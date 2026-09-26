import React, { useEffect, useState, useMemo } from 'react';
import { useSocket } from '../../context/SocketContext';
import { customerApi } from '../../api/customerApi';
import { CustomerTrackingMap } from './CustomerTrackingMap';
import { StatusBadge } from '../common/StatusBadge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import {
  CheckCircle2,
  Clock,
  Bike,
  Store,
  MapPin,
  Phone,
  FileText,
  Sparkles,
  ArrowLeft,
  Loader2,
  ShieldCheck
} from 'lucide-react';

const ORDER_STAGES = [
  { key: 'placed', label: 'Placed', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'preparing', label: 'Cooking', icon: Store },
  { key: 'ready_for_pickup', label: 'Packed', icon: ShieldCheck },
  { key: 'out_for_delivery', label: 'On The Way', icon: Bike },
  { key: 'delivered', label: 'Delivered', icon: Sparkles }
];

export const LiveOrderTracker = ({ orderId, onBack, onViewReceipt }) => {
  const { liveOrderEvent, driverLocations, joinOrderRoom, leaveOrderRoom } = useSocket();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await customerApi.getOrderById(orderId);
        if (res.success && res.order) {
          setOrder(res.order);
        }
      } catch (err) {
        console.error('Failed to load order tracker data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
      joinOrderRoom(orderId);
    }

    return () => {
      if (orderId) leaveOrderRoom(orderId);
    };
  }, [orderId]);

  // Real-time WebSocket sync
  useEffect(() => {
    if (liveOrderEvent) {
      if (liveOrderEvent.type === 'status_changed' && liveOrderEvent.order?.id === orderId) {
        setOrder(liveOrderEvent.order);
      } else if (liveOrderEvent.type === 'driver_assigned' && liveOrderEvent.orderId === orderId) {
        setOrder((prev) => (prev ? { ...prev, delivery: liveOrderEvent.delivery, driver_name: liveOrderEvent.driverName } : prev));
      }
    }
  }, [liveOrderEvent, orderId]);

  // Derive driver coordinates
  const driverCoords = useMemo(() => {
    if (driverLocations[orderId]) {
      return driverLocations[orderId];
    }
    if (order?.delivery?.current_lat && order?.delivery?.current_lng) {
      return {
        lat: Number(order.delivery.current_lat),
        lng: Number(order.delivery.current_lng)
      };
    }
    return null;
  }, [driverLocations, orderId, order]);

  // Compute active stage index
  const currentStageIndex = useMemo(() => {
    if (!order) return 0;
    const idx = ORDER_STAGES.findIndex((s) => s.key === order.status);
    return idx >= 0 ? idx : 0;
  }, [order?.status]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        <span className="text-xs text-gray-400 font-medium">Connecting to live tracking stream...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-dark-850 border border-dark-700 rounded-2xl p-8 text-center space-y-3">
        <h4 className="font-bold text-base text-white">Order not found</h4>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Restaurants</span>
        </button>

        <button
          type="button"
          onClick={() => onViewReceipt(order)}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-gray-300 hover:text-white border border-dark-700 text-xs font-semibold transition"
        >
          <FileText className="w-3.5 h-3.5 text-brand-400" />
          <span>View Invoice Receipt</span>
        </button>
      </div>

      {/* Main Order Card */}
      <div className="bg-dark-850 border border-dark-700 rounded-3xl p-5 sm:p-6 space-y-6 shadow-xl">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-dark-700/80">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-brand-400">
                Order #{order.id.slice(-6).toUpperCase()}
              </span>
              <StatusBadge status={order.status} />
            </div>
            <h2 className="text-xl font-black text-white mt-1">{order.restaurant_name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Placed at {formatDateTime(order.placed_at)} • {order.items?.length || 0} items
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-gray-400 block font-medium">Total Paid</span>
            <span className="text-xl font-black text-white">{formatCurrency(order.total)}</span>
            <span className="text-[11px] text-emerald-400 block font-mono capitalize">
              {order.payment?.payment_method} • {order.payment?.payment_status}
            </span>
          </div>
        </div>

        {/* 6-Stage Visual Stepper */}
        <div className="py-2">
          <div className="grid grid-cols-6 gap-1 relative">
            {ORDER_STAGES.map((stg, index) => {
              const isPassed = index <= currentStageIndex;
              const isCurrent = index === currentStageIndex;
              const IconComp = stg.icon;

              return (
                <div key={stg.key} className="flex flex-col items-center text-center space-y-1.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-110 ring-4 ring-brand-500/20'
                        : isPassed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-dark-800 text-gray-500 border border-dark-700'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      isCurrent
                        ? 'text-brand-400'
                        : isPassed
                        ? 'text-gray-200'
                        : 'text-gray-500'
                    }`}
                  >
                    {stg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Interactive Leaflet Map */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 beacon-pulse"></span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Live GPS Delivery Stream
              </span>
            </div>
            {order.status === 'out_for_delivery' && (
              <span className="text-[11px] font-mono text-emerald-400">
                Estimated arrival: 12-15 mins
              </span>
            )}
          </div>

          <CustomerTrackingMap
            restaurantCoords={{ lat: 40.7192, lng: -73.9972 }}
            customerCoords={{ lat: 40.7280, lng: -73.9850 }}
            driverCoords={driverCoords}
            height="320px"
          />
        </div>

        {/* Assigned Driver Card if Out For Delivery or assigned */}
        {order.delivery && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-dark-800 to-dark-850 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Bike className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                  Assigned Delivery Partner
                </span>
                <h4 className="text-sm font-bold text-white">
                  {order.delivery.driver_name || order.driver_name || 'Alex Rivera'}
                </h4>
                <p className="text-[11px] text-gray-400">
                  {order.delivery.delivery_status === 'delivered'
                    ? 'Delivered'
                    : 'Bringing your food on Scooter / Bike'}
                </p>
              </div>
            </div>

            <a
              href={`tel:${order.delivery.driver_phone || '+15559876543'}`}
              className="px-3.5 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center space-x-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Rider</span>
            </a>
          </div>
        )}

        {/* Itemized Order Recap */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Order Items ({order.items?.length})
          </h4>
          <div className="divide-y divide-dark-750 rounded-xl bg-dark-900 border border-dark-700/60 p-3 space-y-2">
            {order.items?.map((it, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs pt-1.5 first:pt-0">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-brand-400">{it.quantity}x</span>
                  <span className="text-white font-medium">{it.name}</span>
                </div>
                <span className="text-gray-300 font-semibold">
                  {formatCurrency(it.price * it.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="flex items-start space-x-2 text-xs text-gray-400 pt-2 border-t border-dark-700/80">
          <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-gray-300 font-semibold block">Delivery Address</span>
            <span>{order.delivery_address}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
