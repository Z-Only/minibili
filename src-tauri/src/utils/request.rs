use crate::utils::wbi;
use http::Method;
use reqwest::header::{HeaderMap, HeaderValue, CONTENT_TYPE, REFERER, USER_AGENT};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::time::Duration;
use thiserror;
use url::Url;

const BASE_URL: &str = "https://api.bilibili.com";
const CONNECT_TIMEOUT: Duration = Duration::from_secs(30);
const CONTENT_TYPE_VALUE: &str = "application/json";
const UA: &str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const REFERER_VALUE: &str = "https://www.bilibili.com";

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error("failed to parse as string: {0}")]
    Utf8(#[from] std::str::Utf8Error),
    #[error(transparent)]
    Reqwest(#[from] reqwest::Error),
    #[error("HTTP error: {0}")]
    StatusCode(String),
}

#[derive(serde::Serialize)]
#[serde(tag = "kind", content = "message")]
#[serde(rename_all = "camelCase")]
enum ErrorKind {
    Io(String),
    Utf8(String),
    Reqwest(String),
    StatusCode(String),
}

impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        let error_message = self.to_string();
        let error_kind = match self {
            Self::Io(_) => ErrorKind::Io(error_message),
            Self::Utf8(_) => ErrorKind::Utf8(error_message),
            Self::Reqwest(_) => ErrorKind::Reqwest(error_message),
            Self::StatusCode(_) => ErrorKind::StatusCode(error_message),
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

pub fn build_url(path: &str, params: Option<serde_json::Value>) -> String {
    let mut url = Url::parse(BASE_URL).unwrap().join(path).unwrap();

    if let Some(serde_json::Value::Object(map)) = params {
        let params_str = url::form_urlencoded::Serializer::new(String::new())
            .extend_pairs(map.iter().map(|(k, v)| (k.as_str(), v.to_string())))
            .finish();
        if !params_str.is_empty() {
            url.set_query(Some(&params_str));
        }
    }
    url.to_string()
}

pub async fn handle_request<T>(
    method: Method,
    path: &str,
    params: Option<serde_json::Value>,
    data: Option<serde_json::Value>,
) -> Result<ApiResult<T>, Error>
where
    T: for<'de> Deserialize<'de> + Serialize,
{
    // 创建一个 HeaderMap
    let mut headers = HeaderMap::new();
    headers.insert(CONTENT_TYPE, HeaderValue::from_static(&CONTENT_TYPE_VALUE));
    headers.insert(USER_AGENT, HeaderValue::from_static(&UA));
    headers.insert(REFERER, HeaderValue::from_static(&REFERER_VALUE));
    // 创建一个 Client
    let client = Client::builder()
        .default_headers(headers)
        .connect_timeout(CONNECT_TIMEOUT)
        .cookie_store(true)
        .build()?;

    let url = build_url(path, params);

    let res = match data {
        Some(data) => {
            client
                .request(method, url)
                .body(data.to_string())
                .send()
                .await?
        }
        None => client.request(method, url).send().await?,
    };

    if (path.eq("/x/web-interface/nav")
        || path.eq("/bapis/bilibili.api.ticket.v1.Ticket/GenWebTicket"))
        && !res.status().is_success()
    {
        return Err(Error::StatusCode(res.status().to_string()));
    }

    Ok(res.json::<ApiResult<T>>().await?)
}

pub async fn request_with_sign<T>(
    method: Method,
    path: &str,
    params: Option<serde_json::Value>,
    data: Option<serde_json::Value>,
) -> Result<ApiResult<T>, Error>
where
    T: for<'de> Deserialize<'de> + Serialize,
{
    let signed_params = wbi::sign_params(params).await;
    let mut url = Url::parse(BASE_URL).unwrap().join(path).unwrap();
    url.set_query(Some(&signed_params));
    print!("request_with_sign url: {}", &url.to_string());
    Ok(handle_request::<T>(method, &url.to_string(), None, data).await?)
}
