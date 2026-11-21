'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Image as ImageIcon,
  ShieldCheck,
} from 'lucide-react';

interface BatchWhiteBgModalProps {
  onSuccess?: () => void;
}

interface Stats {
  total: number;
  cloudinaryCount: number;
  alreadyWhiteBg: number;
  pendingWhiteBg: number;
}

export default function BatchWhiteBgModal({ onSuccess }: BatchWhiteBgModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [processing, setProcessing] = useState(false);
  const [resultMsg, setResultMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchStats = async () => {
    setLoadingStats(true);
    setResultMsg(null);
    try {
      const res = await fetch('/api/admin/products/batch-white-bg');
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch {
      // ignore
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  const handleAction = async (action: 'apply' | 'revert') => {
    setProcessing(true);
    setResultMsg(null);
    try {
      const res = await fetch('/api/admin/products/batch-white-bg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Operation failed');
      }

      setResultMsg({ type: 'success', text: data.message });
      await fetchStats();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setResultMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error processing images',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="h-10 px-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-800 border border-blue-200/90 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:shadow-sm cursor-pointer whitespace-nowrap shrink-0"
        title="Automatically remove background and apply pure white studio background across all existing laptop photos"
      >
        <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span>Auto White-BG</span>
        <span className="text-[9px] bg-blue-600 text-white font-black px-1.5 py-0.2 rounded-full uppercase shrink-0">
          AI
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Studio White Background (Batch AI)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Auto-remove backgrounds and apply clean studio white behind all laptop photos.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status / Overview Cards */}
            {loadingStats ? (
              <div className="p-8 text-center space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">Scanning catalog image URLs...</p>
              </div>
            ) : stats ? (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Cloudinary Photos
                  </span>
                  <span className="text-lg font-black text-slate-900 mt-0.5 block">
                    {stats.cloudinaryCount}
                  </span>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                    Studio White BG
                  </span>
                  <span className="text-lg font-black text-emerald-700 mt-0.5 block">
                    {stats.alreadyWhiteBg}
                  </span>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                    Pending / Original
                  </span>
                  <span className="text-lg font-black text-amber-800 mt-0.5 block">
                    {stats.pendingWhiteBg}
                  </span>
                </div>
              </div>
            ) : null}

            {/* Informational Guidance */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-200/70 rounded-2xl space-y-1.5 text-xs text-blue-900">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>How Cloudinary AI Studio Mode Works:</span>
              </div>
              <p className="text-[11px] text-blue-800/90 leading-relaxed">
                Applies Cloudinary AI background removal with crisp pure white (#FFFFFF) background to all existing uploaded laptop photos. The changes sync directly to SQLite and Firestore live across the website.
              </p>
            </div>

            {/* Result Message Toast */}
            {resultMsg && (
              <div
                className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
                  resultMsg.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {resultMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{resultMsg.text}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={processing || loadingStats}
                onClick={() => handleAction('apply')}
                className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-700/20 transition-all cursor-pointer"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Processing Images with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Apply Studio White-BG to All Existing Images ({stats?.pendingWhiteBg || 0} Pending)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={processing || loadingStats}
                onClick={() => handleAction('revert')}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-2xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Revert All Photos to Original Background</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
