import React, { useState } from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { Search, ChevronDown, ChevronUp, Store, MapPin, Calendar, Clock, ShoppingBag } from 'lucide-react';
import { formatCurrency, formatFullDate } from '../../utils/formatters';

export const HistoryView = ({ completedOrders = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredOrders = completedOrders.filter((order) => {
    const query = searchTerm.toLowerCase();
    const restName = (order.restaurant_name || '').toLowerCase();
    const orderId = (order.id || '').toLowerCase();
    const custName = (order.customer_name || '').toLowerCase();
    return restName.includes(query) || orderId.includes(query) || custName.includes(query);
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex items-center space-x-2 bg-dark-800 border border-dark-700 rounded-2xl p-2 px-3 shadow">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search trips by restaurant, order #, or customer..."
          className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-gray-400 hover:text-white px-1 font-semibold"
          >
            Clear
          </button>
        )}
      </div>

      {/* History List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const isExpanded = expandedId === order.id;

            return (
              <div
                key={order.id}
                className="bg-dark-800 border border-dark-700 rounded-2xl p-4 shadow-lg transition hover:border-dark-600"
              >
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="flex items-start justify-between cursor-pointer select-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm">
                        {order.restaurant_name}
                      </span>
                      <StatusBadge status={order.delivery?.delivery_status || order.status} />
                    </div>
                    <p className="text-xs text-gray-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span>{formatFullDate(order.delivered_at || order.placed_at)}</span>
                    </p>
                  </div>

                  <div className="text-right flex items-center space-x-2">
                    <div>
                      <div className="font-mono font-extrabold text-emerald-400 text-sm">
                        +{formatCurrency(order.delivery_fee || 3.50)}
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono">
                        #{order.id?.slice(-4).toUpperCase()}
                      </div>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-white">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-dark-700/80 space-y-3 text-xs animate-in fade-in duration-200">
                    <div className="space-y-1.5 text-gray-300">
                      <div className="flex items-start space-x-2">
                        <Store className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-gray-400">Pickup: </span>
                          <span>{order.restaurant_address || 'Restaurant'}</span>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-rider-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-gray-400">Dropoff: </span>
                          <span>{order.delivery_address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Food Items */}
                    <div className="bg-dark-900/60 rounded-xl p-3 border border-dark-700">
                      <div className="font-semibold text-gray-300 mb-1 flex items-center space-x-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />
                        <span>Items Delivered:</span>
                      </div>
                      <ul className="space-y-1 text-gray-400">
                        {order.items?.map((item, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                            <span className="font-mono">{formatCurrency(item.price * item.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 pt-2 border-t border-dark-700/60 flex justify-between font-bold text-gray-200">
                        <span>Customer Total:</span>
                        <span className="font-mono">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 text-center space-y-2">
          <p className="text-xs text-gray-400">
            {searchTerm ? 'No trips match your search.' : 'No completed deliveries yet.'}
          </p>
        </div>
      )}
    </div>
  );
};
