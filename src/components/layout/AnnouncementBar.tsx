'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, ShieldCheck, X, Sparkles, Tag, Store, CheckCircle2, MapPin } from 'lucide-react';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const offers = [
    {
      icon: Tag,
      text: 'USE CODE "LAPPY2000" FOR FLAT ₹2,000 OFF ON ORDERS ABOVE ₹25,000',
      badge: 'FLAT ₹2000 OFF',
    },
    {
      icon: MapPin,
      text: 'VISIT LAPPY SQUARE: PARIS TOWER, NEAR VIJAY PATH, MANSAROVAR, JAIPUR',
      badge: 'STORE LOCATION',
    },
    {
      icon: Sparkles,
      text: 'GET 10% OFF ON YOUR FIRST ORDER WITH COUPON "WELCOME10"',
      badge: 'NEW USER',
    },
    {
      icon: CheckCircle2,
      text: 'EVERY LAPTOP INCLUDES COMPREHENSIVE 45-POINT LAB DIAGNOSTIC REPORT',
      badge: '45-PT TESTED',
    },
    {
      icon: Tag,
      text: 'STUDENTS & DEVELOPERS GET EXTRA 5% OFF WITH CODE "STUDENT5"',
      badge: 'STUDENT EXCLUSIVE',
    },
    {
      icon: ShieldCheck,
      text: '100% GENUINE OEM HARDWARE & CHARGERS INCLUDED ON ALL LAPTOPS',
      badge: '100% GENUINE',
    },
  ];

  return (
    <aside
      aria-label="Special announcements and scrolling offers ticker"
      suppressHydrationWarning
      className="bg-[#0B1120] text-white text-xs py-2 px-3 transition-all border-b border-slate-800/80 overflow-hidden relative w-full max-w-full"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 w-full min-w-0">
        
        {/* Fixed Left Tag */}
        <div className="flex items-center gap-2 flex-shrink-0 z-10 bg-[#0B1120] pr-3 border-r border-slate-800">
          <span className="bg-gradient-to-r from-blue-700 to-blue-500 text-white font-extrabold px-2.5 py-0.5 rounded-full text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-sm shadow-blue-500/20">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>LIVE OFFERS</span>
          </span>
        </div>

        {/* Center: Infinite Horizontal Scrolling Offers Ticker (Scrollbar / Marquee) */}
        <div className="flex-1 min-w-0 overflow-hidden relative select-none">

          {/* Subtle edge fades */}
          <div className="absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-[#0B1120] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-[#0B1120] to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex items-center gap-10 whitespace-nowrap flex-shrink-0 hover:[animation-play-state:paused]"
            animate={{ x: [0, -1400] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 28,
                ease: 'linear',
              },
            }}
          >
            {[...offers, ...offers, ...offers].map((offer, idx) => {
              const Icon = offer.icon;
              return (
                <div key={idx} className="inline-flex items-center">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-slate-700/80 bg-slate-900/90 hover:border-blue-500 text-xs text-slate-200 hover:text-white transition-all shadow-xs cursor-pointer whitespace-nowrap">
                    <span className="bg-blue-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {offer.badge}
                    </span>
                    <Icon className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    <span className="font-medium tracking-wide">{offer.text}</span>
                  </div>
                  <span className="text-blue-400 text-xs mx-3.5 font-bold select-none">✦</span>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Fixed Right Links */}
        <div className="hidden lg:flex items-center gap-4 flex-shrink-0 text-slate-300 z-10 bg-[#0B1120] pl-3 border-l border-slate-800 text-[11px]">
          <Link
            href="/about"
            className="hover:text-white transition-colors flex items-center gap-1 font-medium"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>Store Visit</span>
          </Link>

          <a
            href="tel:+919376988788"
            className="hover:text-white transition-colors flex items-center gap-1 font-medium text-slate-200"
          >
            <Phone className="w-3 h-3 text-slate-400" />
            <span>+91 93769 88788</span>
          </a>

          <button
            type="button"
            onClick={() => setVisible(false)}
            aria-label="Dismiss announcement"
            suppressHydrationWarning
            className="hover:text-white p-0.5 text-slate-400 hover:bg-slate-800 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </aside>
  );
}
