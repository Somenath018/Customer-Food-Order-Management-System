import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useSocket } from '../../../context/SocketContext';
import { soundEngine } from '../../../utils/audio';
import { FoodieLogo } from './FoodieLogo';
import { Volume2, VolumeX, LogOut } from 'lucide-react';

export const Header = () => {
  const { driver, logout, toggleOnline } = useAuth();
  const { isConnected } = useSocket();
  const [isMuted, setIsMuted] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const isOnline = driver ? driver.is_online : true;

  const handleStatusToggle = async () => {
    try {
      setIsUpdatingStatus(true);
      await toggleOnline(!isOnline);
    } catch (err) {
      console.error('Failed to toggle status:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSoundToggle = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
    if (!next) {
      soundEngine.playNewTaskChime();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0d111a]/95 backdrop-blur-md border-b border-dark-700/80 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Connection */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <FoodieLogo size="md" />

          {/* Hub & Live Sync Badge */}
          <div className="hidden sm:flex flex-col border-l border-dark-700/80 pl-3">
            <span className="flex items-center space-x-1 text-[11px] font-semibold text-gray-300">
              <span className="text-xs">🇮🇳</span>
              <span>Koramangala Hub</span>
            </span>
            <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 mt-0.5">
              {isConnected ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 beacon-pulse-green"></span>
                  <span className="text-emerald-400 font-mono font-bold text-[10px]">LIVE SYNC</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span className="text-amber-400 font-mono font-bold text-[10px]">CONNECTING</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Status Toggle & User Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Swiggy/Zomato style ON DUTY / OFF DUTY Toggle */}
          <button
            onClick={handleStatusToggle}
            disabled={isUpdatingStatus}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full font-bold text-xs transition-all shadow-md ${
              isOnline
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30 ring-1 ring-emerald-500/20'
                : 'bg-dark-800 text-gray-400 border border-dark-600 hover:bg-dark-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-400 beacon-pulse-green' : 'bg-gray-500'
              }`}
            ></span>
            <span>{isUpdatingStatus ? 'UPDATING...' : isOnline ? 'ON DUTY' : 'OFF DUTY'}</span>
          </button>

          {/* Audio toggle */}
          <button
            onClick={handleSoundToggle}
            title={isMuted ? 'Unmute sound alerts' : 'Mute sound alerts'}
            className="p-2 rounded-lg bg-dark-800 border border-dark-700 text-gray-400 hover:text-white hover:bg-dark-700 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-rider-400" />}
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            title="Sign out"
            className="p-2 rounded-lg bg-dark-800 border border-dark-700 text-gray-400 hover:text-rose-400 hover:bg-dark-700 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

