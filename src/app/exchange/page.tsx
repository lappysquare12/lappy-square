'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RefreshCw, CheckCircle2, ArrowRight, Sparkles, Laptop, ShieldCheck, Send, Loader2 } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ExchangePage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    oldDevice: '',
    desiredDevice: 'MacBook Pro or ThinkPad',
    condition: 'Working Good',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        type: 'EXCHANGE',
        message: `Exchange upgrade: Old laptop (${formData.oldDevice}, condition: ${formData.condition}) for upgraded (${formData.desiredDevice})`,
      }),
    });
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 sm:py-16 selection:bg-blue-700 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-700 transition-colors font-medium">Home</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold">Exchange & Trade-In Upgrades</span>
        </nav>

        {/* HERO BANNER */}
        <ScrollReveal direction="up" delay={0.05}>
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl space-y-5">
            <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-300 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Flat Extra ₹3,000 Exchange Bonus on Flagships</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Trade-In Your Old Laptop & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Upgrade to Grade A+ Today</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Exchange any functioning used Windows laptop or older MacBook for an instant discount against any certified ThinkPad, Dell Latitude, or MacBook Pro in our catalogue.
            </p>
          </div>
        </ScrollReveal>

        {/* EXCHANGE FORM */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Request Your Exchange Valuation
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tell us about your current device and your desired upgrade. We will provide an instant discount quote.
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-950">Exchange Request Registered!</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Our trade-in specialist will contact you with your guaranteed trade-in valuation and exchange discount coupon within 15 minutes.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold"
              >
                Submit Another Request
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Full Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp Phone Number <span className="text-rose-500">*</span></label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Current Old Laptop (Brand & Model) <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dell Inspiron 15 3000 / MacBook Air 2017 (Intel Core i5, 8GB RAM)"
                  value={formData.oldDevice}
                  onChange={(e) => setFormData({ ...formData, oldDevice: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Physical & Working Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600 font-semibold text-slate-800"
                  >
                    <option value="Working Flawless">Working Flawless (No dents, clean screen)</option>
                    <option value="Working Good">Working Good (Minor scratches, good battery)</option>
                    <option value="Working Average">Working Average (Battery weak or noticeable wear)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Desired Upgrade Machine</label>
                  <input
                    type="text"
                    placeholder="e.g. Lenovo ThinkPad T14 / MacBook Pro 16 M1"
                    value={formData.desiredDevice}
                    onChange={(e) => setFormData({ ...formData, desiredDevice: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600 font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-700/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                <span>Calculate My Exchange Value Now</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
