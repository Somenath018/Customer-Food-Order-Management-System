import React from 'react';
import { Star, Clock, MapPin, Percent, Bike } from 'lucide-react';

export const RestaurantCard = ({ restaurant, onClick }) => {
  const {
    name,
    cuisine,
    image_url,
    rating = 4.5,
    delivery_time_mins = 30,
    delivery_fee = 2.99,
    address,
    is_open = true
  } = restaurant;

  const isFreeDelivery = Number(delivery_fee) === 0;

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-orange-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Image Container with Offer Overlay */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient shadow for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Offer Tag */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white font-black text-xs uppercase tracking-wider drop-shadow-sm">
          <div className="flex items-center space-x-1 text-white">
            <Percent className="w-3.5 h-3.5 text-amber-300" />
            <span>50% OFF UP TO ₹100</span>
          </div>
          {isFreeDelivery && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-extrabold tracking-wide">
              Free Delivery
            </span>
          )}
        </div>

        {/* Closed Overlay */}
        {!is_open && (
          <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center">
            <span className="px-4 py-1.5 rounded-full bg-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-lg">
              Closed Now • Opens Soon
            </span>
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#FF5200] transition-colors line-clamp-1">
              {name}
            </h3>
            {/* Rating Pill */}
            <div className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-emerald-600 text-white font-extrabold text-xs shrink-0 shadow-xs">
              <Star className="w-3 h-3 fill-white" />
              <span>{Number(rating).toFixed(1)}</span>
            </div>
          </div>

          {/* Cuisine & Time */}
          <div className="flex items-center space-x-2 text-xs text-slate-600 mt-1 font-semibold">
            <span className="truncate">{cuisine}</span>
            <span>•</span>
            <span className="flex items-center space-x-1 shrink-0 text-slate-700">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              <span>{delivery_time_mins} mins</span>
            </span>
          </div>

          {/* Address */}
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 flex items-center space-x-1">
            <MapPin className="w-3 h-3 shrink-0" />
            <span>{address}</span>
          </p>
        </div>

        {/* Footer info pill */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="flex items-center space-x-1">
            <Bike className="w-3.5 h-3.5 text-slate-400" />
            <span>{isFreeDelivery ? 'Free Delivery' : `₹${delivery_fee} Delivery Fee`}</span>
          </span>
          <span className="text-[#FF5200] font-bold group-hover:translate-x-0.5 transition-transform">
            View Menu →
          </span>
        </div>
      </div>
    </div>
  );
};
