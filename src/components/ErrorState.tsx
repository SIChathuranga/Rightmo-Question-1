/**
 * ErrorState Component (Error Recovery State)
 *
 * Renders a sci-fi "Subspace Transmission Failure" diagnostic card
 * when network or API errors occur. Provides an instant "Re-establish Uplink & Retry"
 * action button so the user can easily recover without refreshing the entire browser.
 */

import React from 'react';
import { WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  /** Descriptive error diagnosis */
  message: string | null;
  /** Callback fired to retry the planetary fetch */
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="error-banner" role="alert">
      {/* Offline signal indicator */}
      <div className="error-icon-wrapper" aria-hidden="true">
        <WifiOff size={32} />
      </div>

      {/* Error headline & diagnostic message */}
      <div>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--crimson-neon)', marginBottom: '0.4rem' }}>
          Subspace Transmission Failure
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto', fontSize: '0.92rem' }}>
          {message ||
            'The Holonet relay could not synchronize with the planetary telemetry archives. Imperial security frequency may be congested.'}
        </p>
      </div>

      {/* Network diagnosis badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-telemetry)',
        }}
      >
        <AlertTriangle size={14} style={{ color: 'var(--gold-neon)' }} aria-hidden="true" />
        <span>Diagnostic: Network Timeout or SWAPI rate limit detected</span>
      </div>

      {/* Retry recovery button */}
      <button type="button" className="banner-action-btn" onClick={onRetry}>
        <RefreshCw size={16} aria-hidden="true" />
        <span>Re-establish Uplink & Retry</span>
      </button>
    </div>
  );
};
