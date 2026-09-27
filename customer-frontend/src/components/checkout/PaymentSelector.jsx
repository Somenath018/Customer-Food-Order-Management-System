import React, { useState } from 'react';
import { CreditCard, QrCode, Building2, Banknote, ShieldCheck, CheckCircle2 } from 'lucide-react';

const MOCK_BANKS = [
  'HDFC Bank',
  'Chase Bank',
  'Wells Fargo',
  'Bank of America',
  'CitiBank',
  'State Bank of India'
];

export const PaymentSelector = ({ paymentMethod, onSelectMethod, paymentDetails, onUpdateDetails }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-white uppercase tracking-wider">
          Payment Method
        </label>
        <span className="flex items-center space-x-1 text-[11px] text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
          <ShieldCheck className="w-3 h-3" />
          <span>Mock Simulation (No Bank Needed)</span>
        </span>
      </div>

      {/* Payment Method Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => onSelectMethod('card')}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition ${
            paymentMethod === 'card'
              ? 'bg-brand-500/20 border-brand-500 text-brand-400 shadow-sm'
              : 'bg-dark-800 border-dark-700 text-gray-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-[11px] font-bold">Credit/Debit</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectMethod('upi')}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition ${
            paymentMethod === 'upi'
              ? 'bg-brand-500/20 border-brand-500 text-brand-400 shadow-sm'
              : 'bg-dark-800 border-dark-700 text-gray-400 hover:text-white'
          }`}
        >
          <QrCode className="w-5 h-5" />
          <span className="text-[11px] font-bold">UPI / QR</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectMethod('netbanking')}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition ${
            paymentMethod === 'netbanking'
              ? 'bg-brand-500/20 border-brand-500 text-brand-400 shadow-sm'
              : 'bg-dark-800 border-dark-700 text-gray-400 hover:text-white'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span className="text-[11px] font-bold">Net Banking</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectMethod('cod')}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition ${
            paymentMethod === 'cod'
              ? 'bg-brand-500/20 border-brand-500 text-brand-400 shadow-sm'
              : 'bg-dark-800 border-dark-700 text-gray-400 hover:text-white'
          }`}
        >
          <Banknote className="w-5 h-5" />
          <span className="text-[11px] font-bold">Cash on Del.</span>
        </button>
      </div>

      {/* Method Specific Fields */}
      <div className="p-3.5 rounded-xl bg-dark-900 border border-dark-700/80 space-y-3">
        {paymentMethod === 'card' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Card Details (Mock Test Card)</span>
              <span className="text-emerald-400 text-[10px] font-mono">Instant Auto-Approve</span>
            </div>
            <div>
              <input
                type="text"
                value={paymentDetails.cardNumber || '4242 •••• •••• 4242'}
                onChange={(e) => onUpdateDetails({ cardNumber: e.target.value })}
                placeholder="4242 4242 4242 4242"
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={paymentDetails.expiry || '12/28'}
                onChange={(e) => onUpdateDetails({ expiry: e.target.value })}
                placeholder="MM/YY"
                className="bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-brand-500"
              />
              <input
                type="text"
                value={paymentDetails.cvv || '888'}
                onChange={(e) => onUpdateDetails({ cvv: e.target.value })}
                placeholder="CVV"
                maxLength={4}
                className="bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        )}

        {paymentMethod === 'upi' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>UPI ID or Scan QR Code</span>
              <span className="text-emerald-400 text-[10px]">Zero Charges</span>
            </div>
            <input
              type="text"
              value={paymentDetails.upiId || 'customer@okaxis'}
              onChange={(e) => onUpdateDetails({ upiId: e.target.value })}
              placeholder="e.g. mobile@upi"
              className="w-full bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-brand-500"
            />
            {/* Visual mock QR code placeholder */}
            <div className="p-3 bg-dark-800 rounded-xl flex items-center space-x-3 border border-dark-700">
              <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center">
                <QrCode className="w-10 h-10 text-black" />
              </div>
              <div className="text-xs text-gray-300">
                <p className="font-bold text-white">Scan with any UPI App</p>
                <p className="text-[11px] text-gray-400">GPay, PhonePe, Paytm (Mock simulator)</p>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'netbanking' && (
          <div className="space-y-2">
            <label className="text-xs text-gray-400 block">Select Mock Bank</label>
            <select
              value={paymentDetails.bankName || MOCK_BANKS[0]}
              onChange={(e) => onUpdateDetails({ bankName: e.target.value })}
              className="w-full bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
            >
              {MOCK_BANKS.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>
        )}

        {paymentMethod === 'cod' && (
          <div className="flex items-start space-x-2 text-xs text-gray-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p>
              Pay securely in cash or via mobile scanner when your rider delivers the food. No advance payment required.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
