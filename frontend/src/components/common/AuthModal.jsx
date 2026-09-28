import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FoodieLogo } from './FoodieLogo';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  Store,
  Bike,
  Shield,
  AlertCircle,
  LogOut,
  ChevronDown
} from 'lucide-react';

export const AuthModal = ({
  isOpen,
  onClose,
  initialMode = 'login',
  targetRole = null,
  onSuccess
}) => {
  const { user, login, register, logout, quickLoginAs, demoUsers } = useAuth();
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemoList, setShowDemoList] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedRole, setSelectedRole] = useState(targetRole || 'customer');

  useEffect(() => {
    setIsRegister(initialMode === 'register');
    setError('');
  }, [initialMode, isOpen]);

  useEffect(() => {
    if (targetRole) {
      setSelectedRole(targetRole);
    } else {
      setSelectedRole('customer');
    }
  }, [targetRole, isOpen]);

  if (!isOpen) return null;

  const roleLabels = {
    customer: 'Customer',
    restaurant: 'Restaurant Partner',
    driver: 'Delivery Partner',
    admin: 'Platform Admin'
  };

  const isRoleMismatch =
    user && targetRole && user.role !== targetRole && user.role !== 'admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let resultUser = null;
      if (isRegister) {
        const res = await register({
          name: name.trim(),
          email: email.trim(),
          password,
          role: selectedRole,
          phone: phone.trim(),
          address: address.trim()
        });
        resultUser = res.user;
      } else {
        const res = await login(email.trim(), password);
        resultUser = res.user;
      }

      if (onSuccess) {
        onSuccess(resultUser);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (roleKey) => {
    setError('');
    setLoading(true);
    try {
      const demoUser = await quickLoginAs(roleKey);
      if (onSuccess) {
        onSuccess(demoUser);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchAccount = () => {
    logout();
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-orange-50/70 via-white to-orange-50/40">
          <FoodieLogo size="sm" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Target Role Notification Banner */}
          {targetRole && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-200 text-xs text-orange-950 font-medium flex items-center space-x-2.5">
              <span className="p-1.5 rounded-xl bg-orange-500 text-white shrink-0">
                {targetRole === 'restaurant' && <Store className="w-4 h-4" />}
                {targetRole === 'driver' && <Bike className="w-4 h-4" />}
                {targetRole === 'admin' && <Shield className="w-4 h-4" />}
                {targetRole === 'customer' && <User className="w-4 h-4" />}
              </span>
              <div>
                <span className="font-extrabold text-orange-900 block">
                  {roleLabels[targetRole]} Authentication
                </span>
                <span className="text-[11px] text-slate-600">
                  Please sign in or create an account to access this role dashboard.
                </span>
              </div>
            </div>
          )}

          {/* Account mismatch prompt */}
          {isRoleMismatch ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
              <div className="flex items-start space-x-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700">
                  <p className="font-bold text-amber-900">
                    Different Account Active
                  </p>
                  <p className="mt-1">
                    You are currently signed in as <strong>{user.name}</strong> ({roleLabels[user.role] || user.role}).
                    To open the <strong>{roleLabels[targetRole]}</strong> portal, please sign in with a {roleLabels[targetRole]} account.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="button"
                  onClick={handleSwitchAccount}
                  className="px-4 py-2 rounded-xl bg-[#FF5200] text-white font-extrabold text-xs hover:brightness-105 transition cursor-pointer flex items-center space-x-1.5 shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign In with {roleLabels[targetRole]}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Stay as {user.name}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {isRegister ? 'Create Foodie Account' : 'Sign in to Foodie'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isRegister
                    ? 'Enter your details to create a personal account'
                    : 'Access your profile, active orders, and personalized features'}
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Main Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                {isRegister && (
                  <>
                    {/* Role Picker for Registration */}
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                        Register As
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'customer', label: 'Customer' },
                          { id: 'restaurant', label: 'Restaurant' },
                          { id: 'driver', label: 'Delivery Rider' }
                        ].map((r) => (
                          <button
                            type="button"
                            key={r.id}
                            onClick={() => setSelectedRole(r.id)}
                            className={`py-2 px-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                              selectedRole === r.id
                                ? 'bg-[#FF5200] text-white border-[#FF5200] shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                      />
                    </div>
                  </>
                )}

                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                  />
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                  />
                </div>

                {isRegister && (
                  <>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        placeholder="Phone Number (e.g. +91 98765 43210)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                      />
                    </div>

                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder={
                          selectedRole === 'restaurant'
                            ? 'Restaurant Kitchen Address'
                            : selectedRole === 'driver'
                            ? 'Rider Preferred Delivery Hub'
                            : 'Delivery Address / Area'
                        }
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF5200] via-[#FF6A1A] to-[#E23744] hover:brightness-105 text-white font-extrabold text-xs transition shadow-lg shadow-orange-500/25 cursor-pointer mt-3"
                >
                  {loading
                    ? 'Authenticating...'
                    : isRegister
                    ? `Create ${roleLabels[selectedRole] || 'Customer'} Account`
                    : `Sign In to Foodie`}
                </button>
              </form>

              {/* Mode Toggle */}
              <div className="text-center pt-2 text-xs text-slate-600">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setError('');
                  }}
                  className="font-bold text-[#FF5200] hover:underline cursor-pointer"
                >
                  {isRegister ? 'Sign In' : 'Sign Up'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
