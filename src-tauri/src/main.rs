// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{AppHandle, Manager};

#[tauri::command]
fn check_internet() -> bool {
    reqwest::blocking::get("https://www.google.com")
        .map(|res| res.status().is_success())
        .unwrap_or(false)
}

#[tauri::command]
async fn close_splashscreen(app: AppHandle) {
    if let Some(splashscreen) = app.get_webview_window("splashscreen") {
        splashscreen.close().unwrap();
    }
    if let Some(main_window) = app.get_webview_window("main") {
        main_window.show().unwrap();
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let splashscreen_window = app.get_webview_window("splashscreen").unwrap();
            let main_window = app.get_webview_window("main").unwrap();
            tauri::async_runtime::spawn(async move {
                println!("Initializing backend...");
                tokio::time::sleep(std::time::Duration::from_secs(3)).await;
                println!("Backend initialization done.");
                splashscreen_window.close().unwrap();
                main_window.show().unwrap();
            });
            Ok(())
        })
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![check_internet, close_splashscreen])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    abox_pms_lib::run()
}
