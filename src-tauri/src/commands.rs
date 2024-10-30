use crate::utils::download::{send_progress_event, write_buffer_to_file, DownloadEvent};
use crate::utils::request::{request_with_sign, ApiResult, Error, GEETEST_CLIENT, GLOBAL_CLIENT};
use futures_util::StreamExt;
use http::Method;
use regex::Regex;
use serde_json;
use std::fs::File;
use std::str::FromStr;
use std::time::Instant;
use tauri::ipc::Channel;
use log::info;

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

#[tauri::command]
pub async fn geetest_get(
    url: &str,
    params: Option<serde_json::Value>,
) -> Result<serde_json::Value, Error> {
    let request = GEETEST_CLIENT.get(url).query(&params);

    let res = request.send().await?;

    let content = res.text().await?;

    info!("url: {}, params: {:?}, content: {}", url, params, &content);

    // 定义正则表达式，匹配 geetest_时间戳() 中的内容
    let regex = Regex::new(r"geetest_\d+\((.*)\)").unwrap();

    if let Some(captures) = regex.captures(&content) {
        if let Some(json_str) = captures.get(1) {
            // 解析 JSON 数据
            return serde_json::from_str(json_str.as_str())
                .map_err(|e| Error::Parse(e.to_string()));
        }
    }
    Err(Error::Parse("Geetest response parse error.".to_string()))
}
