'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Laptop,
  ShieldCheck,
  CheckCircle2,
  Award,
  Users,
  ArrowRight,
  Sparkles,
  Cpu,
  RefreshCw,
  HeartHandshake,
  MapPin,
  Clock,
  ThumbsUp,
  Quote,
  BadgeCheck
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function AboutPage() {
  const stats = [
    { label: 'Refurbished Laptops Delivered', value: '12,500+', desc: 'Across 19,000+ PIN codes in India' },
    { label: 'Hardware Diagnostic Checkpoints', value: '45 Points', desc: 'Tested by certified hardware engineers' },
    { label: 'Customer Satisfaction Score', value: '99.4%', desc: 'Verified 5-star Google & website ratings' },
    { label: 'E-Waste Prevented in Landfills', value: '18+ Tons', desc: 'Enterprise aluminum & silicon revived' },
  ];

  const pillars = [
    {
      icon: Cpu,
      title: 'Stringent 45-Point Lab Inspection',
      desc: 'Every motherboard is stressed, thermals refreshed with Arctic compound, memory tested for bit-flips, and displays inspected down to sub-pixel level before certification.',
      tag: 'Zero Defect Policy',
    },
    {
      icon: ShieldCheck,
      title: '1-Year Comprehensive Warranty',
      desc: 'We don&apos;t just sell refurbished laptops — we back every machine with full parts and labor warranty, certified technician assistance, and prompt store or WhatsApp support.',
      tag: 'Comprehensive Protection',
    },
    {
      icon: RefreshCw,
      title: 'Transparent Grading Standards',
      desc: 'No hidden flaws. Grade A+ Like New and Grade A Pristine are explicitly distinguished with real battery discharge capacity and cosmetic photos.',
      tag: '100% Honesty Guarantee',
    },
    {
      icon: HeartHandshake,
      title: 'Instant Fair-Value Buyback & Trade-In',
      desc: 'Upgrade your tech responsibly. Exchange older laptops for immediate discounts or on-the-spot cash payouts, promoting sustainable circular electronics.',
      tag: 'Eco-Friendly Circular Tech',
    },
  ];

  const processSteps = [
    { num: '01', title: 'Enterprise Sourcing', desc: 'Direct corporate lease returns from MNC tech parks in Gurugram, Bengaluru & Pune.' },
    { num: '02', title: 'Ultrasonic Sanitize', desc: 'Deep surgical cleaning, keyboard dust extraction, and thermal compound re-paste.' },
    { num: '03', title: '45-Point Stress Run', desc: '6-hour burn-in benchmark checking GPU load, SSD SMART health, and battery cycle life.' },
    { num: '04', title: 'Certified Packaging', desc: 'Sealed in electrostatic tamper-proof air-cushion boxes with 45-Point diagnostic certificate.' },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 sm:py-16 selection:bg-blue-700 selection:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-700 transition-colors font-medium">Home</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold">About Lappy Square</span>
        </nav>

        {/* HERO SECTION */}
        <ScrollReveal direction="up" delay={0.05}>
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-8 sm:p-14 lg:p-16 border border-slate-800 shadow-2xl">
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-300 tracking-wide uppercase backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Our Heritage & Mission</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-none text-white">
                Democratizing Flagship Laptops <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Through Certified Refurbishing</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Founded with a mission to make enterprise-grade computing accessible to every student, software engineer, creator, and growing business in India. At Lappy Square, we bridge the gap between premium computing and sensible budgets.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/shop"
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 hover:translate-y-[-2px]"
                >
                  <span>Explore Certified Inventory</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/warranty"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs sm:text-sm font-bold rounded-2xl transition-all backdrop-blur-md"
                >
                  Inspect Our 45-Point Lab
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* STATS MATRIX */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((s, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-1.5"
              >
                <p className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">{s.value}</p>
                <h4 className="text-xs font-bold text-slate-900">{s.label}</h4>
                <p className="text-[11px] text-slate-500 leading-normal">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* 4 CORE PILLARS */}
        <ScrollReveal direction="up" delay={0.15}>
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Engineering First</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
                The Lappy Square Standard of Trust
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                Unlike unverified local second-hand markets, every device in our catalogue is treated with aerospace-grade precision and verified provenance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pillars.map((item, i) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={i}
                    className="group bg-white border border-slate-200/90 hover:border-blue-600/40 rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 space-y-3.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 group-hover:scale-110 transition-transform">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                        {item.tag}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-950">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* REFURBISHMENT LIFECYCLE STEPS */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Behind The Scenes</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Our 4-Stage Precision Refurbishing Pipeline
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                From bulk corporate enterprise unboxing to final store handover.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, idx) => (
                <div key={idx} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-3 relative">
                  <span className="text-3xl font-black text-blue-400 font-mono">{step.num}</span>
                  <h4 className="text-sm font-bold text-white">{step.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* FOUNDER & CEO LEADERSHIP SECTION */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="relative overflow-hidden bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Founder Image Column */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
                  <Image
                    src="/images/pankaj-jain-founder.jpg"
                    alt="Pankaj Jain — Founder & CEO of Lappy Square"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 400px"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  {/* Subtle Gradient Shadow at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent pointer-events-none" />
                  
                  {/* Floating Badge on photo */}
                  <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-white z-10">
                    <div>
                      <p className="font-black text-lg text-white tracking-tight flex items-center gap-1.5">
                        <span>Pankaj Jain</span>
                        <BadgeCheck className="w-5 h-5 text-blue-400 fill-blue-500/20" />
                      </p>
                      <p className="text-xs text-blue-200 font-semibold">Founder & CEO</p>
                    </div>
                    <span className="text-[11px] font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-white">
                      Lappy Square
                    </span>
                  </div>
                </div>
              </div>

              {/* Founder Narrative & Vision Column */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/70 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-700 tracking-wide uppercase mb-3">
                    <Quote className="w-3.5 h-3.5 text-blue-600" />
                    <span>Founder&apos;s Vision</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                    &quot;Building India&apos;s Most Trusted Hub for Enterprise Computing.&quot;
                  </h2>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-base font-black text-slate-900">Pankaj Jain</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      Founder &amp; CEO
                    </span>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  <p>
                    When I founded <strong className="text-slate-900">Lappy Square</strong>, the second-hand and refurbished laptop market was plagued by unverified sellers, hidden hardware flaws, and zero after-sales accountability. Customers often felt forced to choose between spending Rs. 80,000+ on a basic new machine or gambling on an untrusted used device.
                  </p>
                  <p>
                    We set out to disrupt that paradigm entirely. Today, every Apple MacBook and enterprise laptop in our inventory undergoes a rigorous <strong>45-point diagnostic lab audit</strong> — verifying motherboard thermals, battery cycles, displays, and keyboard performance before it ever reaches our shelves.
                  </p>
                  <p>
                    Our mission is simple: to empower Indian students, developers, creators, and businesses with authentic, flagship-grade computing at a fraction of the cost, fully backed by real warranty protection and transparent support.
                  </p>
                </div>

                {/* Highlights Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <p className="text-xl sm:text-2xl font-black text-slate-950">12,500+</p>
                    <p className="text-[11px] text-slate-500 font-medium">Laptops Delivered</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <p className="text-xl sm:text-2xl font-black text-blue-700">45-Point</p>
                    <p className="text-[11px] text-slate-500 font-medium">Lab Diagnostics</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 col-span-2 sm:col-span-1">
                    <p className="text-xl sm:text-2xl font-black text-emerald-700">100%</p>
                    <p className="text-[11px] text-slate-500 font-medium">Genuine Hardware</p>
                  </div>
                </div>

                {/* Connect on WhatsApp with the Founder's Desk */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href="https://wa.me/919376988788?text=Hello%20Pankaj%20sir%2C%20I%20would%20like%20to%20connect%20regarding%20laptops%20at%20Lappy%20Square."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-[#25D366]/20"
                  >
                    <span>Connect With Founder&apos;s Desk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl transition-all"
                  >
                    <span>Visit Experience Center</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>

        {/* EXPERIENCE CENTER CARD */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase">
                <MapPin className="w-4 h-4" />
                <span>Visit Us In Person</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                Lappy Square Experience &amp; Diagnostic Center
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Want to touch, feel, and run benchmarks in person before buying? Visit our flagship diagnostic hub at Paris Tower, Near Vijay Path Chauraha, Madhyam Marg, Mansarovar, Jaipur. Test displays, keyboards, and battery health directly on our test benches.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-950 hover:bg-black text-white text-xs font-bold rounded-2xl transition-all shadow-md text-center"
              >
                Store Directions & Hours
              </Link>
              <a
                href="https://wa.me/919376988788?text=Hello%20Lappy%20Square%20Team%2C%20I%20would%20like%20to%20visit%20your%20experience%20center."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366]/15 hover:bg-[#25D366] text-[#0E7A53] hover:text-white border border-[#25D366]/40 text-xs font-bold rounded-2xl transition-all text-center"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
