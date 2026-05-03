/**
 * EntryListItem component - displays a single entry in the list
 */

import { EntryData } from "../types";

interface EntryListItemProps {
  entry: EntryData;
  isSelected: boolean;
  onClick: () => void;
}

export function EntryListItem({
  entry,
  isSelected,
  onClick,
}: EntryListItemProps) {
  return (
    <div
      className={`px-4 py-3 border-b border-border cursor-pointer transition-colors ${
        isSelected ? "bg-accent/20" : "hover:bg-bg-secondary"
      } last:border-b-0`}
      onClick={onClick}
    >
      <div className="font-medium text-text-primary">{entry.title}</div>
      <div className="text-sm text-text-secondary">{entry.username}</div>
    </div>
  );
}
