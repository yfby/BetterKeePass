import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import "./App.css";

interface EntryData {
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  uuid: string;
}

function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [filePath, setFilePath] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [entries, setEntries] = useState<EntryData[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<EntryData | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  let clipboardTimer: ReturnType<typeof setTimeout> | null = null;

  async function openFile() {
    const selected = await open({
      multiple: false,
      filters: [{ name: "KeePass Database", extensions: ["kdbx"] }],
    });

    if (selected) {
      setFilePath(selected);
    }
  }

  async function unlock() {
    setError("");
    try {
      const result = await invoke<string>("unlock_database", {
        path: filePath,
        password,
      });
      console.log(result);
      setIsUnlocked(true);
      loadEntries();
    } catch (e) {
      setError(String(e));
    }
  }

  async function loadEntries() {
    try {
      const data = await invoke<EntryData[]>("get_entries");
      setEntries(data);
    } catch (e) {
      console.error("Failed to load entries:", e);
    }
  }

  async function closeDatabase() {
    await invoke("close_database");
    setIsUnlocked(false);
    setFilePath("");
    setPassword("");
    setEntries([]);
    setSelectedEntry(null);
    setSearchQuery("");
  }

  async function copyToClipboard(text: string, _label: string) {
    try {
      await writeText(text);
      if (clipboardTimer) clearTimeout(clipboardTimer);
      clipboardTimer = setTimeout(async () => {
        await writeText("");
      }, 30000);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  }

  const filteredEntries = entries.filter((entry) => {
    const query = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(query) ||
      entry.username.toLowerCase().includes(query) ||
      entry.url.toLowerCase().includes(query)
    );
  });

  return (
    <main className="min-h-screen flex flex-col items-center px-4 pt-10">
      {!isUnlocked ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 w-full max-w-md">
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            BetterKeePass
          </h1>
          <button
            onClick={openFile}
            className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors cursor-pointer"
          >
            Open Database
          </button>

          {filePath && (
            <div className="flex flex-col gap-4 w-full">
              <p className="text-text-secondary text-sm break-all">
                Selected: {filePath}
              </p>
              <div className="flex flex-col gap-3">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full px-4 py-3 bg-bg-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-text-secondary"
                  onKeyDown={(e) => e.key === "Enter" && unlock()}
                />
                <button
                  onClick={unlock}
                  className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Unlock
                </button>
                {error && <p className="text-danger text-sm">{error}</p>}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 w-full max-w-lg">
          <div className="flex items-center gap-4 w-full">
            <p className="text-text-secondary text-sm truncate flex-1">
              Database: {filePath}
            </p>
            <button
              onClick={closeDatabase}
              className="px-4 py-2 bg-bg-tertiary hover:bg-border text-text-primary text-sm rounded-lg transition-colors cursor-pointer"
            >
              Close Database
            </button>
          </div>

          <div className="entries-section w-full">
            <input
              type="text"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-bg-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-text-secondary mb-4"
            />

            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-text-primary">
                Entries ({filteredEntries.length})
              </h3>
            </div>

            <div className="max-h-72 overflow-y-auto border border-border rounded-lg mb-4">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.uuid}
                  className={`px-4 py-3 border-b border-border cursor-pointer transition-colors ${
                    selectedEntry?.uuid === entry.uuid
                      ? "bg-accent/20"
                      : "hover:bg-bg-secondary"
                  } last:border-b-0`}
                  onClick={() => {
                    setSelectedEntry(entry);
                    setPasswordVisible(false);
                  }}
                >
                  <div className="font-medium text-text-primary">
                    {entry.title}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {entry.username}
                  </div>
                </div>
              ))}
            </div>

            {selectedEntry && (
              <div className="w-full p-5 bg-bg-secondary border border-border rounded-lg text-left">
                <h3 className="text-xl font-semibold text-text-primary mb-4">
                  {selectedEntry.title}
                </h3>

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-text-secondary min-w-20 font-medium">
                    Username:
                  </span>
                  <span className="text-text-primary flex-1 break-all">
                    {selectedEntry.username}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(selectedEntry.username, "Username")
                    }
                    className="px-3 py-1.5 bg-bg-tertiary hover:bg-border text-text-primary text-sm rounded-lg transition-colors cursor-pointer"
                  >
                    Copy
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-text-secondary min-w-20 font-medium">
                    Password:
                  </span>
                  <span className="text-text-primary flex-1 break-all">
                    {passwordVisible ? selectedEntry.password : "••••••••"}
                  </span>
                  <button
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="px-3 py-1.5 bg-bg-tertiary hover:bg-border text-text-primary text-sm rounded-lg transition-colors cursor-pointer"
                  >
                    {passwordVisible ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={() =>
                      copyToClipboard(selectedEntry.password, "Password")
                    }
                    className="px-3 py-1.5 bg-bg-tertiary hover:bg-border text-text-primary text-sm rounded-lg transition-colors cursor-pointer"
                  >
                    Copy
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-text-secondary min-w-20 font-medium">
                    URL:
                  </span>
                  <span className="text-text-primary flex-1 break-all">
                    {selectedEntry.url}
                  </span>
                  <button
                    onClick={() => copyToClipboard(selectedEntry.url, "URL")}
                    className="px-3 py-1.5 bg-bg-tertiary hover:bg-border text-text-primary text-sm rounded-lg transition-colors cursor-pointer"
                  >
                    Copy
                  </button>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <span className="text-text-secondary min-w-20 font-medium">
                    Notes:
                  </span>
                  <span className="text-text-primary flex-1">
                    {selectedEntry.notes}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
