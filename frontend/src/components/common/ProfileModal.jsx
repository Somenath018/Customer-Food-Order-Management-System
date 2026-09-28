import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, User, Phone, MapPin, CheckCircle, Camera } from 'lucide-react';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80'
];

export const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || AVATAR_OPTIONS[0]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setAvatarUrl(user.avatar_url || AVATAR_OPTIONS[0]);
      setError('');
      setSuccess(false);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await updateProfile({
        name,
        phone,
        address,
        avatar_url: avatarUrl
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Edit Profile</h3>
            <p className="text-xs text-slate-500">Update your personal account details</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          {success && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold">
              {error}
            </div>
          )}

          {/* Avatar Selector */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Choose Avatar
            </label>
            <div className="flex items-center space-x-2.5 overflow-x-auto pb-1">
              {AVATAR_OPTIONS.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Avatar option ${i}`}
                  onClick={() => setAvatarUrl(img)}
                  className={`w-12 h-12 rounded-2xl object-cover cursor-pointer transition border-2 ${
                    avatarUrl === img
                      ? 'border-[#FF5200] scale-110 shadow-md ring-2 ring-orange-200'
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Email Address
              </label>
              <input
                type="text"
                disabled
                value={user.email}
                className="w-full px-3 py-2.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Delivery Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Primary street address, city, pincode"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF5200] to-[#E23744] hover:brightness-105 text-white font-extrabold text-xs transition shadow-md shadow-orange-500/20 cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
