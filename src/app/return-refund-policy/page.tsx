'use client';

import React from 'react';
import PolicyLayout from '@/components/layout/PolicyLayout';
import { RotateCcw, CheckCircle2, ShieldCheck, DollarSign, Truck, AlertCircle } from 'lucide-react';

export default function ReturnRefundPolicyPage() {
  const returnScenarios = [
    { title: 'Hardware Performance Flaw', desc: 'Any component issue, thermal overheating, or port malfunction discovered during your 7-day home testing period.' },
    { title: 'Condition Grade Mismatch', desc: 'If the cosmetic condition does not strictly align with our declared Grade A+ or Grade A benchmark photos.' },
    { title: 'Accessory or Transit Issue', desc: 'Missing OEM power charger, damaged packaging in transit, or incorrect specification delivery.' },
  ];

  return (
    <PolicyLayout
      title="7-Day Return, Replacement & Refund Policy"
      subtitle="Your satisfaction is 100% guaranteed. Test your laptop at home for a full 7 days with zero financial risk."
      badge="7-Day Money Back Guarantee"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-blue-700" />
            <span>1. 7-Day Hassle-Free Testing Window</span>
          </h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            We believe you need real-world time to test your laptop with your daily coding IDEs, corporate software, or streaming workloads. If within <strong>7 calendar days</strong> from delivery you encounter any hardware defect or cosmetic discrepancy, we provide an immediate <strong>1-to-1 Unit Replacement</strong> or <strong>100% Full Refund</strong>.
          </p>
        </div>

        {/* ELIGIBILITY CARDS */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Covered Replacement Scenarios</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {returnScenarios.map((sc, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1">
                <span className="text-xs font-bold text-slate-950 block">{sc.title}</span>
                <span className="text-[11px] text-slate-500 block leading-relaxed">{sc.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-700" />
            <span>2. Zero Reverse Pickup Charges</span>
          </h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            You will never be charged for return shipping. Lappy Square books and pays for an insured courier to pick up the device directly from your doorstep across India.
          </p>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <span>3. Rapid 3-5 Day Refund Timeline</span>
          </h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            Once the machine is received back at our diagnostic hub, our team inspects serial numbers and releases the refund within <strong>24 to 48 hours</strong>. The funds reflect back in your original payment mode (Bank Account, UPI, Credit Card) within 3 to 5 business days.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-blue-950 space-y-1">
          <div className="flex items-center gap-2 font-bold text-xs text-blue-800">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>How to Initiate a Return</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-700">
            Simply send a WhatsApp message to <strong>+91 93769 88788</strong> or email <strong>lappysquare12@gmail.com</strong> with your Order ID and photos. Our team initiates the reverse pickup immediately.
          </p>
        </div>
      </div>
    </PolicyLayout>
  );
}
