import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useCart } from '../../context/CartContext';
import {
  Clock,
  MapPin,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Star,
  Receipt,
  Store,
  ArrowRight
} from 'lucide-react';

export const OrderHistoryView = ({ onTrackOrder, onOpenReview, onGoToRestaurants }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getOrders();
      if (res && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Error fetching order history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReorder = (order) => {
    if (!order.items || !order.restaurant_id) return;
    const mockRest = {
      id: order.restaurant_id,
      name: order.restaurant_name,
      delivery_fee: order.delivery_fee || 2.99
    };
    order.items.forEach((item) => {
      addToCart(
        {
          id: item.menu_item_id,
          name: item.name,
          price: item.price
        },
        mockRest
      );
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#FF5200] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-black text-slate-700">Loading your food history...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Past Orders</h2>
          <p className="text-xs text-slate-500">Track current dispatches or reorder your favorites</p>
        </div>
        <span className="text-xs font-black uppercase tracking-wider text-slate-400">
          {orders.length} Total Orders
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-orange-100 text-[#FF5200] flex items-center justify-center">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-base font-extrabold text-slate-800">No orders yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't placed any delicious food orders yet. Start exploring great restaurants nearby!
          </p>
          <button
            onClick={onGoToRestaurants}
            className="mt-2 px-5 py-2.5 rounded-2xl bg-[#FF5200] text-white font-bold text-xs hover:brightness-105 shadow-md shadow-orange-500/20 cursor-pointer"
          >
            Browse Restaurants
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => {
            const isActive = !['delivered', 'cancelled'].includes(ord.status);
            return (
              <div
                key={ord.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-orange-200 hover:shadow-md transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF5200] flex items-center justify-center font-black text-sm">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{ord.restaurant_name}</h4>
                      <p className="text-xs text-slate-400">
                        Order #{ord.id?.slice(-4).toUpperCase()} •{' '}
                        {new Date(ord.placed_at).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric'
                        })}{' '}
                        at{' '}
                        {new Date(ord.placed_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-700'
                          : ord.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-orange-100 text-[#FF5200] animate-pulse'
                      }`}
                    >
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Items & Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Dishes Ordered
                    </span>
                    <ul className="space-y-1 text-slate-700 font-medium">
                      {ord.items?.map((item, i) => (
                        <li key={i} className="flex justify-between">
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-bold">
                            ₹{(Number(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-100 md:pl-4 pt-2 md:pt-0">
                    <span className="font-bold text-slate-500 uppercase tracking-wider block">
                      Delivered To
                    </span>
                    <p className="text-slate-600 line-clamp-2">{ord.delivery_address}</p>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="font-bold text-slate-700">Total Paid:</span>
                      <span className="text-sm font-black text-slate-900">
                        ₹{Number(ord.total).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    {/* Live Tracking button if order is active */}
                    {isActive ? (
                      <button
                        onClick={() => onTrackOrder(ord)}
                        className="px-4 py-2 rounded-xl bg-[#FF5200] hover:bg-orange-600 text-white font-extrabold text-xs transition shadow-md shadow-orange-500/20 flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Track Live Status</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onTrackOrder(ord)}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
                      >
                        View Order Details
                      </button>
                    )}

                    {/* Re-order */}
                    <button
                      onClick={() => handleReorder(ord)}
                      className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#FF5200] font-bold text-xs transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-order Items</span>
                    </button>
                  </div>

                  {/* Rating / Review Button if delivered */}
                  {ord.status === 'delivered' && (
                    <button
                      onClick={() => onOpenReview(ord)}
                      className="px-3.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs transition flex items-center space-x-1 cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{ord.feedback ? `Rated ${ord.feedback.rating}★` : 'Rate Food'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
