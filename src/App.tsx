/**
 * App Root Component — Star Wars Planet Explorer
 *
 * Orchestrates:
 * 1. State Management:
 *    - Search query state with debouncing (350ms)
 *    - Pagination (current page & total pages) without full page reloads
 *    - Diameter sorting (default, ascending, descending)
 *    - Selected planet dossier modal state
 * 2. URL Synchronization:
 *    - Automatically syncs ?page=, ?search=, ?sort=, and ?planet= to the URL
 *      via HTML5 history.replaceState so filters/views can be bookmarked and shared.
 * 3. Deep Linking:
 *    - On cold start, if ?planet=<id> is present, immediately fetches and displays that planet.
 * 4. UI View States:
 *    - Loading skeletons, Error state with retry, Empty state with suggestions,
 *      and animated grid of planet cards.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { SortBar } from './components/SortBar';
import { PlanetCard } from './components/PlanetCard';
import { Pagination } from './components/Pagination';
import { PlanetDetailModal } from './components/PlanetDetailModal';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { useDebounce } from './hooks/useDebounce';
import { usePlanets } from './hooks/usePlanets';
import type { Planet, SortOption } from './types/planet';
import { getPlanetById } from './services/swapiService';

export const App: React.FC = () => {
  // Read initial query parameters from window.location only once upon initial component mount
  const [initialParams] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = parseInt(params.get('page') || '1', 10);
    const searchParam = params.get('search') || '';
    const sortParam = (params.get('sort') as SortOption) || 'default';
    const planetIdParam = params.get('planet') || null;

    return {
      page: isNaN(pageParam) || pageParam < 1 ? 1 : pageParam,
      search: searchParam,
      sort: ['default', 'diameter-asc', 'diameter-desc'].includes(sortParam) ? sortParam : 'default',
      planetId: planetIdParam,
    };
  });

  // State: Search filter, Pagination page, Sorting mode, Selected Planet Dossier
  const [searchTerm, setSearchTerm] = useState<string>(initialParams.search);
  const [currentPage, setCurrentPage] = useState<number>(initialParams.page);
  const [sortOption, setSortOption] = useState<SortOption>(initialParams.sort);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);

  // Debounced search value (waits 350ms of typing inactivity before triggering an API request)
  const debouncedSearch = useDebounce(searchTerm, 350);

  // Ref flag to ensure the initial URL deep-link (?planet=id) only executes once on cold start
  const deepLinkCheckedRef = useRef(false);

  // Whenever the search query is modified, reset pagination back to Page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Main SWAPI planetary data hook: handles network calls, caching, cancellation, and sorting
  const {
    planets,
    isLoading,
    isError,
    errorMessage,
    totalCount,
    totalPages,
    refetch,
  } = usePlanets(currentPage, debouncedSearch, sortOption);

  // Synchronize component state with URL query parameters (enables bookmarking without full reload)
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());
    if (sortOption !== 'default') params.set('sort', sortOption);
    if (selectedPlanet) params.set('planet', selectedPlanet.id);

    const queryString = params.toString();
    const newPath = queryString ? `?${queryString}` : window.location.pathname;
    window.history.replaceState(null, '', newPath);
  }, [currentPage, debouncedSearch, sortOption, selectedPlanet]);

  // Deep-link initial load: If URL contains ?planet=id on cold start, fetch and display its dossier
  useEffect(() => {
    if (!deepLinkCheckedRef.current && initialParams.planetId) {
      deepLinkCheckedRef.current = true;
      getPlanetById(initialParams.planetId)
        .then((planet) => setSelectedPlanet(planet))
        .catch(() => {
          // If planet fails to load (e.g. invalid ID), gracefully fallback to list view
        });
    }
  }, [initialParams.planetId]);

  // Handles clicking a planet card to inspect its full dossier
  const handlePlanetSelect = useCallback((planet: Planet) => {
    setSelectedPlanet(planet);
  }, []);

  // Handles closing the dossier modal and cleanly stripping the ?planet param from the URL
  const handleModalClose = useCallback(() => {
    setSelectedPlanet(null);

    // Remove ?planet from URL immediately
    const params = new URLSearchParams(window.location.search);
    params.delete('planet');
    const newQuery = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState(null, '', newQuery);
  }, []);

  // Resets the search query and returns to page 1
  const handleResetSearch = useCallback(() => {
    setSearchTerm('');
    setCurrentPage(1);
  }, []);

  // Populates search query from an empty state suggestion pill
  const handleSuggestionClick = useCallback((name: string) => {
    setSearchTerm(name);
    setCurrentPage(1);
  }, []);

  return (
    <div className="app-container">
      {/* Galactic Header & Telemetry Beacon */}
      <Header totalPlanets={totalCount} />

      <main>
        {/* Search, Filter, and Sorting HUD Controls */}
        <div className="controls-hud">
          <div className="controls-row">
            {/* Live Search Console */}
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
              isLoading={isLoading && searchTerm !== debouncedSearch}
            />

            {/* Bonus: Diameter Sorting Bar */}
            <SortBar
              currentSort={sortOption}
              onSortChange={setSortOption}
            />
          </div>

          {/* Quick Telemetry Status Readout Bar */}
          <div className="stats-bar">
            <span>
              {isLoading ? (
                'TRANSMITTING SECTOR ARCHIVES...'
              ) : isError ? (
                'TELEMETRY OFFLINE'
              ) : (
                <>
                  SHOWING{' '}
                  <strong style={{ color: 'var(--cyan-neon)' }}>{planets.length}</strong> OF{' '}
                  <strong style={{ color: 'var(--text-main)' }}>{totalCount}</strong> PLANETARY BODIES
                  {debouncedSearch && ` MATCHING "${debouncedSearch.toUpperCase()}"`}
                </>
              )}
            </span>

            <span>
              PAGE {currentPage} OF {totalPages}
            </span>
          </div>
        </div>

        {/* View States: Error, Loading Skeletons, Empty Search State, or Planet Grid */}
        {isError ? (
          <ErrorState message={errorMessage} onRetry={refetch} />
        ) : isLoading ? (
          <LoadingSkeleton />
        ) : planets.length === 0 ? (
          <EmptyState
            searchQuery={debouncedSearch}
            onReset={handleResetSearch}
            onSuggestionClick={handleSuggestionClick}
          />
        ) : (
          <>
            {/* Animated Grid of Planet Cards */}
            <motion.div
              className="planets-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {planets.map((planet, index) => (
                <PlanetCard
                  key={planet.id || planet.name}
                  planet={planet}
                  onSelect={handlePlanetSelect}
                  index={index}
                />
              ))}
            </motion.div>

            {/* Accessible Client-Side Pagination Controls (without full-page reload) */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              isLoading={isLoading}
            />
          </>
        )}

        {/* Planet Details Page / Dossier Modal (Required Fields & Bonus Scalable Visualizer) */}
        <PlanetDetailModal
          planet={selectedPlanet}
          onClose={handleModalClose}
        />
      </main>
    </div>
  );
};

export default App;
