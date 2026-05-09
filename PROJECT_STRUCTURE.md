# BetterKeePass Project Structure

## Overview

This document outlines the restructured project organization for the BetterKeePass desktop application, a modern KeePass password manager built with React, TypeScript, and Tauri.

## Project Structure

```
BetterKeePass/
├── src/                                  # Frontend (React + TypeScript)
│   ├── components/                       # Reusable React components
│   │   ├── LoginForm.tsx                # Database unlock form
│   │   ├── DatabaseHeader.tsx           # Database info & close button
│   │   ├── SearchBar.tsx                # Entry search input
│   │   ├── EntryList.tsx                # List of filtered entries
│   │   ├── EntryListItem.tsx            # Single entry list item
│   │   ├── EntryDetails.tsx             # Detailed entry view
│   │   ├── EntryField.tsx               # Reusable entry field component
│   │   ├── LoadingBar.tsx               # Loading progress indicator
│   │   └── index.ts                     # Component exports
│   │
│   ├── hooks/                            # Custom React hooks
│   │   ├── useDatabase.ts               # Database operations
│   │   ├── useFileDialog.ts             # File dialog operations
│   │   ├── useSearch.ts                 # Search filtering
│   │   └── index.ts                     # Hook exports
│   │
│   ├── utils/                            # Utility functions
│   │   ├── api.ts                       # Tauri API calls
│   │   ├── clipboard.ts                 # Clipboard operations with auto-clear
│   │   └── search.ts                    # Search and filtering functions
│   │
│   ├── styles/                           # Stylesheets
│   │   ├── globals.css                  # Global styles & theme
│   │   └── animations.css               # Animation definitions
│   │
│   ├── types/                            # TypeScript type definitions
│   │   └── index.ts                     # Shared type definitions
│   │
│   ├── App.tsx                           # Main React component
│   ├── App.css                           # Global stylesheet imports
│   ├── main.tsx                          # React entry point
│   ├── vite-env.d.ts                     # Vite type definitions
│   └── assets/                           # Static assets
│       └── react.svg
│
├── src-tauri/                            # Backend (Rust + Tauri)
│   ├── src/
│   │   ├── lib.rs                       # Application entry point & module declarations
│   │   ├── main.rs                      # Binary entry point
│   │   ├── commands.rs                  # Tauri command handlers
│   │   ├── database.rs                  # Database operations
│   │   ├── error.rs                     # Error types and handling
│   │   ├── models.rs                    # Data structures (EntryData)
│   │   └── state.rs                     # Application state management
│   │
│   ├── Cargo.toml                       # Rust dependencies
│   ├── Cargo.lock                       # Rust dependency lock
│   ├── build.rs                         # Build script
│   ├── tauri.conf.json                  # Tauri app config
│   ├── capabilities/                    # Tauri permissions
│   ├── icons/                           # App icons
│   └── gen/                             # Generated schemas
│
├── public/                               # Static web assets
│   ├── tauri.svg
│   └── vite.svg
│
├── Configuration Files:
│   ├── package.json                     # npm dependencies & scripts
│   ├── tsconfig.json                    # TypeScript configuration
│   ├── tsconfig.node.json               # TypeScript Vite config
│   ├── vite.config.ts                   # Vite build configuration
│   ├── index.html                       # HTML entry point
│   ├── .gitignore                       # Git ignore rules
│   ├── LICENSE                          # MIT License
│   └── README.md                        # Project documentation
```

## Frontend Architecture

### Components (`src/components/`)

Components are organized by responsibility and reusability:

- **LoginForm.tsx**: Handles database file selection and password entry
- **DatabaseHeader.tsx**: Displays current database file path and close button
- **SearchBar.tsx**: Search input for filtering entries
- **EntryList.tsx**: Container component for list of entries
- **EntryListItem.tsx**: Individual entry in list with click handling
- **EntryDetails.tsx**: Detailed view of selected entry with copy buttons
- **EntryField.tsx**: Reusable component for displaying entry fields
- **LoadingBar.tsx**: Visual loading indicator

