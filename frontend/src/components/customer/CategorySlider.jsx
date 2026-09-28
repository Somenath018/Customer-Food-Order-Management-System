import React from 'react';

export const CATEGORIES = [
  { id: 'All', name: 'All Cuisines', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop&q=80' },
  { id: 'Biryani', name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop&q=80' },
  { id: 'Pizza', name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop&q=80' },
  { id: 'Burgers', name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80' },
  { id: 'North Indian', name: 'North Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&auto=format&fit=crop&q=80' },
  { id: 'Chinese', name: 'Chinese', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&auto=format&fit=crop&q=80' },
  { id: 'Rolls', name: 'Rolls & Wraps', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200&auto=format&fit=crop&q=80' },
  { id: 'Desserts', name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&auto=format&fit=crop&q=80' },
  { id: 'Healthy', name: 'Healthy Bowls', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&auto=format&fit=crop&q=80' },
  { id: 'Beverages', name: 'Shakes & Chai', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&auto=format&fit=crop&q=80' }
];

export const CategorySlider = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900">What's on your mind?</h3>
          <p className="text-xs text-slate-500">Explore curated cuisines delivered with love</p>
        </div>
      </div>

      {/* Horizontal Scrollable Categories */}
      <div className="flex items-center space-x-4 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="flex flex-col items-center space-y-2 shrink-0 group cursor-pointer focus:outline-none"
            >
              <div
                className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden p-1 transition-all duration-300 transform group-hover:scale-105 shadow-md ${
                  isSelected
                    ? 'ring-4 ring-[#FF5200] bg-orange-100'
                    : 'border-2 border-slate-200 bg-white group-hover:border-orange-300'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full group-hover:rotate-3 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <span
                className={`text-xs font-bold transition-colors ${
                  isSelected ? 'text-[#FF5200] font-black' : 'text-slate-700 group-hover:text-[#FF5200]'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
