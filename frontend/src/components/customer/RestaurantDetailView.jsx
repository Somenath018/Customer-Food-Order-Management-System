import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { FoodItemCard } from './FoodItemCard';
import { CustomizationModal } from './CustomizationModal';
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Bike,
  Search,
  Leaf,
  ShieldCheck,
  Percent,
  Sparkles
} from 'lucide-react';

export const RestaurantDetailView = ({ restaurantId, onBack }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [menuSearch, setMenuSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [customizingItem, setCustomizingItem] = useState(null);

  useEffect(() => {
    if (!restaurantId) return;
    setLoading(true);
    api.getRestaurantById(restaurantId)
      .then((res) => {
        if (res && res.restaurant) {
          setRestaurant(res.restaurant);
        } else {
          setError('Restaurant not found');
        }
      })
      .catch((err) => {
        setError(err.message || 'Error fetching restaurant details');
      })
      .finally(() => setLoading(false));
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#FF5200] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-black text-slate-700 tracking-wider">Loading restaurant kitchen...</span>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-4">
        <div className="text-base font-bold text-slate-800">{error || 'Restaurant could not be found'}</div>
        <button
          onClick={onBack}
          className="px-5 py-2 rounded-2xl bg-[#FF5200] text-white font-bold text-xs hover:brightness-110 transition cursor-pointer"
        >
          Return to Restaurants
        </button>
      </div>
    );
  }

  const menu = restaurant.menu || [];

  // Group menu by categories
  const categories = ['All', ...new Set(menu.map((m) => m.category || 'Main Course'))];

  // Filter menu items
  const filteredMenu = menu.filter((item) => {
    if (vegOnly && item.dietary !== 'veg' && item.dietary !== 'vegan') {
      return false;
    }
    if (activeCategory !== 'All' && item.category !== activeCategory) {
      return false;
    }
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-slate-600 hover:text-[#FF5200] transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all restaurants</span>
      </button>

      {/* Restaurant Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-lg border border-slate-200/90 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#FF5200] font-black text-[10px] uppercase tracking-wider">
                {restaurant.cuisine}
              </span>
              {!restaurant.is_open && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-600 font-black text-[10px] uppercase tracking-wider">
                  Closed Now
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {restaurant.name}
            </h1>

            <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
              {restaurant.description || 'Authentic delicacies crafted with fresh ingredients and traditional recipes.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1 font-semibold">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{restaurant.address}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-slate-700">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span>{restaurant.delivery_time_mins} mins</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-slate-700">
                <Bike className="w-3.5 h-3.5 text-emerald-600" />
                <span>₹{restaurant.delivery_fee} delivery fee</span>
              </span>
            </div>
          </div>

          {/* Rating & Safety score */}
          <div className="flex md:flex-col items-center justify-end gap-3 shrink-0">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center shadow-xs">
              <div className="flex items-center justify-center space-x-1 text-emerald-700 font-black text-lg">
                <Star className="w-5 h-5 fill-emerald-600 text-emerald-600" />
                <span>{Number(restaurant.rating).toFixed(1)}</span>
              </div>
              <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">
                500+ Ratings
              </div>
            </div>

            <div className="flex items-center space-x-1 text-[11px] text-slate-500 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Hygiene Inspected</span>
            </div>
          </div>
        </div>

        {/* Offers Ribbon */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center space-x-3 text-xs text-slate-700 font-bold">
          <div className="flex items-center space-x-1.5 text-[#FF5200]">
            <Percent className="w-4 h-4" />
            <span>50% OFF up to ₹100 using FOODIE50</span>
          </div>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-medium hidden sm:inline">Min. order ₹199</span>
        </div>
      </div>

      {/* Menu Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        {/* Search input in menu */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search dish in menu..."
            value={menuSearch}
            onChange={(e) => setMenuSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
          />
          {menuSearch && (
            <button
              onClick={() => setMenuSearch('')}
              className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Veg Only Toggle */}
        <button
          onClick={() => setVegOnly(!vegOnly)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-2xl border text-xs font-bold transition cursor-pointer shadow-xs ${
            vegOnly
              ? 'bg-emerald-50 text-emerald-700 border-emerald-500 ring-1 ring-emerald-400'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="w-3.5 h-3.5 rounded-sm border-2 border-emerald-600 flex items-center justify-center p-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          </span>
          <span>Veg Only</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar text-xs font-bold">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
              activeCategory === cat
                ? 'bg-slate-900 text-white font-black shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food Items List */}
      <div className="space-y-4">
        {filteredMenu.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-2">
            <div className="text-sm font-bold text-slate-700">No dishes match your filters</div>
            <p className="text-xs text-slate-400">Try clearing the search query or veg-only toggle.</p>
            <button
              onClick={() => {
                setMenuSearch('');
                setVegOnly(false);
                setActiveCategory('All');
              }}
              className="mt-2 px-4 py-1.5 rounded-xl bg-orange-100 text-[#FF5200] font-bold text-xs hover:bg-orange-200 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMenu.map((item) => (
              <FoodItemCard
                key={item.id}
                item={item}
                restaurant={restaurant}
                onCustomize={(targetItem) => setCustomizingItem(targetItem)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Customization Modal */}
      <CustomizationModal
        item={customizingItem}
        restaurant={restaurant}
        isOpen={!!customizingItem}
        onClose={() => setCustomizingItem(null)}
      />
    </div>
  );
};
