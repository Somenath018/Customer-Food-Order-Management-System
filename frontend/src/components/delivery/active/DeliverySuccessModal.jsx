import React, { useEffect } from 'react';
import { Modal } from '../common/Modal';
import { soundEngine } from '../../../utils/audio';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

export const DeliverySuccessModal = ({ isOpen, order, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      soundEngine.playSuccessChime();
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const rawBase = order.delivery_fee || 3.50;
  const baseFee = rawBase < 15 ? Math.round(rawBase * 18) : rawBase;
  const tip = 30.00;
  const surgeBonus = 15.00;
  const totalPayout = baseFee + tip + surgeBonus;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Trip Completed! 🎉">
      <div className="text-center py-4 space-y-4">
        {/* Animated Celebration Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/30 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20 animate-bounce">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div>
          <h3 className="text-xl font-black text-white">Order Successfully Delivered!</h3>
          <p className="text-xs text-gray-400 mt-1">
            Order #{order.id?.slice(-4).toUpperCase()} delivered to {order.customer_name || 'Customer'}.
          </p>
        </div>

        {/* Payout Breakdown Card */}
        <div className="bg-dark-900/90 rounded-2xl p-4 border border-dark-700 text-left space-y-2.5">
          <div className="flex items-center justify-between text-xs text-gray-300">
            <span>Trip Base Pay:</span>
            <span className="font-mono text-white font-bold">{formatCurrency(baseFee)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-300">
            <span>Customer UPI Tip:</span>
            <span className="font-mono text-emerald-400 font-bold">+{formatCurrency(tip)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-300">
            <span>Koramangala Surge Bonus:</span>
            <span className="font-mono text-emerald-400 font-bold">+{formatCurrency(surgeBonus)}</span>
          </div>
          <div className="pt-2 border-t border-dark-700 flex items-center justify-between font-bold text-sm">
            <span className="text-white">Credited to Foodie Wallet:</span>
            <span className="text-emerald-400 font-mono text-lg font-black">{formatCurrency(totalPayout)}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FF5200] via-[#FC8019] to-[#E23744] hover:brightness-110 text-white font-black text-sm transition shadow-lg shadow-orange-500/25 cursor-pointer"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Modal>
  );
};

