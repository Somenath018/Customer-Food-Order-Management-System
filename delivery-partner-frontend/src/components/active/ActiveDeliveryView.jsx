import React, { useState, useEffect } from 'react';
import { NavigationMap } from '../map/NavigationMap';
import { GpsSimulator } from '../map/GpsSimulator';
import { OrderItemChecklist } from './OrderItemChecklist';
import { CashCollectionCard } from './CashCollectionCard';
import { DeliverySuccessModal } from './DeliverySuccessModal';
import { ChatDrawer } from '../communication/ChatDrawer';
import { CallModal } from '../communication/CallModal';
import { StatusBadge } from '../common/StatusBadge';
import { deliveryApi } from '../../api/deliveryApi';
import { formatCurrency, formatDistance } from '../../utils/formatters';
import { DEFAULT_NYC_COORDS } from '../../utils/locationSimulator';
import {
  Store,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileText
} from 'lucide-react';

export const ActiveDeliveryView = ({ order, onCompleteDelivery, onRefresh }) => {
  if (!order) {
    return (
      <div className="bg-dark-800/80 border border-dark-700 rounded-2xl p-8 text-center space-y-3">
        <h4 className="font-bold text-base text-white">No Active Trip in Progress</h4>
        <p className="text-xs text-gray-400">
          Accept an available delivery task from the Tasks tab to start navigation and pickup!
        </p>
      </div>
    );
  }

  // Derive initial active stage from order status
  // Possibilities: 'heading_to_restaurant', 'at_restaurant', 'on_the_way', 'at_customer', 'delivered'
  const getInitialStage = () => {
    if (order.delivery?.delivery_status === 'picked_up' || order.status === 'out_for_delivery') {
      return 'on_the_way';
    }
    return 'heading_to_restaurant';
  };

  const [currentStage, setCurrentStage] = useState(getInitialStage);
  const [isUpdating, setIsUpdating] = useState(false);
  const [allItemsVerified, setAllItemsVerified] = useState(false);
  const [isCashCollected, setIsCashCollected] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [callModalInfo, setCallModalInfo] = useState(null); // { name, role, phone }

  // Map Coordinates State
  const [driverCoords, setDriverCoords] = useState(
    order.delivery?.current_lat
      ? { lat: order.delivery.current_lat, lng: order.delivery.current_lng }
      : DEFAULT_NYC_COORDS.driver
  );

  const restaurantCoords = {
    lat: order.restaurant?.lat || 40.7192,
    lng: order.restaurant?.lng || -73.9972
  };

  const customerCoords = {
    lat: 40.7280,
    lng: -73.9850
  };

  // Determine current navigation target
  const targetCoords =
    currentStage === 'heading_to_restaurant' || currentStage === 'at_restaurant'
      ? restaurantCoords
      : customerCoords;

  // Advance stage actions
  const handleArrivedAtRestaurant = () => {
    setCurrentStage('at_restaurant');
  };

  const handleConfirmPickup = async () => {
    try {
      setIsUpdating(true);
      await deliveryApi.updateStage(order.id, 'picked_up');
      setCurrentStage('on_the_way');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to update stage to picked_up:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleArrivedAtCustomer = async () => {
    try {
      setIsUpdating(true);
      await deliveryApi.updateStage(order.id, 'on_the_way');
      setCurrentStage('at_customer');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to update stage to on_the_way:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCompleteDelivery = async () => {
    const isCOD = order.payment?.payment_method === 'cod';
    if (isCOD && !isCashCollected) {
      alert('Please confirm that cash payment was collected from customer!');
      return;
    }

    try {
      setIsUpdating(true);
      await deliveryApi.updateStage(order.id, 'delivered');
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Failed to mark delivered:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFinishAndReturn = () => {
    setShowSuccessModal(false);
    onCompleteDelivery();
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-extrabold text-base text-white">
              Trip #{order.id?.slice(-4).toUpperCase()}
            </h3>
            <StatusBadge status={order.delivery?.delivery_status || order.status} />
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Pickup: <strong className="text-gray-200">{order.restaurant_name}</strong> ➔ Dropoff: <strong className="text-gray-200">{order.customer_name || 'Customer'}</strong>
          </p>
        </div>

        {/* Communication Quick Buttons */}
        <div className="flex items-center space-x-2">
          {/* Chat Button */}
          <button
            onClick={() => setShowChat(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-dark-700 hover:bg-dark-600 text-rider-400 text-xs font-bold border border-dark-600 transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat</span>
          </button>

          {/* Call Button */}
          <button
            onClick={() => {
              const isDropoff = currentStage === 'on_the_way' || currentStage === 'at_customer';
              setCallModalInfo({
                name: isDropoff ? (order.customer_name || 'Sarah Jenkins') : order.restaurant_name,
                role: isDropoff ? 'Customer (Dropoff)' : 'Restaurant Kitchen',
                phone: isDropoff ? order.customer_phone : order.restaurant_phone
              });
            }}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-dark-700 hover:bg-dark-600 text-emerald-400 text-xs font-bold border border-dark-600 transition"
          >
            <Phone className="w-4 h-4" />
            <span>Call</span>
          </button>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-3 sm:p-4 shadow-md">
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { id: 'heading_to_restaurant', label: '1. To Store' },
            { id: 'at_restaurant', label: '2. Verify Pickup' },
            { id: 'on_the_way', label: '3. En Route' },
            { id: 'at_customer', label: '4. Delivered' }
          ].map((step, idx) => {
            const stepOrder = ['heading_to_restaurant', 'at_restaurant', 'on_the_way', 'at_customer'];
            const currentIdx = stepOrder.indexOf(currentStage);
            const isPassed = currentIdx >= idx;
            const isCurrent = currentIdx === idx;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition mb-1 ${
                    isCurrent
                      ? 'bg-rider-500 text-white shadow-lg shadow-rider-500/40 ring-2 ring-rider-400/50'
                      : isPassed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-dark-700 text-gray-500'
                  }`}
                >
                  {idx + 1}
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-medium ${
                    isCurrent ? 'text-rider-400 font-bold' : isPassed ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* GPS Interactive Map */}
      <NavigationMap
        driverCoords={driverCoords}
        restaurantCoords={restaurantCoords}
        customerCoords={customerCoords}
        activeStage={currentStage}
        height="320px"
      />

      {/* GPS Simulation Control */}
      <GpsSimulator
        orderId={order.id}
        currentCoords={driverCoords}
        targetCoords={targetCoords}
        onLocationUpdate={setDriverCoords}
        activeStage={currentStage}
      />

      {/* Stage Detail Card */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        {/* Stage 1: Heading to Restaurant */}
        {currentStage === 'heading_to_restaurant' && (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Pickup Location
                </span>
                <h4 className="text-base font-extrabold text-white mt-0.5">
                  {order.restaurant_name || 'Restaurant Partner'}
                </h4>
                <p className="text-xs text-gray-400 mt-1 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  <span>{order.restaurant_address || '142 Mulberry Street, Little Italy, NY'}</span>
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 font-bold">
                0.8 km away
              </span>
            </div>

            <button
              onClick={handleArrivedAtRestaurant}
              className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-sm transition shadow-lg shadow-amber-500/20 active:scale-[0.98]"
            >
              <span>Arrived at Restaurant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stage 2: At Restaurant - Order Items Verification */}
        {currentStage === 'at_restaurant' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Step 2: Food Pickup Verification
              </span>
              <h4 className="text-base font-extrabold text-white mt-0.5">
                Inspect and Pack Items
              </h4>
            </div>

            <OrderItemChecklist
              items={order.items || []}
              onAllCheckedChange={setAllItemsVerified}
            />

            <button
              onClick={handleConfirmPickup}
              disabled={isUpdating}
              className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-gradient-to-r from-rider-500 to-emerald-600 hover:from-rider-600 hover:to-emerald-700 text-white font-extrabold text-sm transition shadow-lg shadow-rider-500/20 active:scale-[0.98]"
            >
              {isUpdating ? (
                <span>Confirming with Kitchen...</span>
              ) : (
                <>
                  <span>Confirm Pickup & Start Delivery</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Stage 3: On The Way to Customer */}
        {currentStage === 'on_the_way' && (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-rider-400 uppercase tracking-wider">
                  Customer Dropoff Location
                </span>
                <h4 className="text-base font-extrabold text-white mt-0.5">
                  {order.customer_name || 'Sarah Jenkins'}
                </h4>
                <p className="text-xs text-gray-300 mt-1 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-rider-400 shrink-0" />
                  <span>{order.delivery_address}</span>
                </p>
                {order.special_instructions && (
                  <div className="mt-2 text-xs bg-dark-900/80 p-2.5 rounded-xl border border-dark-700 text-amber-300">
                    <strong>Delivery Note:</strong> {order.special_instructions}
                  </div>
                )}
              </div>
              <span className="text-xs font-mono text-rider-400 bg-rider-500/10 px-2.5 py-1 rounded-xl border border-rider-500/20 font-bold">
                1.8 km away
              </span>
            </div>

            <button
              onClick={handleArrivedAtCustomer}
              disabled={isUpdating}
              className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm transition shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              <span>Arrived at Customer Door</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stage 4: At Customer - Payment Collection & Handover */}
        {currentStage === 'at_customer' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Step 4: Final Handover & Payment
              </span>
              <h4 className="text-base font-extrabold text-white mt-0.5">
                Deliver to {order.customer_name || 'Customer'}
              </h4>
            </div>

            {/* Cash on Delivery handling */}
            <CashCollectionCard
              order={order}
              isCashCollected={isCashCollected}
              onToggleCashCollected={() => setIsCashCollected(!isCashCollected)}
            />

            <button
              onClick={handleCompleteDelivery}
              disabled={isUpdating}
              className="w-full flex items-center justify-center space-x-2 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base transition shadow-xl shadow-emerald-500/30 active:scale-[0.98]"
            >
              {isUpdating ? (
                <span>Finalizing Delivery...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Mark as Delivered & Collect Payout</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* In-App Chat Modal */}
      <ChatDrawer
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        order={order}
      />

      {/* Voice Call Modal */}
      <CallModal
        isOpen={!!callModalInfo}
        onClose={() => setCallModalInfo(null)}
        contactName={callModalInfo?.name}
        contactRole={callModalInfo?.role}
        phone={callModalInfo?.phone}
      />

      {/* Delivery Success Celebration Modal */}
      <DeliverySuccessModal
        isOpen={showSuccessModal}
        order={order}
        onClose={handleFinishAndReturn}
      />
    </div>
  );
};
