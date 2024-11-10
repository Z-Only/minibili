use crate::utils::wbi;
use http::Method;
use log::info;
use once_cell::sync::Lazy;
use reqwest::header::{HeaderMap, HeaderValue, ACCEPT, ACCEPT_ENCODING, REFERER, USER_AGENT};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::io;
use std::time::Duration;
use thiserror;
use url::Url;

const HOST: &str = "https://www.bilibili.com";
const CONNECT_TIMEOUT: Duration = Duration::from_secs(30);
const UA: &str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const ACCEPT_VALUE: &str = "Accept: application/json, text/plain, */*";
const ACCEPT_ENCODING_VALUE: &str = "Accept-Encoding: gzip, deflate, br";
const MAX_RETRIES: u8 = 3;

pub static GLOBAL_CLIENT: Lazy<Client> = Lazy::new(|| {
    // 创建一个 HeaderMap
    let mut headers = HeaderMap::new();
    headers.insert(USER_AGENT, HeaderValue::from_static(UA));
    headers.insert(REFERER, HeaderValue::from_static(HOST));
    headers.insert(ACCEPT, HeaderValue::from_static(ACCEPT_VALUE));
    headers.insert(
        ACCEPT_ENCODING,
        HeaderValue::from_static(ACCEPT_ENCODING_VALUE),
    );

    // 创建一个 Client
    Client::builder()
        .default_headers(headers)
        .connect_timeout(CONNECT_TIMEOUT)
        .cookie_store(true)
        .build()
        .expect("Failed to build global reqwest client")
});

pub static GEETEST_CLIENT: Lazy<Client> = Lazy::new(|| {
    // 创建一个 HeaderMap
    let mut headers = HeaderMap::new();
    headers.insert(USER_AGENT, HeaderValue::from_static(UA));
    headers.insert(ACCEPT, HeaderValue::from_static(ACCEPT_VALUE));
    headers.insert(
        ACCEPT_ENCODING,
        HeaderValue::from_static(ACCEPT_ENCODING_VALUE),
    );

    // 创建一个 Client
    Client::builder()
        .default_headers(headers)
        .connect_timeout(CONNECT_TIMEOUT)
        .cookie_store(true)
        .build()
        .expect("Failed to build geetest reqwest client")
});

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Reqwest(#[from] reqwest::Error),
    #[error("HTTP error: {0}")]
    StatusCode(String),
    #[error(transparent)]
    Io(#[from] io::Error),
    #[error("parse error: {0}")]
    Parse(String),
    #[error("tauri error: {0}")]
    Tauri(#[from] tauri::Error),
}

#[derive(serde::Serialize)]
#[serde(tag = "kind", content = "message")]
#[serde(rename_all = "camelCase")]
enum ErrorKind {
    Reqwest(String),
    StatusCode(String),
    Io(String),
    Parse(String),
    Tauri(String),
}

impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        let error_message = self.to_string();
        let error_kind = match self {
            Self::Reqwest(_) => ErrorKind::Reqwest(error_message),
            Self::StatusCode(_) => ErrorKind::StatusCode(error_message),
            Self::Io(_) => ErrorKind::Io(error_message),
            Self::Parse(_) => ErrorKind::Parse(error_message),
            Self::Tauri(_) => ErrorKind::Tauri(error_message),
        };
        error_kind.serialize(serializer)
    }
}

pub async fn fetch_cookie() -> Result<(), Error> {
    GLOBAL_CLIENT.get(HOST).send().await?;
    Ok(())
}

pub async fn handle_request<T>(
    method: &Method,
    url: &str,
    params: Option<&serde_json::Value>,
    data: Option<&serde_json::Value>,
) -> Result<T, Error>
where
    T: for<'de> Deserialize<'de> + Serialize,
{
    let mut retries = 0;

    loop {
        let mut request = GLOBAL_CLIENT.request(method.clone(), url);

        if let Some(params) = params {
            request = request.query(params);
        }

        if let Some(data) = data {
            request = request.body(data.to_string());
        }

        let res = request.send().await?;
        let status = res.status();

        info!(
            "Handle request, url: {:?}, params: {:?}, data: {:?}, status code: {:?}.",
            url,
            params,
            data,
            status.as_u16()
        );

        // // 获取响应头
        // let headers: HeaderMap = res.headers().clone();

        // // 打印响应头
        // for (key, value) in headers.iter() {
        //     info!("{}: {}", key, value.to_str().unwrap_or("Invalid UTF-8"));
        // }

        if status.as_u16() == 412 {
            if retries < MAX_RETRIES {
                retries += 1;
                fetch_cookie().await?;
                continue;
            } else {
                return Err(Error::StatusCode(status.to_string()));
            }
        }

        if !status.is_success() {
            return Err(Error::StatusCode(status.to_string()));
        }

        return Ok(res.json::<T>().await?);
    }
}

pub async fn request_with_sign<T>(
    method: Method,
    url: &str,
    params: Option<&serde_json::Value>,
    data: Option<&serde_json::Value>,
) -> Result<T, Error>
where
    T: for<'de> Deserialize<'de> + Serialize,
{
    let signed_params = wbi::sign_params(params).await;
    let mut url = Url::parse(url).map_err(|e| Error::Parse(e.to_string()))?;
    url.set_query(Some(&signed_params));
    handle_request::<T>(&method, &url.to_string(), None, data).await
}
