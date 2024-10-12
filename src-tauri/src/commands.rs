use std::str::FromStr;

use crate::utils::request::{request_with_sign, ApiResult, Error};
use http::Method;
use serde_json;

#[tauri::command]
pub async fn fetch(
    method: &str,
    path: &str,
    params: Option<serde_json::Value>,
) -> Result<ApiResult<serde_json::Value>, Error> {
    Ok(request_with_sign::<serde_json::Value>(
        Method::from_str(method).unwrap(),
        path,
        params,
        None,
    )
    .await?)
}
