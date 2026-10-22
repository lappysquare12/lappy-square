'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Save,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Lock,
  Clock,
  ExternalLink
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';

interface WhatsAppSettingData {
  id: string;
  enabled: boolean;
  businessNumber: string;
  recipientNumber: string;
  businessAccountId?: string;
  phoneNumberId?: string;
  accessToken?: string;
  notifyOnOrder: boolean;
  notifyOnPayment: boolean;
  notifyOnShipment: boolean;
  notifyOnDelivery: boolean;
  notifyOnCancel: boolean;
  templateOrderPlaced: string;
  templatePaymentVerified: string;
}

interface WhatsAppLogData {
  id: string;
  orderId?: string | null;
  recipient: string;
  messageType: string;
  status: string;
  providerMessageId?: string | null;
  errorMessage?: string | null;
  payload?: string | null;
  createdAt: string;
  order?: {
    orderNumber: string;
    guestName?: string | null;
    totalAmount: number;
  } | null;
}

export default function AdminWhatsAppPage() {
  const [setting, setSetting] = useState<WhatsAppSettingData>({
    id: '',
    enabled: true,
    businessNumber: '+919376988788',
    recipientNumber: '+919376988788',
    businessAccountId: '',
    phoneNumberId: '',
    accessToken: '',
    notifyOnOrder: true,
    notifyOnPayment: true,
    notifyOnShipment: true,
    notifyOnDelivery: true,
    notifyOnCancel: true,
    templateOrderPlaced: 'order_notification_lappy_square',
    templatePaymentVerified: 'payment_verified_lappy_square',
  });

  const [logs, setLogs] = useState<WhatsAppLogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/whatsapp');
      if (res.ok) {
        const data = await res.json();
        if (data.setting) setSetting(data.setting);
        if (data.logs) setLogs(data.logs);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/admin/whatsapp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setting),
      });

      if (!res.ok) throw new Error('Failed to update settings');
      setStatusMsg({ type: 'success', text: 'WhatsApp settings saved successfully!' });
      await fetchData();
    } catch (err: unknown) {
      setStatusMsg({ type: 'error', text: err instanceof Error ? err.message : 'Error saving settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleSendTest = async () => {
    setTestSending(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/admin/whatsapp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testNumber: setting.recipientNumber }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Test message failed');
      setStatusMsg({ type: 'success', text: data.message });
      await fetchData();
    } catch (err: unknown) {
      setStatusMsg({ type: 'error', text: err instanceof Error ? err.message : 'Failed to send test' });
    } finally {
      setTestSending(false);
    }
  };

  const handleRetry = async (logId: string) => {
    try {
      const res = await fetch('/api/admin/whatsapp/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: 'Notification re-sent successfully!' });
        await fetchData();
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Retry failed' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Retry request failed' });
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading WhatsApp configuration...</div>;
  }

  return (
    <div className="space-y-8 max-w-6xl">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Section 15 • Official Meta Cloud API
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <WhatsAppIcon className="w-7 h-7 text-[#25D366] shrink-0" />
            <span>WhatsApp Order Notifications</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure automated WhatsApp order notifications dispatched upon customer purchases and verified payments.
          </p>
        </div>

        <button
          onClick={handleSendTest}
          disabled={testSending}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{testSending ? 'Sending Test...' : 'Send Test Notification'}</span>
        </button>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white border border-[#E8E8E8] rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
        
        {/* Toggle master */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Automatic WhatsApp Order Notifications
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              When enabled, a complete order summary is automatically pushed to WhatsApp upon order creation.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={setting.enabled}
              onChange={(e) => setSetting({ ...setting, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
          </label>
        </div>

        {/* Numbers & Credentials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Store Owner Recipient WhatsApp Number *
            </label>
            <input
              type="text"
              value={setting.recipientNumber}
              onChange={(e) => setSetting({ ...setting, recipientNumber: e.target.value })}
              required
              placeholder="+919376988788"
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none focus:border-slate-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              International format (with country code e.g. +91) that receives new order notifications.
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Public Customer Support WhatsApp Number
            </label>
            <input
              type="text"
              value={setting.businessNumber}
              onChange={(e) => setSetting({ ...setting, businessNumber: e.target.value })}
              required
              placeholder="+919376988788"
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none focus:border-slate-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Shown to customers on product pages for &ldquo;Ask on WhatsApp&rdquo; enquiries.
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Meta WhatsApp Phone Number ID
            </label>
            <input
              type="text"
              value={setting.phoneNumberId || ''}
              onChange={(e) => setSetting({ ...setting, phoneNumberId: e.target.value })}
              placeholder="e.g. 109823471928374"
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none focus:border-slate-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Obtained from Meta App Dashboard &gt; WhatsApp &gt; API Setup.
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              WhatsApp Business Account ID (WABA ID)
            </label>
            <input
              type="text"
              value={setting.businessAccountId || ''}
              onChange={(e) => setSetting({ ...setting, businessAccountId: e.target.value })}
              placeholder="e.g. 293847192837465"
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none focus:border-slate-800"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-800 mb-1">
              Meta System User Permanent Access Token
            </label>
            <div className="relative">
              <input
                type="password"
                value={setting.accessToken || ''}
                onChange={(e) => setSetting({ ...setting, accessToken: e.target.value })}
                placeholder="EAA..."
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 pl-9 outline-none focus:border-slate-800 font-mono text-[11px]"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Token is masked and encrypted on server. Leave unchanged to keep current token.
            </p>
          </div>
        </div>

        {/* Triggers */}
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
            Notification Event Triggers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={setting.notifyOnOrder}
                onChange={(e) => setSetting({ ...setting, notifyOnOrder: e.target.checked })}
              />
              <span className="font-semibold text-slate-800">New Order Placed (COD/Online)</span>
            </label>

            <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={setting.notifyOnPayment}
                onChange={(e) => setSetting({ ...setting, notifyOnPayment: e.target.checked })}
              />
              <span className="font-semibold text-slate-800">Verified Payment Confirmed</span>
            </label>

            <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={setting.notifyOnCancel}
                onChange={(e) => setSetting({ ...setting, notifyOnCancel: e.target.checked })}
              />
              <span className="font-semibold text-slate-800">Order Cancellation / Refund</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>

      {/* Notification Delivery History Log */}
      <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Notification Audit Logs ({logs.length})
            </h2>
            <p className="text-xs text-slate-400">Complete delivery history and provider message IDs</p>
          </div>
          <button
            onClick={fetchData}
            className="p-1.5 text-slate-400 hover:text-black rounded-lg"
            title="Refresh logs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {logs.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No notifications recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5">Date & Time</th>
                  <th className="py-2.5">Order / Event</th>
                  <th className="py-2.5">Recipient</th>
                  <th className="py-2.5">Type</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Message ID</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-3 text-slate-500">
                      {new Date(log.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-3 font-semibold text-slate-900">
                      {log.order ? (
                        <Link href={`/admin/orders/${log.orderId}`} className="hover:underline">
                          #{log.order.orderNumber} (₹{log.order.totalAmount.toLocaleString('en-IN')})
                        </Link>
                      ) : (
                        log.messageType
                      )}
                    </td>
                    <td className="py-3 font-mono text-[11px] text-slate-600">
                      {log.recipient}
                    </td>
                    <td className="py-3">
                      <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {log.messageType}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'SENT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-[10px] text-slate-400 truncate max-w-[140px]">
                      {log.providerMessageId || 'N/A'}
                    </td>
                    <td className="py-3 text-right">
                      {log.orderId && (
                        <button
                          onClick={() => handleRetry(log.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold border border-slate-200 hover:border-black rounded-lg text-slate-800 hover:bg-slate-50"
                        >
                          Retry
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
