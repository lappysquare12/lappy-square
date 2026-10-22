'use client';

import React from 'react';
import PolicyLayout from '@/components/layout/PolicyLayout';
import { FileText, ShieldCheck, Scale, Cpu, AlertCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms & Conditions of Sale"
      subtitle="Governing terms, commercial contracts, customer rights, and warranty commitments for all Lappy Square transactions."
      badge="Commercial Terms of Sale"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-700" />
            <span>1. Commercial Sale Agreement</span>
          </h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            By browsing, interacting with, or placing an order on <strong>Lappy Square</strong>, you enter into a legally binding sales agreement governed by the laws of India and the jurisdiction of courts in New Delhi.
          </p>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-700" />
            <span>2. Certified Refurbished Hardware Standards</span>
          </h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            Unless explicitly designated as &quot;Brand New Open-Box&quot;, all laptops sold on Lappy Square are certified pre-owned, corporate enterprise lease returns, or lab-refurbished machines. Each unit is individually cleaned, ultrasonically treated, hardware-benchmarked, and graded according to our transparent cosmetic criteria (Grade A+ Like New, Grade A Pristine, Grade B Certified).
          </p>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>3. Warranty Scope & Limitations</span>
          </h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            The comprehensive warranty period specified on your official tax invoice (typically 12 months for Grade A+/A laptops, 6 months for Grade B) covers internal hardware failures including motherboard circuitry, memory modules, SSD storage, power circuits, and display defects.
          </p>
          <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600 leading-relaxed space-y-1">
            <strong className="block text-slate-900 font-bold">Exclusions from Warranty Coverage:</strong>
            <ul className="list-disc pl-5 space-y-1">
              <li>Direct accidental drops, cosmetic fractures, or shattered display panels.</li>
              <li>Liquid ingress, water spills, or chemical corrosion.</li>
              <li>Unauthorized opening of base cover or tampering with Lappy Square warranty security seals.</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-700" />
            <span>4. Pricing, Taxes & Invoicing</span>
          </h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            All prices listed on our platform are inclusive of 18% GST unless stated otherwise. Legitimate business entities providing a valid GSTIN at checkout receive full tax credit invoices. Lappy Square reserves the right to cancel orders originating from technical pricing errors before dispatch with immediate 100% refund.
          </p>
        </div>
      </div>
    </PolicyLayout>
  );
}
