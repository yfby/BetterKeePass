/**
 * Search and filtering utilities for entries
 */

import { EntryData } from "../types";

/**
 * Filters entries based on search query
 * Searches across title, username, and URL fields
 */
export function filterEntries(
  entries: EntryData[],
  searchQuery: string
): EntryData[] {
  if (!searchQuery.trim()) {
    return entries;
  }

  const query = searchQuery.toLowerCase();
  return entries.filter((entry) => {
    return (
      entry.title.toLowerCase().includes(query) ||
      entry.username.toLowerCase().includes(query) ||
      entry.url.toLowerCase().includes(query)
    );
  });
}


