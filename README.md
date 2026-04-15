# BetterKeePass

A lightweight KeePass password manager built with Tauri + React + Rust.

## MVP Features

### Core Functionality

- [x] **Open Database** - Select `.kdbx` file via native file dialog
- [x] **Unlock Database** - Enter master password to decrypt
- [x] **Close Database** - Lock/logout from current database

### View Entries

- [x] **List Entries** - Display all password entries
- [x] **Entry Details** - Show title, username, URL, notes
- [x] **Password Toggle** - Show/hide password visibility
- [x] **Search** - Filter entries by title/username/URL

### Manage Entries

- [x] **Add Entry** - Create new password entry
  - Title (required)
  - Username
  - Password
  - URL
  - Notes
- [x] **Edit Entry** - Modify existing entry
- [x] **Delete Entry** - Remove entry with confirmation

### Clipboard

- [x] **Copy Password** - One-click copy to clipboard
- [x] **Copy Username** - One-click copy to clipboard
- [x] **Auto-Clear** - Clear clipboard after 30 seconds

### Persistence

- [ ] **Save Database** - Write changes to `.kdbx` file (keepass crate has experimental write support)
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

## Note on Persistence

The underlying [keepass](https://crates.io/crates/keepass) crate has **experimental** write support for KDBX4 files. Full save functionality will be enabled once the crate's write API stabilizes.