'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Laptop
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function FullFAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const categories = [
    { key: 'ALL', label: 'All Questions' },
    { key: 'WARRANTY', label: 'Warranty & Testing' },
    { key: 'STORE', label: 'Store Visit & Pickup' },
    { key: 'QUALITY', label: 'Grades & Condition' },
    { key: 'PAYMENT', label: 'Payment & GST Invoice' },
  ];

  const allFaqs = [
    {
      category: 'QUALITY',
      q: 'What is the difference between Grade A+ Like New and Grade A Pristine?',
      a: 'Grade A+ Like New devices are practically indistinguishable from factory-new units with zero noticeable scratches, flawless displays, and battery health above 90%. Grade A Pristine laptops are in exceptional cosmetic condition with minor imperceptible microscopic marks on the outer chassis, but 100% flawless screens and keyboards.',
    },
    {
      category: 'WARRANTY',
      q: 'What does the 1-Year Comprehensive Warranty cover?',
      a: 'Our written 1-Year warranty covers internal motherboard components, memory (RAM), NVMe SSD storage, cooling assemblies, keyboard, trackpad, and power circuits. If any hardware issue occurs, we provide certified diagnostic support, component repair or unit replacement.',
    },
    {
      category: 'WARRANTY',
      q: 'What if I am unhappy with the laptop after receiving it?',
      a: 'Every purchase includes our 7-Day Hassle-Free Replacement or Money-Back Guarantee. If the laptop has any hardware issue or does not meet your expectations, we provide an immediate 1-to-1 unit replacement or full refund.',
    },
    {
      category: 'STORE',
      q: 'Can I visit your store to test the laptop before buying?',
      a: 'Yes! We warmly invite you to visit our experience center at Peris, Near Vijay Path Chauraha, Ward 27, Mansarover, Jaipur, Rajasthan. You can test multiple machines, check battery health, benchmark performance, and purchase your laptop on the spot.',
    },
    {
      category: 'STORE',
      q: 'How do I reserve a laptop before visiting the store?',
      a: 'Simply click "Get Today\'s Best Price" or connect on WhatsApp at +91 93769 88788. We will confirm live stock, share original photos and videos, and reserve the machine for your store visit.',
    },
    {
      category: 'QUALITY',
      q: 'Do your laptops come with genuine OEM original chargers?',
      a: 'Yes. Every laptop includes its tested original brand-certified charger and power cord (e.g. original Lenovo 65W Type-C adapter, Apple MagSafe / Type-C brick, Dell original barrel/PD charger) with surge protection.',
    },
    {
      category: 'PAYMENT',
      q: 'Can I get a formal GST invoice for business tax credit?',
      a: 'Absolutely! Simply share your company name and GSTIN number. We issue full B2B compliant GST invoices allowing you to claim 18% input tax credit on your purchases.',
    },
    {
      category: 'PAYMENT',
      q: 'What payment methods do you accept?',
      a: 'We accept In-Store UPI (Google Pay, PhonePe, Paytm), Cash, Debit/Credit Cards, Net Banking, and direct WhatsApp bookings.',
    },
  ];

  const filtered = allFaqs.filter((f) => {
    const matchCat = activeCategory === 'ALL' || f.category === activeCategory;
    const matchSearch =
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 sm:py-16 selection:bg-blue-700 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-700 transition-colors font-medium">Home</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold">Frequently Asked Questions</span>
        </nav>

        {/* HERO BANNER */}
        <ScrollReveal direction="up" delay={0.05}>
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl space-y-5">
            <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-300 tracking-wide uppercase">
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Lappy Square Knowledge Base</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Got Questions? <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">We Have Honest Answers</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Learn about our testing protocols, warranty claims, grading standards, store visits, and GST invoices.
            </p>

            {/* Instant Search Bar */}
            <div className="relative max-w-xl pt-2">
              <input
                type="text"
                placeholder="Search questions (e.g. warranty, battery, charger, store visit)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-blue-400 backdrop-blur-md"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 translate-y-[-2px]" />
            </div>
          </div>
        </ScrollReveal>

        {/* CATEGORY TABS */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => {
                setActiveCategory(c.key);
                setOpenIdx(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === c.key
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* ACCORDION FAQ ITEMS */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 text-xs">
              No matching questions found for &ldquo;{searchQuery}&rdquo;. Try another search or chat with us on WhatsApp!
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-950 leading-snug">{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-700' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-[#F8FAFC]/70"
                    >
                      {item.a}
                    </motion.div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* WHATSAPP CTA CARD */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-lg sm:text-xl font-black text-slate-950">
              Still Have An Unanswered Question?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our technicians are online on WhatsApp. Get live photos of any laptop chassis, ports, and battery report instantly.
            </p>
          </div>

          <a
            href="https://wa.me/919376988788?text=Hello%20Lappy%20Square%20Team%2C%20I%20have%20a%20question%20before%20ordering."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold rounded-2xl transition-all shadow-md text-center flex-shrink-0 flex items-center justify-center gap-2"
          >
            <WhatsAppIcon className="w-4 h-4 shrink-0" />
            <span>Ask On WhatsApp Live</span>
          </a>
        </div>

      </div>
    </div>
  );
}
