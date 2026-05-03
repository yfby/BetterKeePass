/**
 * Tauri command handlers
 */
use std::thread;
use tauri::State;

use crate::database::{get_all_entries, open_database};
use crate::error::AppError;
use crate::models::EntryData;
use crate::state::AppState;

/// Unlocks a KeePass database and stores it in application state
#[tauri::command]
pub async fn unlock_database(
    path: String,
    password: String,
    state: State<'_, AppState>,
) -> Result<String, String> {
    println!("Unlocking database: {}", path);

    let path_clone = path.clone();
    let db_result = thread::spawn(move || open_database(&path_clone, &password))
        .join()
        .map_err(|_| AppError::StateError("Failed to spawn thread".to_string()))?;

    let db = db_result.map_err(|e| e.to_string())?;

    let mut db_lock = state
        .db
        .lock()
        .map_err(|e| AppError::StateError(format!("Failed to lock database: {}", e)))?;
    *db_lock = Some(db);

    let mut path_lock = state
        .file_path
        .lock()
        .map_err(|e| AppError::StateError(format!("Failed to lock file path: {}", e)))?;
    *path_lock = Some(path);

    println!("Database unlocked successfully");
    Ok("Database unlocked successfully".to_string())
}

/// Closes the currently open database
#[tauri::command]
pub async fn close_database(state: State<'_, AppState>) -> Result<(), String> {
    let mut db_lock = state
        .db
        .lock()
        .map_err(|e| format!("Failed to lock database: {}", e))?;
    *db_lock = None;

    let mut path_lock = state
        .file_path
        .lock()
        .map_err(|e| format!("Failed to lock file path: {}", e))?;
    *path_lock = None;

    Ok(())
}

/// Retrieves all entries from the unlocked database
#[tauri::command]
pub async fn get_entries(state: State<'_, AppState>) -> Result<Vec<EntryData>, String> {
    let db_lock = state
        .db
        .lock()
        .map_err(|e| format!("Failed to lock database: {}", e))?;

    let db = db_lock.as_ref().ok_or("Database not unlocked")?;

    get_all_entries(db).map_err(|e| e.to_string())
}
