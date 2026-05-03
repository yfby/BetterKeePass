/**
 * Custom hook for managing database operations
 */

import { useState } from "react";
import {
  unlockDatabase as apiUnlockDatabase,
  getEntries as apiGetEntries,
  closeDatabase as apiCloseDatabase,
} from "../utils/api";
import { EntryData } from "../types";

interface UseDatabaseReturn {
  isUnlocked: boolean;
  filePath: string;
  entries: EntryData[];
  error: string;
  isLoading: boolean;
  setFilePath: (path: string) => void;
  unlockDatabase: (path: string, password: string) => Promise<void>;
  loadEntries: () => Promise<void>;
  closeDatabase: () => Promise<void>;
  clearError: () => void;
}

export function useDatabase(): UseDatabaseReturn {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [filePath, setFilePath] = useState<string>("");
  const [entries, setEntries] = useState<EntryData[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const unlockDatabase = async (path: string, password: string) => {
    setError("");
    setIsLoading(true);
    try {
      await apiUnlockDatabase(path, password);
      setIsUnlocked(true);
      await loadEntries();
    } catch (e) {
      setError(String(e));
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const loadEntries = async () => {
    try {
      const data = await apiGetEntries();
      setEntries(data);
    } catch (e) {
      console.error("Failed to load entries:", e);
      setError("Failed to load entries");
      throw e;
    }
  };

  const closeDatabase = async () => {
    try {
      await apiCloseDatabase();
      setIsUnlocked(false);
      setFilePath("");
      setEntries([]);
      setError("");
    } catch (e) {
      console.error("Failed to close database:", e);
      setError("Failed to close database");
      throw e;
    }
  };

  const clearError = () => {
    setError("");
  };

  return {
    isUnlocked,
    filePath,
    entries,
    error,
    isLoading,
    setFilePath,
    unlockDatabase,
    loadEntries,
    closeDatabase,
    clearError,
  };
}
