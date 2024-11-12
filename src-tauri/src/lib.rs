use log::warn;
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager,
};
use tauri_plugin_log::{Target, TargetKind};

mod commands;
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
            commands::live_msg_stream
        ])
        .setup(|app| {
            // 创建菜单项
            let open_i = MenuItem::with_id(app, "open", "Open", true, None::<&str>)?;
            let hide_i = MenuItem::with_id(app, "hide", "Hide", true, None::<&str>)?;
            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&open_i, &hide_i, &quit_i])?;

            // 托盘图标设置
            let _tray = TrayIconBuilder::new()
                .on_tray_icon_event(|tray, event| match event {
                    TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } => {
                        // 单击左键时显示主窗口
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    _ => {}
                })
                .icon(app.default_window_icon().unwrap().clone()) // 设置图标
                .tooltip("My App") // 设置提示信息
                .menu(&menu) // 绑定菜单
                .menu_on_left_click(false) // 左键点击不打开菜单
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "open" => {
                        app.get_webview_window("main").unwrap().show().unwrap();
                    }
                    "hide" => {
                        app.get_webview_window("main").unwrap().hide().unwrap();
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {
                        warn!("未处理的菜单项 {:?}", event.id);
                    }
                })
                .build(app)?; // 构建托盘图标
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
