import React from 'react';
import { Star, Clock, Bike, MapPin } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const RestaurantCard = ({ restaurant, onSelect }) => {
  const {
    id,
    name,
    cuisine,
    image_url,
    rating,
    delivery_time_mins,
    delivery_fee,
    min_order,
    is_open,
    address
  } = restaurant;

  return (
    <div
      onClick={() => onSelect(restaurant)}
      className="group bg-dark-850 border border-dark-700/80 hover:border-brand-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/10 flex flex-col"
    >
      {/* Hero Image */}
      <div className="relative h-44 w-full overflow-hidden bg-dark-800">
        <img
          src={image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-black/30" />

        {/* Status indicator */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase backdrop-blur-md border ${
              is_open
                ? 'bg-emerald-500/80 text-white border-emerald-400/50'
                : 'bg-dark-900/80 text-gray-300 border-dark-600'
            }`}
          >
            {is_open ? 'Open Now' : 'Closed'}
          </span>
        </div>

        {/* Rating Pill */}
        <div className="absolute top-3 right-3 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs font-bold">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{Number(rating).toFixed(1)}</span>
        </div>

        {/* Cuisine chip at bottom */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-0.5 rounded-lg bg-dark-900/80 backdrop-blur-sm text-xs font-medium text-brand-400 border border-dark-700">
            {cuisine}
          </span>
        </div>
      </div>

      {/* Info Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-bold text-base text-white group-hover:text-brand-400 transition-colors line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center space-x-1 text-xs text-gray-400 mt-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-500" />
            <span>{address}</span>
          </div>
        </div>

        {/* Delivery Specs */}
        <div className="pt-2 border-t border-dark-700/60 flex items-center justify-between text-xs text-gray-300 font-medium">
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-brand-400" />
            <span>{delivery_time_mins || 25} mins</span>
          </div>

          <div className="flex items-center space-x-1">
            <Bike className="w-3.5 h-3.5 text-emerald-400" />
            <span>{Number(delivery_fee) === 0 ? 'Free' : formatCurrency(delivery_fee)}</span>
          </div>

          <div className="text-gray-400 text-[11px]">
            Min {formatCurrency(min_order || 10)}
          </div>
        </div>
      </div>
    </div>
  );
};
