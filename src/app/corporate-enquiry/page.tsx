'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, CheckCircle2, ArrowRight, ShieldCheck, FileText, Laptop, Users, Send, Loader2, Sparkles } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function CorporateEnquiryPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    quantity: '10-25 Units',
    gstin: '',
    requirements: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const perks = [
    {
      icon: FileText,
      title: 'Full 18% GST Input Credit',
      desc: 'Save 18% directly on your balance sheet with compliant B2B tax invoices carrying your company GSTIN.',
    },
    {
      icon: Laptop,
      title: 'Standardized IT Fleets',
      desc: 'Deploy identical ThinkPad, Latitude, or MacBook specs to your engineering and operations teams for effortless IT management.',
    },
    {
      icon: ShieldCheck,
      title: 'Dedicated Enterprise SLA',
      desc: 'Priority doorstep repairs, immediate unit replacement buffers, and dedicated corporate account managers.',
    },
    {
      icon: Users,
      title: 'Bulk Corporate Buyback',
      desc: 'Looking to liquidate your older corporate fleet? Get highest trade-in credit against fresh certified machines.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${formData.contactPerson} (${formData.companyName})`,
        email: formData.email,
        phone: formData.phone,
        type: 'CORPORATE',
        message: `Corporate Procurement | Quantity: ${formData.quantity} | GSTIN: ${formData.gstin || 'N/A'} | Requirements: ${formData.requirements}`,
      }),
    });
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 sm:py-16 selection:bg-blue-700 selection:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-700 transition-colors font-medium">Home</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold">Corporate Fleet Procurement & B2B Solutions</span>
        </nav>

        {/* HERO SECTION */}
        <ScrollReveal direction="up" delay={0.05}>
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-8 sm:p-14 border border-slate-800 shadow-2xl space-y-5">
            <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-300 tracking-wide uppercase backdrop-blur-md">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>B2B Enterprise IT Procurement & Buyback</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Equip Your Workforce with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Certified Enterprise Laptops</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Cut startup & enterprise IT procurement costs by up to 60% without compromising on build quality or performance. Standardized ThinkPads, Dell Latitudes, and MacBooks with full 18% GST input credit.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 ENTERPRISE ADVANTAGES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {perks.map((p, i) => {
            const IconComp = p.icon;
            return (
              <div key={i} className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-950">{p.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* B2B INQUIRY FORM */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Fast Corporate Quote</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
              Request Customized Fleet Proposal
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Dedicated corporate account manager response guaranteed within 2 business hours.
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
              <h3 className="text-2xl font-black text-slate-950">Corporate RFP Logged!</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Your bulk requirements have been assigned to an Enterprise Solutions Specialist. You will receive an official PDF quotation and callback shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold"
              >
                Send Another Inquiry
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company / Organization Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Innovatech Solutions Pvt Ltd"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Person & Designation <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Mehta (IT Operations Lead)"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Corporate Email Address <span className="text-rose-500">*</span></label>
                  <input
                    type="email"
                    required
                    placeholder="vikram@innovatech.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Direct Phone / Mobile <span className="text-rose-500">*</span></label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Required Volume / Units</label>
                  <select
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600 font-semibold text-slate-800"
                  >
                    <option value="5-10 Units">5 – 10 Units (Small Team)</option>
                    <option value="10-25 Units">10 – 25 Units (Growth Stage)</option>
                    <option value="25-50 Units">25 – 50 Units (Mid-Sized)</option>
                    <option value="50-100+ Units">50 – 100+ Units (Enterprise)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Company GSTIN Number (For 18% Input Credit)</label>
                <input
                  type="text"
                  placeholder="e.g. 07AAAAA0000A1Z5"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hardware Preferences & Requirements</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Need Lenovo ThinkPad T14 or Dell Latitude with 16GB RAM and minimum 512GB SSD for software dev batch..."
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-700/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Request Formal Corporate Quotation & SLA</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
