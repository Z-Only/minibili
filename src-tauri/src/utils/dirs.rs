use anyhow::Result;
use std::path::PathBuf;
use tauri::Manager;

use crate::core::handle;

pub static APP_ID: &str = "com.minibili.app";

/// get the verge app home dir
pub fn app_home_dir() -> Result<PathBuf> {
    let handle = handle::Handle::global();
    let app_handle = handle.app_handle.lock().unwrap();

    if let Some(app_handle) = app_handle.as_ref() {
        match app_handle.path().data_dir() {
            Ok(dir) => {
                return Ok(dir.join(APP_ID));
            }
            Err(e) => {
                log::error!("Failed to get the app home directory: {}", e);
                return Err(anyhow::anyhow!("Failed to get the app homedirectory"));
            }
        }
    }
    Err(anyhow::anyhow!("failed to get the app home dir"))
}

/// get the resources dir
pub fn app_resources_dir() -> Result<PathBuf> {
    let handle = handle::Handle::global();
    let app_handle = handle.app_handle.lock().unwrap();
    if let Some(app_handle) = app_handle.as_ref() {
        match app_handle.path().resource_dir() {
            Ok(dir) => {
                return Ok(dir.join("resources"));
            }
            Err(e) => {
                log::error!("Failed to get the resource directory: {}", e);
                return Err(anyhow::anyhow!("Failed to get the resource directory"));
            }
        };
    };
    Err(anyhow::anyhow!("failed to get the resource dir"))
}

/// get the cache dir
pub fn app_cache_dir() -> Result<PathBuf> {
    let handle = handle::Handle::global();
    let app_handle = handle.app_handle.lock().unwrap();
    if let Some(app_handle) = app_handle.as_ref() {
        match app_handle.path().app_cache_dir() {
            Ok(dir) => {
                return Ok(dir.join("cache"));
            }
            Err(e) => {
                log::error!("Failed to get the cache directory: {}", e);
                return Err(anyhow::anyhow!("Failed to get the cache directory"));
            }
        };
    };
    Err(anyhow::anyhow!("failed to get the cache dir"))
}
