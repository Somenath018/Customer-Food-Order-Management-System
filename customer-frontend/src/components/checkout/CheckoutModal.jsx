import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { customerApi } from '../../api/customerApi';
import { soundEngine } from '../../utils/audio';
import { Modal } from '../common/Modal';
import { PaymentSelector } from './PaymentSelector';
import { formatCurrency } from '../../utils/formatters';
import {
  MapPin,
  Phone,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export const CheckoutModal = ({ isOpen, onClose, onOrderPlaced }) => {
  const { user, quickDemoLogin } = useAuth();
  const {
    restaurant,
    items,
    specialInstructions,
    subtotal,
    deliveryFee,
    tax,
    total,
    clearCart
  } = useCart();

  const [address, setAddress] = useState(user?.address || '742 Evergreen Terrace, Apt 4B, New York, NY');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 432-8765');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvv: '888',
    upiId: 'customer@okaxis',
    bankName: 'HDFC Bank'
  });

  const [loading, setLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState(null); // 'verifying' | 'charging' | 'confirming'
  const [error, setError] = useState(null);

  const handleUpdateDetails = (fields) => {
    setPaymentDetails((prev) => ({ ...prev, ...fields }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Please provide a delivery address.');
      return;
    }

    // If not logged in, prompt quick demo login
    let currentUser = user;
    if (!currentUser) {
      try {
        currentUser = await quickDemoLogin();
      } catch (err) {
        setError('Please sign in or use 1-Click Demo before placing an order.');
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      // Mock Gateway Visual Flow
      setProcessingStep('verifying');
      await new Promise((r) => setTimeout(r, 600));

      setProcessingStep('charging');
      await new Promise((r) => setTimeout(r, 600));

      const payload = {
        restaurant_id: restaurant.id,
        items: items.map((i) => ({
          menu_item_id: i.menu_item_id || i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          special_notes: i.special_notes || ''
        })),
        delivery_address: address,
        customer_phone: phone,
        special_instructions: specialInstructions || '',
        payment_method: paymentMethod,
        card_number: paymentMethod === 'card' ? paymentDetails.cardNumber.replace(/\D/g, '') || '4242424242424242' : undefined,
        upi_id: paymentMethod === 'upi' ? paymentDetails.upiId : undefined
      };

      const res = await customerApi.createOrder(payload);

      if (res.success && res.order) {
        soundEngine.playOrderPlaced();
        clearCart();
        onClose();
        onOrderPlaced(res.order);
      } else {
        throw new Error(res.message || 'Could not place order');
      }
    } catch (err) {
      console.error('Order checkout error:', err);
      setError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
      setProcessingStep(null);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Order & Mock Payment" maxWidth="max-w-lg">
      <form onSubmit={handlePlaceOrder} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* User status alert if not logged in */}
        {!user && (
          <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-brand-300">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Ordering as guest? Auto 1-Click login will be applied.</span>
            </div>
          </div>
        )}

        {/* Delivery Destination */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-white uppercase tracking-wider block">
            Delivery Details
          </label>
          <div>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-brand-400" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete delivery street address..."
                className="w-full bg-dark-900 border border-dark-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition"
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-brand-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contact phone number..."
                className="w-full bg-dark-900 border border-dark-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition"
                required
              />
            </div>
          </div>
        </div>

        {/* Mock Payment Selector */}
        <PaymentSelector
          paymentMethod={paymentMethod}
          onSelectMethod={setPaymentMethod}
          paymentDetails={paymentDetails}
          onUpdateDetails={handleUpdateDetails}
        />

        {/* Order Summary Recap */}
        <div className="p-3.5 rounded-xl bg-dark-900 border border-dark-700/80 space-y-1.5 text-xs">
          <div className="flex justify-between text-gray-400">
            <span>Restaurant</span>
            <span className="font-semibold text-white">{restaurant?.name}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Total Items</span>
            <span className="font-semibold text-white">{items.length} items</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Subtotal</span>
            <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Delivery Fee</span>
            <span className="font-semibold text-white">{formatCurrency(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Taxes & Fees</span>
            <span className="font-semibold text-white">{formatCurrency(tax)}</span>
          </div>
          <div className="border-t border-dark-700 pt-1.5 flex justify-between font-extrabold text-sm text-white">
            <span>Final Total</span>
            <span className="text-brand-400 text-base">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Submit Button & Mock Simulation Status */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-brand-500/25 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>
                {processingStep === 'verifying'
                  ? 'Verifying Mock Details...'
                  : processingStep === 'charging'
                  ? 'Clearing Mock Payment...'
                  : 'Confirming Order with Kitchen...'}
              </span>
            </div>
          ) : (
            <span>Place Order • {formatCurrency(total)}</span>
          )}
        </button>
      </form>
    </Modal>
  );
};
