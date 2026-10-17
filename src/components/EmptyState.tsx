import React from 'react';
import { Telescope, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  searchQuery: string;
  onReset: () => void;
  onSuggestionClick?: (planet: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  searchQuery,
  onReset,
  onSuggestionClick,
}) => {
  const suggestions = ['Tatooine', 'Hoth', 'Dagobah', 'Endor', 'Coruscant', 'Naboo'];

  return (
    <div className="empty-banner" role="status">
      <div className="empty-icon-wrapper" aria-hidden="true">
        <Telescope size={32} />
      </div>

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

      <button type="button" className="banner-action-btn" onClick={onReset}>
        <RotateCcw size={16} />
        <span>Reset Search Filters</span>
      </button>
    </div>
  );
};
