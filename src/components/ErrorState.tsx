import React from 'react';
import { WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  message: string | null;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="error-banner" role="alert">
      <div className="error-icon-wrapper" aria-hidden="true">
        <WifiOff size={32} />
      </div>

      <div>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--crimson-neon)', marginBottom: '0.4rem' }}>
          Subspace Transmission Failure
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto', fontSize: '0.92rem' }}>
          {message ||
            'The Holonet relay could not synchronize with the planetary telemetry archives. Imperial security frequency may be congested.'}
        </p>
      </div>

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
        <AlertTriangle size={14} style={{ color: 'var(--gold-neon)' }} />
        <span>Diagnostic: Network Timeout or SWAPI rate limit detected</span>
      </div>

      <button type="button" className="banner-action-btn" onClick={onRetry}>
        <RefreshCw size={16} />
        <span>Re-establish Uplink & Retry</span>
      </button>
    </div>
  );
};
