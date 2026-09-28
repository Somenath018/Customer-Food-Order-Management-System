import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { api } from './api/client';

// Common Components
import { Navbar } from './components/common/Navbar';
import { RoleSwitcherBanner } from './components/common/RoleSwitcherBanner';
import { Footer } from './components/common/Footer';
import { LocationModal } from './components/common/LocationModal';
import { AuthModal } from './components/common/AuthModal';
import { ProfileModal } from './components/common/ProfileModal';
import { RestaurantSelectModal } from './components/restaurant/RestaurantSelectModal';

// Customer Components
import { HeroBanner } from './components/customer/HeroBanner';
import { CategorySlider } from './components/customer/CategorySlider';
import { CategoryDishesSection } from './components/customer/CategoryDishesSection';
import { FilterBar } from './components/customer/FilterBar';
import { RestaurantCard } from './components/customer/RestaurantCard';
import { RestaurantDetailView } from './components/customer/RestaurantDetailView';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { OrderTrackingModal } from './components/customer/OrderTrackingModal';
import { OrderHistoryView } from './components/customer/OrderHistoryView';
import { ReviewModal } from './components/customer/ReviewModal';

// Role Dashboards
import { RestaurantDashboard } from './components/restaurant/RestaurantDashboard';
import { DeliveryDashboard } from './components/delivery/DeliveryDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

