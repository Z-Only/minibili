use crate::utils::download::{send_progress_event, write_buffer_to_file, DownloadEvent};
use crate::utils::request::{request_with_sign, ApiResult, Error, GLOBAL_CLIENT};
use futures_util::StreamExt;
use http::Method;
use reqwest::Client;
use serde_json;
use std::fs::File;
use std::str::FromStr;
use std::time::Instant;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::ipc::Channel;

#[tauri::command]
pub async fn fetch(
    method: &str,
    url: &str,
    params: Option<serde_json::Value>,
    data: Option<serde_json::Value>,
) -> Result<ApiResult<serde_json::Value>, Error> {
    Ok(request_with_sign::<serde_json::Value>(
        Method::from_str(method).unwrap(),
        url,
        params.as_ref(),
        data.as_ref(),
    )
    .await?)
}

#[tauri::command]
pub async fn download(
    url: &str,
    save_path: &str,
    on_event: Channel<DownloadEvent<'_>>,
) -> Result<(), Error> {
    let download_id = 1;

    let response = GLOBAL_CLIENT.get(url).send().await?;

    if !response.status().is_success() {
        return Err(Error::StatusCode(response.status().to_string()));
    }

    let content_length = response
        .headers()
        .get("Content-Length")
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.parse().ok())
        .unwrap_or(0);

    // 发送下载开始事件
    on_event
        .send(DownloadEvent::Started {
            url,
            download_id,
            content_length,
        })
        .unwrap();

    let mut stream = response.bytes_stream();

    // 1MB 缓冲区
    let mut buffer = Vec::with_capacity(1024 * 1024);

    // 下载的字节数
    let mut downloaded_bytes = 0;

    // 创建文件进行写入
    let mut file = File::create(save_path)?;

    let start_time = Instant::now();

    while let Some(bytes_res) = stream.next().await {
        let bytes = bytes_res?;
        buffer.extend_from_slice(&bytes);

        if buffer.len() >= 1024 * 1024 {
            write_buffer_to_file(&mut file, &mut buffer)?;
            downloaded_bytes += buffer.len();
            buffer.clear();
            send_progress_event(
                &on_event,
                download_id,
                content_length,
                downloaded_bytes,
                start_time,
            )?;
        }
    }

    // 将剩余的缓冲区内容写入文件
    if !buffer.is_empty() {
        write_buffer_to_file(&mut file, &mut buffer)?;
        downloaded_bytes += buffer.len();
        buffer.clear();
        send_progress_event(
            &on_event,
            download_id,
            content_length,
            downloaded_bytes,
            start_time,
        )?;
    }

    // 发送下载完成事件
    on_event
        .send(DownloadEvent::Finished { download_id })
        .unwrap();

    Ok(())
}

// TODO: 极验
#[tauri::command]
pub async fn geetest_verify(gt: &str, challenge: &str) -> Result<String, Error> {
    let client = Client::new();

    let time = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis();

    let gettype_url = "https://api.geetest.com/gettype.php";
    let ajax_url = "https://api.geetest.com/ajax.php";
    let get_url = "https://api.geetest.com/get.php";

    // 发送第一个请求
    let gettype_response = client
        .get(gettype_url)
        .query(&[("gt", gt), ("callback", &format!("geetest_{}", time))])
        .send()
        .await?;

    // 检查第一个请求的响应状态
    if !gettype_response.status().is_success() {
        return Err(Error::StatusCode(format!(
            "Failed to get type: {}",
            gettype_response.status()
        )));
    }

    // 发送第二个请求，请求验证码类型
    let ajax_response = client
        .get(ajax_url)
        .query(&[
            ("gt", gt),
            ("challenge", challenge),
            ("lang", "zh-cn"),
            ("pt", "0"),
            ("client_type", "web"),
            ("w", ""),
            ("callback", &format!("geetest_{}", time)),
        ])
        .send()
        .await?;

    // 检查第二个请求的响应状态
    if !ajax_response.status().is_success() {
        return Err(Error::StatusCode(format!(
            "Failed to get ajax: {}",
            ajax_response.status()
        )));
    }

    // 发送第三个请求，获取请求验证码的图片信息
    let get_response = client
        .get(get_url)
        .form(&[
            ("is_next", "true"),
            ("type", "click"),
            ("gt", gt),
            ("challenge", challenge),
            ("lang", "zh-cn"),
            ("https:", "false"),
            ("protocol", "https://"),
            ("offline", "false"),
            ("product", "embed"),
            ("api_server", "aip.geetest.com"),
            ("isPC", "true"),
            ("autoReset", "true"),
            ("width", "100%"),
            ("callback", &format!("geetest_{}", time)),
        ])
        .send()
        .await?;

    // 检查第三个请求的响应状态
    if !get_response.status().is_success() {
        return Err(Error::StatusCode(format!(
            "Failed to get: {}",
            get_response.status()
        )));
    }

    let data = get_response.text().await?;

    // 返回成功消息
    Ok(data)
}
