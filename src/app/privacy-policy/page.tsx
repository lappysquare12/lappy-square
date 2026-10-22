'use client';

import React from 'react';
import PolicyLayout from '@/components/layout/PolicyLayout';
import { Lock, ShieldCheck, Database, CreditCard, EyeOff } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Privacy & Customer Data Protection"
      subtitle="How Lappy Square protects your identity, contact details, payment information, and device data under Indian IT Act 2000."
      badge="PCI-DSS Encrypted & Zero Data Selling"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-700" />
            <span>1. Our Zero Data-Selling Commitment</span>
          </h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            At Lappy Square, your privacy is sacred. We <strong>never sell, monetize, rent, or trade</strong> your personal contact information, phone numbers, or buying history to any third-party marketing brokers or telemarketers.
          </p>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <span>2. Secure Orders & Privacy Protection</span>
          </h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            Lappy Square <strong>never stores sensitive banking credentials</strong>. Orders placed through WhatsApp and Cash on Delivery are verified directly through encrypted channels and official customer support.
          </p>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-700" />
            <span>3. What Information We Collect & Why</span>
          </h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            We collect only necessary transactional data:
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1.5 text-slate-600 text-xs">
            <li><strong>Name, Phone & Shipping Address:</strong> To deliver insured air cargo to your doorstep via Blue Dart / Delhivery.</li>
            <li><strong>Email Address:</strong> To transmit digital PDF tax invoices and warranty certificates.</li>
            <li><strong>GSTIN Number (Optional):</strong> For generating legal B2B business tax invoices.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-blue-700" />
            <span>4. Military-Standard Cryptographic Data Sanitization</span>
          </h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            When buying back used devices from customers or off-lease enterprises, all internal storage SSDs and HDDs undergo certified DoD 5220.22-M multi-pass cryptographic data wiping before re-allocation, guaranteeing zero residual corporate or personal data remnants.
          </p>
        </div>
      </div>
    </PolicyLayout>
  );
}
