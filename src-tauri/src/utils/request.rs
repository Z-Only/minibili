use crate::utils::wbi;
use http::Method;
use once_cell::sync::Lazy;
use reqwest::header::{HeaderMap, HeaderValue, ACCEPT, ACCEPT_ENCODING, REFERER, USER_AGENT};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::time::Duration;
use thiserror;
use url::Url;

const CONNECT_TIMEOUT: Duration = Duration::from_secs(30);
const UA: &str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const REFERER_VALUE: &str = "https://www.bilibili.com";
const ACCEPT_VALUE: &str = "Accept: application/json, text/plain, */*";
const ACCEPT_ENCODING_VALUE: &str = "Accept-Encoding: gzip, deflate, br";

pub static GLOBAL_CLIENT: Lazy<Client> = Lazy::new(|| {
    // 创建一个 HeaderMap
    let mut headers = HeaderMap::new();
    headers.insert(USER_AGENT, HeaderValue::from_static(UA));
    headers.insert(REFERER, HeaderValue::from_static(REFERER_VALUE));
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
    #[error("cookie error: {0}")]
    Cookie(String),
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error("parse error: {0}")]
    Parse(String),
}

#[derive(serde::Serialize)]
#[serde(tag = "kind", content = "message")]
#[serde(rename_all = "camelCase")]
enum ErrorKind {
    Reqwest(String),
    StatusCode(String),
    Cookie(String),
    Io(String),
    Parse(String),
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
            Self::Cookie(_) => ErrorKind::Cookie(error_message),
            Self::Io(_) => ErrorKind::Io(error_message),
            Self::Parse(_) => ErrorKind::Parse(error_message),
        };
        error_kind.serialize(serializer)
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ApiResult<T> {
    pub code: i32,
    pub message: String,
    pub data: T,
}

async fn fetch_cookie() -> Result<(), Error> {
    let response = GLOBAL_CLIENT.get("https://www.bilibili.com").send().await?;
    let cookies: Vec<_> = response.cookies().collect();

    if cookies
        .iter()
        .any(|cookie| matches!(cookie.name(), "buvid3"))
    {
        Ok(())
    } else {
        Err(Error::Cookie(
            "Cannot find name 'buvid3' in cookies".to_string(),
        ))
    }
}

pub async fn handle_request<T>(
    method: &Method,
    url: &str,
    params: Option<&serde_json::Value>,
    data: Option<&serde_json::Value>,
) -> Result<ApiResult<T>, Error>
where
    T: for<'de> Deserialize<'de> + Serialize,
{
    let res = match data {
        Some(data) => {
            GLOBAL_CLIENT
                .request(method.clone(), url)
                .query(&params)
                .body(data.to_string())
                .send()
                .await?
        }
        None => GLOBAL_CLIENT.request(method.clone(), url).send().await?,
    };

    let code = res.status();

    println!(
        "Handle request, url: {:?}, code: {:?}.",
        &url,
        &code.as_u16()
    );

    // 无权限时重新获取 cookie
    if code.as_u16() == 412 {
        // 重新获取 cookie
        fetch_cookie().await?;
        return Ok(Box::pin(handle_request(method, &url, params, data)).await?);
    } else if (url == "https://api.bilibili.com/x/web-interface/nav"
        || url == "https://api.bilibili.com/bapis/bilibili.api.ticket.v1.Ticket/GenWebTicket")
        && !code.is_success()
    {
        return Err(Error::StatusCode(res.status().to_string()));
    }

    Ok(res.json::<ApiResult<T>>().await?)
}

pub async fn request_with_sign<T>(
    method: Method,
    url: &str,
    params: Option<&serde_json::Value>,
    data: Option<&serde_json::Value>,
) -> Result<ApiResult<T>, Error>
where
    T: for<'de> Deserialize<'de> + Serialize,
{
    let signed_params = wbi::sign_params(params).await;
    let mut url = Url::parse(url).unwrap();
    url.set_query(Some(&signed_params));
    Ok(handle_request::<T>(&method, &url.to_string(), None, data).await?)
}
