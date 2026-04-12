import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import "./App.css";

function App() {
  const [filePath, setFilePath] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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
    const result = await invoke("unlock_database", { path: filePath, password });
    console.log(result);
  }

  return (
    <main className="container">
      <h1>BetterKeePass</h1>

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
          </div>
        </>
      )}
    </main>
  );
}

export default App;