export function AppContent() {
  const { user, role, loading: authLoading } = useAuth();

  // Navigation & View state - Foodie opens on the Customer page ('home') by default
  const [activeView, setActiveView] = useState('home'); // 'home' | 'restaurant-detail' | 'orders' | 'restaurant' | 'admin' | 'driver'
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [pureVeg, setPureVeg] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(false);
  const [fastDelivery, setFastDelivery] = useState(false);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  // Restaurant Data
  const [restaurants, setRestaurants] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);

  // Modals state
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTargetRole, setAuthTargetRole] = useState(null);
  const [isRestaurantSelectOpen, setIsRestaurantSelectOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);
  const [reviewingOrder, setReviewingOrder] = useState(null);

  // Sync active view based on user role when switching
  useEffect(() => {
    if (role === 'restaurant') {
      setActiveView('restaurant');
    } else if (role === 'admin') {
      setActiveView('admin');
    } else if (role === 'driver') {
      setActiveView('driver');
    } else if (role === 'customer' || role === 'guest') {
      if (activeView === 'restaurant' || activeView === 'admin' || activeView === 'driver') {
        setActiveView('home');
      }
    }
  }, [role]);

  // Fetch restaurants matching selected category/cuisine and search
  const fetchRestaurants = useCallback(async () => {
    try {
      setLoadingRestaurants(true);
      const res = await api.getRestaurants({
        cuisine: selectedCategory,
        search: searchQuery,
        onlyOpen
      });
      if (res && res.restaurants) {
        setRestaurants(res.restaurants);
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoadingRestaurants(false);
    }
  }, [selectedCategory, searchQuery, onlyOpen]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  // Apply frontend filters & sorting
  const processedRestaurants = restaurants
    .filter((r) => {
      if (ratingFilter && Number(r.rating) < 4.0) return false;
      if (fastDelivery && Number(r.delivery_time_mins) > 30) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'delivery_time') return a.delivery_time_mins - b.delivery_time_mins;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'cost_asc') return a.delivery_fee - b.delivery_fee;
      if (sortBy === 'cost_desc') return b.delivery_fee - a.delivery_fee;
      return 0;
    });

  const handleOpenRestaurant = (id) => {
    setSelectedRestaurantId(id);
    setActiveView('restaurant-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToRestaurants = () => {
    setSelectedRestaurantId(null);
    setActiveView('home');
  };

  const handleOrderPlaced = (newOrder) => {
    setActiveTrackingOrder(newOrder);
  };

  // Normal Role Navigation with Authentication Verification
  const handleRoleSelect = (targetRole) => {
    if (targetRole === 'customer') {
      setActiveView('home');
      setSelectedRestaurantId(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetRole === 'restaurant') {
      if (user && user.role === 'restaurant') {
        setActiveView('restaurant');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setIsRestaurantSelectOpen(true);
      }
      return;
    }

    if (targetRole === 'driver') {
      if (user && (user.role === 'driver' || user.role === 'admin')) {
        setActiveView('driver');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setAuthTargetRole('driver');
        setIsAuthOpen(true);
      }
      return;
    }

    if (targetRole === 'admin') {
      if (user && user.role === 'admin') {
        setActiveView('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setAuthTargetRole('admin');
        setIsAuthOpen(true);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#FF5200] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-black text-slate-700 tracking-wider">Loading Foodie...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Normal Role Navigation Banner (Customer, Restaurant Partner, Delivery Partner) */}
      <RoleSwitcherBanner
        activeView={activeView}
        onSelectRole={handleRoleSelect}
      />

      {/* Main Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeView={activeView}
        onViewChange={(v) => {
          if (v === 'restaurant' || v === 'driver' || v === 'admin') {
            handleRoleSelect(v);
          } else {
            setActiveView(v);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenAuth={() => {
          setAuthTargetRole(null);
          setIsAuthOpen(true);
        }}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenLocation={() => setIsLocationOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        {/* VIEW 1: CUSTOMER RESTAURANTS & FOOD EXPLORER (DEFAULT) */}
        {activeView === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-in fade-in duration-200">
            {/* Hero Promotion Banner */}
            <HeroBanner onCategoryClick={(cat) => setSelectedCategory(cat)} />

            {/* Food Categories Horizontal Slider */}
            <CategorySlider
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />

            {/* Actual Menu Food Items For Selected Category */}
            <CategoryDishesSection
              selectedCategory={selectedCategory}
              onSelectRestaurant={handleOpenRestaurant}
            />

            {/* Filter and Sort Bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between pb-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {selectedCategory === 'All'
                      ? 'Top Restaurant Chains Near You'
                      : `Top ${selectedCategory === 'Rolls' ? 'Rolls & Wraps' : selectedCategory === 'Beverages' ? 'Shakes & Chai' : selectedCategory === 'Healthy' ? 'Healthy Bowls' : selectedCategory} Kitchens`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Showing {processedRestaurants.length} verified kitchens in Bengaluru
                  </p>
                </div>
              </div>

              <FilterBar
                pureVeg={pureVeg}
                setPureVeg={setPureVeg}
                ratingFilter={ratingFilter}
                setRatingFilter={setRatingFilter}
                fastDelivery={fastDelivery}
                setFastDelivery={setFastDelivery}
                onlyOpen={onlyOpen}
                setOnlyOpen={setOnlyOpen}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </div>

            {/* Restaurant Cards Grid */}
            {loadingRestaurants ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-4 border-[#FF5200] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-bold text-slate-600">Finding delicious restaurants...</span>
              </div>
            ) : processedRestaurants.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-orange-100 text-[#FF5200] flex items-center justify-center font-black">
                  🍴
                </div>
                <h4 className="text-base font-black text-slate-900">No restaurants match your filters</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing your search terms or relaxing rating & pure veg criteria.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setPureVeg(false);
                    setRatingFilter(false);
                    setFastDelivery(false);
                    setOnlyOpen(false);
                  }}
                  className="mt-2 px-5 py-2 rounded-2xl bg-[#FF5200] text-white font-extrabold text-xs hover:brightness-105 shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onClick={() => handleOpenRestaurant(restaurant.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: RESTAURANT DETAIL & MENU VIEW */}
        {activeView === 'restaurant-detail' && (
          <RestaurantDetailView
            restaurantId={selectedRestaurantId}
            onBack={handleBackToRestaurants}
          />
        )}

        {/* VIEW 3: CUSTOMER ORDER HISTORY */}
        {activeView === 'orders' && (
          <OrderHistoryView
            onTrackOrder={(ord) => setActiveTrackingOrder(ord)}
            onOpenReview={(ord) => setReviewingOrder(ord)}
            onGoToRestaurants={handleBackToRestaurants}
          />
        )}

        {/* VIEW 4: RESTAURANT PARTNER PORTAL */}
        {activeView === 'restaurant' && (
          <RestaurantDashboard onBackToCustomer={() => setActiveView('home')} />
        )}

        {/* VIEW 5: PLATFORM ADMIN CONSOLE (SEPARATE ADMIN DASHBOARD) */}
        {activeView === 'admin' && (
          <AdminDashboard onBackToCustomer={() => setActiveView('home')} />
        )}

        {/* VIEW 6: DELIVERY PARTNER EMBEDDED DASHBOARD */}
        {activeView === 'driver' && (
          <DeliveryDashboard onBackToCustomer={() => setActiveView('home')} />
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onOpenAuth={() => {
          setAuthTargetRole('customer');
          setIsAuthOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Real-Time Live Order Tracking Modal */}
      <OrderTrackingModal
        order={activeTrackingOrder}
        isOpen={!!activeTrackingOrder}
        onClose={() => setActiveTrackingOrder(null)}
        onOpenReview={(ord) => setReviewingOrder(ord)}
      />

      {/* Feedback / Review Modal */}
      <ReviewModal
        order={reviewingOrder}
        isOpen={!!reviewingOrder}
        onClose={() => setReviewingOrder(null)}
        onFeedbackSubmitted={() => {
          fetchRestaurants();
        }}
      />

      {/* Location Picker Modal */}
      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
      />

      {/* Proper Login / Register Auth Modal with Multiple Account Support */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setAuthTargetRole(null);
        }}
        targetRole={authTargetRole}
        onSuccess={(authUser) => {
          if (authTargetRole === 'restaurant' || authUser?.role === 'restaurant') {
            setActiveView('restaurant');
          } else if (authTargetRole === 'driver' || authUser?.role === 'driver') {
            setActiveView('driver');
          } else if (authTargetRole === 'admin' || authUser?.role === 'admin') {
            setActiveView('admin');
          } else {
            setActiveView('home');
          }
          setAuthTargetRole(null);
        }}
      />

      {/* Restaurant Selection & Private PIN Verification Modal */}
      <RestaurantSelectModal
        isOpen={isRestaurantSelectOpen}
        onClose={() => setIsRestaurantSelectOpen(false)}
        onSuccess={(authenticatedUser, rest) => {
          setActiveView('restaurant');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Edit Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

// Wrap with all necessary Providers
export default function App() {
  return <AppContent />;
}
