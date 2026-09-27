import React from 'react';
import { useCart } from '../../context/CartContext';
import { Modal } from '../common/Modal';
import { AlertTriangle, Trash2, ArrowRight } from 'lucide-react';

export const RestaurantMismatchModal = () => {
  const { conflictModal, confirmSwitchRestaurant, dismissConflict, restaurant } = useCart();

  if (!conflictModal.isOpen) return null;

  return (
    <Modal
      isOpen={conflictModal.isOpen}
      onClose={dismissConflict}
      title="Replace Cart Items?"
      maxWidth="max-w-sm"
    >
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Your cart contains items from <strong className="text-white">{restaurant?.name}</strong>.
            Do you want to discard your current cart and start a new order from{' '}
            <strong className="text-brand-400">{conflictModal.pendingRestaurant?.name}</strong>?
          </p>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <button
            type="button"
            onClick={dismissConflict}
            className="flex-1 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-gray-300 font-semibold text-xs border border-dark-700 transition"
          >
            Keep Existing
          </button>
          <button
            type="button"
            onClick={confirmSwitchRestaurant}
            className="flex-1 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition shadow-md shadow-brand-500/20 flex items-center justify-center space-x-1"
          >
            <span>Start Fresh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