### Custom Hooks (`src/hooks/`)

- **useDatabase.ts**: Manages database state and operations (unlock, load, close)
- **useFileDialog.ts**: Wraps Tauri file dialog functionality
- **useSearch.ts**: Handles search query state and filtering

### Utilities (`src/utils/`)

- **api.ts**: Tauri command wrappers for backend communication
- **clipboard.ts**: Clipboard operations with automatic 30-second clear
- **search.ts**: Entry filtering and search logic

### Types (`src/types/`)

- **index.ts**: Shared TypeScript interfaces and types

### Styles (`src/styles/`)

- **globals.css**: Catppuccin theme colors, base styles
- **animations.css**: Loading bar and other animations
- **App.css**: Main stylesheet that imports all styles

## Backend Architecture

### Rust Modules (`src-tauri/src/`)

**lib.rs** - Main entry point that:
- Declares all modules
- Initializes Tauri app with plugins
- Sets up command handlers
- Manages global app state

**commands.rs** - Tauri command handlers:
- `unlock_database()` - Decrypts KeePass database
- `get_entries()` - Retrieves all entries
- `close_database()` - Clears stored database

**database.rs** - Database operations:
- `open_database()` - Opens and validates KDBX file
- `extract_entries_from_group()` - Recursive entry extraction
- `get_all_entries()` - Retrieves all database entries

**models.rs** - Data structures:
- `EntryData` - Serializable entry representation
- Conversions from KeePass entries to frontend-compatible format

**error.rs** - Error handling:
- `AppError` enum with variants (FileError, DatabaseError, etc.)
- Error conversion traits
- Type alias for `Result<T, AppError>`

**state.rs** - Application state:
- `AppState` struct holding locked database and file path

## Data Flow

### Unlock Sequence
1. User selects KDBX file via file dialog
2. Frontend calls `unlock_database` command with path and password
3. Backend spawns thread to decrypt database (non-blocking)
4. Database stored in `AppState`
5. Frontend receives success, calls `get_entries`
6. Backend returns decrypted entries
7. Frontend displays unlocked view with entries

### Entry Copy Sequence
1. User clicks "Copy" button on entry field
2. Frontend calls `copyToClipboard()` utility
3. Clipboard text set via Tauri plugin
4. Timer started to clear clipboard after 30 seconds
5. New copy action clears old timer and starts new one

## Key Design Decisions

### Frontend
- **Component-based**: Each UI feature is its own component
- **Custom hooks**: Reusable logic extracted from components
- **Separation of concerns**: UI, logic, and data fetch separated
- **Tailwind CSS**: Utility-first styling with Catppuccin theme
- **TypeScript strict mode**: Full type safety

### Backend
- **Module separation**: Concerns split across files for maintainability
- **Error types**: Custom error enum for better error handling
- **Thread spawning**: Database decryption runs on separate thread
- **State management**: Centralized app state using Tauri's `manage()`
- **Type safety**: Rust's type system ensures correctness

## Development Guidelines

### Adding a New Component

1. Create file in `src/components/YourComponent.tsx`
2. Define props interface
3. Export from `src/components/index.ts`
4. Import and use in parent component

### Adding a New Hook

1. Create file in `src/hooks/useYourHook.ts`
2. Define return interface
3. Export from `src/hooks/index.ts`
4. Use in components

### Adding a New Backend Command

1. Create handler function in `src-tauri/src/commands.rs`
2. Add `#[tauri::command]` attribute
3. Add to `invoke_handler!` list in `lib.rs`
4. Create wrapper in `src/utils/api.ts`

### Error Handling

**Frontend**: Try-catch blocks with user-friendly error messages
**Backend**: Use `AppResult<T>` type and `AppError` enum for typed errors

