#[tauri::command]
pub async fn get_cookie() -> Result<String, String> {
    // 创建一个 reqwest 客户端
    let client = reqwest::Client::builder()
        .build()
        .map_err(|e| e.to_string())?;

    let res = client.get("https://www.bilibili.com").send().await;
    match res {
        Ok(response) => {
            println!("res headers: {:?}", response.headers());
            Ok(format!("{:?}", response.headers()))
        }
        Err(e) => {
            println!("request error: {:?}", e);
            Err("error".into())
        }
    }
}
