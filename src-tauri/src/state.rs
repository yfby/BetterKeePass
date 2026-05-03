/**
 * Application state management
 */

use keepass::db::Database;
use std::sync::Mutex;

pub struct AppState {
    pub db: Mutex<Option<Database>>,
    pub file_path: Mutex<Option<String>>,
}
