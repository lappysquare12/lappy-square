'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Trash2, Loader2, Edit2 } from 'lucide-react';
import EditReviewModal, { ReviewItemData } from './EditReviewModal';

interface ReviewTableActionsProps {
  review: ReviewItemData;
}

export default function ReviewTableActions({ review }: ReviewTableActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const toggleApproval = async (newVal: boolean) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews/${review.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: newVal }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to update review status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating review');
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async () => {
    if (!confirm('Are you sure you want to permanently delete this customer review?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews/${review.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete review');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting review');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader2 className="w-4 h-4 animate-spin text-slate-400" />;
  }

  return (
    <>
      <div className="flex items-center gap-1.5 justify-end">
        {/* Edit Button */}
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
          title="Edit Review Details"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>

        {/* Approve / Unpublish Toggle */}
        {review.isApproved ? (
          <button
            onClick={() => toggleApproval(false)}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors"
            title="Unpublish Review"
          >
            <X className="w-3.5 h-3.5" />
            <span>Unpublish</span>
          </button>
        ) : (
          <button
            onClick={() => toggleApproval(true)}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
            title="Approve Review"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Approve</span>
          </button>
        )}

        {/* Delete */}
        <button
          onClick={deleteReview}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          title="Delete Review"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Edit Review Modal */}
      {isEditModalOpen && (
        <EditReviewModal
          review={review}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
}
