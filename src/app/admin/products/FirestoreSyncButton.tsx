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
      setEmailMessage(data.message || 'Test email sent to lappysquare@gmail.com!');
    } catch (err: any) {
      setEmailStatus('error');
      setEmailMessage(err.message || 'Email test failed');
    } finally {
      setTestingEmail(false);
    }
  };

  return (
    <div className="relative flex items-center gap-2 shrink-0">
      {/* Firestore Sync Button */}
      <button
        onClick={handleSyncFirestore}
        disabled={syncing}
        title="Push all products to Firebase Firestore collection"
        className="h-10 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer"
      >
        {syncing ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
        ) : (
          <Database className="w-3.5 h-3.5 text-emerald-600" />
        )}
        <span>{syncing ? 'Syncing...' : 'Sync Firestore DB'}</span>
      </button>

      {/* Resend Test Email Button */}
      <button
        onClick={handleTestEmail}
        disabled={testingEmail}
        title="Send test email notification to lappysquare@gmail.com"
        className="h-10 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer"
      >
        {testingEmail ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
        ) : (
          <Mail className="w-3.5 h-3.5 text-indigo-600" />
        )}
        <span>{testingEmail ? 'Sending Test...' : 'Test Resend Mail'}</span>
      </button>

      {/* Floating Status Toast for Sync / Email (Never breaks button line) */}
      {(syncMessage || emailMessage) && (
        <div className="absolute top-full mt-2 left-0 z-50 whitespace-nowrap bg-white border border-slate-200 shadow-xl rounded-xl p-2.5 flex items-center gap-2 text-xs font-semibold animate-in fade-in zoom-in-95 duration-200">
          {syncMessage && (
            <span
              className={`flex items-center gap-1.5 ${
                syncStatus === 'success' ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {syncStatus === 'success' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              )}
              {syncMessage}
            </span>
          )}
          {emailMessage && (
            <span
              className={`flex items-center gap-1.5 ${
                emailStatus === 'success' ? 'text-indigo-700' : 'text-amber-700'
              }`}
            >
              {emailStatus === 'success' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              )}
              {emailMessage}
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              setSyncMessage(null);
              setEmailMessage(null);
            }}
            className="text-slate-400 hover:text-black ml-2 font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
