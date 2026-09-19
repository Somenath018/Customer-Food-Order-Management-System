import React from 'react';
import { DollarSign, CheckCircle2, TrendingUp, Star, Navigation } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const MetricsGrid = ({ driver, activeCount = 0, completedCount = 0 }) => {
  const earnings = driver?.today_earnings || 68.50;
  const rating = driver?.rating || 4.9;
  const totalDeliveries = driver?.total_deliveries || completedCount || 14;

  const cards = [
    {
      label: "Today's Earnings",
      value: formatCurrency(earnings),
      icon: DollarSign,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
      subtext: '+12% from yesterday'
    },
    {
      label: 'Completed Trips',
      value: totalDeliveries,
      icon: CheckCircle2,
      color: 'from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30',
      subtext: 'Target: 20 trips'
    },
    {
      label: 'Active Delivery',
      value: activeCount,
      icon: Navigation,
      color: activeCount > 0
        ? 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30 animate-pulse'
        : 'from-dark-700 to-dark-800 text-gray-400 border-dark-700',
      subtext: activeCount > 0 ? 'Trip in progress' : 'Ready for pickup'
    },
    {
      label: 'Partner Rating',
      value: `${rating} ★`,
      icon: Star,
      color: 'from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/30',
      subtext: 'Top Rated Rider'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl bg-gradient-to-br border ${card.color} flex flex-col justify-between shadow-lg relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-300">{card.label}</span>
              <div className="p-2 rounded-xl bg-dark-900/60 backdrop-blur-sm">
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {card.value}
              </div>
              <div className="text-[11px] text-gray-400 mt-1 font-medium">{card.subtext}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
