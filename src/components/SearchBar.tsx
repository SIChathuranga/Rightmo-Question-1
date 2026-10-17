import React, { useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  isLoading = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Pressing "/" or "Ctrl+K" focuses the search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="search-container">
      <div className="search-icon" aria-hidden="true">
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" style={{ color: 'var(--cyan-neon)' }} />
        ) : (
          <Search size={18} />
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder="Search planets by name (e.g. Tatooine, Hoth, Dagobah)... [Press /]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search planets by name"
      />

      {value && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={onClear}
          title="Clear search"
          aria-label="Clear search query"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
