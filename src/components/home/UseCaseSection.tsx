'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Briefcase,
  Code2,
  Palette,
  Gamepad2,
  ArrowRight,
  Layers
} from 'lucide-react';

export default function UseCaseSection() {
  const useCases = [
    {
      title: 'Students & College',
      slug: 'student-laptops',
      icon: GraduationCap,
      description: 'Lightweight ultrabooks with 8-12 hour battery life for campus, online lectures & assignments.',
      highlight: 'From ₹13,999',
    },
    {
      title: 'Business & Office',
      slug: 'business-laptops',
      icon: Briefcase,
      description: 'Military-spec Dell Latitude & ThinkPad with enterprise security, dual monitors & docking.',
      highlight: 'From ₹23,999',
    },
    {
      title: 'Programming & Tech',
      slug: 'programming-laptops',
      icon: Code2,
      description: 'Multi-core CPUs, 16GB-32GB RAM, high-speed NVMe for Docker, VS Code & compilation.',
      highlight: 'From ₹27,999',
    },
    {
      title: 'Creators & Designers',
      slug: 'creator-laptops',
      icon: Palette,
      description: 'Retina & 100% sRGB color-accurate displays, dedicated GPUs for Premiere Pro & Figma.',
      highlight: 'From ₹49,999',
    },
    {
      title: 'Gaming & 3D Render',
      slug: 'gaming-laptops',
      icon: Gamepad2,
      description: '144Hz high-refresh panels with dedicated NVIDIA GeForce GTX / RTX graphic cards.',
      highlight: 'From ₹38,999',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-[#E8E8E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold mb-2">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Tailored Performance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Shop by Use Case
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Engineered configurations optimized for your exact workflow and software requirements
            </p>
          </div>
          <Link
            href="/use/business-laptops"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors"
          >
            <span>View All Profiles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {useCases.map((uc, index) => {
            const Icon = uc.icon;
            return (
              <motion.div
                key={uc.slug}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <Link
                  href={`/use/${uc.slug}`}
                  className="group bg-[#F8FAFC] hover:bg-white border border-[#E2E8F0] hover:border-blue-600 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 h-full block"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 group-hover:bg-blue-600 group-hover:text-white text-blue-700 flex items-center justify-center mb-4 transition-all duration-300 shadow-sm">
                      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </div>
                    <h3 className="text-base font-bold text-slate-950 group-hover:text-blue-700 transition-colors">
                      {uc.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">
                      {uc.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3.5 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-md">
                      {uc.highlight}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
