import React from 'react';
import { Sparkles, Clock, Flame, Percent } from 'lucide-react';

export const HeroBanner = ({ onCategoryClick }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-[#FF5200] to-rose-600 text-white p-6 sm:p-8 shadow-xl shadow-orange-500/15">
      {/* Decorative background shapes */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
      <div className="absolute left-1/3 -top-10 w-48 h-48 rounded-full bg-amber-400/20 blur-xl pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-black uppercase tracking-wider border border-white/25">
          <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          <span>Craving something delicious?</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
          Feast on hot, savory food delivered to your door in minutes.
        </h1>

        <p className="text-xs sm:text-sm text-orange-100 font-medium">
          Discover handpicked gourmet kitchens, top-rated biryanis, woodfired pizzas, and street specials.
        </p>

        {/* Promo Code Pill & Highlights */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl bg-white text-slate-900 shadow-md font-bold text-xs">
            <Percent className="w-4 h-4 text-[#FF5200]" />
            <span>Use code <strong className="text-[#FF5200] font-black">FOODIE50</strong> for 50% OFF</span>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-white/90 font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>Average Delivery: 25-35 mins</span>
          </div>
        </div>
      </div>
    </div>
  );
};
