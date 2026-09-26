import React, { useState } from 'react';
import { DollarSign, Wallet, ArrowUpRight, TrendingUp, Calendar, CreditCard, Banknote } from 'lucide-react';
import { formatCurrency, formatFullDate } from '../../utils/formatters';

export const EarningsView = ({ driver, completedOrders = [] }) => {
  const [activeRange, setActiveRange] = useState('today'); // 'today' | 'week'
  const [payoutStatus, setPayoutStatus] = useState(null);

  const todayEarnings = driver?.today_earnings || 68.50;
  const weeklyEarnings = 342.80;
  const tips = 24.00;
  const codCashInHand = 43.49;

  const currentDisplayAmount = activeRange === 'today' ? todayEarnings : weeklyEarnings;

  const handleWithdraw = () => {
    setPayoutStatus('processing');
    setTimeout(() => {
      setPayoutStatus('success');
      setTimeout(() => setPayoutStatus(null), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* Top Earnings Hero Card */}
      <div className="bg-gradient-to-br from-dark-800 via-dark-800 to-rider-900/30 border border-dark-700 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Wallet className="w-4 h-4 text-rider-400" />
            <span>Driver Wallet Balance</span>
          </span>

          {/* Range filter switch */}
          <div className="flex bg-dark-900/80 rounded-xl p-1 border border-dark-700">
            <button
              onClick={() => setActiveRange('today')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                activeRange === 'today'
                  ? 'bg-rider-500 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setActiveRange('week')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                activeRange === 'week'
                  ? 'bg-rider-500 text-white shadow'
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
          <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Includes base pay + incentives + customer tips</span>
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleWithdraw}
            disabled={payoutStatus === 'processing'}
            className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rider-500 to-emerald-600 hover:from-rider-600 hover:to-emerald-700 text-white font-extrabold text-sm transition shadow-lg shadow-rider-500/20"
          >
            {payoutStatus === 'processing' ? (
              <span>Transferring to Bank...</span>
            ) : payoutStatus === 'success' ? (
              <span className="text-emerald-200">✓ Payout Sent to Bank!</span>
            ) : (
              <>
                <span>Instant Cashout to Bank</span>
                <ArrowUpRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-4 shadow">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-medium">Trip Base Pay</span>
            <DollarSign className="w-4 h-4 text-rider-400" />
          </div>
          <div className="text-xl font-extrabold text-white">
            {formatCurrency(currentDisplayAmount - tips)}
          </div>
          <span className="text-[11px] text-gray-500">Per-km delivery fees</span>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-4 shadow">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-medium">Tips Received</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold text-emerald-400">
            {formatCurrency(tips)}
          </div>
          <span className="text-[11px] text-gray-500">100% kept by rider</span>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-4 shadow">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-medium">COD Cash In Hand</span>
            <Banknote className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-extrabold text-amber-400">
            {formatCurrency(codCashInHand)}
          </div>
          <span className="text-[11px] text-gray-500">Deposit at hub EOD</span>
        </div>
      </div>

      {/* Recent Payout Activity List */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-4 sm:p-5 shadow space-y-3">
        <h4 className="font-bold text-sm text-white">Recent Completed Trip Payouts</h4>

        {completedOrders.length > 0 ? (
          <div className="space-y-2">
            {completedOrders.slice(0, 6).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-xl bg-dark-900/60 border border-dark-700 text-xs"
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
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    +{formatCurrency(order.delivery_fee || 3.50)}
                  </span>
                  <div className="text-[10px] text-gray-500">Credited</div>
                </div>
              </div>
            ))}
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
