/**
 * PlanetVisualizer Component (Bonus Optional Feature)
 *
 * Implements an interactive scalable circle data visualization engine.
 * - Computes dynamic proportional sphere radii based on actual diameter in kilometers.
 * - Supports celestial reference body benchmarking (Earth, Jupiter, The Moon, Death Star I).
 * - Displays relative scale ratios (e.g. "0.82x Earth diameter").
 * - Features an interactive zoom slider (0.5x to 1.5x) and Framer Motion spring physics.
 * - Dynamically renders atmospheric halos and surface textures tailored to the planet's biome.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Scale, Sparkles, AlertCircle } from 'lucide-react';
import type { Planet } from '../types/planet';
import { CELESTIAL_REFERENCES, getPlanetTheme } from '../utils/planetTheme';
import { formatDiameter, formatNumber } from '../utils/formatters';

interface PlanetVisualizerProps {
  /** Target planet to visualize */
  planet: Planet;
}

export const PlanetVisualizer: React.FC<PlanetVisualizerProps> = ({ planet }) => {
  // Index of celestial reference body (default: 0 -> Earth)
  const [selectedRefIndex, setSelectedRefIndex] = useState<number>(0);
  // User zoom/scale multiplier
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(1);

  // Derive atmospheric color and radial gradient
  const theme = getPlanetTheme(planet.terrain, planet.climate);
  const activeRef = CELESTIAL_REFERENCES[selectedRefIndex];

  const targetDiam = planet.numericDiameter;
  const refDiam = activeRef.diameterKm;

  // Edge case: SWAPI unknown or unmeasured diameter
  const isDiameterUnknown = !targetDiam || targetDiam <= 0;

  // Maximum and minimum pixel constraints for stage rendering
  const MAX_PIXEL_DIAM = 210;
  const MIN_PIXEL_DIAM = 24;

  // Compute scaled pixel diameters for side-by-side comparison
  let planetPx = 90;
  let refPx = 90;
  let ratioText = '';

  if (!isDiameterUnknown) {
    const maxVal = Math.max(targetDiam, refDiam);
    planetPx = Math.round(
      Math.max(MIN_PIXEL_DIAM, Math.min(MAX_PIXEL_DIAM, (targetDiam / maxVal) * MAX_PIXEL_DIAM * scaleMultiplier))
    );
    refPx = Math.round(
      Math.max(MIN_PIXEL_DIAM, Math.min(MAX_PIXEL_DIAM, (refDiam / maxVal) * MAX_PIXEL_DIAM * scaleMultiplier))
    );

    // Compute human-friendly comparative size multiplier
    const ratio = targetDiam / refDiam;
    if (ratio >= 1) {
      ratioText = `${ratio.toFixed(2)}x larger than ${activeRef.name}`;
    } else {
      ratioText = `${(ratio * 100).toFixed(1)}% of ${activeRef.name}'s size (${ratio.toFixed(2)}x)`;
    }
  }

  // Planetary rings for gas giants
  const hasRings = planet.terrain.toLowerCase().includes('gas') || planet.name.toLowerCase() === 'bespin';

  return (
    <div className="visualizer-card">
      {/* Visualizer Card Header */}
      <div className="visualizer-header">
        <div className="visualizer-title">
          <Scale size={20} aria-hidden="true" />
          <h3>Interactive Planetary Scale Comparison</h3>
        </div>

        {/* Controls: Reference Body Pills & Zoom Slider */}
        <div className="visualizer-controls">
          {/* Reference benchmark buttons */}
          <div className="reference-selector" role="group" aria-label="Reference body comparison">
            {CELESTIAL_REFERENCES.map((ref, idx) => (
              <button
                key={ref.name}
                type="button"
                className={`ref-pill ${selectedRefIndex === idx ? 'active' : ''}`}
                onClick={() => setSelectedRefIndex(idx)}
                aria-pressed={selectedRefIndex === idx}
              >
                {ref.name}
              </button>
            ))}
          </div>

          {/* Real-time zoom/scale multiplier slider */}
          {!isDiameterUnknown && (
            <div className="slider-group">
              <label htmlFor="scale-slider">
                <Maximize2 size={13} style={{ display: 'inline', marginRight: 4 }} aria-hidden="true" />
                Zoom ({scaleMultiplier.toFixed(1)}x):
              </label>
              <input
                id="scale-slider"
                type="range"
                className="visualizer-slider"
                min="0.5"
                max="1.5"
                step="0.1"
                value={scaleMultiplier}
                onChange={(e) => setScaleMultiplier(parseFloat(e.target.value))}
                aria-label="Adjust planetary circle scale"
              />
            </div>
          )}
        </div>
      </div>

      {/* Visualizer Stage Canvas */}
      <div className="visualizer-stage">
        {isDiameterUnknown ? (
          // Unmeasured / Unknown Diameter Fallback Wireframe
          <div className="comparison-column" style={{ width: '100%' }}>
            <motion.div
              className="scalable-body-circle"
              style={{
                width: 120,
                height: 120,
                border: '2px dashed var(--space-border-strong)',
                background: 'rgba(56, 189, 248, 0.05)',
                color: 'var(--text-muted)',
              }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
            >
              <AlertCircle size={28} style={{ color: 'var(--gold-neon)' }} aria-hidden="true" />
            </motion.div>
            <div className="scalable-body-label">
              <span>{planet.name}</span>
              <strong style={{ color: 'var(--gold-neon)' }}>Diameter Unknown</strong>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: 320 }}>
                Imperial cartographic probes have not yet surveyed the equatorial diameter of this sector.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Subject Planet Scalable Circle */}
            <div className="comparison-column">
              <motion.div
                className="scalable-body-circle"
                style={{
                  width: `${planetPx}px`,
                  height: `${planetPx}px`,
                  background: theme.bgGradient,
                  boxShadow: `0 0 ${Math.max(16, planetPx / 3)}px ${theme.glow}`,
                }}
                layout
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              >
                {hasRings && (
                  <div
                    className="mini-circle-rings"
                    style={{
                      width: '160%',
                      height: '28%',
                      borderWidth: '2px',
                    }}
                  />
                )}
              </motion.div>

              <div className="scalable-body-label">
                <span style={{ color: theme.badgeText }}>{planet.name}</span>
                <strong>{formatDiameter(planet.diameter)}</strong>
              </div>
            </div>

            {/* Central Scale Metric Readout */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                zIndex: 3,
              }}
            >
              <span className="ratio-badge">{ratioText}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-telemetry)' }}>
                Scale 1 : {(Math.max(targetDiam, refDiam) / 200).toFixed(0)} km/px
              </span>
            </div>

            {/* Benchmark Celestial Reference Scalable Circle */}
            <div className="comparison-column">
              <motion.div
                className="scalable-body-circle"
                style={{
                  width: `${refPx}px`,
                  height: `${refPx}px`,
                  background: activeRef.gradient,
                  boxShadow: `0 0 ${Math.max(16, refPx / 3)}px ${activeRef.color}55`,
                }}
                layout
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              />

              <div className="scalable-body-label">
                <span style={{ color: activeRef.color }}>{activeRef.name} (Reference)</span>
                <strong>{formatNumber(activeRef.diameterKm)} km</strong>
                <span>{activeRef.description}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer Notes & Astrophysics Indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-telemetry)',
        }}
      >
        <span>
          <Sparkles size={12} style={{ display: 'inline', color: 'var(--gold-neon)', marginRight: 4 }} aria-hidden="true" />
          Comparative size modeled with true astrophysical diameter proportionality
        </span>
        <span>Relative Celestial Ratio</span>
      </div>
    </div>
  );
};
