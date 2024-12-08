use crate::core::handle;
use crate::utils::wbi;
use anyhow::{anyhow, Ok, Result};
use http::Method;
use log::info;
use once_cell::sync::Lazy;
use reqwest::cookie::{CookieStore, Jar};
use reqwest::header::{HeaderMap, HeaderValue, ACCEPT, ACCEPT_ENCODING, REFERER, USER_AGENT};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::time::Duration;
use tauri_plugin_store::StoreExt;
use url::Url;

pub const HOST: &str = "https://www.bilibili.com";
const CONNECT_TIMEOUT: Duration = Duration::from_secs(30);
const UA: &str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const ACCEPT_VALUE: &str = "Accept: application/json, text/plain, */*";
const ACCEPT_ENCODING_VALUE: &str = "Accept-Encoding: gzip, deflate, br";
const MAX_RETRIES: u8 = 3;

pub static COOKIE_JAR: Lazy<Arc<Jar>> = Lazy::new(|| Arc::new(Jar::default()));
pub static COOKIE_STORE_PATH: &str = "cookie_store.bin";
pub static COOKIE_STORE_KEY: &str = "cookie";

pub async fn store_cookie(cookie_str: serde_json::Value) -> Result<()> {
    let app_handle = handle::Handle::global().app_handle.lock().unwrap();
    let app_handle = app_handle.as_ref().unwrap();
    let store = app_handle.store(COOKIE_STORE_PATH)?;

    store.set(COOKIE_STORE_KEY, cookie_str);

    Ok(store.save()?)
}

pub async fn init_cookie() {
    let app_handle = handle::Handle::global().app_handle.lock().unwrap();
    let app_handle = app_handle.as_ref().unwrap();
    let store = app_handle.store(COOKIE_STORE_PATH).unwrap();

    if let Some(cookie) = store.get(COOKIE_STORE_KEY) {
        let cookie_jar = COOKIE_JAR.clone();
        let host_url = url::Url::parse(HOST).unwrap();
        cookie_jar.add_cookie_str(cookie.as_str().unwrap(), &host_url);
    }
}

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
        .cookie_provider(COOKIE_JAR.clone())
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

pub async fn fetch_cookie() -> Result<()> {
    GLOBAL_CLIENT.get(HOST).send().await?;

    let host_url = Url::parse(HOST)?;
    if let Some(cookies) = COOKIE_JAR.cookies(&host_url) {
        let cookies_str = cookies.to_str().unwrap();
        let cookies_json = serde_json::Value::String(cookies_str.to_string());
        store_cookie(cookies_json).await?;
    }
    Ok(())
}

pub async fn handle_request<T>(
    method: &Method,
    url: &str,
    params: Option<&serde_json::Value>,
    data: Option<&serde_json::Value>,
) -> Result<T>
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
                return Err(anyhow!("Max retries reached."));
            }
        }

        if !status.is_success() {
            return Err(anyhow!("Request failed with status code: {:?}", status));
        }

        return Ok(res.json::<T>().await?);
    }
}

pub async fn request_with_sign<T>(
    method: Method,
    url: &str,
    params: Option<&serde_json::Value>,
    data: Option<&serde_json::Value>,
) -> Result<T>
where
    T: for<'de> Deserialize<'de> + Serialize,
{
    let signed_params = wbi::sign_params(params).await;
    let mut url = Url::parse(url)?;
    url.set_query(Some(&signed_params));
    handle_request::<T>(&method, &url.to_string(), None, data).await
}
