import React from 'react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Minus, Clock, Leaf } from 'lucide-react';

export const MenuItemCard = ({ item, restaurant }) => {
  const { items, addItem, updateQuantity } = useCart();

  const cartItem = items.find((i) => (i.menu_item_id || i.id) === item.id);
  const currentQty = cartItem ? cartItem.quantity : 0;

  const getDietaryIcon = () => {
    switch (item.dietary) {
      case 'veg':
        return (
          <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>VEG</span>
          </span>
        );
      case 'vegan':
        return (
          <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
            <Leaf className="w-3 h-3 text-emerald-400" />
            <span>VEGAN</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded border border-rose-500/50 bg-rose-500/10 text-rose-400 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>NON-VEG</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-dark-850 border border-dark-700/80 rounded-2xl p-4 flex flex-col sm:flex-row justify-between gap-4 transition hover:border-dark-600 hover:shadow-lg">
      {/* Details side */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            {getDietaryIcon()}
            {item.category && (
              <span className="text-[11px] text-gray-400 font-medium">
                • {item.category}
              </span>
            )}
          </div>
          <h4 className="font-bold text-sm text-white">{item.name}</h4>
          <span className="font-extrabold text-sm text-brand-400 block">
            {formatCurrency(item.price)}
          </span>
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {item.description || 'Deliciously prepared with authentic ingredients and flavors.'}
          </p>
        </div>

        {item.preparation_time_mins && (
          <div className="flex items-center space-x-1 text-[11px] text-gray-400 pt-1">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span>Prep: {item.preparation_time_mins} mins</span>
          </div>
        )}
      </div>

      {/* Image & Action Button */}
      <div className="relative flex flex-col items-center flex-shrink-0">
        <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-dark-800">
          <img
            src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Counter / Add Button */}
        <div className="mt-2 w-full sm:w-28">
          {currentQty > 0 ? (
            <div className="flex items-center justify-between bg-brand-500/20 border border-brand-500/50 rounded-xl px-2 py-1 text-white shadow-sm">
              <button
                type="button"
                onClick={() => updateQuantity(item.id, currentQty - 1)}
                className="p-1 rounded hover:bg-brand-500/30 text-brand-300 hover:text-white transition"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-white px-2">{currentQty}</span>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, currentQty + 1)}
                className="p-1 rounded hover:bg-brand-500/30 text-brand-300 hover:text-white transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => addItem(item, restaurant)}
              className="w-full py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center space-x-1 transition shadow-md shadow-brand-500/20 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
