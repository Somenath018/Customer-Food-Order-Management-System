import React, { useState, useEffect, useMemo } from 'react';
import { customerApi } from '../../api/customerApi';
import { MenuItemCard } from '../menu/MenuItemCard';
import { formatCurrency } from '../../utils/formatters';
import {
  ArrowLeft,
  Star,
  Clock,
  Bike,
  MapPin,
  Phone,
  ShieldCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const RestaurantDetail = ({ restaurantId, onBack, onOpenCart }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dietaryFilter, setDietaryFilter] = useState('all'); // 'all' | 'veg' | 'non-veg' | 'vegan'

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await customerApi.getRestaurantById(restaurantId);
        if (res.success && res.restaurant) {
          setRestaurant(res.restaurant);
        } else {
          setError('Restaurant could not be loaded.');
        }
      } catch (err) {
        setError(err.message || 'Error fetching restaurant details.');
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchDetail();
    }
  }, [restaurantId]);

  // Group menu items by category and filter by dietary
  const categorizedMenu = useMemo(() => {
    if (!restaurant?.menu) return {};
    const filtered = restaurant.menu.filter((item) => {
      if (!item.is_available) return false;
      if (dietaryFilter === 'veg' && item.dietary !== 'veg') return false;
      if (dietaryFilter === 'vegan' && item.dietary !== 'vegan') return false;
      if (dietaryFilter === 'non-veg' && item.dietary !== 'non-veg') return false;
      return true;
    });

    const groups = {};
    filtered.forEach((item) => {
      const cat = item.category || 'Specialties';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [restaurant, dietaryFilter]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        <span className="text-xs text-gray-400 font-medium">Loading delicious menu...</span>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="bg-dark-850 border border-dark-700 rounded-2xl p-8 text-center space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="font-bold text-base text-white">Oops! Failed to load</h3>
        <p className="text-xs text-gray-400">{error || 'Restaurant not found'}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs"
        >
          Return to Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Restaurants</span>
        </button>
      </div>

      {/* Restaurant Header Banner Card */}
      <div className="bg-dark-850 border border-dark-700 rounded-3xl overflow-hidden shadow-xl">
        <div className="relative h-56 sm:h-72 w-full bg-dark-800">
          <img
            src={restaurant.image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-900/60 to-transparent" />

          {/* Floating Rating Pill */}
          <div className="absolute top-4 right-4 flex items-center space-x-1 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-white text-xs font-extrabold">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{Number(restaurant.rating).toFixed(1)}</span>
            <span className="text-gray-400 font-normal ml-1">Rating</span>
          </div>

          {/* Restaurant details over image */}
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-brand-500 text-white text-xs font-bold uppercase tracking-wider">
                {restaurant.cuisine}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                  restaurant.is_open
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}
              >
                {restaurant.is_open ? 'Open Now' : 'Currently Closed'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white">{restaurant.name}</h1>
            <p className="text-xs text-gray-300 max-w-2xl line-clamp-2">
              {restaurant.description}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-4 sm:p-5 bg-dark-900/90 border-t border-dark-700/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center space-x-2 text-gray-300">
            <Clock className="w-4 h-4 text-brand-400 flex-shrink-0" />
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Delivery Time</span>
              <span className="font-semibold">{restaurant.delivery_time_mins || 25} mins</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-gray-300">
            <Bike className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Delivery Fee</span>
              <span className="font-semibold">
                {Number(restaurant.delivery_fee) === 0 ? 'Free' : formatCurrency(restaurant.delivery_fee)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-gray-300">
            <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <div className="truncate">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Address</span>
              <span className="font-semibold truncate block">{restaurant.address}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-gray-300">
            <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Min Order</span>
              <span className="font-semibold">{formatCurrency(restaurant.min_order || 10)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dietary Filter Buttons */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-gray-400 mr-2 flex-shrink-0">Dietary:</span>
        <button
          onClick={() => setDietaryFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            dietaryFilter === 'all'
              ? 'bg-brand-500 text-white shadow-sm'
              : 'bg-dark-800 text-gray-400 hover:text-white border border-dark-700'
          }`}
        >
          All Items
        </button>
        <button
          onClick={() => setDietaryFilter('veg')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
            dietaryFilter === 'veg'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-dark-800 text-gray-400 hover:text-white border border-dark-700'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Pure Veg</span>
        </button>
        <button
          onClick={() => setDietaryFilter('non-veg')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
            dietaryFilter === 'non-veg'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-dark-800 text-gray-400 hover:text-white border border-dark-700'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          <span>Non-Veg</span>
        </button>
        <button
          onClick={() => setDietaryFilter('vegan')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
            dietaryFilter === 'vegan'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-dark-800 text-gray-400 hover:text-white border border-dark-700'
          }`}
        >
          <span>🌱 Vegan</span>
        </button>
      </div>

      {/* Menu Categories List */}
      <div className="space-y-8">
        {Object.keys(categorizedMenu).length === 0 ? (
          <div className="bg-dark-850 border border-dark-700 rounded-2xl p-8 text-center text-gray-400 text-xs">
            No dishes available for the selected dietary filter.
          </div>
        ) : (
          Object.entries(categorizedMenu).map(([category, items]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center space-x-2 border-b border-dark-700/80 pb-2">
                <h3 className="font-extrabold text-base text-white">{category}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-dark-800 text-gray-400 font-mono">
                  {items.length}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {items.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    restaurant={restaurant}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
