'use client';

import React from 'react';
import PolicyLayout from '@/components/layout/PolicyLayout';
import {
  Lock,
  ShieldCheck,
  Database,
  CreditCard,
  EyeOff,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  Phone,
  Mail,
  HardDrive
} from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      subtitle="How Lappy Square collects, uses, protects, and handles your personal information under the Digital Personal Data Protection Act, 2023 & IT Act, 2000."
      badge="DPDP Act 2023 & Zero Data Selling"
    >
      <div className="space-y-10 text-slate-700 text-sm leading-relaxed">
        
        {/* Zero Data Selling Commitment Badge */}
        <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200/90 rounded-2xl flex items-start gap-3.5 shadow-2xs">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
              Our Zero Data-Selling Commitment
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              At <strong>Lappy Square</strong>, your privacy and trust are paramount. We <strong>never sell, rent, monetize, or trade</strong> your personal contact details, mobile numbers, or browsing history to third-party marketing brokers, advertisers, or telemarketers.
            </p>
          </div>
        </div>

        {/* 1. Who We Are & Scope */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">1</span>
            <span>Who We Are & Scope of this Policy</span>
          </h2>
          <p>
            This Privacy Policy explains how <strong>Lappy Square</strong> (&quot;Lappy Square&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), operating from Paris Tower, Near Vijay Path Chauraha, Madhyam Marg, Mansarovar, Jaipur, Rajasthan 302020, collects, processes, uses, stores, and safeguards your personal data when you:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
            <li>Visit and interact with our website at <Link href="/" className="text-blue-700 underline font-medium">lappysquare.com</Link>.</li>
            <li>Inquire, reserve, or order laptops and accessories via WhatsApp or direct phone calls.</li>
            <li>Visit our retail store in Mansarovar, Jaipur for in-person consultation or purchase.</li>
            <li>Participate in our laptop trade-in, sell, or exchange programs.</li>
          </ul>
          <p>
            By using our platform or interacting with our store, you consent to the data practices described in this policy. If you do not agree, please refrain from using our website and services.
          </p>
        </section>

        {/* 2. Information We Collect */}
        <section className="space-y-4">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">2</span>
            <span>Information We Collect</span>
          </h2>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              2.1 Information You Provide to Us Directly:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1">
                <strong className="text-slate-950 font-bold block">Contact & Account Details</strong>
                <p className="text-slate-600">Full name, mobile phone number, email address, and account password when registering or booking on the website.</p>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1">
                <strong className="text-slate-950 font-bold block">Invoicing & Billing Information</strong>
                <p className="text-slate-600">Billing address, city, state, pincode, and optional company GSTIN for legitimate B2B tax credit invoices.</p>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1">
                <strong className="text-slate-950 font-bold block">Device Trade-In / Sell Details</strong>
                <p className="text-slate-600">Brand, model, serial number, processor, specs, and photos of devices submitted for exchange valuation, along with verified UPI/bank details for payouts.</p>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1">
                <strong className="text-slate-950 font-bold block">Customer Support Communications</strong>
                <p className="text-slate-600">Chat messages, WhatsApp enquiry transcripts, reviews, and feedback shared when interacting with our Jaipur support desk.</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              2.2 Information Collected Automatically:
            </h3>
            <p className="text-xs text-slate-600">
              When you browse our platform, standard technical information is logged automatically: IP address, device type, operating system, browser version, pages viewed, time spent, and referring URLs. We use this strictly to maintain website security, prevent fraud, and optimize loading speeds.
            </p>
          </div>
        </section>

        {/* 3. How We Use Your Information */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">3</span>
            <span>How We Use Your Information</span>
          </h2>
          <p>
            We process your personal information strictly for legitimate commercial and customer-service purposes:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>To manage your account, process device reservations, and confirm orders.</li>
            <li>To coordinate store visits, device handovers, and in-person hardware inspections.</li>
            <li>To verify device ownership, calculate buyback valuations, and disburse exchange payments.</li>
            <li>To provide the written 45-point diagnostic QA inspection report with your machine.</li>
            <li>To issue statutory GST tax invoices and fulfill legal accounting compliance.</li>
            <li>To communicate transactional updates via WhatsApp, SMS, or phone regarding your reserved laptop.</li>
            <li>To detect, investigate, and prevent fraudulent transactions or security violations.</li>
          </ul>
        </section>

        {/* 4. Payment Security & Zero Financial Data Storage */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">4</span>
            <span>Payment Security & Financial Privacy</span>
          </h2>
          <p>
            All digital payment transactions (UPI, Credit/Debit cards, Net Banking) are processed directly through certified, PCI-DSS compliant Indian payment gateway providers.
          </p>
          <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs space-y-1.5">
            <strong className="text-slate-950 font-bold block flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Zero Financial Storage Guarantee</span>
            </strong>
            <p className="text-slate-600">
              Lappy Square <strong>never collects, processes, or stores</strong> complete credit/debit card numbers, CVV codes, expiry dates, or banking passwords on our internal servers. We only retain the transaction status ID, timestamp, and amount for official order record keeping.
            </p>
          </div>
        </section>

        {/* 5. Device Data Clearance & Military-Grade Wiping */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">5</span>
            <span>Device Data Sanitization on Buy-Back / Trade-In</span>
          </h2>
          <p>
            When customers sell or trade-in old laptops at Lappy Square, user privacy is safeguarded through stringent technical protocols:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li><strong>Customer Obligation:</strong> You must backup your personal data and sign out of all user accounts (Apple ID, iCloud, Google Account, Microsoft Account) before handing over any device.</li>
            <li><strong>Cryptographic Data Wipe:</strong> Every pre-owned laptop entering our inventory undergoes certified <strong>DoD 5220.22-M / NIST 800-88 cryptographic multi-pass data sanitization</strong> on internal SSDs and HDDs. This permanently destroys any residual operating files, ensuring zero data recovery.</li>
            <li><strong>Fresh OS Installation:</strong> Every certified laptop is reflashed with a clean, authentic operating system installation (macOS or Windows 11 Pro) before being made available for purchase.</li>
          </ul>
        </section>

        {/* 6. Cookies & Tracking Technologies */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">6</span>
            <span>Cookies & Web Analytics</span>
          </h2>
          <p>
            We use minimal cookies and session technologies:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
            <li><strong>Essential Session Cookies:</strong> Required to keep you authenticated and remember items in your shopping bag.</li>
            <li><strong>Security Cookies:</strong> Help identify and block cross-site request forgery and malicious automated bots.</li>
            <li><strong>Anonymous Performance Analytics:</strong> Help us monitor page loading speeds and understand which laptop series are popular in Jaipur. You may disable cookies via your browser settings at any time.</li>
          </ul>
        </section>

        {/* 7. Information Sharing & Third Parties */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">7</span>
            <span>Information Sharing & Disclosures</span>
          </h2>
          <p>
            We share your data only on a strict need-to-know basis with trusted partners essential to our operations:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li><strong>Payment Gateways:</strong> To verify and complete digital transactions securely.</li>
            <li><strong>Communication Platforms (WhatsApp / SMS):</strong> To send order confirmation and store visit directions.</li>
            <li><strong>Legal & Law Enforcement Authorities:</strong> We may disclose information if mandated by applicable Indian law, court order, or official governmental requests under the Code of Criminal Procedure / IT Act.</li>
          </ul>
        </section>

        {/* 8. Data Security & Storage */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">8</span>
            <span>Data Security & Storage</span>
          </h2>
          <p>
            We implement robust administrative, technical, and physical safeguards to protect your personal information against accidental loss, unauthorized access, alteration, or disclosure. All web traffic is encrypted using modern <strong>256-bit Transport Layer Security (TLS / SSL)</strong> encryption.
          </p>
        </section>

        {/* 9. Your Rights under the DPDP Act 2023 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">9</span>
            <span>Your Rights under the Digital Personal Data Protection Act, 2023</span>
          </h2>
          <p>
            As a Data Principal under Indian law, you possess defined legal rights:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1">
              <strong className="text-slate-950 font-bold block">Right to Access & Summary</strong>
              <p className="text-slate-600">Request a summary of personal data held about you and how it has been processed.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1">
              <strong className="text-slate-950 font-bold block">Right to Correction & Erasure</strong>
              <p className="text-slate-600">Request correction of inaccurate information or deletion of personal data when no longer needed for commercial/tax compliance.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1">
              <strong className="text-slate-950 font-bold block">Right to Grievance Redressal</strong>
              <p className="text-slate-600">Lodge an official data privacy concern directly with our designated Grievance Officer.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1">
              <strong className="text-slate-950 font-bold block">Right to Withdraw Consent</strong>
              <p className="text-slate-600">Opt-out of non-transactional marketing communications at any time with a single click or message.</p>
            </div>
          </div>
        </section>

        {/* 10. Children's Privacy */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">10</span>
            <span>Children&apos;s Privacy</span>
          </h2>
          <p>
            Our website and commercial services are not designed for or directed at children under the age of 18. We do not knowingly collect personal data from minors. If you believe a minor has provided us with personal information without parental consent, please contact us for immediate deletion.
          </p>
        </section>

        {/* 11. Grievance Officer & Statutory Compliance */}
        <section className="p-6 bg-slate-900 text-white rounded-3xl space-y-4">
          <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Designated Grievance Officer (IT Act 2000 & DPDP Act 2023)</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            In accordance with the Information Technology Act, 2000 (and rules made thereunder) and the Digital Personal Data Protection Act, 2023, the details of our designated Grievance Officer are provided below:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-3 bg-slate-800/80 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Designated Officer</span>
              <p className="text-slate-200 font-semibold">Grievance & Privacy Desk</p>
              <p className="text-slate-400">Lappy Square Jaipur</p>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Postal Address</span>
              <p className="text-slate-200">Paris Tower, Near Vijay Path Chauraha, Madhyam Marg, Mansarovar, Jaipur 302020</p>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact Channels</span>
              <p className="text-slate-200 font-semibold">Email: lappysquare@gmail.com</p>
              <p className="text-slate-400">Phone / WhatsApp: +91 93769 88788</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            * Grievance inquiries are acknowledged within 48 business hours and resolved within 30 days as mandated under Indian law.
          </p>
        </section>

      </div>
    </PolicyLayout>
  );
}
