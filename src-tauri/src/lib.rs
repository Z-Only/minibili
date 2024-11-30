use crate::utils::resolve;
use tauri_plugin_log::{Target, TargetKind};

mod commands;
mod core;
mod utils;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([
                    Target::new(TargetKind::Stdout),
                    Target::new(TargetKind::LogDir { file_name: None }),
                    Target::new(TargetKind::Webview),
                ])
                .build(),
        )
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::fetch,
            commands::download,
            commands::geetest_get,
            commands::open_devtools,
            commands::resolve_risk_check_issue,
            commands::monitor_live_msg_stream,
            commands::stop_monitor_live_msg_stream
        ])
        .setup(|app| {
            tauri::async_runtime::block_on(async move {
                resolve::resolve_setup(app).await;
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
