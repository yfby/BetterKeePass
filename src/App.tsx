import { useState } from "react";
import { useDatabase, useSearch } from "./hooks";
import { copyToClipboard } from "./utils/clipboard";
import {
  LoginForm,
  DatabaseHeader,
  SearchBar,
  EntryList,
  EntryDetails,
  LoadingBar,
} from "./components";
import "./App.css";

function App() {
  const {
    isUnlocked,
    filePath,
    entries,
    error,
    isLoading,
    setFilePath,
    unlockDatabase,
    closeDatabase,
  } = useDatabase();

  const { searchQuery, setSearchQuery, filteredEntries } = useSearch(entries);

  const [password, setPassword] = useState<string>("");
  const [selectedEntry, setSelectedEntry] = useState<typeof entries[0] | null>(
    null
  );
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const handleUnlock = async () => {
    if (!filePath || !password.trim()) return;
    try {
      await unlockDatabase(filePath, password);
      setPassword("");
    } catch (e) {
      console.error("Failed to unlock database:", e);
    }
  };

  const handleCloseDatabase = async () => {
    try {
      await closeDatabase();
      setSelectedEntry(null);
      setPasswordVisible(false);
    } catch (e) {
      console.error("Failed to close database:", e);
    }
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await copyToClipboard(text);
    } catch (e) {
      console.error("Failed to copy to clipboard:", e);
    }
  };

  const handleSelectEntry = (entry: typeof entries[0]) => {
    setSelectedEntry(entry);
    setPasswordVisible(false);
  };

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4 pt-10">
      <LoadingBar isVisible={isLoading} />

      {!isUnlocked ? (
        <LoginForm
          filePath={filePath}
          password={password}
          error={error}
          isLoading={isLoading}
          onFileSelect={setFilePath}
          onPasswordChange={setPassword}
          onUnlock={handleUnlock}
        />
      ) : (
        <div className="flex flex-col items-center gap-6 w-full max-w-lg">
          <DatabaseHeader
            filePath={filePath}
            onCloseDatabase={handleCloseDatabase}
          />

          <div className="entries-section w-full">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-text-primary">
                Entries ({filteredEntries.length})
              </h3>
            </div>

            <EntryList
              entries={filteredEntries}
              selectedEntryId={selectedEntry?.uuid ?? null}
              onSelectEntry={handleSelectEntry}
            />

            <EntryDetails
              entry={selectedEntry}
              passwordVisible={passwordVisible}
              onTogglePasswordVisibility={handleTogglePasswordVisibility}
              onCopyField={handleCopyToClipboard}
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
