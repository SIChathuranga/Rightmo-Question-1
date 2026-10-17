export interface BiomeTheme {
  primary: string;
  glow: string;
  bgGradient: string;
  surfaceTexture: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  category: string;
}

export const BIOME_THEMES: Record<string, BiomeTheme> = {
  desert: {
    primary: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.45)',
    bgGradient: 'radial-gradient(circle at 35% 35%, #fbbf24, #d97706 60%, #78350f)',
    surfaceTexture: 'radial-gradient(circle at 70% 60%, rgba(251, 191, 36, 0.4) 0%, transparent 60%)',
    badgeBg: 'rgba(245, 158, 11, 0.12)',
    badgeBorder: 'rgba(245, 158, 11, 0.35)',
    badgeText: '#fbbf24',
    category: 'Arid / Desert',
  },
  ice: {
    primary: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.45)',
    bgGradient: 'radial-gradient(circle at 35% 35%, #7dd3fc, #0284c7 60%, #0c4a6e)',
    surfaceTexture: 'radial-gradient(circle at 60% 40%, rgba(224, 242, 254, 0.5) 0%, transparent 50%)',
    badgeBg: 'rgba(56, 189, 248, 0.12)',
    badgeBorder: 'rgba(56, 189, 248, 0.35)',
    badgeText: '#7dd3fc',
    category: 'Glacial / Frozen',
  },
  gas: {
    primary: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.45)',
    bgGradient: 'radial-gradient(circle at 35% 35%, #e879f9, #9333ea 60%, #4c1d95)',
    surfaceTexture: 'linear-gradient(45deg, rgba(232, 121, 249, 0.3) 25%, transparent 25%, transparent 50%, rgba(232, 121, 249, 0.3) 50%, rgba(232, 121, 249, 0.3) 75%, transparent 75%)',
    badgeBg: 'rgba(192, 132, 252, 0.12)',
    badgeBorder: 'rgba(192, 132, 252, 0.35)',
    badgeText: '#d8b4fe',
    category: 'Gas Giant / Atmospheric',
  },
  forest: {
    primary: '#10b981',
    glow: 'rgba(16, 185, 129, 0.45)',
    bgGradient: 'radial-gradient(circle at 35% 35%, #34d399, #059669 60%, #064e3b)',
    surfaceTexture: 'radial-gradient(circle at 40% 70%, rgba(52, 211, 153, 0.3) 0%, transparent 55%)',
    badgeBg: 'rgba(16, 185, 129, 0.12)',
    badgeBorder: 'rgba(16, 185, 129, 0.35)',
    badgeText: '#6ee7b7',
    category: 'Forest / Terrestrial',
  },
  swamp: {
    primary: '#84cc16',
    glow: 'rgba(132, 204, 22, 0.45)',
    bgGradient: 'radial-gradient(circle at 35% 35%, #a3e635, #65a30d 60%, #365314)',
    surfaceTexture: 'radial-gradient(circle at 75% 30%, rgba(163, 230, 53, 0.3) 0%, transparent 50%)',
    badgeBg: 'rgba(132, 204, 22, 0.12)',
    badgeBorder: 'rgba(132, 204, 22, 0.35)',
    badgeText: '#bef264',
    category: 'Swamp / Wetland',
  },
  volcanic: {
    primary: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.5)',
    bgGradient: 'radial-gradient(circle at 35% 35%, #f87171, #dc2626 60%, #7f1d1d)',
    surfaceTexture: 'radial-gradient(circle at 50% 50%, rgba(248, 113, 113, 0.4) 0%, transparent 60%)',
    badgeBg: 'rgba(239, 68, 68, 0.12)',
    badgeBorder: 'rgba(239, 68, 68, 0.35)',
    badgeText: '#fca5a5',
    category: 'Volcanic / Molten',
  },
  ocean: {
    primary: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.45)',
    bgGradient: 'radial-gradient(circle at 35% 35%, #22d3ee, #0891b2 60%, #164e63)',
    surfaceTexture: 'radial-gradient(circle at 60% 60%, rgba(34, 211, 238, 0.3) 0%, transparent 60%)',
    badgeBg: 'rgba(6, 182, 212, 0.12)',
    badgeBorder: 'rgba(6, 182, 212, 0.35)',
    badgeText: '#67e8f9',
    category: 'Ocean / Aquatic',
  },
  city: {
    primary: '#818cf8',
    glow: 'rgba(129, 140, 248, 0.45)',
    bgGradient: 'radial-gradient(circle at 35% 35%, #a5b4fc, #4f46e5 60%, #312e81)',
    surfaceTexture: 'radial-gradient(circle at 30% 70%, rgba(165, 180, 252, 0.4) 0%, transparent 50%)',
    badgeBg: 'rgba(129, 140, 248, 0.12)',
    badgeBorder: 'rgba(129, 140, 248, 0.35)',
    badgeText: '#c7d2fe',
    category: 'Cityscape / Ecumenopolis',
  },
  default: {
    primary: '#00e5ff',
    glow: 'rgba(0, 229, 255, 0.45)',
    bgGradient: 'radial-gradient(circle at 35% 35%, #38bdf8, #0369a1 60%, #082f49)',
    surfaceTexture: 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.3) 0%, transparent 60%)',
    badgeBg: 'rgba(0, 229, 255, 0.12)',
    badgeBorder: 'rgba(0, 229, 255, 0.35)',
    badgeText: '#67e8f9',
    category: 'Terrestrial / Standard',
  },
};

