use crate::utils::request::{Error, GLOBAL_CLIENT};
use flate2::read::ZlibDecoder;
use futures_util::{SinkExt, StreamExt, TryStreamExt};
use log::{error, info};
use reqwest_websocket::{Message, RequestBuilderExt, WebSocket};
use serde::{Deserialize, Serialize};
use std::io::Read;

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

#[derive(Serialize, Deserialize, Debug)]
pub struct PacketHeader {
    pub total_size: u32,       // 封包总大小
    pub header_size: u16,      // 头部大小
    pub protocol_version: u16, // 协议版本
    pub opcode: u32,           // 操作码
    pub sequence: u32,         // sequence
}

#[derive(Serialize, Deserialize, Debug)]
pub enum ProtocolVersion {
    NormalPacket = 0,                      // 普通包 (正文不使用压缩)
    HeartbeatAndAuthPacket = 1,            // 心跳及认证包 (正文不使用压缩)
    NormalPacketWithZlibCompression = 2,   // 普通包 (正文使用 zlib 压缩)
    NormalPacketWithBrotliCompression = 3, // 普通包 (使用 brotli 压缩的多个带文件头的普通包)
}

impl ProtocolVersion {
    // 方法来根据值获取枚举
    pub fn from_value(value: u16) -> Option<Self> {
        match value {
            0 => Some(Self::NormalPacket),
            1 => Some(Self::HeartbeatAndAuthPacket),
            2 => Some(Self::NormalPacketWithZlibCompression),
            3 => Some(Self::NormalPacketWithBrotliCompression),
            _ => None, // 如果没有匹配的枚举，返回 None
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum Opcode {
    Heartbeat = 2,      // 心跳包
    HeartbeatReply = 3, // 心跳包回复 (人气值)
    RegularPacket = 5,  // 普通包 (命令)
    AuthPacket = 7,     // 认证包
    AuthReply = 8,      // 认证包回复
}

impl Opcode {
    // 方法来根据值获取枚举
    pub fn from_value(value: u32) -> Option<Self> {
        match value {
            2 => Some(Self::Heartbeat),
            3 => Some(Self::HeartbeatReply),
            5 => Some(Self::RegularPacket),
            7 => Some(Self::AuthPacket),
            8 => Some(Self::AuthReply),
            _ => None, // 如果没有匹配的枚举，返回 None
        }
    }
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

// 头部大小一般固定为 16
static HEADER_SIZE: u16 = 16;

#[derive(Deserialize)]
pub struct AuthReply {
    pub code: u32,
}

/// 构造并编码指定操作码的数据包
///
/// # 参数
/// - `op`: 数据包的操作码 (`Opcode`)
/// - `packet_body`: 数据包主体 (`T`) 需要实现 `Serialize`
///
/// # 返回值
/// 返回编码后的二进制向量 (`Vec<u8>`)
///
/// # 示例
/// ```ignore
/// // 构造认证包正文数据
/// let auth_data = AuthPacket {
///     uid: Some(160148624),
///     roomid: 22608112,
///     protover: Some(3),
///     platform: Some("web".to_string()),
///     r#type: Some(2),
///     key: Some("0vpTHW7wWUnloRpRQkGvNbnwvsdm-qYGwBCXu-YQdnWvSUGssA9ybKhy2jx9RocAPFQmTOkRwkKhzDyH9PTuoThh4F0ubXLIdni74U90KBBir2HtQ9A7wgK48KzI_ZZ88uWNYfROHidNj72payn4y0qBhQ==".to_string()),
/// };
///
/// let auth_packet = encode_packet(Opcode::AuthPacket, &auth_data);
/// ```
pub fn encode_packet<T: Serialize>(op: Opcode, packet_body: T) -> Vec<u8> {
    // 数据包内容
    let package_body_binary = serde_json::to_vec(&packet_body).unwrap();

    // 头部数据，字节序为大端
    let mut packet_header = PacketHeader {
        total_size: (package_body_binary.len() as u32 + HEADER_SIZE as u32).to_be(), // 封包总大小 (头部大小 + 正文大小)
        header_size: HEADER_SIZE.to_be(), // 头部大小 (一般为 0x0010, 即 16 字节)
        protocol_version: 0,              // 协议版本
        opcode: (op.clone() as u32).to_be(), // 操作码 (封包类型)
        sequence: 0,                      // sequence, 每次发包时向上递增
    };

    match op {
        Opcode::Heartbeat => {
            packet_header.protocol_version =
                (ProtocolVersion::HeartbeatAndAuthPacket as u16).to_be();
            packet_header.sequence = 1_u32.to_be();
        }
        Opcode::RegularPacket => {
            packet_header.protocol_version =
                (ProtocolVersion::NormalPacketWithZlibCompression as u16).to_be();
            packet_header.sequence = 1_u32.to_be();
        }
        Opcode::AuthPacket => {
            // 补全头部数据
            packet_header.protocol_version =
                (ProtocolVersion::HeartbeatAndAuthPacket as u16).to_be();
            packet_header.sequence = 1_u32.to_be();
        }
        _ => {
            error!("Unsupported opcode: {:?}", op)
        }
    }

    // 将认证包头部和正文数据合并
    let mut auth_packet = Vec::new();
    auth_packet.extend(bincode::serialize(&packet_header).unwrap());
    auth_packet.extend(package_body_binary);

    auth_packet
}

fn decompress_packet(protocol_version: ProtocolVersion, packet_body: &[u8]) -> Vec<u8> {
    match protocol_version {
        ProtocolVersion::NormalPacket => packet_body.to_vec(),
        ProtocolVersion::NormalPacketWithZlibCompression => {
            // zlib 解压
            let mut decoder = ZlibDecoder::new(packet_body);

            // 创建一个缓冲区，用于存储解压缩后的数据
            let mut decompressed_data = Vec::new();

            // 尝试解压缩并读取数据到缓冲区
            decoder.read_to_end(&mut decompressed_data).unwrap();

            // 返回解压缩后的数据
            decompressed_data
        }
        ProtocolVersion::NormalPacketWithBrotliCompression => {
            // brotli 解压
            packet_body.to_vec()
        }
        _ => {
            error!("Unsupported protocol version: {:?}", protocol_version);
            packet_body.to_vec()
        }
    }
}

/// 解码指定操作码的数据包
///
/// # 参数
/// - `op`: 数据包的操作码 (`Opcode`)
/// - `packet`: (`Vec<u8>`)
///
/// # 返回值
/// 返回编码后的二进制向量 (`T`) 需要实现 `DeSerialize`
///
/// # 示例
/// ```ignore
/// // 认证包
/// let auth_package = vec![0, 0, 0, 255, 0, 16, 0, 1, 0, 0, 0, 7, 0, 0, 0, 1, 123, 34, 117, 105, 100, 34, 58, 49, 54, 48, 49, 52, 56, 54, 50, 52, 44, 34, 114, 111, 111, 109, 105, 100, 34, 58, 50, 50, 54, 48, 56, 49, 49, 50, 44, 34, 112, 114, 111, 116, 111, 118, 101, 114, 34, 58, 51, 44, 34, 112, 108, 97, 116, 102, 111, 114, 109, 34, 58, 34, 119, 101, 98, 34, 44, 34, 116, 121, 112, 101, 34, 58, 50, 44, 34, 107, 101, 121, 34, 58, 34, 48, 118, 112, 84, 72, 87, 55, 119, 87, 85, 110, 108, 111, 82, 112, 82, 81, 107, 71, 118, 78, 98, 110, 119, 118, 115, 100, 109, 45, 113, 89, 71, 119, 66, 67, 88, 117, 45, 89, 81, 100, 110, 87, 118, 83, 85, 71, 115, 115, 65, 57, 121, 98, 75, 104, 121, 50, 106, 120, 57, 82, 111, 99, 65, 80, 70, 81, 109, 84, 79, 107, 82, 119, 107, 75, 104, 122, 68, 121, 72, 57, 80, 84, 117, 111, 84, 104, 104, 52, 70, 48, 117, 98, 88, 76, 73, 100, 110, 105, 55, 52, 85, 57, 48, 75, 66, 66, 105, 114, 50, 72, 116, 81, 57, 65, 55, 119, 103, 75, 52, 56, 75, 122, 73, 95, 90, 90, 56, 56, 117, 87, 78, 89, 102, 82, 79, 72, 105, 100, 78, 106, 55, 50, 112, 97, 121, 110, 52, 121, 48, 113, 66, 104, 81, 61, 61, 34, 125]
///
/// let auth_data = decode_packet(auth_data);
///
/// // 判断是否相等
/// AuthPacket {
///     uid: Some(160148624),
///     roomid: 22608112,
///     protover: Some(3),
///     platform: Some("web".to_string()),
///     r#type: Some(2),
///     key: Some("0vpTHW7wWUnloRpRQkGvNbnwvsdm-qYGwBCXu-YQdnWvSUGssA9ybKhy2jx9RocAPFQmTOkRwkKhzDyH9PTuoThh4F0ubXLIdni74U90KBBir2HtQ9A7wgK48KzI_ZZ88uWNYfROHidNj72payn4y0qBhQ==".to_string()),
/// };
/// ```
pub fn decode_packet<T: for<'de> Deserialize<'de>>(packet: Vec<u8>) -> T {
    let mut packet_header: PacketHeader =
        bincode::deserialize(&packet[..HEADER_SIZE as usize]).unwrap();

    // 将字节序为大端的头部数据还原
    packet_header = PacketHeader {
        total_size: u32::from_be(packet_header.total_size),
        header_size: u16::from_be(packet_header.header_size),
        protocol_version: u16::from_be(packet_header.protocol_version),
        opcode: u32::from_be(packet_header.opcode),
        sequence: u32::from_be(packet_header.sequence),
    };

    info!("packet_header: {:?}", packet_header);

    let protocol_version = packet_header.protocol_version;
    let opcode = packet_header.opcode;

    let packet_body = &packet[HEADER_SIZE as usize..];

    info!("packet_body: {:?}", packet_body);

    match Opcode::from_value(opcode) {
        Some(Opcode::HeartbeatReply) => serde_json::from_slice(packet_body).unwrap(),
        Some(Opcode::RegularPacket) => serde_json::from_slice(&decompress_packet(
            ProtocolVersion::from_value(protocol_version).unwrap(),
            packet_body,
        ))
        .unwrap(),
        Some(Opcode::AuthReply) => serde_json::from_slice(packet_body).unwrap(),
        _ => {
            error!("Unsupported opcode: {:?}", Opcode::from_value(opcode));
            serde_json::from_slice(packet_body).unwrap()
        }
    }
}
