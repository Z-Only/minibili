use crate::utils::download::{send_progress_event, write_buffer_to_file, DownloadEvent};
use crate::utils::request::{
    fetch_cookie, request_with_sign, Error, GEETEST_CLIENT, GLOBAL_CLIENT,
};
use futures_util::StreamExt;
use http::Method;
use log::info;
use once_cell::sync::Lazy;
use regex::Regex;
use serde_json;
use std::fs::File;
use std::str::FromStr;
use std::time::Instant;
use tauri::ipc::Channel;
use tauri::AppHandle;
use tauri::Manager;

#[tauri::command]
pub async fn fetch(
    method: &str,
    url: &str,
    params: Option<serde_json::Value>,
    data: Option<serde_json::Value>,
) -> Result<serde_json::Value, Error> {
    request_with_sign::<serde_json::Value>(
        Method::from_str(method).unwrap_or(Method::GET),
        url,
        params.as_ref(),
        data.as_ref(),
    )
    .await
}

#[tauri::command]
pub async fn download(
    url: &str,
    save_path: &str,
    on_event: Channel<DownloadEvent<'_>>,
) -> Result<(), Error> {
    let download_id = 1;
    const BUFFER_SIZE: usize = 1024 * 1024; // 1MB 缓冲区大小

    // 获取响应
    let response = GLOBAL_CLIENT.get(url).send().await?;

    // 检查状态码是否成功
    if !response.status().is_success() {
        return Err(Error::StatusCode(response.status().to_string()));
    }

    // 提取 Content-Length 头信息
    let content_length = response
        .headers()
        .get("Content-Length")
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.parse().ok())
        .unwrap_or(0);

    // 发送下载开始事件
    on_event.send(DownloadEvent::Started {
        url,
        download_id,
        content_length,
    })?;

    // 初始化缓冲区和文件
    let mut buffer = vec![0; BUFFER_SIZE];
    let mut file = File::create(save_path)?;
    let mut downloaded_bytes = 0;
    let start_time = Instant::now();

    // 开始下载循环
    let mut stream = response.bytes_stream();
    while let Some(chunk) = stream.next().await {
        let chunk = chunk?;

        // 将数据追加到缓冲区
        buffer.extend_from_slice(&chunk);

        // 当缓冲区满时写入文件并清空缓冲区
        if buffer.len() >= BUFFER_SIZE {
            write_buffer_to_file(&mut file, &mut buffer)?;
            downloaded_bytes += BUFFER_SIZE;
            buffer.clear();

            // 发送进度更新事件
            send_progress_event(
                &on_event,
                download_id,
                content_length,
                downloaded_bytes,
                start_time,
            )?;
        }
    }

    // 清理剩余缓冲区
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
    on_event.send(DownloadEvent::Finished { download_id })?;

    Ok(())
}

static GEETEST_REGEX: Lazy<Regex> =
    Lazy::new(|| Regex::new(r"geetest_\d+\((.*)\)").expect("Failed to new regex"));

#[tauri::command]
pub async fn geetest_get(
    url: &str,
    params: Option<serde_json::Value>,
) -> Result<serde_json::Value, Error> {
    // 构建请求
    let request = GEETEST_CLIENT.get(url).query(&params);

    // 发送请求并获取文本内容
    let res = request.send().await?;
    let content = res.text().await?;

    // 记录日志
    info!("url: {}, params: {:?}, content: {}", url, params, &content);

    // 匹配正则表达式并解析 JSON 数据
    if let Some(captures) = GEETEST_REGEX.captures(&content) {
        if let Some(json_str) = captures.get(1) {
            return serde_json::from_str(json_str.as_str())
                .map_err(|e| Error::Parse(e.to_string()));
        }
    }

    // 返回错误
    Err(Error::Parse("GeeTest response parse error".to_string()))
}

#[tauri::command]
pub fn open_devtools(app_handle: AppHandle) {
    if let Some(window) = app_handle.get_webview_window("main") {
        if !window.is_devtools_open() {
            window.open_devtools();
        } else {
            window.close_devtools();
        }
    }
}

#[tauri::command]
pub async fn resolve_risk_check_issue() -> Result<(), Error> {
    fetch_cookie().await
}
