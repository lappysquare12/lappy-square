'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, Trash2, Loader2, AlertTriangle, X } from 'lucide-react';

interface OrderTableActionsProps {
  order: {
    id: string;
    orderNumber: string;
    guestName?: string | null;
    totalAmount: number;
  };
}

export default function OrderTableActions({ order }: OrderTableActionsProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete order');
      }
      setShowDeleteModal(false);
      window.location.reload();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error deleting order');
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        <Link
          href={`/admin/orders/${order.id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-[11px] transition-colors"
          title="Manage Order"
        >
          <Eye className="w-3 h-3" />
          <span>Manage</span>
        </Link>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          title="Delete Order"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 text-left">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-950">Confirm Order Deletion</h3>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Are you sure you want to permanently delete Order <strong className="text-slate-900 font-semibold">#{order.orderNumber}</strong>
                  {order.guestName ? ` (${order.guestName})` : ''} worth <strong className="text-slate-900 font-semibold">₹{order.totalAmount.toLocaleString('en-IN')}</strong>?
                </p>
                <p className="text-[11px] text-rose-600 font-medium mt-2 bg-rose-50/80 border border-rose-100 rounded-lg p-2">
                  ⚠️ This action cannot be undone. All linked order items, payment records, and WhatsApp notification logs will be permanently deleted.
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
                {errorMessage}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md shadow-rose-600/20 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Delete Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
