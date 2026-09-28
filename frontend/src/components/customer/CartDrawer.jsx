import React, { useState } from 'react';
import { useCart, AVAILABLE_COUPONS } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  Check,
  Receipt,
  ArrowRight,
  Info,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const CartDrawer = ({ onProceedToCheckout, onOpenAuth }) => {
  const {
    items,
    restaurant,
    totalItemCount,
    subtotal,
    deliveryFee,
    tax,
    discount,
    total,
    appliedCoupon,
    specialInstructions,
    isCartOpen,
    conflictModal,
    setIsCartOpen,
    setSpecialInstructions,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    resolveConflict
  } = useCart();

  const { user } = useAuth();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (code) => {
    try {
      setCouponError('');
      applyCoupon(code);
      setCouponInput('');
    } catch (err) {
      setCouponError(err.message);
    }
  };

  const handleProceed = () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    setIsCartOpen(false);
    onProceedToCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Top Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-orange-100 text-[#FF5200] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Your Food Basket</h3>
                <span className="text-xs text-slate-500 font-medium">
                  {restaurant ? restaurant.name : 'Your selected dishes'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 flex items-center justify-center text-orange-300">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h4 className="text-base font-extrabold text-slate-800">Your cart is empty</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Good food is always just around the corner. Browse delicious dishes and add them to your cart!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-3 px-5 py-2.5 rounded-2xl bg-[#FF5200] text-white font-bold text-xs hover:brightness-110 shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  Explore Restaurants
                </button>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3 divide-y divide-slate-100">
                  {items.map((item) => {
                    const isVeg = item.dietary === 'veg' || item.dietary === 'vegan';
                    return (
                      <div key={item.cartKey} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                        <div className="flex items-start space-x-2.5 flex-1">
                          <span
                            className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center p-0.5 shrink-0 mt-1 ${
                              isVeg ? 'border-emerald-600' : 'border-rose-600'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`}
                            ></span>
                          </span>

                          <div className="space-y-0.5">
                            <h5 className="text-xs font-bold text-slate-900 leading-snug">{item.name}</h5>
                            <span className="text-xs font-extrabold text-slate-700">
                              ₹{(Number(item.price) * item.quantity).toFixed(2)}
                            </span>
                            {item.customizations?.spiceLevel && (
                              <div className="text-[10px] text-slate-400">
                                Spice: {item.customizations.spiceLevel}
                                {item.customizations.addons?.length > 0 &&
                                  ` • ${item.customizations.addons.join(', ')}`}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center space-x-2 bg-slate-100 rounded-xl px-2 py-1 text-slate-800 font-extrabold text-xs">
                          <button
                            onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                            className="p-0.5 text-slate-500 hover:text-rose-600 cursor-pointer"
                          >
                            {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                          </button>
                          <span className="w-5 text-center font-black">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                            className="p-0.5 text-slate-500 hover:text-emerald-600 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Special Instructions Note */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Cooking & Delivery Note
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Leave at door, extra napkins, cutlery..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                  />
                </div>

                {/* Coupon Code Section */}
                <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center space-x-1.5 text-[#FF5200]">
                      <Tag className="w-4 h-4" />
                      <span>Available Coupons</span>
                    </span>
                    {appliedCoupon && (
                      <button
                        onClick={removeCoupon}
                        className="text-rose-500 hover:underline text-[11px] font-extrabold cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Quick coupon buttons */}
                  {!appliedCoupon && (
                    <div className="flex flex-wrap gap-1.5">
                      {AVAILABLE_COUPONS.map((cp) => (
                        <button
                          key={cp.code}
                          onClick={() => handleApplyCoupon(cp.code)}
                          className="px-2.5 py-1 rounded-xl bg-white border border-orange-200 hover:border-orange-400 text-[#FF5200] text-[11px] font-black transition cursor-pointer shadow-2xs"
                        >
                          {cp.code}
                        </button>
                      ))}
                    </div>
                  )}

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-300 text-emerald-700 text-xs font-bold">
                      <div className="flex items-center space-x-1.5">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>'{appliedCoupon.code}' Applied!</span>
                      </div>
                      <span className="text-emerald-600 font-black">Saved ₹{discount}</span>
                    </div>
                  ) : (
                    <div className="flex space-x-1.5">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs uppercase font-mono font-bold focus:ring-2 focus:ring-[#FF5200] outline-none"
                      />
                      <button
                        onClick={() => handleApplyCoupon(couponInput)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#FF5200] text-white font-black text-xs hover:brightness-105 transition cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {couponError && (
                    <p className="text-[11px] text-rose-500 font-semibold">{couponError}</p>
                  )}
                </div>

                {/* Bill Details */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center space-x-1 text-slate-800 font-black uppercase tracking-wider pb-1 border-b border-slate-200">
                    <Receipt className="w-3.5 h-3.5 text-slate-500" />
                    <span>Bill Summary</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Item Total</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Partner Fee</span>
                    <span>{deliveryFee === 0 ? <strong className="text-emerald-600 font-bold">FREE</strong> : `₹${deliveryFee.toFixed(2)}`}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Govt. Taxes & Packaging (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Promo Discount</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                    <span>To Pay</span>
                    <span className="text-[#FF5200] text-base">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Safe and contactless delivery supported on all orders</span>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout Action */}
          {items.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-white space-y-2 shadow-lg">
              <button
                onClick={handleProceed}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FF5200] via-[#FF6A1A] to-[#E23744] hover:brightness-105 text-white font-black text-xs uppercase tracking-wider flex items-center justify-between transition shadow-xl shadow-orange-500/25 cursor-pointer"
              >
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-orange-200 leading-tight">{totalItemCount} ITEMS</span>
                  <span className="text-sm font-black">₹{total.toFixed(2)}</span>
                </div>

                <div className="flex items-center space-x-1.5 text-xs">
                  <span>{user ? 'Proceed to Checkout' : 'Login to Order'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Different Restaurant Conflict Alert Modal */}
      {conflictModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-base font-black text-slate-900">Replace Cart Items?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your cart contains dishes from <strong>{restaurant?.name}</strong>. Do you want to
                discard them and start a new basket from <strong>{conflictModal.newRestaurant.name}</strong>?
              </p>
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => resolveConflict(false)}
                className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Keep Current
              </button>
              <button
                onClick={() => resolveConflict(true)}
                className="flex-1 py-2.5 rounded-2xl bg-[#FF5200] text-white font-black text-xs hover:brightness-110 shadow-md shadow-orange-500/20 cursor-pointer"
              >
                Yes, Replace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
