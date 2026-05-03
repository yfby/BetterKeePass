/**
 * DatabaseHeader component - displays database info and close button
 */

interface DatabaseHeaderProps {
  filePath: string;
  onCloseDatabase: () => void;
}

export function DatabaseHeader({
  filePath,
  onCloseDatabase,
}: DatabaseHeaderProps) {
  return (
    <div className="flex items-center gap-4 w-full">
      <p className="text-text-secondary text-sm truncate flex-1">
        Database: {filePath}
      </p>
      <button
        onClick={onCloseDatabase}
        className="px-4 py-2 bg-bg-tertiary hover:bg-border text-text-primary text-sm rounded-lg transition-colors cursor-pointer"
      >
        Close Database
      </button>
    </div>
  );
}
