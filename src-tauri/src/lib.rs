mod commands;
mod database;
mod error;
mod models;
mod state;

use commands::{close_database, get_entries, unlock_database};
use state::AppState;
use std::sync::Mutex;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AppState {
            db: Mutex::new(None),
            file_path: Mutex::new(None),
        })
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            unlock_database,
            close_database,
            get_entries,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
