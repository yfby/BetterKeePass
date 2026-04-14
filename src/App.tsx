import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import "./App.css";

function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [filePath, setFilePath] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

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
    } catch (e) {
      setError(String(e));
    }
  }

  async function closeDatabase() {
    await invoke("close_database");
    setIsUnlocked(false);
    setFilePath("");
    setPassword("");
  }

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
        </>
      )}
    </main>
  );
}

export default App;
