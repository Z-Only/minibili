use anyhow::{anyhow, Error, Ok, Result};
use brotli::Decompressor;
use flate2::read::ZlibDecoder;
use futures_util::{
    stream::{SplitSink, SplitStream},
    SinkExt, StreamExt, TryStreamExt,
};
use log::error;
use reqwest::Client;
use reqwest_websocket::{Message, RequestBuilderExt, WebSocket};
use serde::{Deserialize, Serialize};
use std::{io::Read, vec};
use tauri::ipc::Channel;

#[derive(Serialize, Deserialize, Debug)]
pub struct PacketHeader {
    pub total_size: u32,       // 封包总大小
    pub header_size: u16,      // 头部大小
    pub protocol_version: u16, // 协议版本
    pub opcode: u32,           // 操作码
    pub sequence: u32,         // sequence
}

#[derive(Serialize, Deserialize, Debug, PartialEq)]
pub enum ProtocolVersion {
    NormalPacket = 0,                      // 普通包 (正文不使用压缩)
    HeartbeatAndAuthPacket = 1,            // 心跳及认证包 (正文不使用压缩)
    NormalPacketWithZlibCompression = 2,   // 普通包 (正文使用 zlib 压缩)
    NormalPacketWithBrotliCompression = 3, // 普通包 (使用 brotli 压缩的多个带文件头的普通包)
}

