import React, { useEffect, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Info,
  FileText
} from 'lucide-react';

export const CartDrawer = ({ isOpen, onClose, onCheckout }) => {
  const {
    restaurant,
    items,
    specialInstructions,
    setSpecialInstructions,
    itemCount,
    subtotal,
    deliveryFee,
    tax,
    total,
    updateQuantity,
    removeItem,
    clearCart
  } = useCart();

  const drawerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const minOrderMet = !restaurant?.min_order || subtotal >= restaurant.min_order;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-dark-900 border-l border-dark-700/80 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-dark-700/80 flex items-center justify-between bg-dark-850">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Your Cart</h3>
              {restaurant && (
                <p className="text-[11px] text-gray-400 line-clamp-1">From {restaurant.name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                title="Clear Cart"
                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-dark-750 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-dark-750 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Items List or Empty State */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center mx-auto text-gray-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-white">Your cart is empty</h4>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Explore restaurants and add some tasty dishes to get started!
              </p>
            </div>
          ) : (
            <>
              {/* Itemized food list */}
              <div className="space-y-2.5">
                {items.map((item) => (
                  <div
                    key={item.menu_item_id || item.id}
                    className="p-3 rounded-xl bg-dark-850 border border-dark-700/60 flex items-center justify-between gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.dietary === 'veg'
                              ? 'bg-emerald-400'
                              : item.dietary === 'vegan'
                              ? 'bg-teal-400'
                              : 'bg-rose-400'
                          }`}
                        />
                        <h4 className="text-xs font-bold text-white line-clamp-1">{item.name}</h4>
                      </div>
                      <span className="text-xs font-semibold text-brand-400 mt-0.5 block">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center space-x-2 bg-dark-800 border border-dark-700 rounded-lg px-2 py-1">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.menu_item_id || item.id, item.quantity - 1)
                        }
                        className="text-gray-400 hover:text-white transition p-0.5"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.menu_item_id || item.id, item.quantity + 1)
                        }
                        className="text-gray-400 hover:text-white transition p-0.5"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Instructions Input */}
              <div className="pt-2">
                <label className="flex items-center space-x-1.5 text-xs font-semibold text-gray-300 mb-1.5">
                  <FileText className="w-3.5 h-3.5 text-brand-400" />
                  <span>Cooking / Delivery Instructions</span>
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Extra napkins, less spicy, leave at door..."
                  rows={2}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition resize-none"
                />
              </div>

              {/* Min Order Notice */}
              {restaurant?.min_order && !minOrderMet && (
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center space-x-2 text-amber-300 text-xs">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Minimum order amount for this restaurant is {formatCurrency(restaurant.min_order)}.
                    Add {formatCurrency(restaurant.min_order - subtotal)} more to checkout.
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Drawer Footer with Calculations */}
        {items.length > 0 && (
          <div className="p-4 border-t border-dark-700 bg-dark-850 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-semibold text-gray-200">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery Fee</span>
                <span className="font-semibold text-gray-200">
                  {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Taxes & Platform Fees (8%)</span>
                <span className="font-semibold text-gray-200">{formatCurrency(tax)}</span>
              </div>
              <div className="border-t border-dark-700/80 pt-2 flex justify-between text-sm font-extrabold text-white">
                <span>Total Amount</span>
                <span className="text-brand-400 text-base">{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onCheckout();
              }}
              disabled={!minOrderMet}
              className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
