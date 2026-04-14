use keepass::{Database, DatabaseKey};
use std::fs::File;
use std::sync::Mutex;
use tauri::State;

struct AppState {
    db: Mutex<Option<Database>>,
}

#[tauri::command]
fn unlock_database(
    path: String,
    password: String,
    state: State<AppState>,
) -> Result<String, String> {
    println!("Unlocking database: {}", path);

    let mut file = File::open(&path).map_err(|e| format!("Failed to open file: {}", e))?;
    let key = DatabaseKey::new().with_password(&password);
    let db =
        Database::open(&mut file, key).map_err(|e| format!("Failed to open database: {}", e))?;

    let mut db_lock = state.db.lock().map_err(|e| e.to_string())?;
    *db_lock = Some(db);

    Ok("Database unlocked successfully".to_string())
}

#[tauri::command]
fn close_database(state: State<AppState>) -> Result<(), String> {
    let mut db_lock = state.db.lock().map_err(|e| e.to_string())?;
    *db_lock = None;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AppState {
            db: Mutex::new(None),
        })
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![unlock_database, close_database])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
