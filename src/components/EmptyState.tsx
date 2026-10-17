/**
 * EmptyState Component (No-Results State)
 *
 * Renders an informative, themed hologram placeholder when a search query
 * returns zero matching planets. Offers 1-click suggested star systems and a reset button.
 */

import React from 'react';
import { Telescope, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  /** The search term that produced zero results */
  searchQuery: string;
  /** Callback to clear/reset the search filter */
  onReset: () => void;
  /** Optional callback when clicking a quick suggestion pill */
  onSuggestionClick?: (planet: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  searchQuery,
  onReset,
  onSuggestionClick,
}) => {
  // Common prominent Star Wars star systems offered as helpful search suggestions
  const suggestions = ['Tatooine', 'Hoth', 'Dagobah', 'Endor', 'Coruscant', 'Naboo'];

  return (
    <div className="empty-banner" role="status">
      {/* Astrogation telescope icon */}
      <div className="empty-icon-wrapper" aria-hidden="true">
        <Telescope size={32} />
      </div>

      {/* Narrative status message */}
      <div>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
          No Planetary Coordinates Located
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto', fontSize: '0.92rem' }}>
          Imperial astrogation arrays searched the known galaxy for{' '}
          <strong style={{ color: 'var(--cyan-neon)' }}>"{searchQuery}"</strong>, but no matching star system was found in the archive.
        </p>
      </div>

      {/* Suggested Quick Searches */}
      {suggestions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-telemetry)' }}>
            TRY SEARCHING PROMINENT SYSTEMS:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
            {suggestions.map((name) => (
              <button
                key={name}
                type="button"
                className="tag-pill"
                style={{ cursor: 'pointer', background: 'rgba(56, 189, 248, 0.12)' }}
                onClick={() => onSuggestionClick ? onSuggestionClick(name) : onReset()}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reset search button */}
      <button type="button" className="banner-action-btn" onClick={onReset}>
        <RotateCcw size={16} aria-hidden="true" />
        <span>Reset Search Filters</span>
      </button>
    </div>
  );
};
