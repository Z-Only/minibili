use std::time::Duration;

use crate::utils::request::{Error, GLOBAL_CLIENT};
use futures_util::{SinkExt, StreamExt, TryStreamExt};
use log::{info, warn};
use reqwest_websocket::{Message, RequestBuilderExt};
use serde_json::json;

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub enum PacketType {
    Heartbeat = 2,      // 心跳包
    HeartbeatReply = 3, // 心跳包回复 (人气值)
    RegularPacket = 5,  // 普通包 (命令)
    AuthPacket = 7,     // 认证包
    AuthReply = 8,      // 认证包回复
}

/// WebSocket 客户端示例。
///
/// 连接到指定房间并进行身份验证。
pub async fn wss(uid: u64, room_id: u64, auth_key: Option<&str>) -> Result<(), Error> {
    // 构建一个 GET 请求，升级到 websocket 并发送
    let websocket = GLOBAL_CLIENT
        .get("wss://broadcastlv.chat.bilibili.com:443/sub")
        .upgrade()
        .send()
        .await?
        .into_websocket()
        .await?;

    // 分离发送和接收通道
    let (mut sender, mut receiver) = websocket.split();

    // 准备认证包
    let auth_packet = json!({
        "uid": uid,
        "roomid": room_id,
        "key": auth_key,
        "protover": 3,
        "platform": "web",
        "type": 2

    });

    // 发送认证包
    sender.send(Message::Text(auth_packet.to_string())).await?;

    // 处理认证回复
    if let Some(message) = receiver.try_next().await? {
        match message {
            Message::Text(text) => info!("Received authentication response: {}", text),
            _ => warn!("Unexpected message"),
        }
    }

    // 启动心跳任务
    tokio::spawn(async move {
        loop {
            tokio::time::sleep(Duration::from_secs(30)).await;

            // 发送心跳包
            sender
                .send(Message::Text("[object Object]".to_string()))
                .await
                .unwrap_or_else(|_| ());
        }
    });

    // 循环接收普通数据包
    while let Ok(Some(message)) = receiver.try_next().await {
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
