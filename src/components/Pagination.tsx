/**
 * Pagination Component
 *
 * Provides accessible, client-side pagination without full-page reloads.
 * Generates an intelligent sliding window of page numbers with ellipses,
 * jump-to-start (First), jump-to-end (Last), Next, and Previous controls.
 */

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  /** Active 1-based page index */
  currentPage: number;
  /** Total calculated pages */
  totalPages: number;
  /** Callback fired when a page change is requested */
  onPageChange: (page: number) => void;
  /** True while data for a new page is currently loading */
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  // If there is only 1 page, pagination controls are unnecessary
  if (totalPages <= 1) return null;

  // Generate an intelligent range of visible page numbers with negative numbers as ellipsis markers
  const getPageNumbers = () => {
    const delta = 2; // Show 2 pages before and after the current page
    const range: number[] = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Left ellipsis
    if (currentPage - delta > 2) {
      range.unshift(-1);
    }
    // Right ellipsis
    if (currentPage + delta < totalPages - 1) {
      range.push(-2);
    }

    // Always include first and last page
    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const pages = getPageNumbers();

  return (
    <nav className="pagination-container" aria-label="Planetary Archive Pagination">
      {/* First Page Button */}
      <button
        type="button"
        className="page-btn"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1 || isLoading}
        title="First Page"
        aria-label="Navigate to first page"
      >
        <ChevronsLeft size={16} aria-hidden="true" />
      </button>

      {/* Previous Page Button */}
      <button
        type="button"
        className="page-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        title="Previous Page"
        aria-label="Navigate to previous page"
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </button>

      {/* Numbered Page Buttons with Ellipses */}
      {pages.map((pageNum, idx) => {
        if (pageNum < 0) {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="mono-telemetry"
              style={{ color: 'var(--text-muted)', padding: '0 0.4rem' }}
              aria-hidden="true"
            >
              ...
            </span>
          );
        }

        const isActive = pageNum === currentPage;
        return (
          <button
            key={pageNum}
            type="button"
            className={`page-btn ${isActive ? 'active' : ''}`}
            onClick={() => onPageChange(pageNum)}
            disabled={isLoading}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`Page ${pageNum}`}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next Page Button */}
      <button
        type="button"
        className="page-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        title="Next Page"
        aria-label="Navigate to next page"
      >
        <ChevronRight size={16} aria-hidden="true" />
      </button>

      {/* Last Page Button */}
      <button
        type="button"
        className="page-btn"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages || isLoading}
        title="Last Page"
        aria-label="Navigate to last page"
      >
        <ChevronsRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
};
