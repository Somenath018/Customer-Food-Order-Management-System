import React from 'react';
import { useCart } from '../../context/CartContext';
import { Star, Plus, Minus, Sparkles } from 'lucide-react';

export const FoodItemCard = ({ item, restaurant, onCustomize }) => {
  const { items, addToCart, updateQuantity } = useCart();

  const isVeg = item.dietary === 'veg' || item.dietary === 'vegan';
  const cartItem = items.find((i) => i.id === item.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    // If user wants to customize or item has customization options
    addToCart(item, restaurant);
  };

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-orange-200 hover:shadow-md transition-all flex items-start justify-between gap-4">
      {/* Left Details */}
      <div className="flex-1 space-y-1.5">
        {/* Veg / Non-Veg Indicator & Bestseller */}
        <div className="flex items-center space-x-2">
          {/* Veg/Non-Veg icon */}
          <span
            className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center p-0.5 shrink-0 ${
              isVeg ? 'border-emerald-600' : 'border-rose-600'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`}
            ></span>
          </span>

          {item.is_available === false ? (
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
              Sold Out
            </span>
          ) : (
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md flex items-center space-x-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-500" />
              <span>Bestseller</span>
            </span>
          )}
        </div>

        {/* Dish Name */}
        <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
          {item.name}
        </h4>

        {/* Price */}
        <div className="text-sm font-black text-slate-800">
          ₹{Number(item.price).toFixed(2)}
        </div>

        {/* Rating preview */}
        <div className="flex items-center space-x-1 text-xs text-emerald-700 font-bold">
          <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
          <span>4.6</span>
          <span className="text-slate-400 font-normal text-[11px]">(42+ ratings)</span>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 pt-0.5">
            {item.description}
          </p>
        )}
      </div>

      {/* Right Image & Add Button */}
      <div className="relative flex flex-col items-center shrink-0 w-28 sm:w-32">
        <div className="w-28 h-24 sm:w-32 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
          <img
            src={
              item.image_url ||
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'
            }
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Add / Quantity Button Overlaid */}
        <div className="-mt-4 w-24 sm:w-28 shadow-lg">
          {item.is_available === false ? (
            <div className="py-1.5 px-3 rounded-xl bg-slate-200 text-slate-500 text-center text-xs font-bold uppercase">
              Unavailable
            </div>
          ) : currentQuantity > 0 ? (
            <div className="flex items-center justify-between bg-white rounded-xl border-2 border-[#FF5200] px-2 py-1 text-[#FF5200] font-black text-xs shadow-md">
              <button
                onClick={() => updateQuantity(cartItem.cartKey, currentQuantity - 1)}
                className="p-1 hover:bg-orange-50 rounded-lg cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-extrabold text-sm">{currentQuantity}</span>
              <button
                onClick={() => updateQuantity(cartItem.cartKey, currentQuantity + 1)}
                className="p-1 hover:bg-orange-50 rounded-lg cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="w-full py-1.5 px-3 rounded-xl bg-white hover:bg-orange-50 text-[#FF5200] border-2 border-[#FF5200] font-black text-xs uppercase tracking-wider transition-all shadow-md hover:scale-102 cursor-pointer flex items-center justify-center space-x-1"
            >
              <span>ADD</span>
              <Plus className="w-3.5 h-3.5 text-[#FF5200]" />
            </button>
          )}

          {/* Customisable indicator */}
          <button
            onClick={() => onCustomize && onCustomize(item)}
            className="w-full text-center text-[10px] text-slate-500 hover:text-[#FF5200] font-bold mt-1 cursor-pointer"
          >
            Customisable ⚙️
          </button>
        </div>
      </div>
    </div>
  );
};
