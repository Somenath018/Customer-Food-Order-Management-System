import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import { api } from '../../api/client';
import L from 'leaflet';
import {
  X,
  Clock,
  MapPin,
  Bike,
  Store,
  Phone,
  CheckCircle2,
  Receipt,
  Star,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const STATUS_STEPS = [
  { key: 'placed', label: 'Order Placed', desc: 'Sent to restaurant kitchen' },
  { key: 'confirmed', label: 'Order Confirmed', desc: 'Kitchen accepted your order' },
  { key: 'preparing', label: 'Cooking & Preparing', desc: 'Chef is preparing your meal' },
  { key: 'ready_for_pickup', label: 'Ready for Pickup', desc: 'Dispatched to delivery partner' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider is on the way to you' },
  { key: 'delivered', label: 'Order Delivered', desc: 'Bon Appétit! Enjoy your food' }
];

export const OrderTrackingModal = ({ order: initialOrder, isOpen, onClose, onOpenReview }) => {
  const { lastEvent, subscribeToOrder } = useSocket();
  const [order, setOrder] = useState(initialOrder);
  const [driverLocation, setDriverLocation] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const driverMarkerRef = useRef(null);

  useEffect(() => {
    setOrder(initialOrder);
    if (initialOrder?.id) {
      subscribeToOrder(initialOrder.id);
      if (initialOrder.delivery) {
        setDriverLocation({
          lat: initialOrder.delivery.current_lat || 12.9716,
          lng: initialOrder.delivery.current_lng || 77.5946
        });
      }
    }
  }, [initialOrder, subscribeToOrder]);

  // Listen for socket events for this order
  useEffect(() => {
    if (!lastEvent || !order) return;

    if (
      lastEvent.type === 'order:status_changed' &&
      lastEvent.data.order?.id === order.id
    ) {
      setOrder(lastEvent.data.order);
    }

    if (
      lastEvent.type === 'delivery:assigned' &&
      lastEvent.data.orderId === order.id
    ) {
      setOrder((prev) => ({
        ...prev,
        driver_name: lastEvent.data.driverName,
        delivery: lastEvent.data.delivery
      }));
    }

    if (
      lastEvent.type === 'delivery:location_update' &&
      lastEvent.data.orderId === order.id
    ) {
      const newLoc = { lat: lastEvent.data.lat, lng: lastEvent.data.lng };
      setDriverLocation(newLoc);
      if (driverMarkerRef.current) {
        driverMarkerRef.current.setLatLng([newLoc.lat, newLoc.lng]);
      }
    }
  }, [lastEvent, order]);

  // Setup Leaflet map when out for delivery or viewing map
  useEffect(() => {
    if (!isOpen || !mapRef.current) return;

    if (!mapInstance.current) {
      // Default to Bengaluru coordinates or order coords
      const centerLat = 12.9716;
      const centerLng = 77.5946;

      const map = L.map(mapRef.current, {
        center: [centerLat, centerLng],
        zoom: 14,
        zoomControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      // Restaurant Marker
      const restIcon = L.divIcon({
        className: 'custom-rest-marker',
        html: `<div style="background:#FF5200; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 4px 10px rgba(0,0,0,0.3); font-size:16px;">🍳</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });
      L.marker([12.9780, 77.5990], { icon: restIcon })
        .addTo(map)
        .bindPopup(`<b>${order?.restaurant_name || 'Restaurant'}</b><br/>Food Pickup Hub`);

      // Customer Marker
      const custIcon = L.divIcon({
        className: 'custom-cust-marker',
        html: `<div style="background:#10B981; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 4px 10px rgba(0,0,0,0.3); font-size:16px;">🏠</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });
      L.marker([12.9660, 77.5910], { icon: custIcon })
        .addTo(map)
        .bindPopup(`<b>Your Delivery Location</b><br/>${order?.delivery_address || 'Home'}`);

      // Driver Bike Marker
      const bikeIcon = L.divIcon({
        className: 'custom-bike-marker',
        html: `<div style="background:#2563EB; width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 4px 12px rgba(37,99,235,0.4); font-size:18px;">🛵</div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      const initialDriverPos = [12.9720, 77.5950];
      const bikeMarker = L.marker(initialDriverPos, { icon: bikeIcon })
        .addTo(map)
        .bindPopup(`<b>${order?.driver_name || 'Delivery Partner'}</b><br/>En Route`);
      driverMarkerRef.current = bikeMarker;

      // Draw polyline connecting path
      L.polyline([[12.9780, 77.5990], [12.9720, 77.5950], [12.9660, 77.5910]], {
        color: '#FF5200',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.8
      }).addTo(map);

      mapInstance.current = map;
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  // Determine active step index
  const currentStatusIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const activeStep = currentStatusIndex > -1 ? currentStatusIndex : 0;
  const isDelivered = order.status === 'delivered';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#FF5200] flex items-center justify-center font-black text-sm">
              #{order.id?.slice(-4).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black text-slate-900">{order.restaurant_name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-[#FF5200]">
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Placed on {new Date(order.placed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Estimated Arrival Banner */}
          {!isDelivered ? (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-[#FF5200] text-white flex items-center justify-between shadow-md">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-200">
                  Estimated Delivery Time
                </span>
                <div className="text-xl font-black">20-25 Minutes</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                <Clock className="w-5 h-5 text-white animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500 text-white flex items-center justify-between shadow-md">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100">
                  Delivery Complete
                </span>
                <div className="text-lg font-black">Your food was delivered! Enjoy! 🎉</div>
              </div>
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
          )}

          {/* Interactive Live Map */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs relative">
            <div ref={mapRef} className="h-44 sm:h-52 w-full bg-slate-100"></div>
            <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl text-[10px] font-black tracking-wider uppercase text-slate-800 shadow-sm border border-slate-200 flex items-center space-x-1.5 z-20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Live GPS Tracking</span>
            </div>
          </div>

          {/* Real-Time Progression Steps */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Order Progress
            </span>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= activeStep;
                const isCurrent = idx === activeStep;
                return (
                  <div key={step.key} className="relative flex items-start space-x-3">
                    {/* Step Dot */}
                    <div
                      className={`absolute -left-6 top-0.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'border-[#FF5200] bg-[#FF5200] ring-4 ring-orange-100'
                          : isPassed
                          ? 'border-emerald-500 bg-emerald-500'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isPassed && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>

                    <div>
                      <div
                        className={`text-xs font-extrabold ${
                          isCurrent ? 'text-[#FF5200]' : isPassed ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </div>
                      <p className="text-[11px] text-slate-500">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assigned Driver Details Card */}
          {order.driver_name && (
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                    Delivery Partner
                  </span>
                  <div className="text-xs font-extrabold text-slate-900">{order.driver_name}</div>
                  <div className="text-[11px] text-slate-500">Verified Foodie Hero • Hero Splendor</div>
                </div>
              </div>

              <a
                href={`tel:${order.delivery?.driver_phone || '+919876543210'}`}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
            </div>
          )}

          {/* Items Summary & Invoice */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between font-black uppercase tracking-wider text-slate-700 pb-1 border-b border-slate-200">
              <span className="flex items-center space-x-1.5">
                <Receipt className="w-3.5 h-3.5 text-slate-500" />
                <span>Ordered Items ({order.items?.length || 0})</span>
              </span>
              <span>₹{Number(order.total).toFixed(2)}</span>
            </div>

            <div className="space-y-1.5 pt-1">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between text-slate-600">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-semibold">₹{(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900">
              <span>Paid via {order.payment?.payment_method?.toUpperCase() || 'CARD'}</span>
              <span className="text-emerald-600">
                {order.payment?.payment_status === 'paid' ? 'PAID ✔' : 'PAY ON DELIVERY'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
          {isDelivered && onOpenReview && (
            <button
              onClick={() => {
                onClose();
                onOpenReview(order);
              }}
              className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs hover:brightness-105 shadow-md shadow-amber-500/20 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Star className="w-4 h-4 fill-white" />
              <span>Rate & Review Food</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
          >
            Close Tracking
          </button>
        </div>
      </div>
    </div>
  );
};
