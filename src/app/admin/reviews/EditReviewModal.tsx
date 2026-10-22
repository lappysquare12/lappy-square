'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, X, Loader2, Edit3, ShieldCheck } from 'lucide-react';

export interface ReviewItemData {
  id: string;
  userName: string;
  userEmail?: string | null;
  rating: number;
  title?: string | null;
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  product?: {
    title: string;
    slug?: string;
  };
}

interface EditReviewModalProps {
  review: ReviewItemData;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditReviewModal({
  review,
  isOpen,
  onClose,
  onSuccess,
}: EditReviewModalProps) {
  const router = useRouter();

  const [userName, setUserName] = useState(review.userName || '');
  const [userEmail, setUserEmail] = useState(review.userEmail || '');
  const [rating, setRating] = useState(review.rating || 5);
  const [title, setTitle] = useState(review.title || '');
  const [comment, setComment] = useState(review.comment || '');
  const [isVerifiedPurchase, setIsVerifiedPurchase] = useState(review.isVerifiedPurchase);
  const [isApproved, setIsApproved] = useState(review.isApproved);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) {
      setError('Customer name and review text are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/reviews/${review.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: userName.trim(),
          userEmail: userEmail ? userEmail.trim() : null,
          rating: Number(rating),
          title: title ? title.trim() : null,
          comment: comment.trim(),
          isVerifiedPurchase,
          isApproved,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update review');
      }

      router.refresh();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating review';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Edit Review Details</h3>
              {review.product?.title && (
                <p className="text-[11px] text-slate-500 line-clamp-1">{review.product.title}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Customer Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Customer Name *</label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-600 outline-none font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Customer Email</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="optional@example.com"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-600 outline-none font-medium"
              />
            </div>
          </div>

          {/* Star Rating Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Rating (1 to 5 Stars)</label>
            <div className="flex items-center gap-1.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-700 ml-2">
                {rating === 5 && '5 Stars (Excellent)'}
                {rating === 4 && '4 Stars (Very Good)'}
                {rating === 3 && '3 Stars (Good)'}
                {rating === 2 && '2 Stars (Fair)'}
                {rating === 1 && '1 Star (Poor)'}
              </span>
            </div>
          </div>

          {/* Headline Title */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Review Headline / Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Excellent Battery Backup & Pristine Screen"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-600 outline-none font-medium"
            />
          </div>

          {/* Comment Body */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Review Comment *</label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-600 outline-none font-medium leading-relaxed"
            />
          </div>

          {/* Checkboxes: Verified Purchase & Approved Status */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isVerifiedPurchase}
                onChange={(e) => setIsVerifiedPurchase(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Buyer Badge
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isApproved}
                onChange={(e) => setIsApproved(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="font-semibold text-slate-800">
                Approved &amp; Published (Visible publicly on product page)
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
