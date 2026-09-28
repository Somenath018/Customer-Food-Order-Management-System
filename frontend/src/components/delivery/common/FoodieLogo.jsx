import React from 'react';

/**
 * High-resolution vector Foodie Logo with Swiggy/Zomato style aesthetics
 * Features gradient food cloche, speed streaks, and bold typography.
 */
export const FoodieLogo = ({ size = 'md', showBadge = true, variant = 'full' }) => {
  // Dimension presets
  const dims = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', badge: 'text-[9px] px-1.5 py-0.5' },
    md: { icon: 'w-9 h-9', text: 'text-xl', badge: 'text-[10px] px-2 py-0.5' },
    lg: { icon: 'w-14 h-14', text: 'text-3xl', badge: 'text-xs px-2.5 py-0.5' }
  }[size] || { icon: 'w-9 h-9', text: 'text-xl', badge: 'text-[10px] px-2 py-0.5' };

  return (
    <div className="flex items-center space-x-2.5 select-none">
      {/* Icon Badge */}
      <div
        className={`${dims.icon} rounded-2xl bg-gradient-to-br from-[#FF5200] via-[#FC8019] to-[#E23744] p-1.5 flex items-center justify-center shadow-lg shadow-orange-500/25 border border-white/20 shrink-0 transform transition-transform hover:scale-105`}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
        >
          {/* Cloche Handle */}
          <circle cx="20" cy="11" r="2.2" fill="white" />
          {/* Cloche Dome */}
          <path
            d="M9 22 C9 14, 31 14, 31 22 Z"
            fill="white"
            fillOpacity="0.95"
          />
          {/* Cloche Base Tray */}
          <rect x="7" y="23" width="26" height="2.5" rx="1.2" fill="white" />
          {/* Fast Delivery Speed Streaks */}
          <path
            d="M12 28.5 L20 28.5 M9 31.5 L17 31.5"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeOpacity="0.9"
          />
          {/* Mini Sparkle Accent */}
          <circle cx="28" cy="29" r="1.5" fill="#FFE600" />
        </svg>
      </div>

      {/* Typography */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5">
            <span
              className={`font-black tracking-tight text-white font-sans ${dims.text}`}
              style={{
                textShadow: '0 2px 10px rgba(255, 82, 0, 0.25)'
              }}
            >
              foodie
              <span className="text-[#FF5200]">.</span>
            </span>

            {showBadge && (
              <span
                className={`font-extrabold tracking-wider uppercase rounded-md bg-gradient-to-r from-[#FF5200]/20 to-[#E23744]/20 text-[#ff7332] border border-[#FF5200]/40 ${dims.badge}`}
              >
                Partner
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-widest uppercase font-semibold text-gray-400 font-mono -mt-0.5">
            Fleet India
          </span>
        </div>
      )}
    </div>
  );
};
