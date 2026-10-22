'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm space-y-4"
        >
          {/* Shimmer wave effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-slate-100/70 to-transparent animate-[shimmer_1.8s_infinite]" />

          {/* Top Grade Tag Skeleton */}
          <div className="flex justify-between items-center">
            <div className="w-24 h-5 bg-slate-100 rounded-full" />
            <div className="w-8 h-8 bg-slate-100 rounded-full" />
          </div>

          {/* Image Placeholder Skeleton */}
          <div className="aspect-[4/3] w-full bg-slate-100 rounded-xl flex items-center justify-center">
            <div className="w-16 h-12 bg-slate-200/50 rounded-lg" />
          </div>

          {/* Brand & Title */}
          <div className="space-y-2">
            <div className="w-16 h-3 bg-slate-100 rounded" />
            <div className="w-full h-4 bg-slate-100 rounded" />
            <div className="w-3/4 h-4 bg-slate-100 rounded" />
          </div>

          {/* Chips */}
          <div className="flex gap-2">
            <div className="w-16 h-5 bg-slate-100 rounded-md" />
            <div className="w-16 h-5 bg-slate-100 rounded-md" />
            <div className="w-20 h-5 bg-slate-100 rounded-md" />
          </div>

          {/* Price & Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="w-20 h-6 bg-slate-100 rounded" />
            <div className="w-24 h-8 bg-slate-100 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function InfinitePulseLoader({ text = 'Loading verified inventory...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      {/* Infinite Dual Spinner */}
      <div className="relative w-12 h-12">
        <motion.div
          className="absolute inset-0 rounded-full border-3 border-slate-200 border-t-blue-700"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-transparent border-b-blue-500"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
        />
      </div>

      <p className="text-xs font-semibold text-slate-500 animate-pulse">{text}</p>
    </div>
  );
}
