'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ShieldCheck,
  BatteryCharging,
  Cpu,
  Monitor,
  Wifi,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function TrustSection() {
  const [activeTab, setActiveTab] = useState<'45point' | 'grades' | 'warranty'>('45point');

  return (
    <section className="py-20 bg-[#F7F8FA] border-y border-[#E8E8E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold text-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>The Lappy Square Standard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Why Buy Refurbished from Lappy Square?
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            We don’t just resell second-hand laptops. We professionally refurbish, rigorously test, and certify every single device to deliver like-new performance with complete peace of mind.
          </p>
        </div>

        {/* Interactive Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white border border-[#E8E8E8] p-1.5 rounded-2xl flex flex-wrap gap-2 shadow-sm">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setActiveTab('45point')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === '45point'
                  ? 'bg-slate-900 text-white shadow'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              45-Point Inspection Lab
            </button>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setActiveTab('grades')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'grades'
                  ? 'bg-slate-900 text-white shadow'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              Honest Grading System
            </button>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setActiveTab('warranty')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'warranty'
                  ? 'bg-slate-900 text-white shadow'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              1-Year Warranty & Returns
            </button>
          </div>
        </div>

        {/* Tab 1: 45-Point Inspection */}
        {activeTab === '45point' && (
          <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 sm:p-10 shadow-sm animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Monitor className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Display & Panel Health</h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>0 Dead Pixels & Sub-Pixel Verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Backlight Bleed & Uniformity Test</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Hinge Rigidity & 180° / 360° Smoothness</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BatteryCharging className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Battery & Charging Circuits</h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Minimum 85%+ OEM Certified Battery Health</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Under-Load Discharge & Thermal Profiling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>OEM Adapter & Type-C Thunderbolt Power Test</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Motherboard, RAM & Cooling</h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>10-Minute Full CPU/GPU Stress Benchmark</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Heatsink Ultrasonic Cleaning & Fresh Thermal Paste</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>NVMe SSD SMART Health (Zero Bad Sectors)</span>
                  </li>
                </ul>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500">
                Every laptop ships with a signed physical 45-point testing report certificate.
              </p>
              <Link
                href="/warranty"
                className="text-xs font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>Read Full Lab Protocol</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Tab 2: Condition Grades */}
        {activeTab === 'grades' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
            
            <div className="bg-white border-2 border-emerald-500/30 rounded-3xl p-6 shadow-sm relative">
              <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full absolute -top-3 left-6 shadow">
                Top Recommendation
              </span>
              <h3 className="text-lg font-black text-slate-950 mt-2">Grade A+ (Like New)</h3>
              <p className="text-xs text-slate-500 mb-4">Open-box or minimal demo units</p>
              <ul className="space-y-2 text-xs text-slate-700 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Flawless body with no visible scratches</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Display 100% pristine with zero marks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Battery health certified 90%+ OEM</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Includes 1-Year Comprehensive Warranty</span>
                </li>
              </ul>
              <Link href="/shop?grade=LIKE_NEW" className="block text-center py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800">
                Browse Grade A+ Laptops
              </Link>
            </div>

            <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-black text-slate-950">Grade A (Excellent)</h3>
              <p className="text-xs text-slate-500 mb-4">Best value for money</p>
              <ul className="space-y-2 text-xs text-slate-700 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Very minor faint hair-lines on outer lid only</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Screen & keyboard 100% spotless</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Battery health certified 85%+ OEM</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Includes 1-Year Comprehensive Warranty</span>
                </li>
              </ul>
              <Link href="/shop?grade=EXCELLENT" className="block text-center py-2.5 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xl hover:border-black">
                Browse Grade A Laptops
              </Link>
            </div>

            <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-black text-slate-950">Grade B (Budget Pick)</h3>
              <p className="text-xs text-slate-500 mb-4">Lowest price guarantee</p>
              <ul className="space-y-2 text-xs text-slate-700 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Normal cosmetic wear or light scuffs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>100% fully functional hardware & screen</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Battery health tested at 80%+ OEM</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Includes 6-Month Lappy Square Warranty</span>
                </li>
              </ul>
              <Link href="/shop?grade=GOOD" className="block text-center py-2.5 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xl hover:border-black">
                Browse Grade B Laptops
              </Link>
            </div>

          </div>
        )}

        {/* Tab 3: Warranty & Returns */}
        {activeTab === 'warranty' && (
          <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 sm:p-10 shadow-sm animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">1-Year Comprehensive Warranty</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We cover motherboard, RAM, SSD, screen, and charging circuitry. If any issue arises, just call or WhatsApp our technical support team or visit our store. We provide quick certified diagnosis, on-site testing, and repair or unit replacement.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">7-Day Zero Risk Replacement</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Inspect your laptop thoroughly at home. If you are not 100% satisfied with the cosmetic condition or performance, return or exchange it within 7 days for a hassle-free replacement or full refund.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
