/**
 * Clipboard utility for secure copy operations with auto-clear
 */

import { writeText } from "@tauri-apps/plugin-clipboard-manager";

const CLIPBOARD_TIMEOUT = 30000; // 30 seconds

let clipboardTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Copies text to clipboard and automatically clears it after 30 seconds
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await writeText(text);
    
    // Clear any existing timer
    if (clipboardTimer) {
      clearTimeout(clipboardTimer);
    }
    
    // Set new timer to clear clipboard after timeout
    clipboardTimer = setTimeout(async () => {
      try {
        await writeText("");
      } catch (e) {
        console.error("Failed to clear clipboard:", e);
      }
    }, CLIPBOARD_TIMEOUT);
  } catch (e) {
    console.error("Failed to copy to clipboard:", e);
    throw e;
  }
}

/**
 * Manually clears the clipboard
 */
export async function clearClipboard(): Promise<void> {
  if (clipboardTimer) {
    clearTimeout(clipboardTimer);
    clipboardTimer = null;
  }
  try {
    await writeText("");
  } catch (e) {
    console.error("Failed to clear clipboard:", e);
  }
}
