'use client';

import React from 'react';
import PolicyLayout from '@/components/layout/PolicyLayout';
import {
  FileText,
  ShieldCheck,
  Scale,
  Cpu,
  AlertCircle,
  Store,
  CreditCard,
  RefreshCw,
  Lock,
  MessageCircle,
  HelpCircle,
  MapPin,
  CheckCircle2,
  Phone,
  Mail
} from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      subtitle="Governing terms, user eligibility, device sale/exchange guidelines, and commercial policies for all Lappy Square interactions."
      badge="Legal Contract of Use & Sale"
    >
      <div className="space-y-10 text-slate-700 text-sm leading-relaxed">
        
        {/* Important Notice Banner */}
        <div className="p-5 bg-gradient-to-r from-blue-50 via-sky-50 to-white border border-blue-200/90 rounded-2xl flex items-start gap-3.5 shadow-2xs">
          <AlertCircle className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-950">
              Important Legal Notice
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Please read these Terms and Conditions carefully before browsing, making a reservation, placing an order, or participating in device buyback/exchange on Lappy Square. By accessing our platform or visiting our store, you agree to be bound by these Terms and our Privacy Policy.
            </p>
          </div>
        </div>

        {/* 1. Acceptance of Terms */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">1</span>
            <span>Acceptance of Terms</span>
          </h2>
          <p>
            Welcome to <strong>Lappy Square</strong> (&quot;Lappy Square&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By accessing our website (<Link href="/" className="text-blue-700 underline font-medium">lappysquare.com</Link>), communicating with us via WhatsApp/phone, creating a user account, reserving a laptop, or visiting our Jaipur retail store, you confirm that you have read, understood, and agreed to be bound by these Terms and Conditions, along with our Privacy Policy.
          </p>
          <p>
            If you do not agree with any part of these Terms, please immediately discontinue using the platform and our services.
          </p>
        </section>

        {/* 2. Definitions */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">2</span>
            <span>Definitions</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1">
              <strong className="text-slate-950 font-bold block">&quot;You&quot; / &quot;User&quot; / &quot;Customer&quot;</strong>
              <p className="text-slate-600">Any natural or legal person who accesses the website, browses inventory, reserves a laptop, or sells/exchanges a device.</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1">
              <strong className="text-slate-950 font-bold block">&quot;We&quot; / &quot;Company&quot; / &quot;Lappy Square&quot;</strong>
              <p className="text-slate-600">Lappy Square, operating from Paris Tower, Near Vijay Path Chauraha, Madhyam Marg, Mansarovar, Jaipur, Rajasthan 302020.</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1">
              <strong className="text-slate-950 font-bold block">&quot;Product&quot;</strong>
              <p className="text-slate-600">Any certified refurbished, second-hand, or open-box laptop, component, or genuine OEM accessory listed on the platform.</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1">
              <strong className="text-slate-950 font-bold block">&quot;Order / Store Reservation&quot;</strong>
              <p className="text-slate-600">A confirmed device booking or purchase request submitted via website, WhatsApp, or at our physical retail counter.</p>
            </div>
          </div>
        </section>

        {/* 3. Eligibility */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">3</span>
            <span>Eligibility under Indian Law</span>
          </h2>
          <p>
            You must be at least 18 years of age and legally competent to enter into a binding contract under the <strong>Indian Contract Act, 1872</strong>. If you are accessing this website on behalf of a business entity, you represent and warrant that you hold legitimate corporate authorization to bind that entity to these Terms.
          </p>
          <p>
            Our services are intended primarily for users located and transacting within the Republic of India.
          </p>
        </section>

        {/* 4. User Account & Security */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">4</span>
            <span>User Account & Security</span>
          </h2>
          <p>
            When registering on our platform or generating an enquiry, you agree to provide true, accurate, current, and complete details (such as your active mobile number and valid email). You are solely responsible for maintaining the confidentiality of your login credentials and for all activities carried out under your account.
          </p>
          <p>
            If you suspect unauthorized access or any security breach, notify us immediately at <a href="mailto:lappysquare@gmail.com" className="text-blue-700 font-semibold underline">lappysquare@gmail.com</a> or WhatsApp <a href="tel:+919376988788" className="text-blue-700 font-semibold">+91 93769 88788</a>.
          </p>
        </section>

        {/* 5. Products, Grading & 45-Point Quality Check */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">5</span>
            <span>Product Description, Grading & 45-Point Lab Testing</span>
          </h2>
          <p>
            Unless explicitly designated as &quot;Brand New Sealed&quot;, all laptops available at Lappy Square are certified pre-owned, corporate enterprise off-lease machines, or lab-tested open-box devices.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li><strong>45-Point Diagnostic Lab Check:</strong> Each unit is rigorously examined across 45 engineering benchmarks including motherboard power buses, CPU/GPU thermal load under Prime95, NVMe SSD SMART health, zero dead pixel IPS screens, and battery charge retention.</li>
            <li><strong>Cosmetic Grading:</strong> Devices are honestly graded (Grade A+ Like New, Grade A Pristine, Grade B Certified). Cosmetic variations are outlined in individual listings.</li>
            <li><strong>Product Photographs:</strong> Studio photos show the device model clearly. We also gladly provide actual video clips or close-up photos on WhatsApp before your store visit.</li>
          </ul>
        </section>

        {/* 6. Order Placement, Pricing & Invoicing */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">6</span>
            <span>Pricing, Taxes & Invoicing</span>
          </h2>
          <p>
            All listed prices are in Indian Rupees (INR) and are inclusive of all applicable statutory taxes (including 18% GST). Legitimate business purchasers who provide their verified GSTIN during order booking or at the store counter receive full tax-compliant B2B tax invoices eligible for Input Tax Credit (ITC).
          </p>
          <p>
            We strive for total pricing accuracy. In the rare event of a technical typographical or system error where a product is priced incorrectly, Lappy Square reserves the right to cancel the order prior to handover and issue an immediate 100% refund.
          </p>
        </section>

        {/* 7. Store Consultation & Handover */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">7</span>
            <span>Store Consultation, Reservation & Handover</span>
          </h2>
          <p>
            Our core commercial model is direct store purchase and in-person consultation:
          </p>
          <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>Retail Location:</strong> Paris Tower, Near Vijay Path Chauraha, Madhyam Marg, Mansarovar, Jaipur, Rajasthan 302020.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>In-Person Physical Verification:</strong> At the time of store handover, customers are provided with their device along with its 45-point testing report. You are encouraged to verify cosmetic condition, screen, keyboard, and performance on the spot before final bill generation.</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span><strong>No Remote Replacement / Online Shipping:</strong> We operate on transparent store consultation and pickup. Devices handed over after in-person customer inspection are final sale and not subject to remote postal replacement policies.</span>
            </div>
          </div>
        </section>

        {/* 8. Selling or Exchanging a Device (Buy-Back) */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">8</span>
            <span>Device Buy-Back & Trade-In Exchange</span>
          </h2>
          <p>
            Customers seeking to sell or exchange old laptops with Lappy Square agree to the following representations under the <strong>Sale of Goods Act, 1930</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li><strong>Lawful Ownership:</strong> You confirm that you are the sole and lawful owner of the submitted device, that it is not stolen or illegally acquired, and is completely free from third-party liens, EMI locks, or financing encumbrances.</li>
            <li><strong>Account Sign-Out:</strong> You must sign out of and permanently remove all iCloud, Google, Microsoft, and BIOS/firmware passwords before handing over the device.</li>
            <li><strong>User Data Clearance:</strong> You are strictly responsible for backing up your personal files. Lappy Square executes an automated multi-pass cryptographic wipe upon device acquisition and is not responsible for any leftover user data.</li>
            <li><strong>Fair Valuation:</strong> Final purchase or exchange credit valuation is subject to physical hardware evaluation by our technical technicians at our Jaipur store.</li>
          </ul>
        </section>

        {/* 9. Payment Methods */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">9</span>
            <span>Payment Methods & Security</span>
          </h2>
          <p>
            We accept payments through secure UPI (Google Pay, PhonePe, Paytm), Net Banking, Major Debit & Credit Cards, and Cash on Store Pickup. All digital gateway payments are processed directly through certified PCI-DSS compliant payment gateway partners. Lappy Square never stores card CVVs, full card numbers, or banking PINs.
          </p>
        </section>

        {/* 10. Prohibited Activities */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">10</span>
            <span>Prohibited Conduct</span>
          </h2>
          <p>
            Users are strictly prohibited from using this website or our service channels for:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
            <li>Any unlawful, fraudulent, or malicious activities.</li>
            <li>Submitting false, counterfeit, or stolen equipment for valuation.</li>
            <li>Automated data scraping, reverse-engineering, or attacking website infrastructure.</li>
            <li>Impersonating any person or misrepresenting corporate identity.</li>
          </ul>
        </section>

        {/* 11. Intellectual Property */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">11</span>
            <span>Intellectual Property</span>
          </h2>
          <p>
            All website trademarks, logos, design code, product photography, editorial blogs, diagnostic criteria, and software elements are the exclusive intellectual property of Lappy Square. Third-party brand names (such as Apple, MacBook, Dell, HP, Lenovo, ASUS, Intel, AMD, Microsoft) are used solely to accurately describe the genuine compatible hardware being certified and sold.
          </p>
        </section>

        {/* 12. Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">12</span>
            <span>Limitation of Liability</span>
          </h2>
          <p>
            To the maximum extent permitted by applicable Indian laws, Lappy Square, its founder, partners, and staff shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from device use, third-party software updates, or user data loss. In all circumstances, Lappy Square&apos;s aggregate liability shall not exceed the actual purchase price paid by the customer for the specific product in dispute.
          </p>
        </section>

        {/* 13. Governing Law & Jurisdiction */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">13</span>
            <span>Governing Law & Legal Jurisdiction</span>
          </h2>
          <p>
            These Terms and Conditions and any non-contractual obligations arising out of or in connection with them shall be governed by and construed in accordance with the <strong>laws of the Republic of India</strong>.
          </p>
          <p className="font-semibold text-slate-900">
            Any dispute, controversy, or claim arising out of or relating to these Terms or transactions with Lappy Square shall be subject to the exclusive jurisdiction of the competent courts at Jaipur, Rajasthan, India.
          </p>
        </section>

        {/* 14. Contact & Grievance Redressal */}
        <section className="p-6 bg-slate-900 text-white rounded-3xl space-y-4">
          <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Store Contact & Grievance Officer</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            For questions regarding these Terms and Conditions, order reservations, or official complaints, contact our designated desk:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-3 bg-slate-800/80 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Visit Store</span>
              <p className="text-slate-200">Paris Tower, Near Vijay Path Chauraha, Madhyam Marg, Mansarovar, Jaipur 302020</p>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Direct Call & WhatsApp</span>
              <p className="text-slate-200 font-semibold">+91 93769 88788</p>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Official Email</span>
              <p className="text-slate-200 font-semibold">lappysquare@gmail.com</p>
            </div>
          </div>
        </section>

      </div>
    </PolicyLayout>
  );
}
