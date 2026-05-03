/**
 * EntryList component - displays list of filtered entries
 */

import { EntryData } from "../types";
import { EntryListItem } from "./EntryListItem";

interface EntryListProps {
  entries: EntryData[];
  selectedEntryId: string | null;
  onSelectEntry: (entry: EntryData) => void;
}

export function EntryList({
  entries,
  selectedEntryId,
  onSelectEntry,
}: EntryListProps) {
  return (
    <div className="max-h-72 overflow-y-auto border border-border rounded-lg mb-4">
      {entries.length === 0 ? (
        <div className="px-4 py-8 text-center text-text-secondary">
          No entries found
        </div>
      ) : (
        entries.map((entry) => (
          <EntryListItem
            key={entry.uuid}
            entry={entry}
            isSelected={selectedEntryId === entry.uuid}
            onClick={() => onSelectEntry(entry)}
          />
        ))
      )}
    </div>
  );
}
