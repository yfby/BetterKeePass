/**
 * EntryDetails component - displays detailed view of selected entry
 */

import { EntryData } from "../types";
import { EntryField } from "./EntryField";

interface EntryDetailsProps {
  entry: EntryData | null;
  passwordVisible: boolean;
  onTogglePasswordVisibility: () => void;
  onCopyField: (text: string) => void;
}

export function EntryDetails({
  entry,
  passwordVisible,
  onTogglePasswordVisibility,
  onCopyField,
}: EntryDetailsProps) {
  if (!entry) {
    return null;
  }

  return (
    <div className="w-full p-5 bg-bg-secondary border border-border rounded-lg text-left">
      <h3 className="text-xl font-semibold text-text-primary mb-4">
        {entry.title}
      </h3>

      <EntryField
        label="Username"
        value={entry.username}
        onCopy={() => onCopyField(entry.username)}
      />

      <div className="flex items-center gap-3 mb-3">
        <span className="text-text-secondary min-w-20 font-medium">
          Password:
        </span>
        <span className="text-text-primary flex-1 break-all">
          {passwordVisible ? entry.password : "••••••••"}
        </span>
        <div className="flex gap-2">
          <button
            onClick={onTogglePasswordVisibility}
            className="px-3 py-1.5 bg-bg-tertiary hover:bg-border text-text-primary text-sm rounded-lg transition-colors cursor-pointer"
          >
            {passwordVisible ? "Hide" : "Show"}
          </button>
          <button
            onClick={() => onCopyField(entry.password)}
            className="px-3 py-1.5 bg-bg-tertiary hover:bg-border text-text-primary text-sm rounded-lg transition-colors cursor-pointer"
          >
            Copy
          </button>
        </div>
      </div>

      <EntryField
        label="URL"
        value={entry.url}
        onCopy={() => onCopyField(entry.url)}
      />

      <div className="flex items-start gap-3 mb-4">
        <span className="text-text-secondary min-w-20 font-medium">Notes:</span>
        <span className="text-text-primary flex-1">{entry.notes}</span>
      </div>
    </div>
  );
}
