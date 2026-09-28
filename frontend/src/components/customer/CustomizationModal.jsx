import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { X, Check, Plus } from 'lucide-react';

export const CustomizationModal = ({ item, restaurant, isOpen, onClose }) => {
  const { addToCart } = useCart();

  const [spiceLevel, setSpiceLevel] = useState('Medium');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [cookingNote, setCookingNote] = useState('');

  if (!isOpen || !item) return null;

  const addonsList = [
    { id: 'extra_cheese', name: 'Extra Melted Cheese', price: 30 },
    { id: 'extra_dip', name: 'Signature Garlic Mayo Dip', price: 20 },
    { id: 'crispy_fries', name: 'Side Crispy Salted Fries', price: 50 },
    { id: 'beverage', name: 'Chilled Coke (300ml)', price: 40 }
  ];

  const toggleAddon = (addon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const totalItemPrice = Number(item.price) + addonsTotal;

  const handleConfirm = () => {
    addToCart(item, restaurant, {
      spiceLevel,
      addons: selectedAddons.map((a) => a.name),
      addonsTotal,
      cookingNote
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Customise "{item.name}"</h3>
            <p className="text-xs text-slate-500">Tailor your order just the way you like it</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Spice Level Section */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Spice Level
            </span>
            <div className="grid grid-cols-4 gap-2">
              {['Mild', 'Medium', 'Spicy', 'Fire 🔥'].map((level) => (
                <button
                  type="button"
                  key={level}
                  onClick={() => setSpiceLevel(level)}
                  className={`py-2 px-1 rounded-2xl text-xs font-bold transition text-center cursor-pointer border ${
                    spiceLevel === level
                      ? 'bg-orange-50 border-[#FF5200] text-[#FF5200] ring-1 ring-orange-400 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons Section */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Popular Add-ons
            </span>
            <div className="space-y-2">
              {addonsList.map((addon) => {
                const isChecked = selectedAddons.some((a) => a.id === addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isChecked
                        ? 'border-[#FF5200] bg-orange-50/60 shadow-xs ring-1 ring-orange-300'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          isChecked ? 'bg-[#FF5200] border-[#FF5200] text-white' : 'border-slate-300'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <span className="text-xs font-bold text-slate-800">{addon.name}</span>
                    </div>
                    <span className="text-xs font-black text-slate-700">+₹{addon.price}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cooking Note */}
          <div className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Special Cooking Instructions (Optional)
            </span>
            <textarea
              rows={2}
              placeholder="e.g. Less oil, extra green chillies, deliver well done..."
              value={cookingNote}
              onChange={(e) => setCookingNote(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
            />
          </div>
        </div>

        {/* Footer with Add Button */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Total Item Price</span>
            <span className="text-base font-black text-slate-900">₹{totalItemPrice.toFixed(2)}</span>
          </div>

          <button
            onClick={handleConfirm}
            className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-[#FF5200] to-[#E23744] hover:brightness-105 text-white font-black text-xs transition shadow-md shadow-orange-500/25 cursor-pointer"
          >
            Add Item to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
