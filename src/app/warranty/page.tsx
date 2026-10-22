'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Phone,
  ArrowRight,
  Cpu,
  BatteryCharging,
  Eye,
  HardDrive,
  Wifi,
  Store,
  Sparkles,
  FileCheck,
  Check,
  Award
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function WarrantyPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'motherboard' | 'battery' | 'display' | 'storage'>('all');

  const categories = [
    { key: 'all', label: 'All 45 Points' },
    { key: 'motherboard', label: 'Motherboard & Thermals' },
    { key: 'battery', label: 'Battery & Charger' },
    { key: 'display', label: 'Display & Hinges' },
    { key: 'storage', label: 'RAM & NVMe SSD' },
  ];

  const testItems = [
    { cat: 'motherboard', title: 'Motherboard Micro-Trace Diagnostic', desc: 'Full automated bus and VRM power circuit inspection' },
    { cat: 'motherboard', title: 'Arctic MX-4 Thermal Paste Re-paste', desc: 'Fresh thermal paste applied for optimal low temperatures' },
    { cat: 'motherboard', title: 'Ultrasonic Fan & Heatsink Cleaning', desc: 'Zero dust build-up ensuring whisper-quiet cooling performance' },
    { cat: 'motherboard', title: '6-Hour Continuous Prime95 Stress Run', desc: 'Maximum CPU and GPU thermal throttling benchmarking' },

    { cat: 'battery', title: 'Battery Discharge Curve Profiling', desc: 'Full laboratory charge-discharge testing verifying ≥ 85% healthy OEM capacity' },
    { cat: 'battery', title: 'OEM Genuine Charger Surge Safety', desc: 'Original brand power bricks verified for clean voltage delivery' },
    { cat: 'battery', title: 'USB-C Power Delivery (PD) Protocol', desc: 'Fast-charging handshake verified on all Type-C ports' },
    { cat: 'battery', title: 'Standby Sleep Mode Drain Test', desc: 'Ensures battery holds charge overnight without parasitic drain' },

    { cat: 'display', title: 'RGB Sub-Pixel Dead Pixel Scan', desc: 'Multi-color pattern check to guarantee crystal-clear IPS panel' },
    { cat: 'display', title: 'Backlight Uniformity & Pressure Marks', desc: 'Even luminescence across all corners with zero white-spots' },
    { cat: 'display', title: '180° / 360° Hinge Tension Calibration', desc: 'Smooth one-finger lid opening with zero wobble or creaks' },
    { cat: 'display', title: 'Bezel Rubber Gasket & Frame Inspection', desc: 'Clean aesthetics with zero cracks or misalignment' },

    { cat: 'storage', title: 'NVMe SSD SMART Health Verification', desc: 'Zero bad sectors and healthy total bytes written (TBW)' },
    { cat: 'storage', title: 'Sequential & Random Read/Write Test', desc: 'CrystalDiskMark verification of peak SSD throughput speeds' },
    { cat: 'storage', title: 'Dual-Channel Memory MemTest86 Run', desc: 'Comprehensive multi-pass test guaranteeing zero memory crashes' },
    { cat: 'storage', title: 'Secure Cryptographic Data Wipe', desc: 'DoD 5220.22-M military-grade sanitization of previous corporate data' },
  ];

  const filteredTests = activeTab === 'all' ? testItems : testItems.filter((t) => t.cat === activeTab);

  const claimSteps = [
    { step: '01', title: 'Instant WhatsApp Claim', desc: 'Ping our care line with your Order ID or Serial Number. No complicated forms.' },
    { step: '02', title: 'Remote Video Triage', desc: 'A senior engineer assists over video to verify software vs hardware triggers.' },
    { step: '03', title: 'Store Service / Walk-In', desc: 'Bring your device to our service center or coordinate directly with our technicians.' },
    { step: '04', title: 'Repair or Replacement', desc: 'Genuine component replacement or swift unit upgrade handed over to you.' },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 sm:py-16 selection:bg-blue-700 selection:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-700 transition-colors font-medium">Home</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold">1-Year Warranty & 45-Point Lab Testing</span>
        </nav>

        {/* HERO BANNER */}
        <ScrollReveal direction="up" delay={0.05}>
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-8 sm:p-14 lg:p-16 border border-slate-800 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-300 tracking-wide uppercase backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Lappy Square Assured Protection</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-none text-white">
                1-Year Comprehensive Warranty <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">& 45-Point Lab Certification</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Peace of mind shouldn&apos;t be an expensive add-on. Every certified refurbished laptop we sell includes our full written warranty, certified lab testing, and 7-day money-back satisfaction guarantee.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#checklist"
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  <span>View Lab Checklist</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="https://wa.me/919376988788?text=Hello%20Lappy%20Square%2C%20I%20want%20to%20register%20or%20inquire%20about%20my%20laptop%20warranty."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs sm:text-sm font-bold rounded-2xl transition-all backdrop-blur-md"
                >
                  Register / Claim Warranty
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 3 HIGHLIGHT METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-950">1-Year Full Coverage</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Covers motherboard, memory, internal storage, power circuits, and display hardware faults with free repair or replacement.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-950">7-Day Replacement Window</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Test your device in your daily workflow. If any hardware defect appears within 7 days, get an instant swap or 100% refund.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-950">Direct Store & Tech Support</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Visit our store or get direct engineer assistance on WhatsApp for hassle-free diagnostics and rapid resolution.
            </p>
          </div>
        </div>

        {/* INTERACTIVE 45-POINT CHECKLIST SECTION */}
        <div id="checklist" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Engineering Quality</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
                45-Point Hardware & Thermal Diagnostic Checklist
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Every single machine passes this benchmark before receiving Lappy Square hologram certification.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl self-start md:self-auto text-xs font-bold">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveTab(cat.key as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    activeTab === cat.key
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTests.map((test, idx) => (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-blue-500/40 hover:shadow-md transition-all space-y-2"
              >
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span className="text-[11px] uppercase tracking-wide">Pass Verified</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-950 leading-snug">{test.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{test.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 4-STEP DOORSTEP CLAIM TIMELINE */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Hassle-Free Support</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              How Our Warranty Support Works in 4 Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              No complicated paperwork. Instant engineer assistance on WhatsApp or store visit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {claimSteps.map((s, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 relative backdrop-blur-md">
                <span className="text-3xl font-black text-blue-400 font-mono">{s.step}</span>
                <h4 className="text-sm font-bold text-white">{s.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* HELP & CLAIMS CTA */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950">
              Have a Question About Your Laptop Warranty?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our support engineers are available on WhatsApp and phone hotline 7 days a week from 10:00 AM to 8:30 PM.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href="https://wa.me/919376988788?text=Hello%2C%20I%20have%20a%20query%20regarding%20Lappy%20Square%20warranty."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold rounded-2xl transition-all shadow-md text-center"
            >
              WhatsApp Support
            </a>
            <a
              href="tel:+919376988788"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-2xl transition-all shadow-md text-center"
            >
              Call +91 93769 88788
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
