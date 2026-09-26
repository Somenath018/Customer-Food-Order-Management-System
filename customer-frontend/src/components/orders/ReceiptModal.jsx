import React, { useEffect, useState } from 'react';
import { Modal } from '../common/Modal';
import { customerApi } from '../../api/customerApi';
import { formatCurrency, formatFullDate } from '../../utils/formatters';
import { CheckCircle2, Receipt, Printer, Loader2 } from 'lucide-react';

export const ReceiptModal = ({ isOpen, onClose, orderId }) => {
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        setLoading(true);
        const res = await customerApi.getReceipt(orderId);
        if (res.success && res.receipt) {
          setReceipt(res.receipt);
        }
      } catch (err) {
        console.error('Error fetching invoice receipt:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && orderId) {
      fetchReceipt();
    }
  }, [isOpen, orderId]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Digital Invoice Receipt" maxWidth="max-w-md">
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-2">
          <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          <span className="text-xs text-gray-400">Loading invoice receipt...</span>
        </div>
      ) : !receipt ? (
        <div className="py-8 text-center text-xs text-gray-400">
          Receipt details not found.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header Card */}
          <div className="p-4 rounded-2xl bg-dark-900 border border-dark-700/80 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm text-white">Payment Confirmed</h4>
            <span className="text-xs font-mono text-emerald-400 font-bold block">
              {receipt.transaction_id}
            </span>
            <span className="text-[11px] text-gray-400 block">
              {formatFullDate(receipt.paid_at)}
            </span>
          </div>

          {/* Details breakdown */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-dark-700/60">
              <span className="text-gray-400">Restaurant</span>
              <span className="font-bold text-white">{receipt.restaurant_name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-dark-700/60">
              <span className="text-gray-400">Customer</span>
              <span className="font-bold text-white">{receipt.customer_name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-dark-700/60">
              <span className="text-gray-400">Payment Mode</span>
              <span className="font-bold text-brand-400 uppercase">
                {receipt.payment_method}{' '}
                {receipt.card_last4 ? `(••${receipt.card_last4})` : ''}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Purchased Items
            </span>
            <div className="p-3 bg-dark-900 rounded-xl border border-dark-700/60 space-y-1.5 text-xs">
              {receipt.items?.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center text-gray-300">
                  <span>
                    {it.quantity}x {it.name}
                  </span>
                  <span className="font-mono">{formatCurrency(it.price * it.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-dark-700 pt-2 flex justify-between font-extrabold text-white text-sm">
                <span>Total Paid</span>
                <span className="text-brand-400">{formatCurrency(receipt.amount)}</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-gray-200 border border-dark-700 font-bold text-xs flex items-center justify-center space-x-2 transition"
            >
              <Printer className="w-4 h-4 text-brand-400" />
              <span>Print / Save Receipt</span>
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
