import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  User,
  Bike,
  ShieldCheck,
  Star,
  Clock,
  CheckCircle2,
  FileCheck,
  Phone,
  Mail,
  LogOut,
  Sparkles,
  Edit3,
  X,
  Save,
  Check
} from 'lucide-react';
import { formatPhone } from '../../../utils/formatters';

export const ProfileView = () => {
  const { user, driver, updateProfile, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || driver?.name || 'Arjun Kumar',
    phone: user?.phone || driver?.phone || '+91 98765 43210',
    vehicle_type: driver?.vehicle_type || 'Hero Splendor Plus (Petrol / 125cc)',
    address: user?.address || 'Koramangala 4th Block, Bengaluru, Karnataka 560034'
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  const riderName = user?.name || driver?.name || 'Arjun Kumar';
  const riderEmail = user?.email || 'driver@foodsystem.com';
  const riderPhone = user?.phone || driver?.phone || '+91 98765 43210';
  const vehicleType = driver?.vehicle_type || formData.vehicle_type;
  const rating = driver?.rating || 4.92;
  const totalTrips = driver?.total_deliveries || 384;

  const documents = [
    { name: 'Aadhaar Card (UIDAI Verified)', status: 'Verified', date: 'UID: •••• 8912' },
    { name: 'Indian Driving License (MCWG & LMV)', status: 'Verified', date: 'Valid: 2032' },
    { name: 'Vehicle RC & Pollution Certificate (PUC)', status: 'Verified', date: 'Valid: 2027' },
    { name: 'Foodie Thermal Bag & Uniform Kit', status: 'Inspected', date: 'Approved' }
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaveSuccess(false);

    try {
      if (updateProfile) {
        await updateProfile({
          name: formData.name,
          phone: formData.phone,
          vehicle_type: formData.vehicle_type,
          address: formData.address
        });
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditing(false);
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to update rider profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Profile Header Card */}
      <div className="bg-[#121622] border border-dark-700 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
          {/* Avatar */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80"
              alt={riderName}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-[#FF5200] shadow-xl shadow-orange-500/20"
            />
            <span className="absolute -bottom-1 -right-1 bg-[#FF5200] text-white p-1 rounded-full border-2 border-dark-800 shadow">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>

          {/* Details */}
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <h3 className="text-xl font-extrabold text-white">{riderName}</h3>
                <span className="text-sm">🇮🇳</span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-[#ff7332] border border-[#FF5200]/40">
                  <Sparkles className="w-3 h-3 text-[#FF5200]" />
                  <span>Foodie Super Star</span>
                </span>
              </div>

              {/* Edit Profile Trigger */}
              <button
                onClick={() => {
                  setFormData({
                    name: riderName,
                    phone: riderPhone,
                    vehicle_type: vehicleType,
                    address: user?.address || 'Koramangala 4th Block, Bengaluru, Karnataka'
                  });
                  setIsEditing(true);
                }}
                className="flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#FF5200]/20 hover:bg-[#FF5200]/30 text-[#ff7332] border border-[#FF5200]/40 text-xs font-bold transition cursor-pointer mx-auto sm:mx-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="space-y-1 text-xs text-gray-400 pt-1">
              <p className="flex items-center justify-center sm:justify-start space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-500" />
                <span>{riderEmail}</span>
              </p>
              <p className="flex items-center justify-center sm:justify-start space-x-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-gray-500" />
                <span>{formatPhone(riderPhone)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-dark-700/80 text-center">
          <div className="p-2 bg-dark-900/60 rounded-xl border border-dark-700/60">
            <div className="flex items-center justify-center space-x-1 text-amber-400 font-extrabold text-base">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{rating}</span>
            </div>
            <div className="text-[10px] text-gray-400 uppercase font-medium mt-0.5">Rating</div>
          </div>

          <div className="p-2 bg-dark-900/60 rounded-xl border border-dark-700/60">
            <div className="text-emerald-400 font-extrabold text-base">98.4%</div>
            <div className="text-[10px] text-gray-400 uppercase font-medium mt-0.5">On-Time</div>
          </div>

          <div className="p-2 bg-dark-900/60 rounded-xl border border-dark-700/60">
            <div className="text-blue-400 font-extrabold text-base">{totalTrips}</div>
            <div className="text-[10px] text-gray-400 uppercase font-medium mt-0.5">Total Trips</div>
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-4 sm:p-5 shadow space-y-3">
        <h4 className="font-bold text-sm text-white flex items-center space-x-2">
          <Bike className="w-4 h-4 text-rider-400" />
          <span>Registered Delivery Vehicle</span>
        </h4>
        <div className="p-3 rounded-xl bg-dark-900/60 border border-dark-700 flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-white">{vehicleType}</div>
            <div className="text-gray-400 text-[11px] mt-0.5">Reg Plate: KA-01-EQ-5489 (Bengaluru Central RTO)</div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[11px]">
            ACTIVE
          </span>
        </div>
      </div>

      {/* Verified Partner Documents */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-4 sm:p-5 shadow space-y-3">
        <h4 className="font-bold text-sm text-white flex items-center space-x-2">
          <FileCheck className="w-4 h-4 text-rider-400" />
          <span>Compliance & Verified Documents</span>
        </h4>
        <div className="space-y-2">
          {documents.map((doc, i) => (
            <div
              key={i}
              className="p-2.5 rounded-xl bg-dark-900/60 border border-dark-700/80 flex items-center justify-between text-xs"
            >
              <div className="flex items-center space-x-2 text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{doc.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-gray-500">{doc.date}</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 font-bold text-[10px]">
                  {doc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-rose-600/15 hover:bg-rose-600/25 text-rose-400 border border-rose-500/30 font-bold text-xs transition cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out from Rider Portal</span>
      </button>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#121622] border border-dark-700 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col">
            <div className="p-5 border-b border-dark-700 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white">Edit Partner Profile</h3>
                <p className="text-xs text-gray-400">Update your rider contact and vehicle info</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-dark-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              {saveSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>Profile updated successfully in Central Fleet!</span>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold">
                  {error}
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-dark-900 rounded-2xl border border-dark-700 text-white text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2.5 bg-dark-900 rounded-2xl border border-dark-700 text-white text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Registered Vehicle Model
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hero Splendor, Honda Activa, Ather 450X"
                  value={formData.vehicle_type}
                  onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                  className="w-full px-3 py-2.5 bg-dark-900 rounded-2xl border border-dark-700 text-white text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Primary Delivery Hub Address
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-900 rounded-2xl border border-dark-700 text-white text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                />
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 rounded-2xl border border-dark-700 text-gray-300 hover:bg-dark-800 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF5200] to-[#E23744] hover:brightness-110 text-white font-black text-xs transition shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

