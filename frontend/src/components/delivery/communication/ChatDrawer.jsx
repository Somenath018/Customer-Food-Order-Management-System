import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { soundEngine } from '../../../utils/audio';
import { Send, User, Store, Sparkles } from 'lucide-react';
import { formatDateTime } from '../../../utils/formatters';

export const ChatDrawer = ({ isOpen, onClose, order }) => {
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' | 'restaurant'
  const [inputText, setInputText] = useState('');

  const rawCustName = order?.customer_name || 'Rahul Sharma';
  const customerName = rawCustName.includes('Sarah') ? 'Rahul Sharma' : rawCustName;

  const [customerMessages, setCustomerMessages] = useState([
    {
      id: 'm1',
      sender: 'customer',
      senderName: customerName,
      text: 'Bhaiya, please call when you reach Gate 2 of the society.',
      time: new Date(Date.now() - 8 * 60000).toISOString()
    },
    {
      id: 'm2',
      sender: 'rider',
      senderName: 'You (Arjun)',
      text: 'Ji sir! I am on my way with your hot food parcel.',
      time: new Date(Date.now() - 5 * 60000).toISOString()
    }
  ]);

  const [restaurantMessages, setRestaurantMessages] = useState([
    {
      id: 'r1',
      sender: 'restaurant',
      senderName: order?.restaurant_name || 'Meghana Foods / Restaurant',
      text: 'Order is freshly packed in insulated bag at the dispatch counter.',
      time: new Date(Date.now() - 10 * 60000).toISOString()
    }
  ]);

  const quickRepliesCustomer = [
    "I'm at the restaurant waiting for order",
    "On my way to your location on bike 🛵",
    "I have reached your building gate 🚪",
    "Please come to lobby or send OTP",
    "Slight signal traffic delay, reaching in 5 mins"
  ];

  const quickRepliesRestaurant = [
    "I have arrived at the food counter",
    "Is the order packed and ready?",
    "Could you please add extra napkins & cutlery?",
    "Food safely secured in thermal bag"
  ];

  const handleSendMessage = (textToSend) => {
    const messageContent = textToSend || inputText;
    if (!messageContent.trim()) return;

    soundEngine.playMessagePing();

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'rider',
      senderName: 'You (Arjun)',
      text: messageContent.trim(),
      time: new Date().toISOString()
    };

    if (activeTab === 'customer') {
      setCustomerMessages(prev => [...prev, newMsg]);
    } else {
      setRestaurantMessages(prev => [...prev, newMsg]);
    }

    setInputText('');
  };

  const activeMessages = activeTab === 'customer' ? customerMessages : restaurantMessages;
  const currentQuickReplies = activeTab === 'customer' ? quickRepliesCustomer : quickRepliesRestaurant;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="In-App Messaging" maxWidth="max-w-lg">
      <div className="flex flex-col h-[480px]">
        {/* Tabs: Customer vs Restaurant */}
        <div className="flex rounded-xl bg-dark-900 p-1 mb-3 border border-dark-700">
          <button
            onClick={() => setActiveTab('customer')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'customer'
                ? 'bg-[#FF5200]/20 text-[#ff7332] border border-[#FF5200]/40 shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer ({customerName})</span>
          </button>

          <button
            onClick={() => setActiveTab('restaurant')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'restaurant'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Kitchen ({order?.restaurant_name || 'Restaurant'})</span>
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {activeMessages.map((msg) => {
            const isMe = msg.sender === 'rider';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-gray-500 mb-1 px-1 font-semibold">{msg.senderName}</span>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs shadow-md ${
                    isMe
                      ? 'bg-gradient-to-r from-[#FF5200] to-[#E23744] text-white rounded-br-none font-medium'
                      : 'bg-dark-800 text-gray-100 rounded-bl-none border border-dark-700'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <span className="text-[9px] opacity-70 mt-1 block text-right font-mono">
                    {formatDateTime(msg.time)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Canned Quick Replies Chips */}
        <div className="py-2.5 overflow-x-auto flex space-x-2 no-scrollbar border-t border-dark-700/80 my-1">
          {currentQuickReplies.map((reply, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(reply)}
              className="whitespace-nowrap px-3 py-1 rounded-full bg-dark-900 border border-dark-700 hover:border-[#FF5200]/50 text-[11px] text-gray-300 hover:text-white transition flex items-center space-x-1 cursor-pointer"
            >
              <Sparkles className="w-2.5 h-2.5 text-[#FF5200]" />
              <span>{reply}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2 pt-2 border-t border-dark-700"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${activeTab === 'customer' ? 'customer' : 'restaurant kitchen'}...`}
            className="flex-1 bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5200]"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#FF5200] to-[#E23744] disabled:opacity-40 text-white transition shadow cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </Modal>
  );
};

