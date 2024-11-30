use log::warn;
use tauri::menu::Menu;
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{
    menu::{MenuEvent, MenuItem},
    Wry,
};
use tauri::{AppHandle, Manager};

pub struct Tray {}

impl Tray {
    pub fn init_tray(app_handle: &AppHandle) {
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
            .icon(app_handle.default_window_icon().unwrap().clone()) // 设置图标
            .tooltip("MiniBili") // 设置提示信息
            .menu(&create_menu(app_handle)) // 绑定菜单
            .menu_on_left_click(false) // 左键点击不打开菜单
            .on_menu_event(on_menu_event)
            .build(app_handle);
    }
}

fn on_menu_event(app_handle: &AppHandle, event: MenuEvent) {
    match event.id.as_ref() {
        "open" => {
            app_handle
                .get_webview_window("main")
                .unwrap()
                .show()
                .unwrap();
        }
        "hide" => {
            app_handle
                .get_webview_window("main")
                .unwrap()
                .hide()
                .unwrap();
        }
        "quit" => {
            app_handle.exit(0);
        }
        _ => {
            warn!("未处理的菜单项 {:?}", event.id);
        }
    }
}

fn create_menu(app_handle: &AppHandle) -> Menu<Wry> {
    // 创建菜单项
    let open_i = MenuItem::with_id(app_handle, "open", "Open", true, None::<&str>).unwrap();
    let hide_i = MenuItem::with_id(app_handle, "hide", "Hide", true, None::<&str>).unwrap();
    let quit_i = MenuItem::with_id(app_handle, "quit", "Quit", true, None::<&str>).unwrap();
    Menu::with_items(app_handle, &[&open_i, &hide_i, &quit_i]).unwrap()
}
