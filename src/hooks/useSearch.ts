/**
 * Custom hook for search functionality
 */

import { useState } from "react";
import { filterEntries } from "../utils/search";
import { EntryData } from "../types";

interface UseSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredEntries: EntryData[];
}

export function useSearch(entries: EntryData[]): UseSearchReturn {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredEntries = filterEntries(entries, searchQuery);

  return {
    searchQuery,
    setSearchQuery,
    filteredEntries,
  };
}
