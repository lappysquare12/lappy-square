'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import BrandLogo from '@/components/ui/BrandLogos';

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  count?: number;
}

export default function BrandBar({ brands }: { brands: BrandItem[] }) {
  // Collections Row 1: Brand & Series Edits
  const rowOneItems = [
    { label: 'Apple MacBook Pro & Air', href: '/brands/apple' },
    { label: 'Lenovo ThinkPad Business Series', href: '/brands/lenovo' },
    { label: 'Dell Latitude & XPS Fleet', href: '/brands/dell' },
    { label: 'HP EliteBook & ProBook Edition', href: '/brands/hp' },
    { label: 'ASUS ROG & ZenBook Ultrabooks', href: '/brands/asus' },
    { label: 'Intel Core i7 & Ryzen 7 PRO', href: '/shop?processor=Core%20i7' },
    { label: 'Acer Swift & Gaming Predator', href: '/brands/acer' },
    { label: 'Touchscreen 360° 2-in-1s', href: '/use/creative' },
    { label: 'Workstation Coding & DevOps Machines', href: '/use/coding' },
  ];

  // Collections Row 2: Diagnostic & Trust Guarantees
  const rowTwoItems = [
    { label: 'Written 45-Point Lab Diagnostic Report', href: '/warranty' },
    { label: '1-Year Comprehensive Warranty', href: '/warranty' },
    { label: 'Like-New Grade A+ Certified Pristine', href: '/shop?grade=LIKE_NEW' },
    { label: 'Direct Store Walk-in & Live Testing', href: '/about' },
    { label: 'Up to 70% Off Retail Showroom MRP', href: '/deals' },
    { label: '7-Day Zero-Risk Replacement Guarantee', href: '/return-refund-policy' },
    { label: 'Original OEM Chargers & Accessories', href: '/warranty' },
    { label: 'Instant Buyback & Exchange ₹3,000 Bonus', href: '/exchange' },
    { label: 'Full 18% GST Input Tax Credit Invoice', href: '/corporate-enquiry' },
  ];

  return (
    <section className="py-16 bg-white border-b border-[#E8E8E8] overflow-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>100% Genuine OEM Hardware</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Shop by Leading Brands
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tested, verified, and certified second-hand business & gaming laptops with full warranty
            </p>
          </div>
          <Link
            href="/brands"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <span>Explore All Brands</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Brand Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map((b, index) => (
            <motion.div
              key={b.slug}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Link
                href={`/brands/${b.slug}`}
                className="group relative bg-white hover:bg-slate-50/50 border border-slate-200/80 hover:border-blue-600/50 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center text-center transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-xl hover:shadow-blue-500/10 block h-full"
              >
                {/* Official Brand Logo */}
                <div className="h-10 sm:h-12 w-full flex items-center justify-center mb-2.5 sm:mb-3 text-slate-900 group-hover:text-blue-700 transition-transform duration-300 group-hover:scale-110">
                  <BrandLogo brand={b.slug} size="lg" />
                </div>

                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {b.name}
                </span>

                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 group-hover:text-blue-600 font-semibold transition-colors">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  <span>45-Pt Tested</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Luxury Capsule Pill Marquee Slider (Inspired by Modern Collection Ticker) */}
      <div className="relative border-y border-[#E7E2DA] bg-[#FAF8F5] py-7 overflow-hidden select-none w-full max-w-full">
        {/* Soft edge blur masks */}
        <div className="absolute left-0 inset-y-0 w-24 sm:w-40 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/90 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-24 sm:w-40 bg-gradient-to-l from-[#FAF8F5] via-[#FAF8F5]/90 to-transparent z-20 pointer-events-none" />

        <div className="space-y-3.5 w-full max-w-full">
          {/* Row 1: Leftward Infinite Marquee */}
          <div className="flex overflow-hidden w-full max-w-full">
            <motion.div
              className="flex items-center flex-shrink-0"
              animate={{ x: [0, -1800] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 35,
                  ease: 'linear',
                },
              }}
            >
              {[...rowOneItems, ...rowOneItems, ...rowOneItems].map((item, idx) => (
                <div key={`r1-${idx}`} className="inline-flex items-center">
                  <Link
                    href={item.href}
                    className="inline-flex items-center justify-center px-5 sm:px-6 py-2 sm:py-2.5 rounded-full border border-slate-900 bg-white text-slate-900 text-xs sm:text-sm font-medium tracking-wide shadow-2xs hover:bg-slate-900 hover:text-white transition-all duration-200 whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                  <span className="text-slate-900 text-sm sm:text-base mx-3 sm:mx-4 select-none font-bold">
                    ✦
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Row 2: Rightward Infinite Marquee (Staggered / Opposite flow) */}
          <div className="flex overflow-hidden w-full max-w-full">

            <motion.div
              className="flex items-center flex-shrink-0"
              animate={{ x: [-1800, 0] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 38,
                  ease: 'linear',
                },
              }}
            >
              {[...rowTwoItems, ...rowTwoItems, ...rowTwoItems].map((item, idx) => (
                <div key={`r2-${idx}`} className="inline-flex items-center">
                  <Link
                    href={item.href}
                    className="inline-flex items-center justify-center px-5 sm:px-6 py-2 sm:py-2.5 rounded-full border border-slate-900 bg-white text-slate-900 text-xs sm:text-sm font-medium tracking-wide shadow-2xs hover:bg-slate-900 hover:text-white transition-all duration-200 whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                  <span className="text-slate-900 text-sm sm:text-base mx-3 sm:mx-4 select-none font-bold">
                    ✦
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
