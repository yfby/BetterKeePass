use keepass::db::{Database, Entry, Group, Value};
use keepass::DatabaseKey;
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::sync::Mutex;
use tauri::State;
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
struct EntryData {
    title: String,
    username: String,
    password: String,
    url: String,
    notes: String,
    uuid: String,
}

#[derive(Serialize, Deserialize)]
struct NewEntryData {
    title: String,
    username: String,
    password: String,
    url: String,
    notes: String,
}

struct AppState {
    db: Mutex<Option<Database>>,
    file_path: Mutex<Option<String>>,
}

fn entry_to_data(entry: &Entry) -> EntryData {
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

    let mut path_lock = state.file_path.lock().map_err(|e| e.to_string())?;
    *path_lock = Some(path);

    Ok("Database unlocked successfully".to_string())
}

#[tauri::command]
fn close_database(state: State<AppState>) -> Result<(), String> {
    let mut db_lock = state.db.lock().map_err(|e| e.to_string())?;
    *db_lock = None;
    let mut path_lock = state.file_path.lock().map_err(|e| e.to_string())?;
    *path_lock = None;
    Ok(())
}

#[tauri::command]
fn get_entries(state: State<AppState>) -> Result<Vec<EntryData>, String> {
    let db_lock = state.db.lock().map_err(|e| e.to_string())?;
    let db = db_lock.as_ref().ok_or("Database not unlocked")?;

    let entries = get_entries_from_group(&db.root);
    Ok(entries)
}

#[tauri::command]
fn add_entry(entry_data: NewEntryData, state: State<AppState>) -> Result<EntryData, String> {
    let mut db_lock = state.db.lock().map_err(|e| e.to_string())?;
    let db = db_lock.as_mut().ok_or("Database not unlocked")?;

    let mut new_entry = Entry::new();
    new_entry.set("Title", Value::Unprotected(entry_data.title.clone()));
    new_entry.set("Username", Value::Unprotected(entry_data.username.clone()));
    new_entry.set("Password", Value::Unprotected(entry_data.password.clone()));
    new_entry.set("URL", Value::Unprotected(entry_data.url.clone()));
    new_entry.set("Notes", Value::Unprotected(entry_data.notes.clone()));

    db.root.entries.push(new_entry.clone());

    Ok(entry_to_data(&new_entry))
}

#[tauri::command]
fn update_entry(
    uuid: String,
    entry_data: NewEntryData,
    state: State<AppState>,
) -> Result<(), String> {
    let mut db_lock = state.db.lock().map_err(|e| e.to_string())?;
    let db = db_lock.as_mut().ok_or("Database not unlocked")?;

    let target_uuid = Uuid::parse_str(&uuid).map_err(|e| format!("Invalid UUID: {}", e))?;

    for entry in &mut db.root.entries {
        if entry.uuid == target_uuid {
            entry.set("Title", Value::Unprotected(entry_data.title));
            entry.set("Username", Value::Unprotected(entry_data.username));
            entry.set("Password", Value::Unprotected(entry_data.password));
            entry.set("URL", Value::Unprotected(entry_data.url));
            entry.set("Notes", Value::Unprotected(entry_data.notes));
            return Ok(());
        }
    }

    for group in &mut db.root.groups {
        if update_entry_in_group(group, target_uuid, &entry_data) {
            return Ok(());
        }
    }

    Err("Entry not found".to_string())
}

fn update_entry_in_group(group: &mut Group, uuid: Uuid, entry_data: &NewEntryData) -> bool {
    for entry in &mut group.entries {
        if entry.uuid == uuid {
            entry.set("Title", Value::Unprotected(entry_data.title.clone()));
            entry.set("Username", Value::Unprotected(entry_data.username.clone()));
            entry.set("Password", Value::Unprotected(entry_data.password.clone()));
            entry.set("URL", Value::Unprotected(entry_data.url.clone()));
            entry.set("Notes", Value::Unprotected(entry_data.notes.clone()));
            return true;
        }
    }
    for subgroup in &mut group.groups {
        if update_entry_in_group(subgroup, uuid, entry_data) {
            return true;
        }
    }
    false
}

#[tauri::command]
fn delete_entry(uuid: String, state: State<AppState>) -> Result<(), String> {
    let mut db_lock = state.db.lock().map_err(|e| e.to_string())?;
    let db = db_lock.as_mut().ok_or("Database not unlocked")?;

    let target_uuid = Uuid::parse_str(&uuid).map_err(|e| format!("Invalid UUID: {}", e))?;

    if let Some(pos) = db.root.entries.iter().position(|e| e.uuid == target_uuid) {
        db.root.entries.remove(pos);
        return Ok(());
    }

    for group in &mut db.root.groups {
        if delete_entry_from_group(group, target_uuid) {
            return Ok(());
        }
    }

    Err("Entry not found".to_string())
}

fn delete_entry_from_group(group: &mut Group, uuid: Uuid) -> bool {
    if let Some(pos) = group.entries.iter().position(|e| e.uuid == uuid) {
        group.entries.remove(pos);
        return true;
    }
    for subgroup in &mut group.groups {
        if delete_entry_from_group(subgroup, uuid) {
            return true;
        }
    }
    false
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
            add_entry,
            update_entry,
            delete_entry
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
