import React, { useState, useMemo } from 'react';
import { CuisineFilter } from './CuisineFilter';
import { RestaurantCard } from './RestaurantCard';
import { Search, SlidersHorizontal, Sparkles, Frown } from 'lucide-react';

export const RestaurantList = ({
  restaurants = [],
  loading = false,
  selectedCuisine,
  onSelectCuisine,
  searchQuery,
  onSearchChange,
  onSelectRestaurant
}) => {
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [fastDelivery, setFastDelivery] = useState(false);
  const [topRated, setTopRated] = useState(false);

  // Filter pipeline
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      if (onlyOpen && !r.is_open) return false;
      if (fastDelivery && Number(r.delivery_time_mins) > 25) return false;
      if (topRated && Number(r.rating) < 4.8) return false;
      return true;
    });
  }, [restaurants, onlyOpen, fastDelivery, topRated]);

  return (
    <div className="space-y-6">
      {/* Search & Quick Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search restaurants, cuisines, dishes..."
            className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-brand-500 transition shadow-inner"
          />
        </div>

        {/* Secondary Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto">
          <button
            onClick={() => setOnlyOpen(!onlyOpen)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              onlyOpen
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-dark-800 text-gray-400 border-dark-700 hover:text-white'
            }`}
          >
            Open Now
          </button>
          <button
            onClick={() => setFastDelivery(!fastDelivery)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              fastDelivery
                ? 'bg-brand-500/20 text-brand-300 border-brand-500/50'
                : 'bg-dark-800 text-gray-400 border-dark-700 hover:text-white'
            }`}
          >
            Under 25m
          </button>
          <button
            onClick={() => setTopRated(!topRated)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              topRated
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-dark-800 text-gray-400 border-dark-700 hover:text-white'
            }`}
          >
            Top Rated (4.8+)
          </button>
        </div>
      </div>

      {/* Cuisine Categories */}
      <CuisineFilter
        selectedCuisine={selectedCuisine}
        onSelectCuisine={onSelectCuisine}
      />

      {/* Section Heading */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-lg font-extrabold text-white flex items-center space-x-2">
          <span>Popular Restaurants</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-dark-800 text-gray-400 border border-dark-700 font-mono">
            {filteredRestaurants.length}
          </span>
        </h2>
      </div>

      {/* Grid or Empty/Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-dark-850 border border-dark-800 rounded-2xl h-72 animate-pulse"
            />
          ))}
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <div className="bg-dark-850 border border-dark-800 rounded-2xl p-12 text-center space-y-3">
          <Frown className="w-10 h-10 text-gray-500 mx-auto" />
          <h4 className="font-bold text-base text-white">No restaurants found</h4>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing cuisine filters, or removing the active filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onSelect={onSelectRestaurant}
            />
          ))}
        </div>
      )}
    </div>
  );
};
