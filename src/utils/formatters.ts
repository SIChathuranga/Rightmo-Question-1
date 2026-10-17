/**
 * Formats a numeric value with standard comma separators
 */
export function formatNumber(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return 'Unknown';
  return new Intl.NumberFormat('en-US').format(val);
}

/**
 * Formats large population counts compactly (e.g., 2.5M, 1.2B)
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
 * Formats diameter string with km units
 */
export function formatDiameter(diameter: string | number | null | undefined): string {
  if (!diameter || diameter === 'unknown' || diameter === '0') return 'Unknown';
  const num = typeof diameter === 'number' ? diameter : parseInt(diameter, 10);
  if (isNaN(num) || num <= 0) return 'Unknown';
  return `${new Intl.NumberFormat('en-US').format(num)} km`;
}

/**
 * Formats population string with locale commas and compact context
 */
export function formatPopulation(population: string | number | null | undefined): string {
  if (!population || population === 'unknown') return 'Unknown';
  if (population === '0') return 'Uninhabited (0)';
  const num = typeof population === 'number' ? population : parseInt(population, 10);
  if (isNaN(num)) return String(population);
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Normalizes gravity string
 */
export function formatGravity(gravity: string | null | undefined): string {
  if (!gravity || gravity === 'unknown' || gravity === 'N/A') return 'Standard (Unspecified)';
  return gravity.trim();
}

/**
 * Parses numeric gravity multiplier (e.g., "1 standard" -> 1.0, "0.98 standard" -> 0.98)
 */
export function parseNumericGravity(gravity: string | null | undefined): number | null {
  if (!gravity) return null;
  const match = gravity.match(/([0-9.]+)/);
  if (!match) return null;
  const num = parseFloat(match[1]);
  return isNaN(num) ? null : num;
}

/**
 * Extracts the planet ID from a SWAPI URL (e.g., "https://swapi.dev/api/planets/1/" -> "1")
 */
export function extractPlanetId(url: string): string {
  const matches = url.match(/\/planets\/(\d+)\/?/);
  return matches ? matches[1] : url;
}
