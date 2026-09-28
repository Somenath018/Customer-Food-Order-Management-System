import React from 'react';

export const FoodieLogo = ({ size = 'md', badgeText = '', onClick }) => {
  const dims = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', badge: 'text-[9px] px-1.5 py-0.5' },
    md: { icon: 'w-9 h-9', text: 'text-2xl', badge: 'text-[10px] px-2 py-0.5' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl', badge: 'text-xs px-2.5 py-1' }
  }[size] || { icon: 'w-9 h-9', text: 'text-2xl', badge: 'text-[10px] px-2 py-0.5' };

  return (
    <div
      onClick={onClick}
      className={`flex items-center space-x-2.5 select-none ${onClick ? 'cursor-pointer hover:opacity-95' : ''}`}
    >
      {/* Icon Badge */}
      <div
        className={`${dims.icon} rounded-2xl bg-gradient-to-br from-[#FF5200] via-[#FF6A1A] to-[#E23744] p-1.5 flex items-center justify-center shadow-lg shadow-orange-500/30 border border-white/25 shrink-0 transform transition-transform duration-200 hover:scale-105`}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white drop-shadow-sm"
        >
          {/* Cloche Handle */}
          <circle cx="20" cy="11" r="2.2" fill="white" />
          {/* Cloche Dome */}
          <path
            d="M9 22 C9 14, 31 14, 31 22 Z"
            fill="white"
            fillOpacity="0.96"
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
          {/* Accent dot */}
          <circle cx="28" cy="29" r="1.5" fill="#FFE600" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-1.5">
          <span className={`font-black tracking-tight text-slate-900 font-sans leading-none ${dims.text}`}>
            foodie
            <span className="text-[#FF5200]">.</span>
          </span>
          {badgeText && (
            <span
              className={`font-extrabold tracking-wider uppercase rounded-full bg-orange-100 text-[#FF5200] border border-orange-200 ${dims.badge}`}
            >
              {badgeText}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 font-mono -mt-0.5">
          Food Delivery
        </span>
      </div>
    </div>
  );
};
