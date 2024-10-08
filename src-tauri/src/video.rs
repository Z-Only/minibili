use reqwest::header::{HeaderMap, HeaderValue, REFERER, USER_AGENT};

#[tauri::command]
pub async fn req(url: String) -> Result<String, String> {
    let referer = "https://www.bilibili.com";
    let user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    // 创建一个新的 HeaderMap
    let mut headers = HeaderMap::new();
    headers.insert(
        REFERER,
        HeaderValue::from_str(referer).map_err(|e| e.to_string())?,
    );
    headers.insert(
        USER_AGENT,
        HeaderValue::from_str(user_agent).map_err(|e| e.to_string())?,
    );

    // 创建一个 reqwest 客户端
    let client = reqwest::Client::builder()
        .default_headers(headers)
        .build()
        .map_err(|e| e.to_string())?;

    let res = client.get(url).send().await;
    match res {
        Ok(response) => {
            println!("res status: {:?}", response.status());
            match response.text().await {
                Ok(text) => Ok(text),
                Err(_) => Err("error".into()),
            }
        }
        Err(e) => {
            println!("request error: {:?}", e);
            Err("error".into())
        }
    }
}

#[tauri::command]
pub async fn req_video(url: String) -> Result<Vec<u8>, String> {
    let referer = "https://www.bilibili.com";
    let user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    // 创建一个新的 HeaderMap
    let mut headers = HeaderMap::new();
    headers.insert(
        REFERER,
        HeaderValue::from_str(referer).map_err(|e| e.to_string())?,
    );
    headers.insert(
        USER_AGENT,
        HeaderValue::from_str(user_agent).map_err(|e| e.to_string())?,
    );

    // 创建一个 reqwest 客户端
    let client = reqwest::Client::builder()
        .default_headers(headers)
        .build()
        .map_err(|e| e.to_string())?;

    let res: Result<reqwest::Response, reqwest::Error> = client.get(url).send().await;
    print!("res: {:?}\n", &res);
    match res {
        Ok(response) => match response.bytes().await {
            Ok(bytes) => Ok(bytes.to_vec()),
            Err(_) => Err("error".into()),
        },
        Err(e) => {
            println!("request error: {:?}", e);
            Err("error".into())
        }
    }
}
