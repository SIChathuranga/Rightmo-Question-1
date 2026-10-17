/**
 * Raw data model returned directly from the Star Wars API (SWAPI)
 * All numeric attributes in SWAPI are returned as strings (e.g. "10465", "unknown").
 */
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

/**
 * Paginated API envelope returned by the SWAPI /api/planets/ endpoint
 */
export interface SWAPIPlanetResponse {
  /** Total number of planets matching the query */
  count: number;
  /** Next page endpoint URL (null if on last page) */
  next: string | null;
  /** Previous page endpoint URL (null if on first page) */
  previous: string | null;
  /** Array of raw planet records for the current page */
  results: SWAPIPlanet[];
}

/**
 * Cleaned, strongly-typed domain model for consumption across the UI
 * Includes parsed numeric values for mathematical operations & sorting.
 */
export interface Planet {
  /** Extracted unique identifier from the SWAPI URL (e.g. "1") */
  id: string;
  /** Common planetary name (e.g. "Tatooine") */
  name: string;
  /** Original raw diameter string */
  diameter: string;
  /** Parsed diameter in kilometers (null if "unknown" or 0) */
  numericDiameter: number | null;
  /** Raw climate string */
  climate: string;
  /** Normalized list of climate tokens (e.g. ["arid", "temperate"]) */
  climateList: string[];
  /** Raw terrain description */
  terrain: string;
  /** Normalized list of terrain biomes (e.g. ["desert", "mountains"]) */
  terrainList: string[];
  /** Raw population string */
  population: string;
  /** Parsed population count (null if "unknown") */
  numericPopulation: number | null;
  /** Raw gravity description (e.g. "1 standard") */
  gravity: string;
  /** Extracted numeric multiplier for surface gravity */
  numericGravity: number | null;
  /** Planetary year length in standard days */
  orbitalPeriod: string;
  /** Parsed numeric orbital period in days */
  numericOrbitalPeriod: number | null;
  /** Planetary day length in standard hours */
  rotationPeriod: string;
  /** Parsed numeric rotation period in hours */
  numericRotationPeriod: number | null;
  /** Raw surface water coverage percentage string */
  surfaceWater: string;
  /** Parsed numeric surface water percentage */
  numericSurfaceWater: number | null;
  /** Total count of Star Wars motion pictures this planet appeared in */
  filmsCount: number;
  /** Total count of notable SWAPI characters associated with this planet */
  residentsCount: number;
  /** Canonical SWAPI resource URL */
  url: string;
}

/**
 * Sorting options supported by the application
 */
export type SortOption = 'default' | 'diameter-asc' | 'diameter-desc';

/**
 * Standard astronomical body used in the scalable size visualizer for scale comparison
 */
export interface CelestialReference {
  name: string;
  diameterKm: number;
  description: string;
  color: string;
  gradient: string;
  type: 'terrestrial' | 'gas_giant' | 'satellite' | 'battlestation';
}
