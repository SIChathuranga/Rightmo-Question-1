/**
 * SWAPI (Star Wars API) Service Layer
 *
 * Handles HTTP requests, in-memory caching, network timeout resilience,
 * mirror fallback endpoints, and sanitization of raw SWAPI planet data.
 */

import type { Planet, SWAPIPlanet, SWAPIPlanetResponse } from '../types/planet';
import { extractPlanetId, parseNumericGravity } from '../utils/formatters';

// Primary SWAPI endpoint and high-reliability backup mirror
const PRIMARY_API = 'https://swapi.dev/api/planets/';
const FALLBACK_API = 'https://swapi.py4e.com/api/planets/';

// In-memory response cache to ensure zero reload latency on previous/cached queries
const cache = new Map<string, { data: SWAPIPlanetResponse; timestamp: number }>();
const planetCache = new Map<string, Planet>();
const CACHE_TTL_MS = 1000 * 60 * 15; // 15-minute cache expiration window

/**
 * Normalizes raw SWAPI planet data into a clean, typed domain model.
 * Parses strings like "10465" into numeric integers, handles "unknown",
 * tokenizes comma-separated terrain and climate lists, and caches the result.
 *
 * @param raw - Raw SWAPI planet object
 * @returns Clean Planet domain model
 */
export function normalizePlanet(raw: SWAPIPlanet): Planet {
  const id = extractPlanetId(raw.url);

  // Parse numeric diameter: strip commas and filter out "unknown" or "0"
  const cleanDiam = raw.diameter?.replace(/,/g, '').trim();
  const numDiam = cleanDiam && cleanDiam !== 'unknown' && cleanDiam !== '0'
    ? parseInt(cleanDiam, 10)
    : null;

  // Parse numeric population: strip commas and filter out "unknown"
  const cleanPop = raw.population?.replace(/,/g, '').trim();
  const numPop = cleanPop && cleanPop !== 'unknown'
    ? parseInt(cleanPop, 10)
    : null;

  // Tokenize comma-separated climate list (e.g. "arid, temperate" -> ["arid", "temperate"])
  const climateList = raw.climate
    ? raw.climate.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
    : [];

  // Tokenize comma-separated terrain list (e.g. "desert, mountains" -> ["desert", "mountains"])
  const terrainList = raw.terrain
    ? raw.terrain.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
    : [];

  // Parse orbital cycle (days in year) & rotational cycle (hours in day)
  const cleanOrb = raw.orbital_period?.replace(/,/g, '').trim();
  const numOrb = cleanOrb && cleanOrb !== 'unknown' ? parseInt(cleanOrb, 10) : null;

  const cleanRot = raw.rotation_period?.replace(/,/g, '').trim();
  const numRot = cleanRot && cleanRot !== 'unknown' ? parseInt(cleanRot, 10) : null;

  // Parse surface water coverage percentage (0-100)
  const cleanWater = raw.surface_water?.replace(/,/g, '').trim();
  const numWater = cleanWater && cleanWater !== 'unknown' ? parseFloat(cleanWater) : null;

  const planet: Planet = {
    id,
    name: raw.name,
    diameter: raw.diameter,
    numericDiameter: isNaN(numDiam as number) ? null : numDiam,
    climate: raw.climate,
    climateList,
    terrain: raw.terrain,
    terrainList,
    population: raw.population,
    numericPopulation: isNaN(numPop as number) ? null : numPop,
    gravity: raw.gravity,
    numericGravity: parseNumericGravity(raw.gravity),
    orbitalPeriod: raw.orbital_period,
    numericOrbitalPeriod: isNaN(numOrb as number) ? null : numOrb,
    rotationPeriod: raw.rotation_period,
    numericRotationPeriod: isNaN(numRot as number) ? null : numRot,
    surfaceWater: raw.surface_water,
    numericSurfaceWater: isNaN(numWater as number) ? null : numWater,
    filmsCount: Array.isArray(raw.films) ? raw.films.length : 0,
    residentsCount: Array.isArray(raw.residents) ? raw.residents.length : 0,
    url: raw.url,
  };

  // Cache individual planet for instant deep-link and dossier lookups
  planetCache.set(id, planet);
  return planet;
}

/**
 * Resilient fetcher with automatic fallback mirror support.
 * If the primary swapi.dev host times out or errors, tries swapi.py4e.com.
 *
 * @param url - Destination endpoint URL
 * @param signal - Optional AbortSignal for request cancellation
 * @returns HTTP Response
 */
async function fetchWithFallback(url: string, signal?: AbortSignal): Promise<Response> {
  try {
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
    if (res.ok) return res;
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  } catch (err: unknown) {
    if ((err as Error)?.name === 'AbortError') throw err;

    // Failover: Attempt fallback mirror if primary swapi.dev is blocked or throttled
    if (url.includes('swapi.dev')) {
      const fallbackUrl = url.replace('https://swapi.dev/api/planets/', FALLBACK_API);
      return await fetch(fallbackUrl, { signal, headers: { Accept: 'application/json' } });
    }
    throw err;
  }
}

/**
 * Fetches a paginated or searched list of planets.
 * Checks memory cache first before dispatching a network call.
 *
 * @param page - Current page number (default 1)
 * @param search - Optional planet search keyword
 * @param signal - Optional AbortSignal to cancel pending requests
 * @returns Normalized planets array and total catalog count
 */
export async function getPlanets(
  page = 1,
  search = '',
  signal?: AbortSignal
): Promise<{ planets: Planet[]; totalCount: number; next: string | null; previous: string | null }> {
  // Construct URL parameters
  const queryParams = new URLSearchParams();
  if (page > 1) queryParams.set('page', page.toString());
  if (search.trim()) queryParams.set('search', search.trim());

  // Check cache before fetching
  const cacheKey = queryParams.toString() || 'default-page-1';
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    const planets = cached.data.results.map(normalizePlanet);
    return {
      planets,
      totalCount: cached.data.count,
      next: cached.data.next,
      previous: cached.data.previous,
    };
  }

  // Network fetch with fallback
  const endpoint = `${PRIMARY_API}?${queryParams.toString()}`;
  const response = await fetchWithFallback(endpoint, signal);

  if (!response.ok) {
    throw new Error(`Failed to transmit planetary telemetry. Imperial network returned code ${response.status}.`);
  }

  const data: SWAPIPlanetResponse = await response.json();
  cache.set(cacheKey, { data, timestamp: Date.now() });

  const planets = data.results.map(normalizePlanet);
  return {
    planets,
    totalCount: data.count,
    next: data.next,
    previous: data.previous,
  };
}

/**
 * Fetches an individual planet's full dossier by ID (e.g. "1" for Tatooine).
 *
 * @param id - Numeric planet ID string
 * @param signal - Optional AbortSignal
 * @returns Cleaned Planet object
 */
export async function getPlanetById(id: string, signal?: AbortSignal): Promise<Planet> {
  // Return cached planet if already fetched in memory
  const cached = planetCache.get(id);
  if (cached) return cached;

  const endpoint = `${PRIMARY_API}${id}/`;
  const response = await fetchWithFallback(endpoint, signal);

  if (!response.ok) {
    throw new Error(`Planetary archive entry #${id} could not be located in Imperial records.`);
  }

  const raw: SWAPIPlanet = await response.json();
  return normalizePlanet(raw);
}
