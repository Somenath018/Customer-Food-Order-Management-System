import React, { useState } from 'react';
import { api } from '../../api/client';
import { X, Star, CheckCircle, Sparkles } from 'lucide-react';

export const ReviewModal = ({ order, isOpen, onClose, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.submitFeedback(order.id, { rating, comment });
      setSubmitted(true);
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1400);
    } catch (err) {
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Rate your experience</h3>
            <p className="text-xs text-slate-500">Order from {order.restaurant_name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {submitted ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-base font-black text-slate-900">Thank you for your feedback!</h4>
              <p className="text-xs text-slate-500">Your review helps our restaurant partners improve.</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold">
                  {error}
                </div>
              )}

              {/* Star Rating Picker */}
              <div className="text-center space-y-2 py-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  How was the food & delivery?
                </span>
                <div className="flex items-center justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-slate-300 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          (hoverRating || rating) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-xs font-black text-amber-600">
                  {rating === 5 && 'Outstanding! Loved it 🔥'}
                  {rating === 4 && 'Very Good taste & packaging 👍'}
                  {rating === 3 && 'Average experience 😐'}
                  {rating === 2 && 'Needs improvement 👎'}
                  {rating === 1 && 'Disappointing 😞'}
                </div>
              </div>

              {/* Feedback Comment */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Write a review (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Share details about food taste, packaging quality, delivery speed..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#FF5200] outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF5200] to-[#E23744] hover:brightness-105 text-white font-extrabold text-xs transition shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
