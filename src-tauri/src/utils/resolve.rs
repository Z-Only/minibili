use tauri::{App, Manager};

use crate::core::{handle, tray};

pub async fn resolve_setup(app: &mut App) {
    handle::Handle::global().init(app.app_handle());
    tray::Tray::init_tray(app.app_handle());
}
