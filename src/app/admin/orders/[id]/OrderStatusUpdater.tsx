'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, CheckCircle2, RotateCcw, Trash2 } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';

interface OrderUpdaterProps {
  order: {
    id: string;
    status: string;
    paymentStatus: string;
    trackingNumber?: string | null;
    courierPartner?: string | null;
    adminNotes?: string | null;
  };
}

export default function OrderStatusUpdater({ order }: OrderUpdaterProps) {
  const router = useRouter();

  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [courierPartner, setCourierPartner] = useState(order.courierPartner || 'Blue Dart Express');
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || '');
  const [saving, setSaving] = useState(false);
  const [whatsappSending, setWhatsappSending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleDeleteOrder = async () => {
    if (!confirm('Are you sure you want to permanently delete this order record? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/orders');
        router.refresh();
      } else {
        alert('Failed to delete order');
      }
    } catch {
      alert('Error deleting order');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          paymentStatus,
          trackingNumber,
          courierPartner,
          adminNotes,
        }),
      });

      if (!res.ok) throw new Error('Failed to update order');
      setFeedback('Order status & tracking updated successfully!');
      router.refresh();
    } catch {
      setFeedback('Error updating order');
    } finally {
      setSaving(false);
    }
  };

  const handleResendWhatsApp = async () => {
    setWhatsappSending(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/whatsapp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testNumber: '+919376988788' }),
      });
      if (res.ok) {
        setFeedback('WhatsApp order notification dispatched successfully!');
        router.refresh();
      } else {
        setFeedback('Failed to dispatch WhatsApp message');
      }
    } catch {
      setFeedback('WhatsApp dispatch error');
    } finally {
      setWhatsappSending(false);
    }
  };

  return (
    <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 shadow-xs space-y-5 text-xs">
      <h2 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-3">
        Fulfillment & Shipping Controls
      </h2>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium">
          {feedback}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Fulfillment Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none font-semibold"
          >
            <option value="PENDING">PENDING (Awaiting Review)</option>
            <option value="CONFIRMED">CONFIRMED (Ready for Packing)</option>
            <option value="PROCESSING">PROCESSING (Diagnostic Verification)</option>
            <option value="SHIPPED">SHIPPED (Handed to Courier)</option>
            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
            <option value="DELIVERED">DELIVERED (Completed)</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Payment Status</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none font-semibold"
          >
            <option value="PENDING">PENDING (Cash on Delivery)</option>
            <option value="VERIFIED_PAID">VERIFIED_PAID (Confirmed Online)</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Courier Partner</label>
            <input
              type="text"
              value={courierPartner}
              onChange={(e) => setCourierPartner(e.target.value)}
              placeholder="e.g. Blue Dart Express"
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tracking AWB #</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. 7482910382"
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Internal Admin Notes</label>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={2}
            placeholder="Add internal fulfillment remarks..."
            className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none"
          />
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 text-xs shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Updating...' : 'Save Status'}</span>
            </button>

            <button
              type="button"
              onClick={handleDeleteOrder}
              className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold flex items-center gap-1.5 transition-colors text-xs"
              title="Delete this order record"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Order</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleResendWhatsApp}
            disabled={whatsappSending}
            className="px-3.5 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 text-xs shadow-xs"
            title="Send notification to business WhatsApp"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
            <span>{whatsappSending ? 'Sending...' : 'Push WhatsApp Alert'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
