'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Store,
  RotateCcw,
  Zap,
  ArrowRight
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';

export interface BannerItem {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  linkUrl: string;
  badgeText?: string | null;
  ctaText: string;
  active: boolean;
  displayOrder: number;
}

interface HeroBannerProps {
  banners?: BannerItem[];
}

const DEFAULT_SLIDES = [
  {
    id: 'default-1',
    title: 'Certified Second-Hand & Open-Box MacBooks',
    subtitle: 'Apple MacBook Pro & MacBook Air with M-Series & Intel Chips. 45-Point Tested, OEM Battery, Genuine Hardware.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=2000&q=85',
    linkUrl: '/collection/macbook',
    badgeText: 'Flat 35% to 50% OFF Today',
    ctaText: "Get Today's Best Price",
    active: true,
    displayOrder: 1,
  },
  {
    id: 'default-2',
    title: 'Top Brand Enterprise Windows Laptops',
    subtitle: 'Dell Latitude, Lenovo ThinkPad & HP EliteBook. Ultra-durable business grade laptops ready for heavy programming & office use.',
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=2000&q=85',
    linkUrl: '/collection/windows',
    badgeText: 'Deal of the Day',
    ctaText: "Get Today's Best Price",
    active: true,
    displayOrder: 2,
  },
  {
    id: 'default-3',
    title: 'High Performance Gaming & Student Laptops',
    subtitle: 'NVIDIA RTX Graphics, Core i7/Ryzen Processors, 16GB/32GB RAM & NVMe SSDs at unbeatable budget prices.',
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=2000&q=85',
    linkUrl: '/use/gaming-laptops',
    badgeText: 'Best for Gaming & Coding',
    ctaText: "Get Today's Best Price",
    active: true,
    displayOrder: 3,
  },
];

export default function HeroBanner({ banners }: HeroBannerProps) {
  const slides = banners && banners.length > 0 ? banners : DEFAULT_SLIDES;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto-play timer (5s) for pleasant, non-flickering slide transitions
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, isPaused, totalSlides]);

  const currentSlide = slides[currentIdx] || slides[0];

  return (
    <div
      className="relative w-full bg-slate-950 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Hero Carousel Container - Balanced responsive banner height so banners are never cut off */}
      {/* Modern Banner Stage with Clean Responsive Ratio */}
      <div className="relative w-full h-[340px] sm:h-[400px] md:h-[480px] lg:h-[540px] xl:h-[580px] overflow-hidden bg-slate-950">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide.id || currentIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Complete Full-Width Banner Image */}
            <Image
              src={currentSlide.imageUrl}
              alt={currentSlide.title || 'Lappy Square Banner'}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center w-full h-full"
            />

            {/* Subtle Gradient Overlays for High Contrast readability */}
            <div className="absolute inset-0 z-20 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/20 pointer-events-none" />
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

            {/* Slide Content with safe horizontal padding so text never touches arrows */}
            <div className="relative z-30 h-full max-w-7xl mx-auto px-12 sm:px-16 lg:px-20 flex flex-col justify-center">
              <div className="max-w-2xl space-y-2.5 sm:space-y-4">
                
                {/* Badge */}
                {currentSlide.badgeText && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="inline-flex items-center gap-1.5 bg-amber-500/90 backdrop-blur-md text-slate-950 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-black tracking-wide shadow-md"
                  >
                    <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-950 fill-slate-950" />
                    <span>{currentSlide.badgeText}</span>
                  </motion.div>
                )}

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]"
                >
                  {currentSlide.title}
                </motion.h1>

                {/* Subtitle */}
                {currentSlide.subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="text-xs sm:text-sm md:text-base text-slate-200 font-medium max-w-xl line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow-sm"
                  >
                    {currentSlide.subtitle}
                  </motion.p>
                )}

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  className="pt-1 sm:pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3"
                >
                  <a
                    href="https://wa.me/919376988788?text=Hello%20Lappy%20Square%20Team!%20I%20am%20looking%20for%20the%20best%20price%20on%20certified%20laptops%20today."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-full shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    <span>{currentSlide.ctaText || "Get Today's Best Price"}</span>
                  </a>

                  <Link
                    href={currentSlide.linkUrl || '/shop'}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-6 sm:py-3.5 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-xs sm:text-sm rounded-full border border-white/25 transition-all"
                  >
                    <span>Explore Products</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Link>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Previous Button */}
        {totalSlides > 1 && (
          <button
            type="button"
            suppressHydrationWarning
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-all z-30 hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Next Button */}
        {totalSlides > 1 && (
          <button
            type="button"
            suppressHydrationWarning
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-all z-30 hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Bottom Pagination Dots */}
        {totalSlides > 1 && (
          <div className="absolute bottom-4 sm:bottom-5 inset-x-0 flex items-center justify-center gap-1.5 sm:gap-2 z-30">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                suppressHydrationWarning
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all rounded-full ${
                  idx === currentIdx
                    ? 'w-7 sm:w-8 h-2 sm:h-2.5 bg-amber-400 shadow-md'
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Trust Highlights Bar right below the slider (Like Renewfy's 4 Value Props) */}
      <div className="bg-slate-900 border-t border-slate-800 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 text-white text-xs">
          <div className="flex items-center gap-2.5 py-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold leading-tight">45-Point Tested</p>
              <p className="text-[10px] text-slate-400">Lab Diagnostic Verified</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 py-1">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <p className="font-bold leading-tight">100% Genuine Hardware</p>
              <p className="text-[10px] text-slate-400">Original OEM Components</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 py-1">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold leading-tight">Best Price in Jaipur</p>
              <p className="text-[10px] text-slate-400">Save Up to 70% vs New</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 py-1">
            <Store className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <p className="font-bold leading-tight">Store Consultation</p>
              <p className="text-[10px] text-slate-400">Paris Tower, Mansarovar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
