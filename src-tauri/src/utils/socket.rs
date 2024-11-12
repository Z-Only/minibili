use crate::utils::request::{Error, GLOBAL_CLIENT};
use futures_util::{SinkExt, StreamExt, TryStreamExt};
use reqwest_websocket::{Message, RequestBuilderExt, WebSocket};

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub enum PacketType {
    Heartbeat = 2,      // 心跳包
    HeartbeatReply = 3, // 心跳包回复 (人气值)
    RegularPacket = 5,  // 普通包 (命令)
    AuthPacket = 7,     // 认证包
    AuthReply = 8,      // 认证包回复
}

// TODO: 如果过程中 host 和 port 不变化，考虑设计为全局变量
pub async fn init_socket(
    host: &str,
    port: u16,
    path: &str,
) -> Result<WebSocket, reqwest_websocket::Error> {
    let url = format!("wss://{}:{}{}", host, port, path);
    GLOBAL_CLIENT
        .get(&url)
        .upgrade()
        .send()
        .await?
        .into_websocket()
        .await
}

pub async fn socket_send(host: &str, port: u16, path: &str, msg: Message) -> Result<(), Error> {
    let web_socket = init_socket(host, port, path).await?;
    let (mut sender, _) = web_socket.split();
    sender.send(msg).await?;
    Ok(())
}

pub async fn socket_receive(host: &str, port: u16, path: &str) -> Result<Option<Message>, Error> {
    let web_socket = init_socket(host, port, path).await?;
    let (_, mut receiver) = web_socket.split();
    let msg = receiver.try_next().await?;
    Ok(msg)
}
