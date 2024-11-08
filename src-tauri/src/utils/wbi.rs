use crate::utils::request;
use http::Method;
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use serde_json;
use std::time::{SystemTime, UNIX_EPOCH};
use tokio::sync::OnceCell;

pub static WBI_KEYS: Lazy<OnceCell<(String, String)>> = Lazy::new(|| OnceCell::new());

const MIXIN_KEY_ENC_TAB: [usize; 64] = [
    46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29,
    28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25,
    54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52,
];

#[derive(Deserialize, Serialize)]
struct WbiImg {
    img_url: String,
    sub_url: String,
}

#[derive(Deserialize, Serialize)]
struct Data {
    wbi_img: WbiImg,
}

// 对 imgKey 和 subKey 进行字符顺序打乱编码
fn get_mixin_key(orig: &[u8]) -> String {
    MIXIN_KEY_ENC_TAB
        .iter()
        .take(32)
        .map(|&i| orig[i] as char)
        .collect::<String>()
}

fn get_url_encoded(s: &str) -> String {
    s.chars()
        .filter_map(|c| match c.is_ascii_alphanumeric() || "-_.~".contains(c) {
            true => Some(c.to_string()),
            false => {
                // 过滤 value 中的 "!'()*" 字符
                if "!'()*".contains(c) {
                    return None;
                }
                let encoded = c
                    .encode_utf8(&mut [0; 4])
                    .bytes()
                    .fold("".to_string(), |acc, b| acc + &format!("%{:02X}", b));
                Some(encoded)
            }
        })
        .collect::<String>()
}

// 为请求参数进行 wbi 签名
fn encode_wbi(params: Vec<(&str, String)>, (img_key, sub_key): (String, String)) -> String {
    let cur_time = match SystemTime::now().duration_since(UNIX_EPOCH) {
        Ok(t) => t.as_secs(),
        Err(_) => panic!("SystemTime before UNIX EPOCH!"),
    };
    _encode_wbi(params, (img_key, sub_key), cur_time)
}

fn _encode_wbi(
    mut params: Vec<(&str, String)>,
    (img_key, sub_key): (String, String),
    timestamp: u64,
) -> String {
    let mixin_key = get_mixin_key((img_key + &sub_key).as_bytes());
    // 添加当前时间戳
    params.push(("wts", timestamp.to_string()));
    // 重新排序
    params.sort_by(|a, b| a.0.cmp(b.0));
    // 拼接参数
    let query = params
        .iter()
        .map(|(k, v)| format!("{}={}", get_url_encoded(k), get_url_encoded(v)))
        .collect::<Vec<_>>()
        .join("&");
    // 计算签名
    let web_sign = format!("{:?}", md5::compute(query.clone() + &mixin_key));
    // 返回最终的 query
    query + &format!("&w_rid={}", web_sign)
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ApiResult<T> {
    pub code: i32,
    pub message: String,
    pub ttl: i32,
    pub data: T,
}

async fn get_wbi_keys() -> Result<(String, String), request::Error> {
    let Data { wbi_img } = request::handle_request::<ApiResult<Data>>(
        &Method::GET,
        "https://api.bilibili.com/x/web-interface/nav",
        None,
        None,
    )
    .await?
    .data;

    Ok((
        take_filename(&wbi_img.img_url).unwrap(),
        take_filename(&wbi_img.sub_url).unwrap(),
    ))
}

pub async fn initialize_wbi_keys() -> Result<(), Box<dyn std::error::Error>> {
    let keys = get_wbi_keys().await?;
    WBI_KEYS.set(keys).map_err(|_| "Failed to set WBI_KEYS")?;
    Ok(())
}

fn take_filename(url: &str) -> Option<String> {
    url.rsplit_once('/')
        .and_then(|(_, s)| s.rsplit_once('.'))
        .map(|(s, _)| s.to_string())
}

/// 将 serde_json::Value 转换为 Vec<(&str, String)>
fn value_to_vec(value: &serde_json::Value) -> Option<Vec<(&str, String)>> {
    match value {
        serde_json::Value::Object(map) => {
            let mut result = Vec::new();
            for (key, val) in map.iter() {
                if let Some(str_val) = val.as_str() {
                    result.push((key.as_str(), str_val.to_string()));
                } else {
                    // 如果值不是字符串，将其转换为字符串
                    result.push((key.as_str(), val.to_string()));
                }
            }
            Some(result)
        }
        _ => None, // 如果不是对象，返回 None
    }
}

/// Converts the given `params` to a vector if `params` is `Some`, otherwise sets `vec_params` to `None`.
///
/// # Parameters
/// - `params`: An optional reference to a value that can be converted to a vector.
///
/// # Returns
/// - `Some(Vec<T>)` if `params` is `Some`.
/// - `None` if `params` is `None`.
pub async fn sign_params(params: Option<&serde_json::Value>) -> String {
    // 初始化 WBI_KEYS
    if WBI_KEYS.get().is_none() {
        initialize_wbi_keys()
            .await
            .expect("Failed to initialize WBI_KEYS");
    }
    let keys = WBI_KEYS.get().expect("WBI_KEYS not initialized");
    let vec_params = match params.as_ref() {
        Some(params) => value_to_vec(params),
        None => None,
    };
    match vec_params {
        Some(params) => encode_wbi(params, keys.clone()),
        None => encode_wbi(Vec::new(), keys.clone()),
    }
}

// 取自文档描述的测试用例
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_get_filename() {
        assert_eq!(
            take_filename("https://i0.hdslb.com/bfs/wbi/7cd084941338484aae1ad9425b84077c.png"),
            Some("7cd084941338484aae1ad9425b84077c".to_string())
        );
    }

    #[test]
    fn test_get_mixin_key() {
        let concat_key =
            "7cd084941338484aae1ad9425b84077c".to_string() + "4932caff0ff746eab6f01bf08b70ac45";
        assert_eq!(
            get_mixin_key(concat_key.as_bytes()),
            "ea1db124af3c7062474693fa704f4ff8"
        );
    }

    #[test]
    fn test_encode_wbi() {
        let params = vec![
            ("foo", String::from("114")),
            ("bar", String::from("514")),
            ("zab", String::from("1919810")),
        ];
        assert_eq!(
            _encode_wbi(
                params,
                (
                    "7cd084941338484aae1ad9425b84077c".to_string(),
                    "4932caff0ff746eab6f01bf08b70ac45".to_string()
                ),
                1702204169
            ),
            "bar=514&foo=114&wts=1702204169&zab=1919810&w_rid=8f6f2b5b3d485fe1886cec6a0be8c5d4"
                .to_string()
        )
    }
}
