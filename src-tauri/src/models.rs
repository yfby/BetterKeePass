/**
 * Data models and structures
 */

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct EntryData {
    pub title: String,
    pub username: String,
    pub password: String,
    pub url: String,
    pub notes: String,
    pub uuid: String,
}

impl EntryData {
    /// Converts a KeePass entry to EntryData
    pub fn from_keepass_entry(entry: &keepass::db::Entry) -> Self {
        EntryData {
            title: entry.get("Title").unwrap_or_default().to_string(),
            username: entry.get("Username").unwrap_or_default().to_string(),
            password: entry.get("Password").unwrap_or_default().to_string(),
            url: entry.get("URL").unwrap_or_default().to_string(),
            notes: entry.get("Notes").unwrap_or_default().to_string(),
            uuid: format!("{:?}", entry.uuid),
        }
    }
}
