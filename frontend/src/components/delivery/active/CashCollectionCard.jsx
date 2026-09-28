import React, { useState } from 'react';
import { Banknote, QrCode, CheckCircle2, Smartphone } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

export const CashCollectionCard = ({ order, isCashCollected, onToggleCashCollected }) => {
  const [collectionMethod, setCollectionMethod] = useState('cash'); // 'cash' | 'upi'
  const isCOD = order?.payment?.payment_method === 'cod';

  // Realistic Indian total
  const rawTotal = order?.total || 340;
  const totalAmount = rawTotal < 100 ? Math.round(rawTotal * 16) : rawTotal;

  if (!isCOD) {
    return (
      <div className="bg-[#121622] border border-dark-700/80 rounded-2xl p-4 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-gray-300">
            Payment Method: <strong className="text-white">Prepaid Online (UPI / Card)</strong>
          </span>
        </div>
        <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          PAID ONLINE (₹0 DUE)
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#FF5200]/15 via-[#1a202e] to-[#121622] border-2 border-[#FF5200]/50 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-r from-[#FF5200] to-[#E23744] text-white shadow">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-black text-sm text-white uppercase tracking-wide">
              Payment Due at Doorstep
            </h4>
            <span className="text-[11px] text-gray-400">Cash on Delivery (COD) or UPI</span>
          </div>
        </div>
        <span className="text-xl font-black text-[#ff7332] font-mono">
          {formatCurrency(totalAmount)}
        </span>
      </div>

      {/* Switch between Cash vs Customer UPI QR */}
      <div className="flex rounded-xl bg-dark-900/80 p-1 border border-dark-700 text-xs font-bold">
        <button
          type="button"
          onClick={() => setCollectionMethod('cash')}
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center space-x-1.5 transition ${
            collectionMethod === 'cash'
              ? 'bg-[#FF5200] text-white shadow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Banknote className="w-3.5 h-3.5" />
          <span>Cash in Hand</span>
        </button>
        <button
          type="button"
          onClick={() => setCollectionMethod('upi')}
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center space-x-1.5 transition ${
            collectionMethod === 'upi'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Customer UPI (GPay / PhonePe)</span>
        </button>
      </div>

      {collectionMethod === 'upi' ? (
        <div className="bg-dark-900/90 rounded-2xl p-3 border border-dark-700 text-center space-y-2">
          <div className="w-24 h-24 mx-auto bg-white rounded-xl p-1.5 shadow flex items-center justify-center">
            {/* Mock Indian UPI QR Code graphic */}
            <div className="w-full h-full bg-dark-900 rounded-lg flex flex-col items-center justify-center text-white text-[9px] font-mono">
              <QrCode className="w-12 h-12 text-[#FF5200]" />
              <span className="text-[8px] font-bold text-gray-300">FOODIE UPI</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-300">
            Ask customer to scan with <strong className="text-white">GPay, PhonePe, or Paytm</strong> for <strong>{formatCurrency(totalAmount)}</strong>
          </p>
        </div>
      ) : (
        <p className="text-xs text-amber-200/90 leading-relaxed bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
          Please collect exactly <strong>{formatCurrency(totalAmount)}</strong> in cash before handing over the food parcel.
        </p>
      )}

      <div
        onClick={onToggleCashCollected}
        className={`flex items-center space-x-3 p-3.5 rounded-2xl border cursor-pointer transition select-none ${
          isCashCollected
            ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-md'
            : 'bg-dark-900/80 border-dark-700 text-gray-300 hover:border-dark-600'
        }`}
      >
        <input
          type="checkbox"
          checked={isCashCollected}
          onChange={() => {}} // handled by parent onClick
          className="w-4 h-4 text-emerald-500 rounded bg-dark-800 border-dark-600 focus:ring-0 cursor-pointer"
        />
        <span className="text-xs font-bold">
          {isCashCollected
            ? `✓ Payment of ${formatCurrency(totalAmount)} collected & verified!`
            : `Confirm: I have received ${formatCurrency(totalAmount)} from customer`}
        </span>
      </div>
    </div>
  );
};

