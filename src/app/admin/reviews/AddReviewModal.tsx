'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Star, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProductOption {
  id: string;
  title: string;
  brand?: {
    name: string;
  } | null;
}

export default function AddReviewModal({ products }: { products: ProductOption[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [productId, setProductId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isVerifiedPurchase, setIsVerifiedPurchase] = useState(true);
  const [isApproved, setIsApproved] = useState(true);

  const resetForm = () => {
    setProductId(products.length > 0 ? products[0].id : '');
    setUserName('');
    setUserEmail('');
    setRating(5);
    setHoverRating(0);
    setTitle('');
    setComment('');
    setIsVerifiedPurchase(true);
    setIsApproved(true);
    setError('');
    setSuccess(false);
  };

  const handleOpen = () => {
    resetForm();
    if (products.length > 0) {
      setProductId(products[0].id);
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) {
      setError('Please select a laptop for this review.');
      return;
    }
    if (!userName.trim()) {
      setError('Customer name is required.');
      return;
    }
    if (!comment.trim()) {
      setError('Review comment cannot be empty.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userName: userName.trim(),
          userEmail: userEmail.trim() || undefined,
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
          isVerifiedPurchase,
          isApproved,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        router.refresh();
      }, 900);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting review';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow-md"
      >
        <Plus className="w-4 h-4" />
        <span>Add Customer Review</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add Customer Review</h3>
                  <p className="text-xs text-slate-500">Create a verified review for any laptop</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200/70 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                  <span>Review added successfully! Refreshing...</span>
                </div>
              )}

              {/* Laptop Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Laptop Product <span className="text-rose-500">*</span>
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="" disabled>-- Select a Laptop --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brand?.name ? `[${p.brand.name.toUpperCase()}] ` : ''}{p.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Customer Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    required
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email / Location <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="rahul@gmail.com or New Delhi"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Rating: <span className="text-amber-600 font-extrabold">{rating} out of 5 Stars</span>
                </label>
                <div className="flex items-center gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isFilled = (hoverRating || rating) >= starVal;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-slate-300 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs text-slate-600 ml-2 font-semibold">
                    {rating === 5 && '5 Stars (Excellent)'}
                    {rating === 4 && '4 Stars (Very Good)'}
                    {rating === 3 && '3 Stars (Good)'}
                    {rating === 2 && '2 Stars (Fair)'}
                    {rating === 1 && '1 Star (Poor)'}
                  </span>
                </div>
              </div>

              {/* Review Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Review Headline / Title <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Pristine condition, battery backup 5+ hours!"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Detailed Review Comment <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write the customer feedback here (performance, delivery experience, packaging, battery, screen quality...)"
                  required
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
                />
              </div>

              {/* Checkboxes for Verified Purchase & Approved */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={isVerifiedPurchase}
                    onChange={(e) => setIsVerifiedPurchase(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                  />
                  <span className="text-xs font-semibold text-slate-800">Verified Buyer Badge</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={isApproved}
                    onChange={(e) => setIsApproved(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-0"
                  />
                  <span className="text-xs font-semibold text-slate-800">Approve & Publish Live</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || success}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-700/20 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Review...</span>
                    </>
                  ) : (
                    <span>Submit & Publish</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
