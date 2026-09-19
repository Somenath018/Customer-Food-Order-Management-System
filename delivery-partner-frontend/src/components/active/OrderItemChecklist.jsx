import React, { useState } from 'react';
import { CheckSquare, Square, PackageCheck, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

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
    <div className="bg-dark-900/60 border border-dark-700 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <PackageCheck className="w-4 h-4 text-rider-400" />
          <h4 className="font-bold text-xs text-white uppercase tracking-wider">
            Order Pickup Checklist
          </h4>
        </div>
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            allDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-dark-700 text-gray-400'
          }`}
        >
          {Object.values(checkedItems).filter(Boolean).length}/{items.length} Checked
        </span>
      </div>

      <p className="text-xs text-gray-400">
        Verify that each container is sealed and present before leaving the restaurant:
      </p>

      <div className="space-y-2">
        {items.map((item) => {
          const id = item.id || item.menu_item_id;
          const isChecked = !!checkedItems[id];

          return (
            <div
              key={id}
              onClick={() => toggleItem(id)}
              className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition select-none ${
                isChecked
                  ? 'bg-rider-500/10 border-rider-500/40 text-rider-200'
                  : 'bg-dark-800/80 border-dark-700 text-gray-300 hover:border-dark-600'
              }`}
            >
              <div className="flex items-center space-x-3">
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-rider-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-gray-500 shrink-0" />
                )}
                <div>
                  <div className="text-xs font-semibold text-white">
                    {item.quantity}x {item.name}
                  </div>
                  {item.special_notes && (
                    <div className="text-[11px] text-amber-400/90 italic">
                      Note: {item.special_notes}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-xs font-mono text-gray-400">
                {formatCurrency(item.price * (item.quantity || 1))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
