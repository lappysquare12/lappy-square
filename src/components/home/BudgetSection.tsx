'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Wallet, Sparkles } from 'lucide-react';

export default function BudgetSection() {
  const budgetTiers = [
    {
      title: 'Under ₹15,000',
      subtitle: 'Great for Students, School Basics & Online Classes',
      slug: 'under-15000',
      specs: 'Core i3 / 8GB RAM / 256GB SSD',
      badge: 'ENTRY LEVEL',
    },
    {
      title: '₹15,000 – ₹25,000',
      subtitle: 'Best Value Sweet Spot for Office & Accounts Work',
      slug: '15000-25000',
      specs: 'Core i5 / 16GB RAM / 256GB SSD',
      badge: 'MOST POPULAR',
    },
    {
      title: '₹25,000 – ₹40,000',
      subtitle: 'Coding, Work from Home & Smooth Multitasking',
      slug: '25000-40000',
      specs: 'Core i5/i7 11th Gen / 16GB / 512GB',
      badge: 'PRO PRODUCTIVITY',
    },
    {
      title: '₹40,000 – ₹60,000',
      subtitle: 'Heavy Video Editing, 3D Rendering & Tech Stack',
      slug: '40000-60000',
      specs: 'Apple M1 / Ryzen 7 / 16-32GB RAM',
      badge: 'CREATOR GRADE',
    },
    {
      title: 'Above ₹60,000',
      subtitle: 'Flagship MacBooks & RTX Gaming Machines',
      slug: 'above-60000',
      specs: 'Retina Displays / Dedicated GPUs',
      badge: 'FLAGSHIP',
    },
  ];

  return (
    <section className="py-16 bg-[#F8FAFC] border-b border-[#E8E8E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold mb-2">
              <Wallet className="w-3.5 h-3.5 text-blue-600" />
              <span>Smart Price Brackets</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Shop by Budget
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Guaranteed performance at every price point, backed by certified testing
            </p>
          </div>
          <Link
            href="/budget"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <span>Explore All Tiers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards Grid with Framer Motion Stagger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {budgetTiers.map((tier, idx) => (
            <motion.div
              key={tier.slug}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <Link
                href={`/budget/${tier.slug}`}
                className="group bg-white border border-[#E2E8F0] hover:border-blue-600 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 h-full block"
              >
                <div>
                  <span className="inline-block text-[9px] font-black tracking-wider uppercase bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white px-2.5 py-1 rounded-md border border-blue-200/60 mb-3 transition-colors">
                    {tier.badge}
                  </span>
                  <h3 className="text-lg font-black text-slate-950 group-hover:text-blue-700 transition-colors">
                    {tier.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {tier.subtitle}
                  </p>
                </div>

                <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600 group-hover:text-blue-700 transition-colors">
                    Browse Laptops
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
