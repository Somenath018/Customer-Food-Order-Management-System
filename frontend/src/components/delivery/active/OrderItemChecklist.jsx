import React, { useState } from 'react';
import { CheckSquare, Square, PackageCheck } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import { VegNonVegBadge } from '../common/VegNonVegBadge';

export const OrderItemChecklist = ({ items = [], onAllCheckedChange }) => {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleItem = (id) => {
    const next = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(next);

    const allChecked = items.length > 0 && items.every(i => next[i.id || i.menu_item_id]);
    if (onAllCheckedChange) {
      onAllCheckedChange(allChecked);
    }
  };

  const allDone = items.length > 0 && items.every(i => checkedItems[i.id || i.menu_item_id]);

  return (
    <div className="bg-[#0e121c] border border-dark-700/80 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <PackageCheck className="w-4 h-4 text-[#FF5200]" />
          <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">
            Kitchen Pickup & Packing Checklist
          </h4>
        </div>
        <span
          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
            allDone
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-dark-800 text-gray-400 border border-dark-700'
          }`}
        >
          {Object.values(checkedItems).filter(Boolean).length}/{items.length} Checked
        </span>
      </div>

      <p className="text-xs text-gray-400">
        Verify each item, thermal packaging, and cutlery with kitchen staff before leaving:
      </p>

      <div className="space-y-2">
        {items.map((item) => {
          const id = item.id || item.menu_item_id;
          const isChecked = !!checkedItems[id];
          const rawPrice = item.price || 9.99;
          const price = rawPrice < 50 ? Math.round(rawPrice * 18) : rawPrice;

          return (
            <div
              key={id}
              onClick={() => toggleItem(id)}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition select-none ${
                isChecked
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                  : 'bg-[#141926] border-dark-700 text-gray-300 hover:border-dark-600'
              }`}
            >
              <div className="flex items-center space-x-3">
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-gray-500 shrink-0" />
                )}
                <div>
                  <div className="text-xs font-bold text-white flex items-center space-x-2">
                    <VegNonVegBadge itemName={item.name} size="xs" />
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                  </div>
                  {item.special_notes && (
                    <div className="text-[11px] text-amber-400/90 italic mt-0.5">
                      Note: {item.special_notes}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-gray-400">
                {formatCurrency(price * (item.quantity || 1))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

