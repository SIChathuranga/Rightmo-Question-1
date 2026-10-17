/**
 * SortBar Component (Bonus Feature)
 *
 * Renders interactive diameter sorting controls allowing users to reorder
 * planets by size in Ascending (Low → High), Descending (High → Low), or Default SWAPI order.
 */

import React from 'react';
import { ArrowDownNarrowWide, ArrowUpNarrowWide, SlidersHorizontal } from 'lucide-react';
import type { SortOption } from '../types/planet';

interface SortBarProps {
  /** Currently selected sort strategy */
  currentSort: SortOption;
  /** Callback fired when a new sort option is clicked */
  onSortChange: (sort: SortOption) => void;
}

export const SortBar: React.FC<SortBarProps> = ({ currentSort, onSortChange }) => {
  return (
    <div className="sort-group" role="group" aria-label="Diameter sorting options">
      <span className="sort-label">
        <SlidersHorizontal size={13} style={{ display: 'inline', marginRight: 4 }} aria-hidden="true" />
        Diameter Sort:
      </span>

      {/* Default order button */}
      <button
        type="button"
        className={`sort-btn ${currentSort === 'default' ? 'active' : ''}`}
        onClick={() => onSortChange('default')}
        aria-pressed={currentSort === 'default'}
      >
        Default
      </button>

      {/* Diameter Ascending (Smallest to Largest) */}
      <button
        type="button"
        className={`sort-btn ${currentSort === 'diameter-asc' ? 'active' : ''}`}
        onClick={() => onSortChange('diameter-asc')}
        aria-pressed={currentSort === 'diameter-asc'}
      >
        <ArrowUpNarrowWide size={14} aria-hidden="true" />
        Ascending (Low → High)
      </button>

      {/* Diameter Descending (Largest to Smallest) */}
      <button
        type="button"
        className={`sort-btn ${currentSort === 'diameter-desc' ? 'active' : ''}`}
        onClick={() => onSortChange('diameter-desc')}
        aria-pressed={currentSort === 'diameter-desc'}
      >
        <ArrowDownNarrowWide size={14} aria-hidden="true" />
        Descending (High → Low)
      </button>
    </div>
  );
};
