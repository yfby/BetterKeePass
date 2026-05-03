/**
 * EntryField component - displays a single field in entry details
 */

interface EntryFieldProps {
  label: string;
  value: string;
  onCopy?: () => void;
  copyLabel?: string;
  actions?: React.ReactNode;
}

export function EntryField({
  label,
  value,
  onCopy,
  copyLabel = "Copy",
  actions,
}: EntryFieldProps) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-text-secondary min-w-20 font-medium">{label}:</span>
      <span className="text-text-primary flex-1 break-all">{value}</span>
      <div className="flex gap-2">
        {onCopy && (
          <button
            onClick={onCopy}
            className="px-3 py-1.5 bg-bg-tertiary hover:bg-border text-text-primary text-sm rounded-lg transition-colors cursor-pointer"
          >
            {copyLabel}
          </button>
        )}
        {actions}
      </div>
    </div>
  );
}
