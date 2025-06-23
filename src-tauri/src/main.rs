// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn check_internet() -> bool {
    reqwest::blocking::get("https://www.google.com")
        .map(|res| res.status().is_success())
        .unwrap_or(false)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![check_internet,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    abox_pms_lib::run()
}
