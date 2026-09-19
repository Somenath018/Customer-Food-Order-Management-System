import React, { useEffect } from 'react';
import { Modal } from '../common/Modal';
import { soundEngine } from '../../utils/audio';
import { CheckCircle, Award, DollarSign, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const DeliverySuccessModal = ({ isOpen, order, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      soundEngine.playSuccessChime();
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const baseFee = order.delivery_fee || 3.50;
  const tip = 2.00;
  const totalPayout = baseFee + tip;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delivery Completed! 🎉">
      <div className="text-center py-4 space-y-4">
        {/* Animated Celebration Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20 animate-bounce">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-white">Order Successfully Delivered!</h3>
          <p className="text-xs text-gray-400 mt-1">
            Order #{order.id?.slice(-4).toUpperCase()} delivered to {order.customer_name || 'Customer'}.
          </p>
        </div>

        {/* Payout Breakdown Card */}
        <div className="bg-dark-900/80 rounded-2xl p-4 border border-dark-700 text-left space-y-2.5">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Base Delivery Fee:</span>
            <span className="font-mono text-white">{formatCurrency(baseFee)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Customer Tip:</span>
            <span className="font-mono text-emerald-400">+{formatCurrency(tip)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>On-Time Arrival Bonus:</span>
            <span className="font-mono text-emerald-400">+Free Points ⭐</span>
          </div>
          <div className="pt-2 border-t border-dark-700 flex items-center justify-between font-bold text-sm">
            <span className="text-white">Total Credited:</span>
            <span className="text-emerald-400 font-mono text-base">{formatCurrency(totalPayout)}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rider-500 to-emerald-600 hover:from-rider-600 hover:to-emerald-700 text-white font-bold text-sm transition shadow-lg shadow-rider-500/30"
        >
          <span>Back to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Modal>
  );
};
