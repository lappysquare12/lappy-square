'use client';

import React from 'react';
import PolicyLayout from '@/components/layout/PolicyLayout';
import { Store, ShieldCheck, Clock, MapPin, PackageCheck, CheckCircle2 } from 'lucide-react';

export default function ShippingPolicyPage() {
  const storeHighlights = [
    { area: 'Store Location', time: 'Paris Tower, Vijay Path Chauraha, Mansarovar, Jaipur', desc: 'Paris Tower, Near Vijay Path Chauraha, Madhyam Marg, Mansarovar, Jaipur, Rajasthan 302020.' },
    { area: 'Timings', time: 'Open 7 Days a Week (11:00 AM - 8:30 PM)', desc: 'Visit at your convenience for live demos and direct purchase.' },
    { area: 'Live Testing', time: 'Full Diagnostic Run on Spot', desc: 'Test keyboard, display, battery health, and ports before buying.' },
    { area: 'Instant Handover', time: 'Zero Waiting Period', desc: 'Walk out with your certified laptop, genuine OEM charger & invoice.' },
  ];

  return (
    <PolicyLayout
      title="Store Visit & In-Person Purchase Policy"
      subtitle="Complete transparency on visiting our experience center, live hardware inspection, and direct store pickup standards."
      badge="Store Experience Center"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <Store className="w-5 h-5 text-blue-700" />
            <span>1. In-Store Experience & Direct Pickup</span>
          </h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            At Lappy Square, we believe purchasing a laptop should be 100% transparent and hands-on. We encourage all customers to visit our store experience center to touch, feel, and test multiple models before deciding on the perfect machine for your workflow.
          </p>
        </div>

        {/* TIMELINE / STORE CARDS */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-700" />
            <span>Store Visit & Handover Details</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {storeHighlights.map((tier, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1">
                <span className="text-xs font-bold text-slate-950 block">{tier.area}</span>
                <span className="text-xs font-black text-blue-700 block">{tier.time}</span>
                <span className="text-[11px] text-slate-500 block leading-tight">{tier.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>2. Hands-On Live Hardware Testing</span>
          </h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            Every machine is accompanied by our verified 45-point diagnostic report. When you visit our store, our technicians will run benchmark stress tests, verify battery cycle count & health percentage, and demonstrate all ports, webcam, speakers, and keyboard responsiveness right in front of you.
          </p>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-blue-700" />
            <span>3. Packaging, OEM Charger & Invoicing</span>
          </h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            Once you finalize your laptop, it is neatly boxed with its genuine OEM power adapter, power cord, and warranty card. We issue an official computer-generated tax invoice (with 18% GST Input Credit for corporate/business buyers upon request).
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-blue-950 space-y-1">
          <div className="flex items-center gap-2 font-bold text-xs text-blue-900">
            <CheckCircle2 className="w-4 h-4 text-blue-700" />
            <span>Online Reservation via WhatsApp</span>
          </div>
          <p className="text-[11px] leading-relaxed text-blue-800">
            Want to hold a specific unit before heading to the store? Click &quot;Get Today&apos;s Best Price&quot; or connect on WhatsApp at +91 93769 88788 to reserve your preferred model for same-day store pickup.
          </p>
        </div>
      </div>
    </PolicyLayout>
  );
}
