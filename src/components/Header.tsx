/**
 * Header Component
 *
 * Renders the top Galactic Holonet Archive HUD bar with animated
 * branding, title, and live telemetry uplink status beacon.
 */

import React from 'react';
import { Orbit, Radio, Sparkles } from 'lucide-react';

interface HeaderProps {
  /** Total count of planets currently cataloged in the SWAPI archive */
  totalPlanets: number;
}

export const Header: React.FC<HeaderProps> = ({ totalPlanets }) => {
  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Brand Identity */}
        <div className="brand-section">
          <div className="brand-icon-wrapper" aria-hidden="true">
            <Orbit size={24} />
          </div>
          <div className="brand-title-group">
            <h1>
              GALACTIC <span>PLANET EXPLORER</span>
            </h1>
            <p className="brand-subtitle">Imperial Holonet Cartography & Astrogation</p>
          </div>
        </div>

        {/* Live Network & Telemetry Status Beacon */}
        <div className="telemetry-beacon">
          <span className="beacon-pulse" aria-hidden="true" />
          <Radio size={14} aria-hidden="true" />
          <span>HOLONET UPLINK ACTIVE</span>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span style={{ color: 'var(--cyan-neon)', fontWeight: 600 }}>
            {totalPlanets > 0 ? `${totalPlanets} PLANETS CATALOGED` : 'SYNCHRONIZING...'}
          </span>
          <Sparkles size={13} style={{ color: 'var(--gold-neon)' }} aria-hidden="true" />
        </div>
      </div>
    </header>
  );
};
