import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Compass,
  Users,
  Orbit,
  CloudSun,
  Weight,
  Clock,
  Calendar,
  Droplets,
  Film,
  UserCheck,
  X,
} from 'lucide-react';
import type { Planet } from '../types/planet';
import {
  formatDiameter,
  formatGravity,
  formatNumber,
  formatPopulation,
} from '../utils/formatters';
import { getPlanetTheme } from '../utils/planetTheme';
import { PlanetVisualizer } from './PlanetVisualizer';

interface PlanetDetailModalProps {
  planet: Planet | null;
  onClose: () => void;
}

export const PlanetDetailModal: React.FC<PlanetDetailModalProps> = ({ planet, onClose }) => {
  // Listen for Escape key to close details
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (planet) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [planet, onClose]);

  const theme = planet ? getPlanetTheme(planet.terrain, planet.climate) : null;

  return (
    <AnimatePresence>
      {planet && theme && (
        <motion.div
          key="modal-overlay"
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            // Close if clicking on the backdrop itself
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            key={`dossier-${planet.id}`}
            className="dossier-modal"
            style={
              {
                '--theme-color': theme.primary,
                '--theme-glow': theme.glow,
              } as React.CSSProperties
            }
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Bar with Back Button */}
            <div className="dossier-header">
              <button
                type="button"
                className="back-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                aria-label="Back to Planet Archive List"
              >
                <ArrowLeft size={16} />
                <span>Back to Planet Archive</span>
              </button>

              <span className="mono-telemetry" style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                SECTOR ARCHIVE RECORD #{planet.id} • PRESS ESC TO RETURN
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--space-border)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.45rem',
                  transition: 'all 0.2s ease',
                }}
                aria-label="Close dossier"
                title="Close (Esc)"
              >
                <X size={18} />
              </button>
            </div>

            {/* Dossier Body Content */}
            <div className="dossier-body">
              {/* Hero Header */}
              <div className="dossier-hero">
                <div className="dossier-title-group">
                  <span style={{ color: theme.badgeText, fontFamily: 'var(--font-telemetry)', fontSize: '0.8rem' }}>
                    {theme.category.toUpperCase()}
                  </span>
                  <h2>{planet.name}</h2>
                  <div className="dossier-badge-row">
                    {planet.climateList.map((c) => (
                      <span key={c} className="tag-pill climate">
                        <CloudSun size={12} />
                        {c}
                      </span>
                    ))}
                    {planet.terrainList.map((t) => (
                      <span key={t} className="tag-pill">
                        <Compass size={12} />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--space-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                  }}
                >
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      background: theme.bgGradient,
                      boxShadow: `0 0 20px ${theme.glow}`,
                    }}
                  />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-telemetry)' }}>
                      ARCHIVE CLASSIFICATION
                    </span>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                      {planet.name} Primary
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--cyan-neon)', fontFamily: 'var(--font-telemetry)' }}>
                      {planet.filmsCount} Film Appearances
                    </span>
                  </div>
                </div>
              </div>

              {/* Core Required Telemetry Grid: Name, Diameter, Terrain, Climate, Population, Gravity */}
              <div className="specs-grid">
                {/* Diameter (Required) */}
                <div className="spec-tile">
                  <div className="spec-tile-header">
                    <span>Equatorial Diameter</span>
                    <Orbit size={16} style={{ color: 'var(--cyan-neon)' }} />
                  </div>
                  <div className="spec-tile-value">{formatDiameter(planet.diameter)}</div>
                  <div className="spec-tile-detail">Physical celestial span across equator</div>
                </div>

                {/* Gravity (Required) */}
                <div className="spec-tile">
                  <div className="spec-tile-header">
                    <span>Surface Gravity</span>
                    <Weight size={16} style={{ color: 'var(--purple-neon)' }} />
                  </div>
                  <div className="spec-tile-value">{formatGravity(planet.gravity)}</div>
                  <div className="spec-tile-detail">
                    {planet.numericGravity ? `${planet.numericGravity}x Standard Galactic G` : 'Uncalibrated'}
                  </div>
                </div>

                {/* Population (Required) */}
                <div className="spec-tile">
                  <div className="spec-tile-header">
                    <span>Total Population</span>
                    <Users size={16} style={{ color: 'var(--gold-neon)' }} />
                  </div>
                  <div className="spec-tile-value">{formatPopulation(planet.population)}</div>
                  <div className="spec-tile-detail">Recorded sentient inhabitants</div>
                </div>

                {/* Climate (Required) */}
                <div className="spec-tile">
                  <div className="spec-tile-header">
                    <span>Primary Climate</span>
                    <CloudSun size={16} style={{ color: '#f59e0b' }} />
                  </div>
                  <div className="spec-tile-value" style={{ textTransform: 'capitalize' }}>
                    {planet.climate || 'Unknown'}
                  </div>
                  <div className="spec-tile-detail">Atmospheric weather classification</div>
                </div>

                {/* Terrain (Required) */}
                <div className="spec-tile">
                  <div className="spec-tile-header">
                    <span>Dominant Terrain</span>
                    <Compass size={16} style={{ color: 'var(--emerald-neon)' }} />
                  </div>
                  <div className="spec-tile-value" style={{ textTransform: 'capitalize', fontSize: '1.1rem' }}>
                    {planet.terrain || 'Unknown'}
                  </div>
                  <div className="spec-tile-detail">Topographical surface biomes</div>
                </div>

                {/* Surface Water */}
                <div className="spec-tile">
                  <div className="spec-tile-header">
                    <span>Surface Water</span>
                    <Droplets size={16} style={{ color: '#38bdf8' }} />
                  </div>
                  <div className="spec-tile-value">
                    {planet.numericSurfaceWater !== null ? `${planet.numericSurfaceWater}%` : 'Unknown'}
                  </div>
                  <div className="spec-tile-detail">Hydrosphere coverage percentage</div>
                </div>

                {/* Rotation Period (Day Length) */}
                <div className="spec-tile">
                  <div className="spec-tile-header">
                    <span>Rotational Cycle (Day)</span>
                    <Clock size={16} style={{ color: 'var(--text-accent)' }} />
                  </div>
                  <div className="spec-tile-value">
                    {planet.numericRotationPeriod ? `${formatNumber(planet.numericRotationPeriod)} hrs` : 'Unknown'}
                  </div>
                  <div className="spec-tile-detail">Time to complete 1 axial rotation</div>
                </div>

                {/* Orbital Period (Year Length) */}
                <div className="spec-tile">
                  <div className="spec-tile-header">
                    <span>Orbital Cycle (Year)</span>
                    <Calendar size={16} style={{ color: 'var(--text-accent)' }} />
                  </div>
                  <div className="spec-tile-value">
                    {planet.numericOrbitalPeriod ? `${formatNumber(planet.numericOrbitalPeriod)} days` : 'Unknown'}
                  </div>
                  <div className="spec-tile-detail">Time to complete 1 stellar orbit</div>
                </div>
              </div>

              {/* Bonus: Interactive Scalable Planet Size Visualizer */}
              <PlanetVisualizer planet={planet} />

              {/* Extra Astrogation Context */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  background: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--space-border)',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-telemetry)',
                  color: 'var(--text-secondary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Film size={15} style={{ color: 'var(--cyan-neon)' }} />
                  <span>Documented in {planet.filmsCount} Star Wars Motion Pictures</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <UserCheck size={15} style={{ color: 'var(--gold-neon)' }} />
                  <span>{planet.residentsCount} Notable Galactic Denizens / Characters Cataloged</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
