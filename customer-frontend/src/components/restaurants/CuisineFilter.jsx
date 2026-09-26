import React from 'react';
import { Utensils, Pizza, Flame, Coffee, Sparkles } from 'lucide-react';

const CUISINES = [
  { label: 'All', icon: '🍽️' },
  { label: 'Italian', icon: '🍕' },
  { label: 'American', icon: '🍔' },
  { label: 'Indian', icon: '🍛' },
  { label: 'Japanese', icon: '🍣' },
  { label: 'Mexican', icon: '🌮' },
  { label: 'Healthy', icon: '🥗' }
];

export const CuisineFilter = ({ selectedCuisine, onSelectCuisine }) => {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
      {CUISINES.map((c) => {
        const isSelected = selectedCuisine === c.label;
        return (
          <button
            key={c.label}
            onClick={() => onSelectCuisine(c.label)}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
              isSelected
                ? 'bg-brand-500 text-white shadow-brand-500/25 scale-[1.02]'
                : 'bg-dark-800 text-gray-300 border border-dark-700 hover:bg-dark-750 hover:text-white'
            }`}
          >
            <span className="text-sm">{c.icon}</span>
            <span>{c.label}</span>
          </button>
        );
      })}
    </div>
  );
};