impl ProtocolVersion {
    /// 根据值获取对应的枚举项
    pub fn from_value(value: u16) -> Option<Self> {
        match value {
            0 => Some(Self::NormalPacket),
            1 => Some(Self::HeartbeatAndAuthPacket),
            2 => Some(Self::NormalPacketWithZlibCompression),
            3 => Some(Self::NormalPacketWithBrotliCompression),
            _ => None,
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
    /// 根据值获取对应的枚举项
    pub fn from_value(value: u32) -> Option<Self> {
        match value {
            2 => Some(Self::Heartbeat),
            3 => Some(Self::HeartbeatReply),
            5 => Some(Self::RegularPacket),
            7 => Some(Self::AuthPacket),
            8 => Some(Self::AuthReply),
            _ => None,
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

    // 初始化头部信息
    let body_len = package_body_binary.len() as u32;
    let total_size = body_len + HEADER_SIZE as u32;

    let mut packet_header = PacketHeader {
        total_size: total_size.to_be(),
        header_size: HEADER_SIZE.to_be(),
        protocol_version: 0,
        opcode: (op.clone() as u32).to_be(),
        sequence: 0,
    };

    // 根据不同的操作码设置协议版本和其他字段
    match op {
        Opcode::AuthPacket | Opcode::Heartbeat => {
            packet_header.protocol_version =
                (ProtocolVersion::HeartbeatAndAuthPacket as u16).to_be();
            packet_header.sequence = 1_u32.to_be();
        }
        Opcode::RegularPacket => {
            packet_header.protocol_version =
                (ProtocolVersion::NormalPacketWithZlibCompression as u16).to_be();
            packet_header.sequence = 1_u32.to_be();
        }
        _ => {
            error!("Unsupported opcode: {:?}", op)
        }
    }

    // 将认证包头部和正文数据合并
    let mut packet = bincode::serialize(&packet_header).unwrap();
    packet.extend_from_slice(&package_body_binary);

    packet
}

/// 根据协议版本解压缩数据包
///
/// # 参数
/// - `protocol_version`: 数据包使用的协议版本
/// - `packet_body`: 需要解压缩的数据包内容
///
/// # 返回值
/// - 解压缩后的数据包内容
fn decompress_packet(protocol_version: ProtocolVersion, packet_body: &[u8]) -> Vec<u8> {
    match protocol_version {
        ProtocolVersion::NormalPacket => packet_body.to_vec(),
        ProtocolVersion::NormalPacketWithZlibCompression => {
            // zlib 解压
            let mut decoder = ZlibDecoder::new(packet_body);

            // 创建一个缓冲区，用于存储解压缩后的数据
            let mut decompressed_data = Vec::new();

            // 尝试解压缩并读取数据到缓冲区
            if let Err(e) = decoder.read_to_end(&mut decompressed_data) {
                error!("Failed to decompress zlib data: {:?}", e);
            }

            // 返回解压缩后的数据
            decompressed_data
        }
        ProtocolVersion::NormalPacketWithBrotliCompression => {
            // brotli 解压
            let mut decompressor = Decompressor::new(packet_body, 4096);

            // 解压数据到内存中
            let mut decompressed_data = Vec::new();
            if let Err(e) = decompressor.read_to_end(&mut decompressed_data) {
                error!("Failed to decompress brotli data: {:?}", e);
            }

            decompressed_data
        }
        _ => {
            error!(
                "Cannot decompress unsupported protocol version: {:?}.",
                protocol_version
            );
            packet_body.to_vec()
        }
    }
}

pub fn split_packets(data: &[u8]) -> Vec<Vec<u8>> {
    let mut packets = Vec::new();
    let mut offset = 0;

    // 循环直到无法再读取完整的头部信息
    while offset + HEADER_SIZE as usize <= data.len() {
        let total_size = u32::from_be_bytes(
            data[offset..offset + 4]
                .try_into()
                .expect("Failed to convert slice into array"),
        ) as usize;

        // 检查剩余数据是否足够构成完整的数据包
        if offset + total_size > data.len() {
            error!("Packet size exceeds available data.");
            break;
        }

        // 提取数据包主体并加入到数据包列表中
        let packet_body = data[offset + HEADER_SIZE as usize..offset + total_size].to_vec();
        packets.push(packet_body);

        // 更新偏移量至下一个数据包开始位置
        offset += total_size;
    }
    packets
}

fn parse_packet_header(pack: &[u8]) -> Option<PacketHeader> {
    if pack.len() < HEADER_SIZE as usize {
        error!("Packet is too short to contain a valid header.");
        return None;
    }

    let mut packet_header: PacketHeader =
        bincode::deserialize(&pack[..HEADER_SIZE as usize]).unwrap();

    // 将字节序为大端的头部数据还原
    packet_header.total_size = u32::from_be(packet_header.total_size);
    packet_header.header_size = u16::from_be(packet_header.header_size);
    packet_header.protocol_version = u16::from_be(packet_header.protocol_version);
    packet_header.opcode = u32::from_be(packet_header.opcode);
    packet_header.sequence = u32::from_be(packet_header.sequence);

    Some(packet_header)
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase", tag = "event", content = "data")]
pub enum MessageEvent {
    #[serde(rename_all = "camelCase")]
    Auth { success: bool },
    #[serde(rename_all = "camelCase")]
    Heartbeat { success: bool, popularity: u32 },
    #[serde(rename_all = "camelCase")]
    Normal { success: bool, msg: String },
}

#[derive(Default)]
pub struct LiveMsgStreamClient {
    client: Client,                                    /* Http Client */
    stop_signal: bool,                                 /* Stop Signal */
    uid: u64,                                          /* BiliBili Account */
    room_id: u64,                                      /* Room ID */
    token: String,                                     /* Token */
    host_list: Vec<HostServer>,                        /* Danmu Host Server List */
    host_index: u8,                                    /* Index of Danmu Host Server Connected */
    on_event: Option<Channel<MessageEvent>>,           /* Tauri Channel */
    conn_write: Option<SplitSink<WebSocket, Message>>, /* WebSocket Sink */
    conn_read: Option<SplitStream<WebSocket>>,         /* WebSocket Stream */
}

#[derive(Debug, Serialize, Deserialize)]
struct HostServer {
    host: String,
    port: u32,
    ws_port: u32,
    wss_port: u32,
}

impl LiveMsgStreamClient {
    pub fn new(room_id: u64, on_event: Channel<MessageEvent>) -> Self {
        LiveMsgStreamClient {
            room_id,
            on_event: Some(on_event),
            ..Default::default()
        }
    }

    async fn init_client(&mut self) -> Result<()> {
        // send request to get token
        let resp = self
            .client
            .get(format!(
                "https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id={}",
                self.room_id
            ))
            .send()
            .await?;

        let json: serde_json::Value = resp.json().await?;
        self.token = json["data"]["token"]
            .as_str()
            .unwrap_or_default()
            .to_string();
        if let Some(host_list) = json["data"]["host_list"].as_array() {
            for obj in host_list {
                if let Result::Ok(host_server) = serde_json::from_value(obj.clone()) {
                    self.host_list.push(host_server);
                }
            }
        }
        Ok(())
    }

    async fn shake_hands(&mut self) -> Result<()> {
        for (index, item) in self.host_list.iter().enumerate() {
            if let Result::Ok(upgrade_response) = self
                .client
                .get(format!("wss://{}:{}/sub", item.host, item.wss_port))
                .upgrade()
                .send()
                .await
            {
                if let Result::Ok(conn) = upgrade_response.into_websocket().await {
                    let (sender, receiver) = conn.split();
                    self.conn_read = Some(receiver);
                    self.conn_write = Some(sender);
                    self.host_index = index as u8;
                    return Ok(());
                }
            }
        }
        Err(anyhow!("Failed to connect to server."))
    }

    async fn send(&mut self, data: &[u8]) {
        if let Some(conn_write) = self.conn_write.as_mut() {
            if let Err(e) = conn_write.send(Message::from(data)).await {
                error!("Failed to send message: {:?}", e);
            }
        }
    }

    async fn read(&mut self) -> Option<Vec<u8>> {
        if let Some(conn_read) = self.conn_read.as_mut() {
            if let Result::Ok(Some(message)) = conn_read.try_next().await {
                if let Message::Binary(packet) = message {
                    return Some(packet);
                }
            }
        }
        None
    }

    pub async fn send_auth(&mut self) {
        // 构造认证包正文数据
        let auth_data = AuthPacket {
            uid: Some(self.uid),
            roomid: self.room_id,
            protover: Some(3),
            platform: Some("web".to_string()),
            r#type: Some(2),
            key: Some(self.token.clone()),
        };

        // 编码认证包
        let auth_packet = encode_packet(Opcode::AuthPacket, auth_data);

        self.send(&auth_packet).await;
    }

    pub async fn send_heart_beat(&mut self) {
        // 编码认证包
        let heartbeat_packet = encode_packet::<Vec<u8>>(Opcode::Heartbeat, vec![]);

        // 发送心跳包
        self.send(&heartbeat_packet).await;
    }

    pub async fn connect(&mut self) -> Result<SplitSink<WebSocket, Message>, Error> {
        // initialize danmu client
        self.init_client().await?;

        // shake hands
        let _ = self.shake_hands().await?;

        // send authentication pack
        self.send_auth().await;

        if let Some(conn_write) = self.conn_write.take() {
            Ok(conn_write)
        } else {
            Err(anyhow!("Failed to connect to server."))
        }
    }

    pub async fn receive(&mut self) {
        if let Some(msg) = self.read().await {
            if msg.len() >= HEADER_SIZE as usize {
                if let Some(header) = parse_packet_header(&msg) {
                    let protocol = match ProtocolVersion::from_value(header.protocol_version) {
                        Some(p) => p,
                        None => {
                            error!("Unknown protocol version: {}", header.protocol_version);
                            return;
                        }
                    };
                    let opcode = match Opcode::from_value(header.opcode) {
                        Some(op) => op,
                        None => {
                            error!("Unknown opcode: {}", header.opcode);
                            return;
                        }
                    };

                    match opcode {
                        Opcode::AuthReply => {
                            if protocol == ProtocolVersion::HeartbeatAndAuthPacket {
                                let packet_body = &msg[HEADER_SIZE as usize..];
                                match serde_json::from_slice::<AuthReply>(packet_body) {
                                    Result::Ok(auth_reply) => {
                                        if auth_reply.code == 0 {
                                            let _ = self
                                                .on_event
                                                .as_mut()
                                                .unwrap()
                                                .send(MessageEvent::Auth { success: true });
                                        } else {
                                            error!("Authentication failed: {}", auth_reply.code);
                                        }
                                    }
                                    Err(e) => {
                                        error!("Failed to parse auth reply: {:?}", e);
                                    }
                                }
                            }
                        }
                        Opcode::HeartbeatReply => {
                            if protocol == ProtocolVersion::HeartbeatAndAuthPacket {
                                let packet_body = &msg[HEADER_SIZE as usize..];
                                if packet_body.len() >= 4 {
                                    let popularity =
                                        u32::from_be_bytes(packet_body[..4].try_into().unwrap());
                                    let _ = self.on_event.as_mut().unwrap().send(
                                        MessageEvent::Heartbeat {
                                            success: true,
                                            popularity,
                                        },
                                    );
                                }
                            }
                        }
                        Opcode::RegularPacket => {
                            let packet_body = &msg[HEADER_SIZE as usize..];
                            let decompressed_data = decompress_packet(protocol, packet_body);
                            let packs = split_packets(&decompressed_data);
                            for pack in packs {
                                self.handle_msg(&pack).await;
                            }
                        }
                        _ => {
                            error!("Unsupported opcode: {:?}", opcode);
                        }
                    }
                }
            }
        }
    }

    pub async fn handle_msg(&mut self, msg: &[u8]) {
        match serde_json::from_slice::<serde_json::Value>(msg) {
            Result::Ok(json) => {
                let _ = self.on_event.as_mut().unwrap().send(MessageEvent::Normal {
                    success: true,
                    msg: json.to_string(),
                });
            }
            Err(e) => {
                error!("Failed to parse message as JSON: {:?}", e);
            }
        }
    }

    pub fn stop(&mut self) {
        self.stop_signal = true;
    }

    pub fn stopped(&mut self) -> bool {
        self.stop_signal
    }
}
