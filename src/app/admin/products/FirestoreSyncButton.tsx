'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Database, RefreshCw, Mail, CheckCircle2, AlertCircle, Loader2, Cloud } from 'lucide-react';

export default function FirestoreSyncButton() {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'success' | 'error' | null>(null);

  const [testingEmail, setTestingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<'success' | 'error' | null>(null);

  const handleSyncFirestore = async () => {
    setSyncing(true);
    setSyncMessage(null);
    setSyncStatus(null);

    try {
      const res = await fetch('/api/admin/sync-firestore', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to sync with Firestore');
      }

      setSyncStatus('success');
      setSyncMessage(data.message || `Successfully synced ${data.synced} products to Firestore!`);
      router.refresh();
    } catch (err: any) {
      setSyncStatus('error');
      setSyncMessage(err.message || 'Sync error');
    } finally {
      setSyncing(false);
    }
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    setEmailMessage(null);
    setEmailStatus(null);

    try {
      const res = await fetch('/api/admin/test-email', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch test email');
      }

      setEmailStatus('success');
      setEmailMessage(data.message || 'Test email sent to lappysquare12@gmail.com!');
    } catch (err: any) {
      setEmailStatus('error');
      setEmailMessage(err.message || 'Email test failed');
    } finally {
      setTestingEmail(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {/* Firestore Sync Button */}
        <button
          onClick={handleSyncFirestore}
          disabled={syncing}
          title="Push all products to Firebase Firestore collection"
          className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          {syncing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
          ) : (
            <Database className="w-3.5 h-3.5 text-emerald-600" />
          )}
          <span>{syncing ? 'Syncing to Firestore...' : 'Sync Firestore DB'}</span>
        </button>

        {/* Resend Test Email Button */}
        <button
          onClick={handleTestEmail}
          disabled={testingEmail}
          title="Send test email notification to lappysquare12@gmail.com"
          className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          {testingEmail ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
          ) : (
            <Mail className="w-3.5 h-3.5 text-indigo-600" />
          )}
          <span>{testingEmail ? 'Sending Test...' : 'Test Resend Mail'}</span>
        </button>
      </div>

      {/* Sync Status Banner */}
      {syncMessage && (
        <div
          className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border animate-in fade-in duration-200 ${
            syncStatus === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {syncStatus === 'success' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
          )}
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Email Status Banner */}
      {emailMessage && (
        <div
          className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border animate-in fade-in duration-200 ${
            emailStatus === 'success'
              ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          {emailStatus === 'success' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          )}
          <span>{emailMessage}</span>
        </div>
      )}
    </div>
  );
}
