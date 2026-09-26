import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { useSocket } from './context/SocketContext';
import { customerApi } from './api/customerApi';

// Component Imports
import { Navbar } from './components/common/Navbar';
import { RestaurantList } from './components/restaurants/RestaurantList';
import { RestaurantDetail } from './components/restaurants/RestaurantDetail';
import { CartDrawer } from './components/cart/CartDrawer';
import { RestaurantMismatchModal } from './components/cart/RestaurantMismatchModal';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { LiveOrderTracker } from './components/tracking/LiveOrderTracker';
import { OrderHistoryView } from './components/orders/OrderHistoryView';
import { ReceiptModal } from './components/orders/ReceiptModal';
import { CustomerAuthModal } from './components/auth/CustomerAuthModal';
import { soundEngine } from './utils/audio';

export function AppContent() {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { liveOrderEvent } = useSocket();

  // Navigation view state: 'restaurants' | 'restaurant_detail' | 'tracking' | 'orders'
  const [view, setView] = useState('restaurants');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [trackingOrderId, setTrackingOrderId] = useState(null);
  const [activeOrderId, setActiveOrderId] = useState(null); // In-progress order for header pill

  // Data state
  const [restaurants, setRestaurants] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [receiptOrderId, setReceiptOrderId] = useState(null);

  // Fetch restaurants
  const fetchRestaurants = useCallback(async () => {
    try {
      setLoadingRestaurants(true);
      const res = await customerApi.getRestaurants({
        cuisine: selectedCuisine,
        search: searchQuery
      });
      if (res.success && res.restaurants) {
        setRestaurants(res.restaurants);
      }
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
    } finally {
      setLoadingRestaurants(false);
    }
  }, [selectedCuisine, searchQuery]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  // Check active order for current user
  const checkActiveOrders = useCallback(async () => {
    if (!user) return;
    try {
      const res = await customerApi.getOrders();
      if (res.success && res.orders) {
        const inProgress = res.orders.find(
          (o) => !['delivered', 'cancelled'].includes(o.status)
        );
        if (inProgress) {
          setActiveOrderId(inProgress.id);
        } else {
          setActiveOrderId(null);
        }
      }
    } catch (err) {
      console.error('Error checking active orders:', err);
    }
  }, [user]);

  useEffect(() => {
    checkActiveOrders();
  }, [checkActiveOrders]);

  // Synchronize on live socket events
  useEffect(() => {
    if (liveOrderEvent) {
      checkActiveOrders();
      if (liveOrderEvent.type === 'status_changed' && liveOrderEvent.order?.status === 'delivered') {
        if (activeOrderId === liveOrderEvent.order.id) {
          setActiveOrderId(null);
        }
      }
    }
  }, [liveOrderEvent, checkActiveOrders, activeOrderId]);

  // Navigation handlers
  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurantId(restaurant.id);
    setView('restaurant_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackOrder = (orderId) => {
    setTrackingOrderId(orderId);
    setView('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderPlaced = (newOrder) => {
    setActiveOrderId(newOrder.id);
    setTrackingOrderId(newOrder.id);
    setView('tracking');
  };

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onGoHome={() => {
          setView('restaurants');
          setSelectedRestaurantId(null);
        }}
        onGoOrders={() => setView('orders')}
        activeOrderId={activeOrderId}
        onTrackActiveOrder={handleTrackOrder}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {view === 'restaurants' && (
          <RestaurantList
            restaurants={restaurants}
            loading={loadingRestaurants}
            selectedCuisine={selectedCuisine}
            onSelectCuisine={setSelectedCuisine}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectRestaurant={handleSelectRestaurant}
          />
        )}

        {view === 'restaurant_detail' && (
          <RestaurantDetail
            restaurantId={selectedRestaurantId}
            onBack={() => setView('restaurants')}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {view === 'tracking' && (
          <LiveOrderTracker
            orderId={trackingOrderId || activeOrderId}
            onBack={() => setView('restaurants')}
            onViewReceipt={(order) => setReceiptOrderId(order.id)}
          />
        )}

        {view === 'orders' && (
          <OrderHistoryView
            onTrackOrder={handleTrackOrder}
            onViewReceipt={(order) => setReceiptOrderId(order.id)}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}
      </main>

      {/* Floating Bottom Cart Bar (if items in cart and cart drawer not open) */}
      {itemCount > 0 && !isCartOpen && view !== 'tracking' && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto animate-in slide-in-from-bottom duration-300">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between border border-brand-400/40 transition active:scale-98"
          >
            <div className="flex items-center space-x-2 font-black text-sm">
              <span className="w-6 h-6 rounded-full bg-white text-brand-700 flex items-center justify-center text-xs">
                {itemCount}
              </span>
              <span>View Cart & Checkout</span>
            </div>
            <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-xl">
              Tap to open
            </span>
          </button>
        </div>
      )}

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Restaurant Mismatch Conflict Modal */}
      <RestaurantMismatchModal />

      {/* Checkout & Mock Payment Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Digital Payment Receipt Modal */}
      <ReceiptModal
        isOpen={!!receiptOrderId}
        onClose={() => setReceiptOrderId(null)}
        orderId={receiptOrderId}
      />

      {/* Auth & 1-Click Demo Modal */}
      <CustomerAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
