/**
 * Database operations module
 */

use keepass::db::{Database, Group};
use keepass::DatabaseKey;
use std::fs::File;

use crate::error::{AppError, AppResult};
use crate::models::EntryData;

/// Opens and decrypts a KeePass database
pub fn open_database(path: &str, password: &str) -> AppResult<Database> {
    let mut file = File::open(path)
        .map_err(|e| AppError::FileError(format!("Failed to open file: {}", e)))?;
    
    let key = DatabaseKey::new().with_password(password);
    Database::open(&mut file, key)
        .map_err(|e| AppError::DatabaseError(format!("Failed to open database: {}", e)))
}

/// Recursively extracts all entries from a group and its subgroups
pub fn extract_entries_from_group(group: &Group) -> Vec<EntryData> {
    let mut entries = Vec::new();

    // Add entries from current group
    for entry in &group.entries {
        entries.push(EntryData::from_keepass_entry(entry));
    }

    // Recursively add entries from subgroups
    for subgroup in &group.groups {
        entries.extend(extract_entries_from_group(subgroup));
    }

    entries
}

/// Extracts all entries from the database
pub fn get_all_entries(db: &Database) -> AppResult<Vec<EntryData>> {
    let entries = extract_entries_from_group(&db.root);
    Ok(entries)
}
