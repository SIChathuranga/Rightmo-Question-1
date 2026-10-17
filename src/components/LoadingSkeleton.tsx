/**
 * LoadingSkeleton Component
 *
 * Renders holographic shimmering placeholder cards matching the exact
 * grid dimensions of the PlanetCard components while asynchronous
 * SWAPI planetary data is being transmitted.
 */

import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="planets-grid" aria-busy="true" aria-label="Loading planetary telemetry">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="skeleton-card">
          {/* Animated holographic light shimmer sweep */}
          <div className="skeleton-shimmer" aria-hidden="true" />

          {/* Title and ID chip placeholder */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div className="skeleton-line" style={{ width: '55%', height: '24px' }} />
            <div className="skeleton-line" style={{ width: '25%', height: '18px' }} />
          </div>

          {/* Mini Celestial Circle Preview Placeholder */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '1rem 0',
              height: '90px',
            }}
          >
            <div
              className="skeleton-line"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
              }}
            />
          </div>

          {/* Metrics Grid Placeholders (Diameter & Population) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            <div className="skeleton-line" style={{ height: '48px', borderRadius: '8px' }} />
            <div className="skeleton-line" style={{ height: '48px', borderRadius: '8px' }} />
          </div>

          {/* Biome Tag Pills Placeholder */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
            <div className="skeleton-line" style={{ width: '30%', height: '22px', borderRadius: '12px' }} />
            <div className="skeleton-line" style={{ width: '40%', height: '22px', borderRadius: '12px' }} />
          </div>
        </div>
      ))}
    </div>
  );
};
