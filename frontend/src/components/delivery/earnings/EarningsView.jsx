import React, { useState } from 'react';
import { IndianRupee, Wallet, ArrowUpRight, TrendingUp, Banknote, Zap } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

export const EarningsView = ({ driver, completedOrders = [] }) => {
  const [activeRange, setActiveRange] = useState('today'); // 'today' | 'week'
  const [payoutStatus, setPayoutStatus] = useState(null);

  const rawToday = driver?.today_earnings || 68.50;
  const todayEarnings = rawToday < 150 ? rawToday * 12 : rawToday;
  const weeklyEarnings = 5420.00;
  const tips = 180.00;
  const codCashInHand = 450.00;

  const currentDisplayAmount = activeRange === 'today' ? todayEarnings : weeklyEarnings;

  const handleWithdraw = () => {
    setPayoutStatus('processing');
    setTimeout(() => {
      setPayoutStatus('success');
      setTimeout(() => setPayoutStatus(null), 3500);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* Top Earnings Hero Card */}
      <div className="bg-gradient-to-br from-[#121622] via-[#1a2030] to-[#FF5200]/20 border border-dark-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Wallet className="w-4 h-4 text-[#FF5200]" />
            <span>Foodie Partner Wallet Balance</span>
          </span>

          {/* Range filter switch */}
          <div className="flex bg-dark-900/80 rounded-xl p-1 border border-dark-700">
            <button
              onClick={() => setActiveRange('today')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                activeRange === 'today'
                  ? 'bg-gradient-to-r from-[#FF5200] to-[#E23744] text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setActiveRange('week')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                activeRange === 'week'
                  ? 'bg-gradient-to-r from-[#FF5200] to-[#E23744] text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              This Week
            </button>
          </div>
        </div>

        <div className="my-4">
          <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
            {formatCurrency(currentDisplayAmount)}
          </div>
          <p className="text-xs text-emerald-400 font-medium mt-1.5 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Base pay + Peak Surge (₹18/km) + 100% Customer Tips</span>
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleWithdraw}
            disabled={payoutStatus === 'processing'}
            className="flex-1 flex items-center justify-center space-x-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FF5200] via-[#FC8019] to-[#E23744] hover:brightness-110 text-white font-black text-sm transition shadow-lg shadow-orange-500/25 cursor-pointer active:scale-[0.98]"
          >
            {payoutStatus === 'processing' ? (
              <span>Initiating Instant IMPS / UPI Transfer...</span>
            ) : payoutStatus === 'success' ? (
              <span className="text-emerald-100">✓ ₹ Payout Sent to Bank / UPI (IMPS)!</span>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                <span>Instant Cashout to Bank / UPI (IMPS)</span>
                <ArrowUpRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#121622] border border-dark-700/80 rounded-2xl p-4 shadow">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-semibold">Trip Base Pay</span>
            <IndianRupee className="w-4 h-4 text-[#FF5200]" />
          </div>
          <div className="text-xl font-black text-white font-mono">
            {formatCurrency(currentDisplayAmount - tips)}
          </div>
          <span className="text-[11px] text-gray-400">Order fee + distance (₹18/km)</span>
        </div>

        <div className="bg-[#121622] border border-dark-700/80 rounded-2xl p-4 shadow">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-semibold">Customer Tips</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">
            {formatCurrency(tips)}
          </div>
          <span className="text-[11px] text-gray-400">100% kept by Arjun</span>
        </div>

        <div className="bg-[#121622] border border-dark-700/80 rounded-2xl p-4 shadow">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-semibold">COD Cash In Hand</span>
            <Banknote className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400 font-mono">
            {formatCurrency(codCashInHand)}
          </div>
          <span className="text-[11px] text-gray-400">Deposit at Koramangala Hub</span>
        </div>
      </div>

      {/* Recent Payout Activity List */}
      <div className="bg-[#121622] border border-dark-700/80 rounded-2xl p-4 sm:p-5 shadow space-y-3">
        <h4 className="font-bold text-sm text-white">Recent Completed Trip Credits</h4>

        {completedOrders.length > 0 ? (
          <div className="space-y-2">
            {completedOrders.slice(0, 6).map((order) => {
              const rawFee = order.delivery_fee || 3.50;
              const fee = rawFee < 15 ? Math.round(rawFee * 18) : rawFee;
              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-dark-900/60 border border-dark-700/80 text-xs"
                >
                  <div>
                    <div className="font-bold text-white">
                      {order.restaurant_name} ➔ {order.customer_name || 'Customer'}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      Order #{order.id?.slice(-4).toUpperCase()} • Delivered
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-emerald-400 text-sm">
                      +{formatCurrency(fee)}
                    </span>
                    <div className="text-[10px] text-gray-400">Credited to UPI</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-400 py-4 text-center">
            Completed deliveries will appear here with instant earnings credits.
          </p>
        )}
      </div>
    </div>
  );
};