/**
 * Resolves planet biome theme based on terrain and climate strings
 */
export function getPlanetTheme(terrain = '', climate = ''): BiomeTheme {
  const text = `${terrain} ${climate}`.toLowerCase();

  if (text.includes('lava') || text.includes('volcan') || text.includes('magma')) {
    return BIOME_THEMES.volcanic;
  }
  if (text.includes('gas') || text.includes('cloud')) {
    return BIOME_THEMES.gas;
  }
  if (text.includes('ice') || text.includes('frozen') || text.includes('tundra') || text.includes('glacier')) {
    return BIOME_THEMES.ice;
  }
  if (text.includes('desert') || text.includes('arid') || text.includes('rocky') || text.includes('dunes') || text.includes('barren')) {
    return BIOME_THEMES.desert;
  }
  if (text.includes('city') || text.includes('urban') || text.includes('coruscant')) {
    return BIOME_THEMES.city;
  }
  if (text.includes('swamp') || text.includes('marsh') || text.includes('bog') || text.includes('murky')) {
    return BIOME_THEMES.swamp;
  }
  if (text.includes('ocean') || text.includes('water') || text.includes('aquatic') || text.includes('reefs')) {
    return BIOME_THEMES.ocean;
  }
  if (text.includes('forest') || text.includes('jungle') || text.includes('rainforest') || text.includes('wood') || text.includes('plains') || text.includes('grass')) {
    return BIOME_THEMES.forest;
  }

  return BIOME_THEMES.default;
}

/**
 * Common reference celestial bodies for the scalable size comparison engine
 */
export const CELESTIAL_REFERENCES = [
  {
    name: 'Earth',
    diameterKm: 12742,
    description: 'Human Homeworld Reference',
    color: '#38bdf8',
    gradient: 'radial-gradient(circle at 35% 35%, #60a5fa, #2563eb 60%, #1e3a8a)',
    type: 'terrestrial' as const,
  },
  {
    name: 'Jupiter',
    diameterKm: 139820,
    description: 'Gas Giant Benchmark',
    color: '#fb923c',
    gradient: 'radial-gradient(circle at 35% 35%, #fdba74, #ea580c 60%, #7c2d12)',
    type: 'gas_giant' as const,
  },
  {
    name: 'The Moon',
    diameterKm: 3474,
    description: 'Lunar Satellite Scale',
    color: '#94a3b8',
    gradient: 'radial-gradient(circle at 35% 35%, #cbd5e1, #64748b 60%, #334155)',
    type: 'satellite' as const,
  },
  {
    name: 'Death Star I',
    diameterKm: 120,
    description: 'Imperial Orbital Station',
    color: '#ef4444',
    gradient: 'radial-gradient(circle at 35% 35%, #94a3b8, #475569 60%, #1e293b)',
    type: 'battlestation' as const,
  },
];
