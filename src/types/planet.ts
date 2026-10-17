export interface SWAPIPlanet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}

export interface SWAPIPlanetResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SWAPIPlanet[];
}

export interface Planet {
  id: string;
  name: string;
  diameter: string;
  numericDiameter: number | null;
  climate: string;
  climateList: string[];
  terrain: string;
  terrainList: string[];
  population: string;
  numericPopulation: number | null;
  gravity: string;
  numericGravity: number | null;
  orbitalPeriod: string;
  numericOrbitalPeriod: number | null;
  rotationPeriod: string;
  numericRotationPeriod: number | null;
  surfaceWater: string;
  numericSurfaceWater: number | null;
  filmsCount: number;
  residentsCount: number;
  url: string;
}

export type SortOption = 'default' | 'diameter-asc' | 'diameter-desc';

export interface CelestialReference {
  name: string;
  diameterKm: number;
  description: string;
  color: string;
  gradient: string;
  type: 'terrestrial' | 'gas_giant' | 'satellite' | 'battlestation';
}
