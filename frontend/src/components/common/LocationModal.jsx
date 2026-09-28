import React, { useState } from 'react';
import { useLocation } from '../../context/LocationContext';
import { MapPin, Navigation, Home, Briefcase, Plus, Check, X, Building } from 'lucide-react';

export const LocationModal = ({ isOpen, onClose }) => {
  const { selectedAddress, savedAddresses, selectAddress, addAddress, detectLocation, isDetecting } = useLocation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newTag, setNewTag] = useState('Home');

  if (!isOpen) return null;

  const handleAddNew = (e) => {
    e.preventDefault();
    if (!newAddress.trim()) return;
    addAddress({
      type: newTag,
      tag: newTag,
      title: newTitle || `${newTag} Address`,
      address: newAddress,
      landmark: newLandmark,
      phone: '+91 98765 43210'
    });
    setShowAddForm(false);
    setNewTitle('');
    setNewAddress('');
    setNewLandmark('');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Home':
        return <Home className="w-4 h-4 text-orange-500" />;
      case 'Work':
        return <Briefcase className="w-4 h-4 text-blue-500" />;
      default:
        return <Building className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-orange-100 text-[#FF5200] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Select Delivery Location</h3>
              <p className="text-xs text-slate-500">Pick where you want your delicious food delivered</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* GPS Auto Detect Button */}
          <button
            onClick={detectLocation}
            disabled={isDetecting}
            className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-orange-200 bg-orange-50/70 hover:bg-orange-100/70 text-slate-900 transition group cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF5200] text-white flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
                <Navigation className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
              </div>
              <div className="text-left">
                <div className="text-xs font-black uppercase tracking-wider text-[#FF5200]">
                  {isDetecting ? 'Detecting GPS...' : 'Use Current Location'}
                </div>
                <div className="text-xs font-semibold text-slate-700">Using Device GPS / Browser</div>
              </div>
            </div>
            <span className="text-xs font-bold text-[#FF5200] group-hover:underline">Detect</span>
          </button>

          {/* Saved Addresses Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">Saved Addresses</span>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs font-bold text-[#FF5200] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddForm ? 'Cancel' : 'Add New'}</span>
              </button>
            </div>

            {/* Add Address Form */}
            {showAddForm && (
              <form onSubmit={handleAddNew} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800">Add New Delivery Address</div>
                <div className="flex space-x-2">
                  {['Home', 'Work', 'Other'].map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setNewTag(t)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                        newTag === t
                          ? 'bg-[#FF5200] text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Address Title (e.g. My Flat, Mom's Place)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                />
                <textarea
                  placeholder="Complete Address (House/Flat No, Apartment/Street, Area, City, Pincode)"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  required
                  rows={2}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                />
                <input
                  type="text"
                  placeholder="Nearby Landmark (Optional)"
                  value={newLandmark}
                  onChange={(e) => setNewLandmark(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF5200] to-[#E23744] hover:brightness-105 text-white font-bold text-xs transition shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  Save & Deliver Here
                </button>
              </form>
            )}

            {/* List of Saved Addresses */}
            <div className="space-y-2">
              {savedAddresses.map((addr) => {
                const isSelected = selectedAddress?.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => selectAddress(addr)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between ${
                      isSelected
                        ? 'border-[#FF5200] bg-orange-50/50 shadow-md ring-1 ring-orange-400'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-xl bg-slate-100 text-slate-700 mt-0.5">
                        {getIcon(addr.type)}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-extrabold text-slate-900">{addr.title}</span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                            {addr.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-snug line-clamp-2">{addr.address}</p>
                        {addr.landmark && (
                          <p className="text-[11px] text-slate-400">Landmark: {addr.landmark}</p>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="p-1 rounded-full bg-[#FF5200] text-white shrink-0 mt-1">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
