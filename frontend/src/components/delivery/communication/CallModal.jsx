import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, ExternalLink } from 'lucide-react';
import { formatPhone } from '../../../utils/formatters';

export const CallModal = ({ isOpen, onClose, contactName, contactRole, phone }) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    let timer = null;
    if (isOpen) {
      setCallDuration(0);
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOpenDialer = () => {
    window.location.href = `tel:${phone || '1234567890'}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Active Voice Call" maxWidth="max-w-sm">
      <div className="flex flex-col items-center justify-center py-6 space-y-5 text-center">
        {/* Contact Avatar */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF5200] via-[#FC8019] to-[#E23744] flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-orange-500/30 border-4 border-dark-700">
            {contactName ? contactName.charAt(0) : 'C'}
          </div>
          <span className="absolute bottom-0 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-dark-800 flex items-center justify-center text-white">
            <Phone className="w-3 h-3" />
          </span>
        </div>

        <div>
          <h3 className="text-lg font-black text-white">{contactName || 'Customer'}</h3>
          <p className="text-xs text-[#ff7332] font-bold">{contactRole || 'Delivery Recipient'}</p>
          <p className="text-xs text-gray-400 mt-1 font-mono">{formatPhone(phone)}</p>
          <div className="text-sm font-mono font-bold text-emerald-400 mt-2 bg-emerald-500/10 px-3 py-0.5 rounded-full inline-block border border-emerald-500/20">
            {formatTimer(callDuration)}
          </div>
        </div>

        {/* Call Controls: Mute, Speaker, Dialer */}
        <div className="flex items-center justify-center space-x-4 pt-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-2xl border transition ${
              isMuted
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                : 'bg-dark-700 border-dark-600 text-gray-300 hover:text-white'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`p-3 rounded-2xl border transition ${
              isSpeaker
                ? 'bg-[#FF5200]/20 border-[#FF5200]/40 text-[#ff7332]'
                : 'bg-dark-700 border-dark-600 text-gray-300 hover:text-white'
            }`}
          >
            {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={handleOpenDialer}
            title="Open native phone dialer"
            className="p-3 rounded-2xl bg-dark-700 border border-dark-600 text-blue-400 hover:text-white transition"
          >
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>

        {/* End Call Button */}
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition shadow-lg shadow-rose-600/30"
        >
          <PhoneOff className="w-4 h-4" />
          <span>End Call</span>
        </button>
      </div>
    </Modal>
  );
};

