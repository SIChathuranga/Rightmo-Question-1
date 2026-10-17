/**
 * usePlanets Custom Hook
 *
 * Coordinates planetary data fetching, pagination, debounced search,
 * request cancellation with AbortController, and client-side diameter sorting.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getPlanets } from '../services/swapiService';
import type { Planet, SortOption } from '../types/planet';

/**
 * Return type definition for the usePlanets hook
 */
interface UsePlanetsResult {
  /** Filtered and sorted array of planets for the active page */
  planets: Planet[];
  /** True while network request is inflight */
  isLoading: boolean;
  /** True if network request encountered an unrecoverable error */
  isError: boolean;
  /** Descriptive error message to display in ErrorState */
  errorMessage: string | null;
  /** Total count of planets matching the current search query */
  totalCount: number;
  /** Calculated total pages (10 planets per page standard in SWAPI) */
  totalPages: number;
  /** Indicates if a subsequent page exists */
  hasNext: boolean;
  /** Indicates if an earlier page exists */
  hasPrevious: boolean;
  /** Callback to re-trigger data fetch (used by Retry button) */
  refetch: () => void;
}

/**
 * Manages planets list state, API coordination, sorting and pagination
 *
 * @param page - Current 1-based page number
 * @param search - Debounced search term
 * @param sortOption - Active diameter sort selection ('default', 'diameter-asc', 'diameter-desc')
 * @returns State and helpers to render the planet archive
 */
export function usePlanets(
  page: number,
  search: string,
  sortOption: SortOption
): UsePlanetsResult {
  // Raw unsorted planet records from the API
  const [rawPlanets, setRawPlanets] = useState<Planet[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Ref to hold the active AbortController to cancel previous calls when page or search changes rapidly
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch logic with cancellation and error resilience
  const fetchData = useCallback(async () => {
    // Abort any ongoing request before dispatching a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);

    try {
      const data = await getPlanets(page, search, controller.signal);
      setRawPlanets(data.planets);
      setTotalCount(data.totalCount);
      setHasNext(Boolean(data.next));
      setHasPrevious(Boolean(data.previous));
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') {
        // Request was cancelled intentionally due to rapid navigation/typing; do not treat as error
        return;
      }
      setIsError(true);
      setErrorMessage(
        (err as Error)?.message ||
          'Unable to establish communication with the Planetary Holonet Archive. Please check your connection and retry.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  // Trigger fetch whenever page or search changes
  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // Bonus Feature: Diameter Sorting (Ascending, Descending, or Default SWAPI order)
  const planets = useMemo(() => {
    if (sortOption === 'default') {
      return rawPlanets;
    }

    const copy = [...rawPlanets];
    return copy.sort((a, b) => {
      // Edge Case: Unknown or non-numeric diameters always sink to the bottom of the list
      if (a.numericDiameter === null && b.numericDiameter === null) return 0;
      if (a.numericDiameter === null) return 1;
      if (b.numericDiameter === null) return -1;

      if (sortOption === 'diameter-asc') {
        return a.numericDiameter - b.numericDiameter;
      } else {
        return b.numericDiameter - a.numericDiameter;
      }
    });
  }, [rawPlanets, sortOption]);

  // SWAPI always returns 10 items per page; minimum 1 page
  const totalPages = Math.max(1, Math.ceil(totalCount / 10));

  return {
    planets,
    isLoading,
    isError,
    errorMessage,
    totalCount,
    totalPages,
    hasNext,
    hasPrevious,
    refetch: fetchData,
  };
}
