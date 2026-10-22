'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2, AlertTriangle, X } from 'lucide-react';

export default function EnquiryStatusSelector({
  enquiryId,
  currentStatus,
  onStatusChange,
  compact = false,
}: {
  enquiryId: string;
  currentStatus: string;
  onStatusChange?: (newStatus: string) => void;
  compact?: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getStatusStyle = (st: string) => {
    switch (st) {
      case 'NEW':
        return 'bg-blue-50 text-blue-700 border-blue-200 focus:ring-blue-200';
      case 'CONTACTED':
        return 'bg-amber-50 text-amber-700 border-amber-200 focus:ring-amber-200';
      case 'IN_PROGRESS':
        return 'bg-purple-50 text-purple-700 border-purple-200 focus:ring-purple-200';
      case 'RESOLVED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-200';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200 focus:ring-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Status update failed');
      if (onStatusChange) {
        onStatusChange(newStatus);
      } else {
        router.refresh();
      }
    } catch {
      alert('Error updating enquiry status');
      setStatus(currentStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete query');
      }
      setShowModal(false);
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error deleting query');
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="inline-flex items-center gap-1.5 flex-shrink-0">
        <div className="relative inline-block">
          <select
            value={status}
            onChange={handleSelectChange}
            disabled={isUpdating}
            className={`text-[11px] font-bold rounded-lg px-2.5 py-1.5 border outline-none transition-all cursor-pointer disabled:opacity-50 ${getStatusStyle(
              status
            )}`}
          >
            <option value="NEW" className="bg-white text-slate-800">New</option>
            <option value="CONTACTED" className="bg-white text-slate-800">Contacted</option>
            <option value="IN_PROGRESS" className="bg-white text-slate-800">In Progress</option>
            <option value="RESOLVED" className="bg-white text-slate-800">Resolved</option>
            <option value="REJECTED" className="bg-white text-slate-800">Rejected</option>
          </select>
          {isUpdating && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <Loader2 className="w-3 h-3 text-slate-400 animate-spin" />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
          title="Delete Customer Query / Lead"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 text-left">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-950">Confirm Lead Deletion</h3>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Are you sure you want to permanently delete this customer enquiry / trade-in lead?
                </p>
                <p className="text-[11px] text-rose-600 font-medium mt-2 bg-rose-50/80 border border-rose-100 rounded-lg p-2">
                  This query will be completely removed from the database.
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
                onClick={() => setShowModal(false)}
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
                    <span>Yes, Delete Lead</span>
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
