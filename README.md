# BetterKeePass

A lightweight KeePass password manager built with Tauri + React + Rust.

## Features

### Core Functionality
- **Open Database** - Select `.kdbx` file via native file dialog
- **Unlock Database** - Enter master password to decrypt
- **Close Database** - Lock/logout from current database

### View Entries
- **List Entries** - Display all password entries
- **Entry Details** - Show title, username, URL, notes
- **Password Toggle** - Show/hide password visibility
- **Search** - Filter entries by title/username/URL

### Clipboard
- **Copy** - One-click copy for username, password, and URL
- **Auto-Clear** - Automatically clears clipboard after 30 seconds

### UI/UX
- **Dark Theme** - Catppuccin-inspired color palette
- **Background Pattern** - Subtle dot grid pattern for visual interest

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS v4 |
| Backend | Rust + Tauri v2 |
| Database Parsing | [keepass](https://crates.io/crates/keepass) crate |
| Plugins | dialog, clipboard-manager |

### Rust Dependencies
- `tauri` - Desktop app framework
- `keepass` - KDBX file parsing
- `uuid` - Entry identification
- `serde` / `serde_json` - Serialization

### Frontend Dependencies
- `@tauri-apps/api` - Tauri IPC
- `@tauri-apps/plugin-dialog` - Native file dialogs
- `@tauri-apps/plugin-clipboard-manager` - Clipboard access

---

## Project Structure

```
BetterKeePass/
├── src/                      # Frontend (React)
│   ├── App.tsx               # Main app component
│   ├── App.css               # Global styles + CSS variables
│   └── main.tsx              # React entry point
│
├── src-tauri/                # Backend (Rust)
│   ├── src/
│   │   ├── lib.rs            # Tauri commands
│   │   └── main.rs          # Rust entry point
│   ├── icons/                # App icons
│   ├── Cargo.toml           # Rust dependencies
│   └── capabilities/         # Tauri permissions
│
├── public/                   # Static assets
├── index.html                # HTML entry point
└── package.json              # Node dependencies
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Rust 1.70+
- pnpm (or npm/yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/BetterKeePass.git
cd BetterKeePass

# Install dependencies
pnpm install

# Run in development mode
pnpm tauri dev
```

### Building

```bash
# Build for production
pnpm tauri build
```

The built application will be in `src-tauri/target/release/betterkeepass`.

---

## Usage

1. Click **Open Database** and select a `.kdbx` file
2. Enter your master password
3. Click **Unlock** to decrypt and view entries
4. Use **Search** to filter entries
5. Click an entry to view details
6. Use **Copy** buttons to copy credentials to clipboard
7. Click **Close Database** to lock the app

---

## Roadmap

- [ ] Add new entry
- [ ] Edit existing entry
- [ ] Delete entry with confirmation
- [ ] Auto-lock after inactivity
- [ ] Settings panel (auto-lock time, theme preferences)
- [ ] Entry categories/folders
- [ ] Responsive layout improvements
- [ ] Custom app icon

---

## Note on Write Support

The underlying [keepass](https://crates.io/crates/keepass) crate has **experimental** write support for KDBX4 files. Full save functionality (add/edit/delete entries) will be enabled once the crate's write API stabilizes.

---

## License

[MIT](LICENSE)
