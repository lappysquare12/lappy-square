import React from 'react';
import Link from 'next/link';
import { Wallet, ArrowRight, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function BudgetOverviewPage() {
  const tiers = [
    {
      title: 'Under ₹15,000',
      subtitle: 'Great for Students, Online Classes & Daily Accounting',
      slug: 'under-15000',
      description: 'Durable laptops with Core i3 / i5, high-speed SSD, and certified batteries under ₹15,000.',
      badge: 'Entry-Level Value',
    },
    {
      title: '₹15,000 – ₹25,000',
      subtitle: 'The Sweet Spot for Office Work, Tally, & Browsing',
      slug: '15000-25000',
      description: 'Core i5 processors, 16GB RAM, Full HD IPS displays, and all-aluminum enterprise business builds.',
      badge: 'Best Seller Tier',
    },
    {
      title: '₹25,000 – ₹40,000',
      subtitle: 'High-Performance Coding, Touchscreens & 2-in-1s',
      slug: '25000-40000',
      description: '11th Gen Core i5/i7, AMD Ryzen 5 PRO, 360 convertible hinges, and backlit keyboards.',
      badge: 'Developer Choice',
    },
    {
      title: '₹40,000 – ₹60,000',
      subtitle: 'Creators, Video Editors & Heavy Multitasking',
      slug: '40000-60000',
      description: 'Apple Silicon M1, dedicated GPUs, 32GB RAM options, and color-accurate Retina displays.',
      badge: 'Pro Performance',
    },
    {
      title: 'Above ₹60,000',
      subtitle: 'Flagship MacBooks & Mobile Workstations',
      slug: 'above-60000',
      description: 'Retina XDR displays, Core i9 / M1 Pro / M2 chips, massive NVMe storage, and studio sound.',
      badge: 'Flagship Elite',
    },
  ];

  return (
    <div className="bg-[#0B1120] text-slate-100 min-h-screen pb-16">
      {/* Header Banner */}
      <section className="relative pt-12 pb-10 border-b border-slate-800/80 overflow-hidden">
        <div className="absolute inset-0 bg-radial-[at_top] from-blue-600/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <nav className="text-xs text-slate-400 mb-4 flex items-center gap-2 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-blue-400 font-semibold">Budget Categories</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Wallet className="w-3.5 h-3.5" />
              <span>Smart Price-Wise Categorization</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Shop Laptops by Budget
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
              Filter laptops by your target price range. Every model includes our 45-point testing report and 1-Year Comprehensive Warranty.
            </p>
          </div>

        </div>
      </section>

      {/* Tiers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <Link
              key={t.slug}
              href={`/budget/${t.slug}`}
              className="group bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-7 flex flex-col justify-between backdrop-blur-sm shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 uppercase tracking-wider">
                    {t.badge}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-blue-400 transition-colors">
                  {t.title}
                </h3>
                
                <p className="text-xs font-semibold text-slate-300 mt-1 mb-3">
                  {t.subtitle}
                </p>
                
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {t.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                  Explore Laptops in Range
                </span>
                <div className="w-9 h-9 rounded-full bg-slate-950 border border-slate-800 group-hover:bg-blue-600 group-hover:border-blue-500 text-slate-400 group-hover:text-white flex items-center justify-center transition-all shadow-md">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
