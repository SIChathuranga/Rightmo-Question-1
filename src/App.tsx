import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
  // Read initial state from URL query parameters for bookmarking & direct link support
  const getInitialUrlState = () => {
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
  };

  const initial = getInitialUrlState();

  const [searchTerm, setSearchTerm] = useState<string>(initial.search);
  const [currentPage, setCurrentPage] = useState<number>(initial.page);
  const [sortOption, setSortOption] = useState<SortOption>(initial.sort);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 350);

  // When search query is edited, reset page to 1
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Main SWAPI planetary data hook
  const {
    planets,
    isLoading,
    isError,
    errorMessage,
    totalCount,
    totalPages,
    refetch,
  } = usePlanets(currentPage, debouncedSearch, sortOption);

  // Sync state to URL without full-page reloads
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());
    if (sortOption !== 'default') params.set('sort', sortOption);
    if (selectedPlanet) params.set('planet', selectedPlanet.id);

    const queryString = params.toString();
    const newRelativePathQuery = queryString ? `?${queryString}` : window.location.pathname;
    window.history.replaceState(null, '', newRelativePathQuery);
  }, [currentPage, debouncedSearch, sortOption, selectedPlanet]);

  // Deep-link initial load: If URL contains ?planet=id, fetch and open modal directly
  useEffect(() => {
    if (initial.planetId && !selectedPlanet) {
      getPlanetById(initial.planetId)
        .then((planet) => setSelectedPlanet(planet))
        .catch(() => {
          // If planet fails to load from deep link, gracefully ignore
        });
    }
  }, [initial.planetId]);

  const handlePlanetSelect = useCallback((planet: Planet) => {
    setSelectedPlanet(planet);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedPlanet(null);
  }, []);

  const handleResetSearch = useCallback(() => {
    setSearchTerm('');
    setCurrentPage(1);
  }, []);

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
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
              isLoading={isLoading && searchTerm !== debouncedSearch}
            />

            <SortBar
              currentSort={sortOption}
              onSortChange={setSortOption}
            />
          </div>

          {/* Quick Telemetry Status Readout */}
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

        {/* View States: Error, Loading, Empty, or List */}
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

            {/* Pagination Controls without full-page reload */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              isLoading={isLoading}
            />
          </>
        )}

        {/* Planet Details Page / Dossier Modal (Required & Bonus Visualizer) */}
        <AnimatePresence>
          {selectedPlanet && (
            <PlanetDetailModal
              planet={selectedPlanet}
              onClose={handleModalClose}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
