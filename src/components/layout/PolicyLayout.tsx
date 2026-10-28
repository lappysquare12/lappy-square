'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Store,
  RotateCcw,
  ShieldCheck,
  FileText,
  Lock,
  XCircle,
  HelpCircle,
  Phone,
  Mail,
  Sparkles
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface PolicyLayoutProps {
  title: string;
  subtitle: string;
  badge: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export default function PolicyLayout({
  title,
  subtitle,
  badge,
  lastUpdated = 'October 2025',
  children,
}: PolicyLayoutProps) {
  const pathname = usePathname();

  const links = [
    { href: '/shipping-policy', label: 'Store Visit & Pickup', icon: Store },
    { href: '/about', label: '45-Point Lab Testing', icon: ShieldCheck },
    { href: '/terms-and-conditions', label: 'Terms & Conditions', icon: FileText },
    { href: '/privacy-policy', label: 'Privacy & Data Protection', icon: Lock },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 sm:py-16 selection:bg-blue-700 selection:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-700 transition-colors font-medium">Home</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500">Legal & Policies</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold">{title}</span>
        </nav>

        {/* HERO HEADER */}
        <ScrollReveal direction="up" delay={0.05}>
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-300 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{badge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {subtitle}
            </p>

            <div className="pt-2 flex items-center gap-4 text-[11px] text-slate-400">
              <span>Last Updated: <strong className="text-white">{lastUpdated}</strong></span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">100% Legally Compliant (Consumer Protection Act 2019)</span>
            </div>
          </div>
        </ScrollReveal>

        {/* 2-COLUMN LAYOUT: SIDEBAR NAV + DOCUMENT CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR (4 COLS) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-1.5">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Policy Directory
              </span>
              {links.map((link) => {
                const IconComp = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                        : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-950'
                    }`}
                  >
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* HELPLINE CALLOUT */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-sm text-white">Need Clarification?</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Our compliance and customer disputes desk is available directly via WhatsApp and official phone hotline.
              </p>
              <div className="pt-1 space-y-2">
                <a
                  href="tel:+919376988788"
                  className="flex items-center gap-2 text-white font-bold hover:text-blue-400 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>+91 93769 88788</span>
                </a>
                <a
                  href="mailto:lappysquare@gmail.com"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-[11px]"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>lappysquare@gmail.com</span>
                </a>
              </div>
            </div>
          </aside>

          {/* RIGHT DOCUMENT CONTAINER (8 COLS) */}
          <main className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {children}
          </main>

        </div>

      </div>
    </div>
  );
}
