// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::{Manager, Runtime, Window};

#[tauri::command]
fn check_internet() -> bool {
    reqwest::blocking::get("https://www.google.com")
        .map(|res| res.status().is_success())
        .unwrap_or(false)
}

#[tauri::command]
async fn close_splashscreen<R: Runtime>(window: tauri::Window<R>) {
    if let Some(splashscreen) = window.get_window("splashscreen") {
        splashscreen.close().unwrap();
    }
    window.show().unwrap();
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let splashscreen_window = Window::builder(
                app,
                "splashscreen",
                tauri::WindowUrl::App("index.html".into()),
            )
            .title("Splash Screen")
            .inner_size(400.0, 600.0)
            .decorations(false)
            .transparent(true)
            .visible(false)
            .center()
            .resizable(false)
            .skip_taskbar(true)
            .build()?;

            // Rest of your code...
            Ok(())
        })
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![close_splashscreen, check_internet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    // tauri::Builder::default()
    //     .plugin(tauri_plugin_store::Builder::new().build())
    //     .plugin(tauri_plugin_dialog::init())
    //     .plugin(tauri_plugin_opener::init())
    //     .invoke_handler(tauri::generate_handler![check_internet,])
    //     .run(tauri::generate_context!())
    //     .expect("error while running tauri application");

    abox_pms_lib::run()
}
