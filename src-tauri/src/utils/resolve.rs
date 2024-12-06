use crate::core::{handle, tray};
use crate::utils::request::init_cookie;
use anyhow::{Ok, Result};
use tauri::{App, Manager};

pub async fn resolve_setup(app: &mut App) {
    let app_handle = app.app_handle();
    handle::Handle::global().init(app_handle);
    tray::Tray::init_tray(app_handle);

    init_resource().await.unwrap();
}

pub async fn init_resource() -> Result<()> {
    init_cookie().await;

    Ok(())
}
