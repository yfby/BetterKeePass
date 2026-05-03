/**
 * LoginForm component - handles database file selection and password entry
 */

import { useState } from "react";
import { useFileDialog } from "../hooks";

interface LoginFormProps {
  filePath: string;
  password: string;
  error: string;
  isLoading: boolean;
  onFileSelect: (path: string) => void;
  onPasswordChange: (password: string) => void;
  onUnlock: () => void;
}

export function LoginForm({
  filePath,
  password,
  error,
  isLoading,
  onFileSelect,
  onPasswordChange,
  onUnlock,
}: LoginFormProps) {
  const { openFileDialog } = useFileDialog();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenFile = async () => {
    setIsDialogOpen(true);
    try {
      const selected = await openFileDialog();
      if (selected) {
        onFileSelect(selected);
      }
    } finally {
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 w-full max-w-md">
      <h1 className="text-3xl font-bold text-text-primary mb-4">
        BetterKeePass
      </h1>
      <button
        onClick={handleOpenFile}
        disabled={isDialogOpen || isLoading}
        className="px-6 py-3 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors cursor-pointer"
      >
        Open Database
      </button>

      {filePath && (
        <div className="flex flex-col gap-4 w-full">
          <p className="text-text-secondary text-sm break-all">
            Selected: {filePath}
          </p>
          <div className="flex flex-col gap-3">
            <input
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Enter password..."
              disabled={isLoading}
              className="w-full px-4 py-3 bg-bg-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  onUnlock();
                }
              }}
            />
            <button
              onClick={onUnlock}
              disabled={isLoading || !password}
              className="px-6 py-3 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              {isLoading ? "Unlocking..." : "Unlock"}
            </button>
            {error && <p className="text-danger text-sm">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
