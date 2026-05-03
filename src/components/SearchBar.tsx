/**
 * SearchBar component - search and filter entries
 */

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search entries...",
}: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-bg-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-text-secondary mb-4"
    />
  );
}
