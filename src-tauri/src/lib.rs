use keepass::db::{Database, Group};
use keepass::DatabaseKey;
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::sync::Mutex;
use std::thread;
use tauri::State;

#[derive(Serialize, Deserialize, Clone)]
struct EntryData {
    title: String,
    username: String,
    password: String,
    url: String,
    notes: String,
    uuid: String,
}

struct AppState {
    db: Mutex<Option<Database>>,
    file_path: Mutex<Option<String>>,
}

fn entry_to_data(entry: &keepass::db::Entry) -> EntryData {
    EntryData {
        title: entry.get("Title").unwrap_or_default().to_string(),
        username: entry.get("Username").unwrap_or_default().to_string(),
        password: entry.get("Password").unwrap_or_default().to_string(),
        url: entry.get("URL").unwrap_or_default().to_string(),
        notes: entry.get("Notes").unwrap_or_default().to_string(),
        uuid: format!("{:?}", entry.uuid),
    }
}

fn get_entries_from_group(group: &Group) -> Vec<EntryData> {
    let mut entries = Vec::new();
    for entry in &group.entries {
        entries.push(entry_to_data(entry));
    }
    for subgroup in &group.groups {
        entries.extend(get_entries_from_group(subgroup));
    }
    entries
}

fn open_db(path: &str, password: &str) -> Result<Database, String> {
    let mut file = File::open(path).map_err(|e| format!("Failed to open file: {}", e))?;
    let key = DatabaseKey::new().with_password(password);
    Database::open(&mut file, key).map_err(|e| format!("Failed to open database: {}", e))
}

#[tauri::command]
async fn unlock_database(
    path: String,
    password: String,
    state: State<'_, AppState>,
) -> Result<String, String> {
    println!("Unlocking database: {}", path);

    let path_clone = path.clone();
    let db_result = thread::spawn(move || open_db(&path_clone, &password))
        .join()
        .unwrap();
    let db = db_result.map_err(|e| e.to_string())?;

    let mut db_lock = state.db.lock().map_err(|e| e.to_string())?;
    *db_lock = Some(db);

    let mut path_lock = state.file_path.lock().map_err(|e| e.to_string())?;
    *path_lock = Some(path);

    println!("Database unlocked successfully");

    Ok("Database unlocked successfully".to_string())
}

#[tauri::command]
async fn close_database(state: State<'_, AppState>) -> Result<(), String> {
    let mut db_lock = state.db.lock().map_err(|e| e.to_string())?;
    *db_lock = None;
    let mut path_lock = state.file_path.lock().map_err(|e| e.to_string())?;
    *path_lock = None;
    Ok(())
}

#[tauri::command]
async fn get_entries(state: State<'_, AppState>) -> Result<Vec<EntryData>, String> {
    let db_lock = state.db.lock().map_err(|e| e.to_string())?;
    let db = db_lock.as_ref().ok_or("Database not unlocked")?;

    let entries = get_entries_from_group(&db.root);
    Ok(entries)
}

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
