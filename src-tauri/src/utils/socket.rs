use crate::utils::request::{Error, GLOBAL_CLIENT};
use futures_util::{SinkExt, StreamExt, TryStreamExt};
use reqwest_websocket::{Message, RequestBuilderExt, WebSocket};
use serde::{Deserialize, Serialize};

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

#[derive(Serialize, Deserialize)]
pub struct PacketHeader {
    pub total_size: u32,       // 封包总大小
    pub header_size: u16,      // 头部大小
    pub protocol_version: u16, // 协议版本
    pub opcode: u32,           // 操作码
    pub sequence: u32,         // sequence
}

#[derive(Serialize, Deserialize)]
pub enum ProtocolVersion {
    NormalPacket = 0,                      // 普通包 (正文不使用压缩)
    HeartbeatAndAuthPacket = 1,            // 心跳及认证包 (正文不使用压缩)
    NormalPacketWithZlibCompression = 2,   // 普通包 (正文使用 zlib 压缩)
    NormalPacketWithBrotliCompression = 3, // 普通包 (使用 brotli 压缩的多个带文件头的普通包)
}

#[derive(Serialize, Deserialize)]
pub enum Opcode {
    Heartbeat = 2,      // 心跳包
    HeartbeatReply = 3, // 心跳包回复 (人气值)
    RegularPacket = 5,  // 普通包 (命令)
    AuthPacket = 7,     // 认证包
    AuthReply = 8,      // 认证包回复
}

#[derive(Serialize, Deserialize)]
pub struct AuthPacket {
    pub uid: Option<u64>,
    pub roomid: u64,
    pub protover: Option<u64>,
    pub platform: Option<String>,
    #[serde(rename = "type")]
    pub r#type: Option<u64>,
    pub key: Option<String>,
}

pub fn encode_packet<T: Serialize>(op: Opcode, packet_body: T) -> Vec<u8> {
    match op {
        Opcode::Heartbeat => {
            vec![0]
        }
        Opcode::RegularPacket => {
            vec![0]
        }
        Opcode::AuthPacket => {
            let package_body_binary = serde_json::to_vec(&packet_body).unwrap();
            // 头部数据
            let packet_header = PacketHeader {
                total_size: package_body_binary.len() as u32,
                header_size: 16, // 固定为 16
                protocol_version: ProtocolVersion::HeartbeatAndAuthPacket as u16, // 认证包
                opcode: Opcode::AuthPacket as u32, // 认证包
                sequence: 1,     // sequence是 1
            };

            // 将认证包头部和正文数据合并
            let mut auth_packet = Vec::new();
            auth_packet.extend(serde_json::to_vec(&packet_header).unwrap());
            auth_packet.extend(package_body_binary);

            auth_packet
        }
        _ => vec![0],
    }
}

pub fn decode_packet<T: for<'de> Deserialize<'de>>(op: Opcode, packet: Vec<u8>) -> T {
    match op {
        Opcode::HeartbeatReply => serde_json::from_slice(&packet).unwrap(),
        Opcode::RegularPacket => serde_json::from_slice(&packet).unwrap(),
        Opcode::AuthReply => serde_json::from_slice(&packet).unwrap(),
        _ => serde_json::from_slice(&packet).unwrap(),
    }
}
