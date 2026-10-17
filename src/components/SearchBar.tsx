/**
 * SearchBar Component
 *
 * Provides a live search console with input debouncing, quick-clear button,
 * keyboard accessibility shortcut (press "/" or "Ctrl+K" to focus), and loading spinner.
 */

import React, { useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchBarProps {
  /** Current text query value */
  value: string;
  /** Callback fired whenever user types */
  onChange: (val: string) => void;
  /** Callback to reset/clear search query */
  onClear: () => void;
  /** True when a debounced search is currently synchronizing with the API */
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  isLoading = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard shortcut: Pressing "/" or "Ctrl+K" focuses the search bar instantly
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
      {/* Search status icon: switches to spinner when debouncing/querying */}
      <div className="search-icon" aria-hidden="true">
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" style={{ color: 'var(--cyan-neon)' }} />
        ) : (
          <Search size={18} />
        )}
      </div>

      {/* Main input element */}
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder="Search planets by name (e.g. Tatooine, Hoth, Dagobah)... [Press /]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search planets by name"
      />

      {/* Clear button (visible only when input has text) */}
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
