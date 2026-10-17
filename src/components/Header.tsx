import React from 'react';
import { Orbit, Radio, Sparkles } from 'lucide-react';

interface HeaderProps {
  totalPlanets: number;
}

export const Header: React.FC<HeaderProps> = ({ totalPlanets }) => {
  return (
    <header className="site-header">
      <div className="header-inner">
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

        <div className="telemetry-beacon">
          <span className="beacon-pulse" />
          <Radio size={14} />
          <span>HOLONET UPLINK ACTIVE</span>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span style={{ color: 'var(--cyan-neon)', fontWeight: 600 }}>
            {totalPlanets > 0 ? `${totalPlanets} PLANETS CATALOGED` : 'SYNCHRONIZING...'}
          </span>
          <Sparkles size={13} style={{ color: 'var(--gold-neon)' }} />
        </div>
      </div>
    </header>
  );
};
