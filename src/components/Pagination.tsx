import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  if (totalPages <= 1) return null;

  // Generate intelligent range of visible page numbers
  const getPageNumbers = () => {
    const delta = 2;
    const range: number[] = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift(-1); // ellipsis
    }
    if (currentPage + delta < totalPages - 1) {
      range.push(-2); // ellipsis
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const pages = getPageNumbers();

  return (
    <nav className="pagination-container" aria-label="Planetary Archive Pagination">
      {/* First Page */}
      <button
        type="button"
        className="page-btn"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1 || isLoading}
        title="First Page"
        aria-label="Navigate to first page"
      >
        <ChevronsLeft size={16} />
      </button>

      {/* Previous Page */}
      <button
        type="button"
        className="page-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        title="Previous Page"
        aria-label="Navigate to previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Numbered Page Buttons */}
      {pages.map((pageNum, idx) => {
        if (pageNum < 0) {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="mono-telemetry"
              style={{ color: 'var(--text-muted)', padding: '0 0.4rem' }}
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

      {/* Next Page */}
      <button
        type="button"
        className="page-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        title="Next Page"
        aria-label="Navigate to next page"
      >
        <ChevronRight size={16} />
      </button>

      {/* Last Page */}
      <button
        type="button"
        className="page-btn"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages || isLoading}
        title="Last Page"
        aria-label="Navigate to last page"
      >
        <ChevronsRight size={16} />
      </button>
    </nav>
  );
};
