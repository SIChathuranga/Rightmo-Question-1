/**
 * PlanetCard Component
 *
 * Renders an individual planet card on the Planet List Page.
 * Displays all mandatory attributes:
 * - Planet Name
 * - Diameter (formatted with km)
 * - Terrain (biome badges)
 * - Population (formatted number / compact notation)
 * Plus a mini celestial scale circle preview and Framer Motion hover elevation.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Compass, Users, Orbit } from 'lucide-react';
import type { Planet } from '../types/planet';
import { formatCompactNumber, formatDiameter, formatPopulation } from '../utils/formatters';
import { getPlanetTheme } from '../utils/planetTheme';

interface PlanetCardProps {
  /** Cleaned Planet domain object */
  planet: Planet;
  /** Callback fired when the card is clicked or activated via keyboard */
  onSelect: (planet: Planet) => void;
  /** Index in the list used for staggered entry animation delay */
  index: number;
}

export const PlanetCard: React.FC<PlanetCardProps> = ({ planet, onSelect, index }) => {
  // Resolve biome theme (colors, glow, and gradients) based on terrain and climate
  const theme = getPlanetTheme(planet.terrain, planet.climate);

  // Compute proportional preview size for the mini celestial circle (between 26px and 78px)
  const diameterNum = planet.numericDiameter;
  const circleSize = diameterNum
    ? Math.min(78, Math.max(26, Math.round((diameterNum / 12742) * 44)))
    : 38;

  // Gas giants like Bespin feature decorative planetary rings
  const hasRings = planet.terrain.toLowerCase().includes('gas') || planet.name.toLowerCase() === 'bespin';

  return (
    <motion.div
      className="planet-card"
      style={
        {
          '--theme-color': theme.primary,
          '--theme-glow': theme.glow,
        } as React.CSSProperties
      }
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onClick={() => onSelect(planet)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        // Support keyboard activation via Enter or Space
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(planet);
        }
      }}
      aria-label={`View dossier for planet ${planet.name}`}
    >
      {/* Top Header Row: Planet Name and Sector Badge */}
      <div className="card-top-row">
        <div>
          <h2 className="planet-name">{planet.name}</h2>
          <span style={{ fontSize: '0.72rem', color: theme.badgeText, fontWeight: 500 }}>
            {theme.category}
          </span>
        </div>
        <span className="planet-id-chip">SECTOR #{planet.id}</span>
      </div>

      {/* Mini Visualizer Preview: Proportional glowing sphere */}
      <div className="planet-mini-visualizer" aria-hidden="true">
        <div
          className="mini-circle"
          style={{
            width: `${circleSize}px`,
            height: `${circleSize}px`,
            background: theme.bgGradient,
            boxShadow: `0 0 20px ${theme.glow}`,
          }}
        >
          {hasRings && <div className="mini-circle-rings" />}
        </div>
      </div>

      {/* Required Telemetry: Diameter & Population */}
      <div className="card-metrics-grid">
        <div className="metric-item">
          <span className="metric-label">
            <Orbit size={12} style={{ color: 'var(--cyan-neon)' }} aria-hidden="true" />
            Diameter
          </span>
          <span className="metric-value">{formatDiameter(planet.diameter)}</span>
        </div>

        <div className="metric-item">
          <span className="metric-label">
            <Users size={12} style={{ color: 'var(--gold-neon)' }} aria-hidden="true" />
            Population
          </span>
          <span className="metric-value" title={formatPopulation(planet.population)}>
            {formatCompactNumber(planet.numericPopulation)}
          </span>
        </div>
      </div>

      {/* Required Telemetry: Terrain Biome Badges */}
      <div className="terrain-tags-wrapper">
        <span className="metric-label" style={{ width: '100%', marginBottom: 2 }}>
          <Compass size={12} aria-hidden="true" />
          Terrain
        </span>
        {planet.terrainList.length > 0 ? (
          planet.terrainList.slice(0, 3).map((item) => (
            <span key={item} className="tag-pill">
              {item}
            </span>
          ))
        ) : (
          <span className="tag-pill" style={{ opacity: 0.6 }}>
            Unclassified
          </span>
        )}
        {planet.terrainList.length > 3 && (
          <span className="tag-pill" style={{ opacity: 0.7 }}>
            +{planet.terrainList.length - 3} more
          </span>
        )}
      </div>

      {/* Action Footer Callout */}
      <div className="card-action-bar">
        <span>INSPECT DOSSIER & SIZE SCALE</span>
        <ArrowUpRight size={15} aria-hidden="true" />
      </div>
    </motion.div>
  );
};
