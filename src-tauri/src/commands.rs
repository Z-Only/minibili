use crate::utils::download::{send_progress_event, write_buffer_to_file, DownloadEvent};
use crate::utils::request::{
    fetch_cookie, request_with_sign, Error, GEETEST_CLIENT, GLOBAL_CLIENT,
};
use crate::utils::socket::{
    decode_packet, encode_packet, init_socket, socket_receive, socket_send, AuthPacket, AuthReply,
    Opcode,
};
use futures_util::{SinkExt, StreamExt, TryStreamExt};
use http::Method;
use log::{error, info};
use once_cell::sync::Lazy;
use regex::Regex;
use reqwest_websocket::Message;
use serde_json;
use std::fs::File;
use std::str::FromStr;
use std::time::{Duration, Instant};
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

#[tauri::command]
pub async fn authenticate(
    host: &str,
    port: u16,
    room_id: u64,
    uid: Option<u64>,
    auth_key: Option<&str>,
) -> Result<(), Error> {
    // 构造认证包正文数据
    let auth_data = AuthPacket {
        uid,
        roomid: room_id,
        protover: Some(3),
        platform: Some("web".to_string()),
        r#type: Some(2),
        key: auth_key.map(ToString::to_string),
    };

    // 编码认证包
    let auth_packet = encode_packet(Opcode::AuthPacket, auth_data);

    // 构建一个 GET 请求，升级到 websocket 并发送
    let web_socket = init_socket(host, port, "/sub").await?;

    // 分离发送和接收通道
    let (mut sender, mut receiver) = web_socket.split();

    // 发送认证包
    sender.send(Message::Binary(auth_packet)).await?;

    // 处理认证回复
    if let Some(message) = receiver.try_next().await? {
        match message {
            Message::Binary(packet) => match decode_packet(packet) {
                AuthReply { code } => match code {
                    0 => {
                        info!("Authentication success");
                        return Ok(());
                    }
                    _ => error!("Authentication failed: {:?}", code),
                },
            },
            _ => error!("Unexpected message type: {:?}", message),
        }
    }

    Err(Error::Parse("Failed to authentocate.".to_string()))
}

#[tauri::command]
pub async fn heartbeat(host: String, port: u16) -> Result<(), Error> {
    // 启动心跳任务
    tokio::spawn(async move {
        loop {
            tokio::time::sleep(Duration::from_secs(30)).await;

            // 发送心跳包
            socket_send(
                &host,
                port,
                "/sub",
                Message::Text("[object Object]".to_string()),
            )
            .await
            .unwrap_or_else(|_| ());
        }
    });

    Ok(())
}

#[tauri::command]
pub async fn receive_normal_packet(host: &str, port: u16) -> Result<(), Error> {
    // 循环接收普通数据包
    while let Ok(Some(message)) = socket_receive(host, port, "/sub").await {
        match message {
            Message::Binary(data) => {
                // 解压数据并解析 JSON 对象
                // 注意：这里需要根据实际使用的压缩算法解压数据
                info!("Received message: {:?}", data);
            }
            Message::Close { .. } => break,
            _ => (),
        }
    }

    Ok(())
}
