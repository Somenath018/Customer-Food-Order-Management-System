import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { soundEngine } from '../../utils/audio';
import { Bike, Power, Volume2, VolumeX, LogOut, Wifi, WifiOff } from 'lucide-react';

export const Header = () => {
  const { user, driver, logout, toggleOnline } = useAuth();
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
    <header className="sticky top-0 z-40 bg-dark-900/90 backdrop-blur-md border-b border-dark-700 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Connection */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rider-500/20 border border-rider-500/40 flex items-center justify-center text-rider-400 shadow-sm shadow-rider-500/20">
            <Bike className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base text-white tracking-wide">RiderPortal</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-rider-500/10 text-rider-400 border border-rider-500/30">
                Partner
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-gray-400">
              {isConnected ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-emerald-400 font-mono text-[11px]">LIVE SYNC</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span className="text-amber-400 font-mono text-[11px]">CONNECTING</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Status Toggle & User Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Online/Offline switch button */}
          <button
            onClick={handleStatusToggle}
            disabled={isUpdatingStatus}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full font-semibold text-xs transition-all shadow-sm ${
              isOnline
                ? 'bg-rider-500/20 text-rider-300 border border-rider-500/50 hover:bg-rider-500/30'
                : 'bg-dark-800 text-gray-400 border border-dark-600 hover:bg-dark-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-rider-400 beacon-pulse' : 'bg-gray-500'
              }`}
            ></span>
            <span>{isUpdatingStatus ? 'UPDATING...' : isOnline ? 'ONLINE' : 'OFFLINE'}</span>
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
