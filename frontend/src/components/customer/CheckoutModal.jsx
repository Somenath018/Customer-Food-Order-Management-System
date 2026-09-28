import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { api } from '../../api/client';
import { sound } from '../../utils/audio';
import {
  X,
  CreditCard,
  QrCode,
  Smartphone,
  Banknote,
  Building,
  CheckCircle,
  MapPin,
  Phone,
  ShieldCheck,
  Receipt,
  Sparkles,
  Lock
} from 'lucide-react';

export const CheckoutModal = ({ isOpen, onClose, onOrderPlaced }) => {
  const { items, restaurant, subtotal, deliveryFee, tax, discount, total, specialInstructions, clearCart } = useCart();
  const { user } = useAuth();
  const { selectedAddress } = useLocation();

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi' | 'netbanking' | 'cod'
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('890');
  const [upiId, setUpiId] = useState('priya.sharma@okaxis');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 98765 43210');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || items.length === 0) return null;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      // 1. Simulate payment clearance delay (0.8s)
      await new Promise((r) => setTimeout(r, 800));

      // 2. Prepare payload matching backend createOrder controller
      const orderPayload = {
        restaurant_id: restaurant.id,
        items: items.map((i) => ({
          menu_item_id: i.id,
          name: i.name,
          price: Number(i.price),
          quantity: Number(i.quantity),
          special_notes: i.customizations?.cookingNote || specialInstructions || ''
        })),
        delivery_address: selectedAddress?.address || user?.address || 'Indiranagar, Bengaluru',
        customer_phone: customerPhone,
        special_instructions: specialInstructions || '',
        payment_method: paymentMethod,
        card_number: paymentMethod === 'card' ? cardNumber.replace(/\D/g, '') || '4242' : undefined,
        upi_id: paymentMethod === 'upi' ? upiId : undefined
      };

      const res = await api.createOrder(orderPayload);

      if (res && res.order) {
        sound.playOrderPlaced();
        clearCart();
        onClose();
        if (onOrderPlaced) {
          onOrderPlaced(res.order);
        }
      } else {
        throw new Error('Order creation failed on backend');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h3 className="text-base font-black text-slate-900">Secure Checkout</h3>
            <p className="text-xs text-slate-500 font-medium">Ordering from {restaurant?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handlePlaceOrder} className="p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold">
              {error}
            </div>
          )}

          {/* Delivery Address Review */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-[#FF5200]" />
                <span>Deliver To: {selectedAddress?.tag || 'Home'}</span>
              </span>
              <span className="text-[11px] text-[#FF5200] font-bold">Verified</span>
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              {selectedAddress?.address || 'Flat 402, Sunshine Apts, 12th Main, Indiranagar, Bengaluru'}
            </p>
            <div className="flex items-center space-x-2 pt-1 text-xs text-slate-500">
              <Phone className="w-3.5 h-3.5" />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Rider contact number"
                className="bg-white px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-800"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Select Payment Method (Mock Gateway)</span>
            </span>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, subtitle: 'Visa, Master, RuPay' },
                { id: 'upi', name: 'UPI & Instant QR', icon: QrCode, subtitle: 'GPay, PhonePe, Paytm' },
                { id: 'netbanking', name: 'Net Banking', icon: Building, subtitle: 'HDFC, ICICI, SBI' },
                { id: 'cod', name: 'Cash on Delivery', icon: Banknote, subtitle: 'Pay when delivered' }
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#FF5200] bg-orange-50/70 ring-1 ring-orange-400 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#FF5200]' : 'text-slate-500'}`} />
                      {isSelected && <span className="w-2 h-2 rounded-full bg-[#FF5200]"></span>}
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">{m.name}</div>
                      <div className="text-[10px] text-slate-400">{m.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional Payment Details */}
          {paymentMethod === 'card' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Card Information</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-black">
                  TEST MODE
                </span>
              </div>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Card Number"
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-[#FF5200]"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-[#FF5200]"
                />
                <input
                  type="password"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  placeholder="CVV"
                  maxLength={4}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-[#FF5200]"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>UPI ID / VPA</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-black">
                  Instant Approve
                </span>
              </div>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@bank"
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-[#FF5200]"
              />
              <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Simulated auto-approval will verify payment immediately.</span>
              </div>
            </div>
          )}

          {paymentMethod === 'cod' && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-800 space-y-1">
              <div className="font-bold flex items-center space-x-1.5">
                <Banknote className="w-4 h-4 text-amber-600" />
                <span>Cash on Delivery Selected</span>
              </div>
              <p className="text-[11px] text-amber-700">
                Please keep exact cash ready of <strong>₹{total.toFixed(2)}</strong> for the delivery partner upon arrival.
              </p>
            </div>
          )}

          {/* Amount Breakdown Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-100/70 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-semibold">Total Payable Amount:</span>
            <span className="text-base font-black text-[#FF5200]">₹{total.toFixed(2)}</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5200] via-[#FF6A1A] to-[#E23744] hover:brightness-105 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Securing Payment & Dispatching...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Pay ₹{total.toFixed(2)} & Place Order</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
