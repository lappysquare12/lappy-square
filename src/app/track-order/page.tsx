'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, Search, ArrowRight, ShieldCheck, Truck, CheckCircle2, Clock, MapPin, Sparkles } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function TrackOrderPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      router.push(`/order-success/${orderNumber.trim().toUpperCase()}`);
    }
  };

  const sampleOrders = ['LS-ORD-2025-01', 'LS-ORD-2025-02'];

  return (
    <div className="bg-[#F8FAFC] min-h-[80vh] py-12 sm:py-20 flex items-center justify-center selection:bg-blue-700 selection:text-white">
      <div className="max-w-xl w-full mx-auto px-4 space-y-8">
        
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 flex items-center justify-center gap-2">
          <Link href="/" className="hover:text-blue-700 transition-colors font-medium">Home</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold">Order / Reservation Status</span>
        </nav>

        {/* TRACKING CARD */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-xl space-y-6 text-center relative overflow-hidden"
        >
          {/* Top Decorative Stage */}
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-700 shadow-sm">
            <Package className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Real-Time Order Verification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Check Order & Reservation Status
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              Enter your Lappy Square Order ID or WhatsApp booking reference to view details, invoice, and warranty status.
            </p>
          </div>

          <form onSubmit={handleTrack} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                placeholder="Order ID (e.g. LS-ORD-2025-01)"
                required
                className="w-full bg-[#F8FAFC] border border-slate-200 text-xs sm:text-sm font-bold rounded-2xl p-4 pl-11 outline-none uppercase focus:border-blue-600 text-slate-950 shadow-inner"
              />
              <Package className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-lg shadow-blue-700/25 flex items-center justify-center gap-2 hover:translate-y-[-1px]"
            >
              <span>Track Parcel Live</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Sample quick test pill */}
          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-center gap-2">
            <span>Try sample order:</span>
            {sampleOrders.map((ord) => (
              <button
                key={ord}
                type="button"
                onClick={() => setOrderNumber(ord)}
                className="font-mono font-bold text-blue-700 hover:underline bg-blue-50 px-2 py-0.5 rounded-md"
              >
                {ord}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-6 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              100% Insured Air Transit
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Tamper-Proof Seal
            </span>
          </div>
        </motion.div>

        {/* LOGISTICS PARTNERS FOOTNOTE */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 text-center text-xs text-slate-500 shadow-xs space-y-1">
          <p className="font-semibold text-slate-800">Need urgent dispatch escalation?</p>
          <p className="text-[11px]">
            Call our logistics dispatch desk directly at <strong className="text-slate-900 font-bold">+91 93769 88788</strong> or chat on WhatsApp.
          </p>
        </div>

      </div>
    </div>
  );
}
