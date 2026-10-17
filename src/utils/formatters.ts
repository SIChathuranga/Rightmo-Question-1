/**
 * Formatting and Parsing Utilities
 * 
 * Provides safe text formatting, metric conversions, and sanitization
 * for Star Wars API (SWAPI) astronomical and census data.
 */

/**
 * Formats a numeric value with standard US-locale comma separators (e.g. 10465 -> "10,465")
 *
 * @param val - Numeric value to format, or null/undefined
 * @returns Formatted comma-separated string, or "Unknown"
 */
export function formatNumber(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return 'Unknown';
  return new Intl.NumberFormat('en-US').format(val);
}

/**
 * Formats large population counts into compact human-readable abbreviations (e.g. 2500000 -> "2.5M")
 *
 * @param val - Population count
 * @returns Compact notation string, or "0 (Uninhabited)" or "Unknown"
 */
export function formatCompactNumber(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return 'Unknown';
  if (val === 0) return '0 (Uninhabited)';
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(val);
}

/**
 * Formats a raw diameter string or number with kilometer units (e.g. "10465" -> "10,465 km")
 * Correctly handles SWAPI edge cases like "unknown", "0", or empty values.
 *
 * @param diameter - Raw diameter value from SWAPI
 * @returns Clean formatted string with "km", or "Unknown"
 */
export function formatDiameter(diameter: string | number | null | undefined): string {
  if (!diameter || diameter === 'unknown' || diameter === '0') return 'Unknown';
  const num = typeof diameter === 'number' ? diameter : parseInt(diameter, 10);
  if (isNaN(num) || num <= 0) return 'Unknown';
  return `${new Intl.NumberFormat('en-US').format(num)} km`;
}

/**
 * Formats population string with locale commas and handles "0" and "unknown" gracefully.
 *
 * @param population - Raw population string from SWAPI
 * @returns Formatted census string or status indicator
 */
export function formatPopulation(population: string | number | null | undefined): string {
  if (!population || population === 'unknown') return 'Unknown';
  if (population === '0') return 'Uninhabited (0)';
  const num = typeof population === 'number' ? population : parseInt(population, 10);
  if (isNaN(num)) return String(population);
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Normalizes raw gravity telemetry string (e.g. "1 standard", "N/A", "unknown")
 *
 * @param gravity - Raw gravity string from SWAPI
 * @returns Cleaned gravity description
 */
export function formatGravity(gravity: string | null | undefined): string {
  if (!gravity || gravity === 'unknown' || gravity === 'N/A') return 'Standard (Unspecified)';
  return gravity.trim();
}

/**
 * Extracts a numeric gravity multiplier from freeform strings (e.g. "1.2 standard" -> 1.2)
 *
 * @param gravity - Raw gravity string
 * @returns Numeric multiplier or null if unparseable
 */
export function parseNumericGravity(gravity: string | null | undefined): number | null {
  if (!gravity) return null;
  const match = gravity.match(/([0-9.]+)/);
  if (!match) return null;
  const num = parseFloat(match[1]);
  return isNaN(num) ? null : num;
}

/**
 * Extracts the numerical planet ID from a SWAPI URL
 * Example: "https://swapi.dev/api/planets/1/" -> "1"
 *
 * @param url - SWAPI resource URL
 * @returns ID string (e.g. "1"), or the original URL if unparsed
 */
export function extractPlanetId(url: string): string {
  const matches = url.match(/\/planets\/(\d+)\/?/);
  return matches ? matches[1] : url;
}
