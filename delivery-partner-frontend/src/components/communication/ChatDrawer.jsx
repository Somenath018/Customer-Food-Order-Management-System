import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { soundEngine } from '../../utils/audio';
import { Send, User, Store, MessageSquare, Sparkles } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export const ChatDrawer = ({ isOpen, onClose, order }) => {
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' | 'restaurant'
  const [inputText, setInputText] = useState('');

  const [customerMessages, setCustomerMessages] = useState([
    {
      id: 'm1',
      sender: 'customer',
      senderName: order?.customer_name || 'Sarah Jenkins',
      text: 'Hi Alex! Please ring bell 4B when you arrive at the building.',
      time: new Date(Date.now() - 8 * 60000).toISOString()
    },
    {
      id: 'm2',
      sender: 'rider',
      senderName: 'You (Alex)',
      text: 'Got it! I will ring bell 4B as soon as I arrive.',
      time: new Date(Date.now() - 5 * 60000).toISOString()
    }
  ]);

  const [restaurantMessages, setRestaurantMessages] = useState([
    {
      id: 'r1',
      sender: 'restaurant',
      senderName: order?.restaurant_name || 'Bella Italia Trattoria',
      text: 'Order #1001 is freshly boxed and waiting at the dispatch counter.',
      time: new Date(Date.now() - 10 * 60000).toISOString()
    }
  ]);

  const quickRepliesCustomer = [
    "I'm at the restaurant waiting for order",
    "On my way to your address now 🛵",
    "I have arrived at your door! 🚪",
    "Please come to the lobby gate",
    "Slight traffic delay, be there in 5 mins"
  ];

  const quickRepliesRestaurant = [
    "I have arrived at the counter",
    "Is order ready for pickup?",
    "Could you double-check napkins & sauces?",
    "Food safely secured in thermal bag"
  ];

  const handleSendMessage = (textToSend) => {
    const messageContent = textToSend || inputText;
    if (!messageContent.trim()) return;

    soundEngine.playMessagePing();

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'rider',
      senderName: 'You (Alex)',
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
                ? 'bg-rider-500/20 text-rider-300 border border-rider-500/40 shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer ({order?.customer_name || 'Sarah'})</span>
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
                <span className="text-[10px] text-gray-500 mb-1 px-1">{msg.senderName}</span>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs shadow-md ${
                    isMe
                      ? 'bg-rider-600 text-white rounded-br-none'
                      : 'bg-dark-700 text-gray-100 rounded-bl-none border border-dark-600'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <span className="text-[9px] opacity-70 mt-1 block text-right">
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
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-dark-900 border border-dark-700 hover:border-rider-500/50 text-[11px] text-gray-300 hover:text-white transition flex items-center space-x-1"
            >
              <Sparkles className="w-2.5 h-2.5 text-rider-400" />
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
            className="flex-1 bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-rider-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-rider-500 hover:bg-rider-600 disabled:opacity-40 disabled:hover:bg-rider-500 text-white transition shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </Modal>
  );
};
