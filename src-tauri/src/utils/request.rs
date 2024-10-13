use crate::utils::wbi;
use http::Method;
use reqwest::cookie::Jar;
use reqwest::header::{HeaderMap, HeaderValue, CONTENT_TYPE, REFERER, USER_AGENT};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
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
    #[error("cookie error: {0}")]
    Cookie(String),
}

#[derive(serde::Serialize)]
#[serde(tag = "kind", content = "message")]
#[serde(rename_all = "camelCase")]
enum ErrorKind {
    Io(String),
    Utf8(String),
    Reqwest(String),
    StatusCode(String),
    Cookie(String),
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
            Self::Cookie(_) => ErrorKind::Cookie(error_message),
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

pub fn build_url(path: &str, params: Option<&serde_json::Value>) -> String {
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

async fn get_cookie() -> Result<String, Error> {
    let client = get_client(None)?;

    let response = client.get("https://www.bilibili.com").send().await?;
    let cookies = response.cookies();
    for cookie in cookies {
        if cookie.name() == "buvid3" {
            return Ok(format!("{}={}", cookie.name(), cookie.value()));
        }
    }
    return Err(Error::Cookie("cookie buvid3 not found".to_string()));
}

fn get_client(cookie_jar: Option<Jar>) -> Result<Client, reqwest::Error> {
    // 创建一个 HeaderMap
    let mut headers = HeaderMap::new();
    headers.insert(CONTENT_TYPE, HeaderValue::from_static(&CONTENT_TYPE_VALUE));
    headers.insert(USER_AGENT, HeaderValue::from_static(&UA));
    headers.insert(REFERER, HeaderValue::from_static(&REFERER_VALUE));
    // 创建一个 Client
    let client_builder = Client::builder()
        .default_headers(headers)
        .connect_timeout(CONNECT_TIMEOUT)
        .cookie_store(true);

    match cookie_jar {
        Some(jar) => client_builder.cookie_provider(Arc::new(jar)).build(),
        None => client_builder.build(),
    }
}

// TODO: 如何复用 client 和 cookie
pub async fn handle_request<T>(
    client: Option<&Client>,
    method: &Method,
    path: &str,
    params: Option<&serde_json::Value>,
    data: Option<&serde_json::Value>,
) -> Result<ApiResult<T>, Error>
where
    T: for<'de> Deserialize<'de> + Serialize,
{
    let client = match client {
        Some(client) => client,
        None => &get_client(None)?,
    };

    let url = &build_url(path, params);

    let res = match data {
        Some(data) => {
            client
                .request(method.clone(), url)
                .body(data.to_string())
                .send()
                .await?
        }
        None => client.request(method.clone(), url).send().await?,
    };

    let code = res.status();

    print!(
        "handle_request, url: {:?}, code: {:?}.\n",
        url,
        &code.as_u16()
    );

    // 无权限时重新获取 cookie
    if code.as_u16() == 412 {
        // 创建一个 CookieJar
        let jar = Jar::default();
        let cookie = get_cookie().await?;
        jar.add_cookie_str(&cookie, &Url::parse(BASE_URL).unwrap());
        let client = get_client(Some(jar))?;
        return Ok(Box::pin(handle_request(Some(&client), method, path, params, data)).await?);
    } else if (path.eq("/x/web-interface/nav")
        || path.eq("/bapis/bilibili.api.ticket.v1.Ticket/GenWebTicket"))
        && !code.is_success()
    {
        return Err(Error::StatusCode(res.status().to_string()));
    }

    Ok(res.json::<ApiResult<T>>().await?)
}

pub async fn request_with_sign<T>(
    method: Method,
    path: &str,
    params: Option<&serde_json::Value>,
    data: Option<&serde_json::Value>,
) -> Result<ApiResult<T>, Error>
where
    T: for<'de> Deserialize<'de> + Serialize,
{
    let signed_params = wbi::sign_params(params).await;
    let mut url = Url::parse(BASE_URL).unwrap().join(path).unwrap();
    url.set_query(Some(&signed_params));
    Ok(handle_request::<T>(None, &method, &url.to_string(), None, data).await?)
}
