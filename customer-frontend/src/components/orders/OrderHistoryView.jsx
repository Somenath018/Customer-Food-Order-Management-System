import React, { useEffect, useState } from 'react';
import { customerApi } from '../../api/customerApi';
import { useCart } from '../../context/CartContext';
import { StatusBadge } from '../common/StatusBadge';
import { formatCurrency, formatFullDate } from '../../utils/formatters';
import {
  Clock,
  RotateCcw,
  FileText,
  Navigation,
  ArrowRight,
  ShoppingBag,
  Loader2,
  Frown
} from 'lucide-react';

export const OrderHistoryView = ({ onTrackOrder, onViewReceipt, onOpenCart }) => {
  const { addItem, clearCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await customerApi.getOrders();
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Error fetching customer order history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    clearCart();
    const mockRest = {
      id: order.restaurant_id,
      name: order.restaurant_name,
      delivery_fee: order.delivery_fee,
      address: order.restaurant_address || 'Restaurant'
    };

    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addItem(item, mockRest);
      }
    });

    onOpenCart();
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === 'active') {
      return !['delivered', 'cancelled'].includes(o.status);
    }
    if (filter === 'completed') {
      return o.status === 'delivered';
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header and Filter tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white">Your Orders</h2>
          <p className="text-xs text-gray-400">View and track all your past and live food deliveries</p>
        </div>

        <div className="flex items-center space-x-1 bg-dark-800 p-1 rounded-xl border border-dark-700">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'all'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'active'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'completed'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-2">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          <span className="text-xs text-gray-400">Loading order history...</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-dark-850 border border-dark-700 rounded-2xl p-12 text-center space-y-3">
          <ShoppingBag className="w-10 h-10 text-gray-500 mx-auto" />
          <h4 className="font-bold text-base text-white">No orders found</h4>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            You don't have any orders matching the selected filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isActive = !['delivered', 'cancelled'].includes(order.status);

            return (
              <div
                key={order.id}
                className="bg-dark-850 border border-dark-700/80 hover:border-dark-600 rounded-2xl p-5 space-y-4 transition shadow-md"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-dark-750">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 font-extrabold text-xs">
                      #{order.id.slice(-4).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-white">{order.restaurant_name}</h3>
                      <span className="text-[11px] text-gray-400">
                        {formatFullDate(order.placed_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <StatusBadge status={order.status} />
                    <span className="text-sm font-extrabold text-white ml-2">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>

                {/* Items string */}
                <div className="text-xs text-gray-300">
                  {order.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-dark-750/80 text-xs">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => onViewReceipt(order)}
                      className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-gray-300 hover:text-white border border-dark-700 font-semibold flex items-center space-x-1.5 transition"
                    >
                      <FileText className="w-3.5 h-3.5 text-brand-400" />
                      <span>Receipt</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReorder(order)}
                      className="px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-gray-300 hover:text-white border border-dark-700 font-semibold flex items-center space-x-1.5 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Re-order</span>
                    </button>
                  </div>

                  {isActive ? (
                    <button
                      type="button"
                      onClick={() => onTrackOrder(order.id)}
                      className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold flex items-center space-x-1.5 transition shadow-md shadow-brand-500/20"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Live Track</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onTrackOrder(order.id)}
                      className="px-3.5 py-1.5 rounded-xl text-gray-400 hover:text-white transition flex items-center space-x-1"
                    >
                      <span>Order Summary</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
