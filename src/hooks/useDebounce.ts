/**
 * Input Debounce Hook
 *
 * Delays updating the returned value until a specified idle period has elapsed.
 * Used for live planet searches to avoid firing network requests on every keystroke.
 */

import { useEffect, useState } from 'react';

/**
 * Custom hook to debounce rapidly changing values (like search inputs)
 *
 * @param value - The input value to debounce
 * @param delayMs - Delay duration in milliseconds (default: 350ms)
 * @returns The debounced value, updated after `delayMs` of typing inactivity
 */
export function useDebounce<T>(value: T, delayMs: number = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update debouncedValue after delayMs
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    // Cancel previous timer if value changes before delayMs completes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
