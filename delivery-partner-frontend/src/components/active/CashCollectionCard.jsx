import React from 'react';
import { Banknote, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const CashCollectionCard = ({ order, isCashCollected, onToggleCashCollected }) => {
  const isCOD = order?.payment?.payment_method === 'cod';

  if (!isCOD) {
    return (
      <div className="bg-dark-900/60 border border-dark-700 rounded-2xl p-4 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-gray-300">
            Payment Method: <strong className="text-white uppercase">{order?.payment?.payment_method || 'Online Card'}</strong> (Paid in Advance)
          </span>
        </div>
        <span className="font-bold text-emerald-400">NO CASH DUE</span>
      </div>
    );
  }

  return (
    <div className="bg-amber-500/10 border-2 border-amber-500/50 rounded-2xl p-4 space-y-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500 text-black">
            <Banknote className="w-4 h-4" />
          </div>
          <h4 className="font-extrabold text-sm text-amber-300 uppercase tracking-wide">
            Cash On Delivery (COD)
          </h4>
        </div>
        <span className="text-lg font-black text-amber-400 font-mono">
          {formatCurrency(order?.total)}
        </span>
      </div>

      <p className="text-xs text-amber-200/90 leading-relaxed">
        Please collect exactly <strong>{formatCurrency(order?.total)}</strong> in cash from the customer before handing over the delivery order.
      </p>

      <div
        onClick={onToggleCashCollected}
        className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition select-none ${
          isCashCollected
            ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
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
            ? '✓ Cash payment received and verified!'
            : 'Confirm: I have received cash payment from customer'}
        </span>
      </div>
    </div>
  );
};
