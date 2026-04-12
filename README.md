# BetterKeePass

A lightweight KeePass password manager built with Tauri + React + Rust.

## MVP Features

### Core Functionality

- [ ] **Open Database** - Select `.kdbx` file via native file dialog
- [ ] **Unlock Database** - Enter master password to decrypt
- [ ] **Close Database** - Lock/logout from current database

### View Entries

- [ ] **List Entries** - Display all password entries
- [ ] **Entry Details** - Show title, username, URL, notes
- [ ] **Password Toggle** - Show/hide password visibility
- [ ] **Search** - Filter entries by title/username/URL

### Manage Entries

- [ ] **Add Entry** - Create new password entry
  - Title (required)
  - Username
  - Password
  - URL
  - Notes
- [ ] **Edit Entry** - Modify existing entry
- [ ] **Delete Entry** - Remove entry with confirmation

### Clipboard

- [ ] **Copy Password** - One-click copy to clipboard
- [ ] **Copy Username** - One-click copy to clipboard
- [ ] **Auto-Clear** - Clear clipboard after 30 seconds

### Persistence

- [ ] **Save Database** - Write changes to `.kdbx` file
- [ ] **Auto-Save** - Save on every modification

---

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Backend:** Rust + Tauri 2
- **Database:** [keepass](https://crates.io/crates/keepass) crate
- **Plugins:** dialog, clipboard-manager

## Development

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm tauri dev

# Build for production
pnpm tauri build
```
