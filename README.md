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

---

# TODO

## Manage Entries

- **Add Entry** - Create new password entry
- **Edit Entry** - Modify existing entry
- **Delete Entry** - Remove entry with confirmation

## Clipboard

###FIX CURRENT CLIPBOARD IMPLEMENTATION

- **Copy Password** - One-click copy to clipboard
- **Copy Username** - One-click copy to clipboard
- **Auto-Clear** - Clear clipboard after 30 seconds

## UI/UX Improvements

- **Dark Mode** - Toggle between light/dark themes
- **Change Font** - Simple clean design
- **Background Pattern** - Subtle pattern for visual interest
- **Loading Bar** - Show progress when opening large databases
- **Responsive Layout** - Works well on different screen sizes
- **Error Handling** - User-friendly error messages for failed operations
- **Icon** - Custom app Icon

## Future Enhancements
- **Auto-Lock** - Lock database after inactivity
- **Settings** - Configure app preferences (e.g. auto-lock time, theme)

---

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS
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
