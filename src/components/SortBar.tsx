import React from 'react';
import { ArrowDownNarrowWide, ArrowUpNarrowWide, SlidersHorizontal } from 'lucide-react';
import type { SortOption } from '../types/planet';

interface SortBarProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SortBar: React.FC<SortBarProps> = ({ currentSort, onSortChange }) => {
  return (
    <div className="sort-group" role="group" aria-label="Diameter sorting options">
      <span className="sort-label">
        <SlidersHorizontal size={13} style={{ display: 'inline', marginRight: 4 }} />
        Diameter Sort:
      </span>

      <button
        type="button"
        className={`sort-btn ${currentSort === 'default' ? 'active' : ''}`}
        onClick={() => onSortChange('default')}
        aria-pressed={currentSort === 'default'}
      >
        Default
      </button>

      <button
        type="button"
        className={`sort-btn ${currentSort === 'diameter-asc' ? 'active' : ''}`}
        onClick={() => onSortChange('diameter-asc')}
        aria-pressed={currentSort === 'diameter-asc'}
      >
        <ArrowUpNarrowWide size={14} />
        Ascending (Low → High)
      </button>

      <button
        type="button"
        className={`sort-btn ${currentSort === 'diameter-desc' ? 'active' : ''}`}
        onClick={() => onSortChange('diameter-desc')}
        aria-pressed={currentSort === 'diameter-desc'}
      >
        <ArrowDownNarrowWide size={14} />
        Descending (High → Low)
      </button>
    </div>
  );
};
