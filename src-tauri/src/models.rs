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
    pub fn from_keepass_entry(entry: &keepass::db::EntryRef) -> Self {
        // Use the public getter methods on EntryRef/Entry to access fields
        EntryData {
            title: entry.get("Title").unwrap_or_default().to_string(),
            username: entry.get("UserName").or(entry.get("Username")).unwrap_or_default().to_string(),
            password: entry.get("Password").unwrap_or_default().to_string(),
            url: entry.get("URL").or(entry.get("Url")).unwrap_or_default().to_string(),
            notes: entry.get("Notes").unwrap_or_default().to_string(),
            // EntryRef doesn't expose a public `uuid` field; get the EntryId then its uuid
            uuid: format!("{}", entry.id()),
        }
    }
}
