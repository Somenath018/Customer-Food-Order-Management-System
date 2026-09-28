import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { FoodieLogo } from '../../common/FoodieLogo';
import { KeyRound, Mail, ArrowRight, ShieldCheck, Zap, AlertCircle } from 'lucide-react';

export const LoginView = () => {
  const { login, quickDemoLogin, error: authError } = useAuth();
  const [email, setEmail] = useState('driver@foodsystem.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setLocalError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLocalError(null);
    setIsDemoLoading(true);
    try {
      await quickDemoLogin();
    } catch (err) {
      setLocalError(err.message || 'Demo login failed');
    } finally {
      setIsDemoLoading(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0d14] relative overflow-hidden">
      {/* Warm Foodie glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#FF5200]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#E23744]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#121622] border border-dark-700 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2.5">
          <FoodieLogo size="lg" />
          <h1 className="text-xl font-black text-white tracking-tight mt-1">
            Delivery Partner Portal
          </h1>
          <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
            Delivering happiness across India. Sign in to start receiving food orders & instant daily payouts.
          </p>
        </div>

        {/* 1-Click Quick Demo Login Button - Indian Partner Arjun Kumar */}
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isDemoLoading || isLoading}
          className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FF5200] via-[#FC8019] to-[#E23744] hover:brightness-110 text-white font-extrabold text-sm transition shadow-xl shadow-orange-500/25 active:scale-[0.98]"
        >
          {isDemoLoading ? (
            <span className="flex items-center space-x-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Authenticating Arjun Kumar...</span>
            </span>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-white text-white" />
              <span>1-Click Demo Login (Arjun Kumar • Top Partner)</span>
            </>
          )}
        </button>

        <div className="flex items-center w-full gap-3">
  <div className="flex-1 border-t border-dark-700"></div>

  <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold whitespace-nowrap">
    Or sign in with email
  </span>

  <div className="flex-1 border-t border-dark-700"></div>
</div>

        {/* Error Alert */}
        {displayError && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-3.5 text-xs text-rose-300 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{displayError}</span>
          </div>
        )}

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Rider Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="driver@foodsystem.com"
                className="w-full bg-dark-900 border border-dark-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-rider-500 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-dark-900 border border-dark-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-rider-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isDemoLoading}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-dark-700 hover:bg-dark-600 text-white font-bold text-xs transition border border-dark-600"
          >
            {isLoading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] text-gray-500 flex items-center justify-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FF5200]" />
          <span>Aadhaar Verified • Instant UPI Payouts • 24/7 Support</span>
        </div>
      </div>
    </div>
  );
};

