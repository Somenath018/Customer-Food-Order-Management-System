import React from 'react';
import { SlidersHorizontal, Star, Zap, Leaf, Check, ArrowUpDown } from 'lucide-react';

export const FilterBar = ({
  pureVeg,
  setPureVeg,
  ratingFilter,
  setRatingFilter,
  fastDelivery,
  setFastDelivery,
  sortBy,
  setSortBy,
  onlyOpen,
  setOnlyOpen
}) => {
  return (
    <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar text-xs font-bold">
      {/* Sort By Dropdown */}
      <div className="relative shrink-0">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort restaurants by"
          className="appearance-none pl-8 pr-8 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:border-slate-300 font-bold text-xs focus:ring-2 focus:ring-[#FF5200] outline-none cursor-pointer shadow-xs"
        >
          <option value="relevance">Sort: Relevance</option>
          <option value="delivery_time">Fastest Delivery</option>
          <option value="rating">Rating: High to Low</option>
          <option value="cost_asc">Cost: Low to High</option>
          <option value="cost_desc">Cost: High to Low</option>
        </select>
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
      </div>

      {/* Pure Veg Filter */}
      <button
        onClick={() => setPureVeg(!pureVeg)}
        className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl border transition-all shrink-0 cursor-pointer shadow-xs ${
          pureVeg
            ? 'bg-emerald-50 text-emerald-700 border-emerald-500 ring-1 ring-emerald-400'
            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
        }`}
      >
        <span className="w-3.5 h-3.5 rounded-sm border-2 border-emerald-600 flex items-center justify-center p-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
        </span>
        <span>Pure Veg</span>
        {pureVeg && <Check className="w-3 h-3 text-emerald-600 ml-1" />}
      </button>

      {/* 4.0+ Rating */}
      <button
        onClick={() => setRatingFilter(!ratingFilter)}
        className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl border transition-all shrink-0 cursor-pointer shadow-xs ${
          ratingFilter
            ? 'bg-amber-50 text-amber-800 border-amber-400 ring-1 ring-amber-300'
            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
        }`}
      >
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
        <span>Ratings 4.0+</span>
        {ratingFilter && <Check className="w-3 h-3 text-amber-600 ml-1" />}
      </button>

      {/* Fast Delivery (< 30 mins) */}
      <button
        onClick={() => setFastDelivery(!fastDelivery)}
        className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl border transition-all shrink-0 cursor-pointer shadow-xs ${
          fastDelivery
            ? 'bg-orange-50 text-[#FF5200] border-orange-400 ring-1 ring-orange-300'
            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
        }`}
      >
        <Zap className="w-3.5 h-3.5 text-[#FF5200]" />
        <span>Fast Delivery (&lt;30m)</span>
        {fastDelivery && <Check className="w-3 h-3 text-[#FF5200] ml-1" />}
      </button>

      {/* Open Now */}
      <button
        onClick={() => setOnlyOpen(!onlyOpen)}
        className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl border transition-all shrink-0 cursor-pointer shadow-xs ${
          onlyOpen
            ? 'bg-teal-50 text-teal-800 border-teal-400 ring-1 ring-teal-300'
            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>Open Now</span>
        {onlyOpen && <Check className="w-3 h-3 text-teal-600 ml-1" />}
      </button>
    </div>
  );
};
