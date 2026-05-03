# Quick Reference Guide

## Frontend Directory Map

```
src/
├── components/          # Reusable UI components
│   ├── LoginForm.tsx           # Login screen
│   ├── EntryList.tsx           # Entry list display
│   ├── EntryDetails.tsx        # Entry details view
│   ├── SearchBar.tsx           # Search input
│   └── [other components]      # Supporting UI components
├── hooks/               # Custom React hooks
│   ├── useDatabase.ts          # Database state and operations
│   ├── useFileDialog.ts        # File dialog
│   └── useSearch.ts            # Search/filter logic
├── utils/               # Utility functions
│   ├── api.ts                  # Tauri API wrappers
│   ├── clipboard.ts            # Clipboard operations
│   └── search.ts               # Search utilities
├── types/               # TypeScript definitions
│   └── index.ts                # All shared types
├── styles/              # Global stylesheets
│   ├── globals.css             # Theme & base styles
│   └── animations.css          # Animations
└── App.tsx              # Main app component (orchestrator)
```

## Backend Directory Map

```
src-tauri/src/
├── lib.rs           # Entry point & module declarations
├── main.rs          # Binary entry point
├── commands.rs      # Tauri command handlers
├── database.rs      # KeePass database operations
├── models.rs        # Data structures
├── error.rs         # Error types
└── state.rs         # Application state
```

## Common Tasks

### Add a New Component
1. Create `src/components/MyComponent.tsx`
2. Define props interface
3. Export from `src/components/index.ts`
4. Import in `App.tsx` or parent component

### Add a New Hook
1. Create `src/hooks/useMyHook.ts`
2. Define return interface
3. Export from `src/hooks/index.ts`
4. Use in components

### Add a New Tauri Command
1. Create handler in `src-tauri/src/commands.rs`
2. Add `#[tauri::command]` attribute
3. Register in `src-tauri/src/lib.rs` invoke_handler
4. Create wrapper in `src/utils/api.ts`

### Styling
- Use Tailwind CSS utility classes (Catppuccin colors in `styles/globals.css`)
- Add animations to `src/styles/animations.css`
- Import additional CSS in `App.css`

## Import Examples

```typescript
// Components
import { LoginForm, EntryList } from './components';

// Hooks
import { useDatabase, useSearch } from './hooks';

// Utils
import { getEntries, unlockDatabase } from './utils/api';
import { copyToClipboard } from './utils/clipboard';
import { filterEntries } from './utils/search';

// Types
import { EntryData } from './types';
```

## Type Definitions

```typescript
// EntryData - Main entry interface
export interface EntryData {
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  uuid: string;
}

// Component props - Always define for every component
interface LoginFormProps {
  filePath: string;
  password: string;
  error: string;
  isLoading: boolean;
  onFileSelect: (path: string) => void;
  onPasswordChange: (password: string) => void;
  onUnlock: () => void;
}
```

## Development Workflow

```bash
# Install dependencies
npm install

# Start development
npm run tauri dev

# Build for production
npm run tauri build

# Just build frontend
npm run build

# Preview built frontend
npm run preview

# Type check
npm run tsc
```

## Rust Module Dependencies

- `commands.rs` - Uses database.rs, models.rs, state.rs
- `database.rs` - Uses models.rs, error.rs
- `models.rs` - Independent
- `error.rs` - Independent
- `state.rs` - Independent
- `lib.rs` - Imports all modules

## Best Practices

### Frontend
- ✅ Keep components small and focused
- ✅ Extract logic into hooks
- ✅ Use TypeScript strict mode
- ✅ Add JSDoc comments
- ✅ Always define component props interface

### Backend
- ✅ Keep functions pure when possible
- ✅ Use Result types for error handling
- ✅ Document with doc comments (///)
- ✅ Keep modules focused
- ✅ Use descriptive function names

## Documentation Files

- **PROJECT_STRUCTURE.md** - Complete architecture guide
- **RESTRUCTURING_SUMMARY.md** - What changed and why
- **QUICK_REFERENCE.md** - This file

## Important Notes

- The project already compiles successfully ✅
- All functionality is preserved ✅
- No breaking changes introduced ✅
- Ready for adding new features ✅
- Easy to test (modular structure) ✅

## Getting Help

1. Check `PROJECT_STRUCTURE.md` for detailed architecture
2. Look at existing components for examples
3. Review hook implementations for patterns
4. Check Rust module organization for backend examples
