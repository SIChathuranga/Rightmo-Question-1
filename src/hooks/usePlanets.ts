import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getPlanets } from '../services/swapiService';
import type { Planet, SortOption } from '../types/planet';

interface UsePlanetsResult {
  planets: Planet[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  refetch: () => void;
}

export function usePlanets(
  page: number,
  search: string,
  sortOption: SortOption
): UsePlanetsResult {
  const [rawPlanets, setRawPlanets] = useState<Planet[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

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
        // Request was cancelled intentionally, do not set error state
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

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // Apply Bonus: Diameter Sorting (ASC, DESC, or Default)
  const planets = useMemo(() => {
    if (sortOption === 'default') {
      return rawPlanets;
    }

    const copy = [...rawPlanets];
    return copy.sort((a, b) => {
      // Unknown or null diameters always sink to the bottom
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
