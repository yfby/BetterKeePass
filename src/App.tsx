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

interface NewEntryData {
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
}

type ModalMode = "closed" | "add" | "edit";

function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [filePath, setFilePath] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [entries, setEntries] = useState<EntryData[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<EntryData | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<ModalMode>("closed");
  const [editForm, setEditForm] = useState<NewEntryData>({
    title: "",
    username: "",
    password: "",
    url: "",
    notes: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

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

  function openAddModal() {
    setEditForm({ title: "", username: "", password: "", url: "", notes: "" });
    setModalMode("add");
  }

  function openEditModal() {
    if (selectedEntry) {
      setEditForm({
        title: selectedEntry.title,
        username: selectedEntry.username,
        password: selectedEntry.password,
        url: selectedEntry.url,
        notes: selectedEntry.notes,
      });
      setModalMode("edit");
    }
  }

  function closeModal() {
    setModalMode("closed");
    setDeleteConfirm(false);
  }

  async function handleSave() {
    try {
      if (modalMode === "add") {
        await invoke("add_entry", { entryData: editForm });
      } else if (modalMode === "edit" && selectedEntry) {
        await invoke("update_entry", { uuid: selectedEntry.uuid, entryData: editForm });
      }
      closeModal();
      loadEntries();
    } catch (e) {
      console.error("Failed to save entry:", e);
    }
  }

  async function handleDelete() {
    if (selectedEntry && deleteConfirm) {
      try {
        await invoke("delete_entry", { uuid: selectedEntry.uuid });
        setSelectedEntry(null);
        closeModal();
        loadEntries();
      } catch (e) {
        console.error("Failed to delete entry:", e);
      }
    } else {
      setDeleteConfirm(true);
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
    <main className="container">
      <h1>BetterKeePass</h1>

      {!isUnlocked ? (
        <>
          <button onClick={openFile}>Open Database</button>

          {filePath && (
            <>
              <p>Selected: {filePath}</p>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                />
                <button onClick={unlock}>Unlock</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <p>Database: {filePath}</p>
          <button onClick={closeDatabase}>Close Database</button>

          <div className="entries-section">
            <input
              type="text"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />

            <div className="entries-header">
              <h3>Entries ({filteredEntries.length})</h3>
              <button onClick={openAddModal}>Add Entry</button>
            </div>

            <div className="entries-list">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.uuid}
                  className={`entry-item ${selectedEntry?.uuid === entry.uuid ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedEntry(entry);
                    setPasswordVisible(false);
                    setDeleteConfirm(false);
                  }}
                >
                  <div className="entry-title">{entry.title}</div>
                  <div className="entry-username">{entry.username}</div>
                </div>
              ))}
            </div>

            {selectedEntry && (
              <div className="entry-details">
                <h3>{selectedEntry.title}</h3>
                <div className="detail-row">
                  <span className="detail-label">Username:</span>
                  <span className="detail-value">{selectedEntry.username}</span>
                  <button onClick={() => copyToClipboard(selectedEntry.username, "Username")}>
                    Copy
                  </button>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Password:</span>
                  <span className="detail-value">
                    {passwordVisible ? selectedEntry.password : "••••••••"}
                  </span>
                  <button onClick={() => setPasswordVisible(!passwordVisible)}>
                    {passwordVisible ? "Hide" : "Show"}
                  </button>
                  <button onClick={() => copyToClipboard(selectedEntry.password, "Password")}>
                    Copy
                  </button>
                </div>
                <div className="detail-row">
                  <span className="detail-label">URL:</span>
                  <span className="detail-value">{selectedEntry.url}</span>
                  <button onClick={() => copyToClipboard(selectedEntry.url, "URL")}>
                    Copy
                  </button>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Notes:</span>
                  <span className="detail-value">{selectedEntry.notes}</span>
                </div>
                <div className="detail-actions">
                  <button onClick={openEditModal}>Edit</button>
                  <button
                    className={deleteConfirm ? "confirm-delete" : ""}
                    onClick={handleDelete}
                  >
                    {deleteConfirm ? "Confirm Delete" : "Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {modalMode !== "closed" && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>{modalMode === "add" ? "Add Entry" : "Edit Entry"}</h3>
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Username:</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Password:</label>
                  <input
                    type="text"
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>URL:</label>
                  <input
                    type="text"
                    value={editForm.url}
                    onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Notes:</label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  />
                </div>
                <div className="modal-actions">
                  <button onClick={closeModal}>Cancel</button>
                  <button onClick={handleSave}>Save</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default App;