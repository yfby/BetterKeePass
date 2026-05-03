/**
 * API utilities for communicating with Tauri backend
 */

import { invoke } from "@tauri-apps/api/core";
import { EntryData } from "../types";

/**
 * Unlocks the KeePass database with the provided path and password
 */
export async function unlockDatabase(
  path: string,
  password: string
): Promise<string> {
  return invoke<string>("unlock_database", { path, password });
}

/**
 * Retrieves all entries from the unlocked database
 */
export async function getEntries(): Promise<EntryData[]> {
  return invoke<EntryData[]>("get_entries");
}

/**
 * Closes the currently open database
 */
export async function closeDatabase(): Promise<void> {
  return invoke("close_database");
}
