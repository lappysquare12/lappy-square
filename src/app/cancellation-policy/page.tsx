'use client';

import React from 'react';
import PolicyLayout from '@/components/layout/PolicyLayout';
import { XCircle, Clock, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function CancellationPolicyPage() {
  return (
    <PolicyLayout
      title="Order Cancellation & Modification Policy"
      subtitle="Clear guidelines on pre-dispatch cancellation, in-transit cancellation, and immediate refund processing."
      badge="Pre-Dispatch 100% Free Cancellation"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <XCircle className="w-5 h-5 text-blue-700" />
            <span>1. Cancellation Before Dispatch (100% Full Refund)</span>
          </h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            You may cancel any order at zero penalty or cost at any time prior to package dispatch and courier AWB generation. To cancel before dispatch, simply call or WhatsApp our desk at <strong>+91 93769 88788</strong> or email <strong>lappysquare12@gmail.com</strong>. The full paid amount will be reversed immediately.
          </p>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span>2. Cancellation After Courier Dispatch</span>
          </h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            If your laptop has already been handed over to air cargo (Blue Dart / Delhivery), we can still initiate an in-transit recall. In such cases, nominal one-way air freight charges (₹500 - ₹800 depending on region) may be deducted from the final refund, with the remaining balance credited back promptly.
          </p>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-emerald-600" />
            <span>3. Order Modification / Address Changes</span>
          </h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            Need to change your shipping address, phone number, or swap to another laptop configuration before shipment? Contact us within <strong>4 hours</strong> of placing your order and we will update your shipment manifest free of charge.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 space-y-1">
          <div className="flex items-center gap-2 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Fast Hassle-Free Cancellation</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600">
            For Cash on Delivery and WhatsApp orders, you can cancel freely before dispatch by contacting our WhatsApp support team.
          </p>
        </div>
      </div>
    </PolicyLayout>
  );
}
