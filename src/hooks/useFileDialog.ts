/**
 * Custom hook for file dialog operations
 */

import { open } from "@tauri-apps/plugin-dialog";

interface UseFileDialogReturn {
  openFileDialog: () => Promise<string | null>;
}

export function useFileDialog(): UseFileDialogReturn {
  const openFileDialog = async (): Promise<string | null> => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{ name: "KeePass Database", extensions: ["kdbx"] }],
      });
      return selected as string | null;
    } catch (e) {
      console.error("Failed to open file dialog:", e);
      return null;
    }
  };

  return { openFileDialog };
}
