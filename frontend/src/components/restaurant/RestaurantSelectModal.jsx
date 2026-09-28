import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import {
  X,
  Store,
  Lock,
  ArrowRight,
  ArrowLeft,
  Search,
  Star,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const RestaurantSelectModal = ({ isOpen, onClose, onSuccess }) => {
  const { restaurantLogin, user } = useAuth();

  const [restaurants, setRestaurants] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [pin, setPin] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [error, setError] = useState('');

  // Fetch the 10 existing restaurants
  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setPin('');
    setSelectedRestaurant(null);
    setSearchFilter('');

    const fetchRestaurants = async () => {
      try {
        setLoadingRestaurants(true);
        const res = await api.getRestaurants();
        if (res && res.restaurants) {
          setRestaurants(res.restaurants);
        }
      } catch (err) {
        console.error('Failed to load restaurants list:', err);
      } finally {
        setLoadingRestaurants(false);
      }
    };

    fetchRestaurants();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectRestaurant = (rest) => {
    setSelectedRestaurant(rest);
    setPin('');
    setError('');
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Please enter the private manager PIN or password.');
      return;
    }

    try {
      setLoadingAuth(true);
      setError('');
      const res = await restaurantLogin(selectedRestaurant.id, pin.trim());
      if (onSuccess) {
        onSuccess(res.user, selectedRestaurant);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Incorrect manager PIN/password. Access denied.');
    } finally {
      setLoadingAuth(false);
    }
  };

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (r.cuisine && r.cuisine.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-orange-50/80 via-white to-amber-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FF5200] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                {selectedRestaurant ? 'Restaurant Partner Verification' : 'Select Your Restaurant'}
              </h3>
              <p className="text-xs text-slate-500">
                {selectedRestaurant
                  ? 'Enter private credentials to open your kitchen console'
                  : 'Choose from the 10 verified partner kitchens in Foodie'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Select Restaurant */}
          {!selectedRestaurant ? (
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search among 10 existing restaurants..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-2xl text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:bg-white focus:border-[#FF5200] outline-none transition"
                />
              </div>

              {/* Restaurants Grid */}
              {loadingRestaurants ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-500">
                  <div className="w-8 h-8 border-3 border-[#FF5200] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-bold">Loading kitchens...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[55vh] overflow-y-auto pr-1">
                  {filteredRestaurants.map((rest) => (
                    <button
                      key={rest.id}
                      onClick={() => handleSelectRestaurant(rest)}
                      className="p-3 rounded-2xl bg-white hover:bg-orange-50/60 border border-slate-200 hover:border-orange-300 transition text-left flex items-start space-x-3 cursor-pointer group shadow-xs hover:shadow-md"
                    >
                      <img
                        src={rest.image_url}
                        alt={rest.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black text-slate-900 group-hover:text-[#FF5200] transition-colors truncate">
                          {rest.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{rest.cuisine}</p>
                        <div className="flex items-center space-x-2 mt-1.5 text-[10px]">
                          <span className="flex items-center text-emerald-600 font-black">
                            <Star className="w-3 h-3 fill-emerald-600 mr-0.5" />
                            {rest.rating}
                          </span>
                          <span className="text-slate-400 truncate">• {rest.address.split(',')[1] || rest.address}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#FF5200] shrink-0 self-center transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* STEP 2: Enter Private PIN / Password */
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={() => {
                  setSelectedRestaurant(null);
                  setError('');
                  setPin('');
                }}
                className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Choose another restaurant</span>
              </button>

              {/* Selected Restaurant Profile Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center space-x-3.5">
                <img
                  src={selectedRestaurant.image_url}
                  alt={selectedRestaurant.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5200]">
                    Selected Partner Kitchen
                  </span>
                  <h4 className="text-sm font-black text-slate-900">{selectedRestaurant.name}</h4>
                  <p className="text-xs text-slate-500">{selectedRestaurant.address}</p>
                </div>
              </div>

              {/* PIN / Password Form */}
              <form onSubmit={handlePinSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Enter Private Owner / Manager Password or PIN
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      placeholder="e.g. 1001 or manager password"
                      autoFocus
                      required
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#FF5200] focus:border-transparent outline-none transition font-mono tracking-wider"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Each restaurant's dashboard is securely protected and isolated to authorized personnel.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loadingAuth}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF5200] via-[#FF6A1A] to-[#E23744] hover:brightness-105 text-white font-extrabold text-xs transition shadow-lg shadow-orange-500/25 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{loadingAuth ? 'Verifying PIN...' : `Open ${selectedRestaurant.name} Dashboard`}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantSelectModal;
