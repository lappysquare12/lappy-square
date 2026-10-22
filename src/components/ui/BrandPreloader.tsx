'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LappySquareLogo from './LappySquareLogo';

export default function BrandPreloader() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      // Baar baar loader nahi aaega - only show once per browser session
      const alreadySeen = sessionStorage.getItem('lappy_preloader_seen');
      if (!alreadySeen) {
        setLoading(true);
        sessionStorage.setItem('lappy_preloader_seen', 'true');
        const timer = setTimeout(() => {
          setLoading(false);
        }, 750);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore storage errors in privacy modes
    }
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="relative flex flex-col items-center">
            
            {/* Infinite Rotating Outer Glow Ring */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 border-r-blue-400"
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: 'linear',
                }}
              />
              <motion.div
                className="absolute inset-2 rounded-full border border-slate-100 border-b-slate-900"
                animate={{ rotate: -360 }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  ease: 'linear',
                }}
              />

              {/* Center Breathing Lappy Square Emblem */}
              <motion.div
                animate={{ scale: [0.95, 1.05, 0.95] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              >
                <LappySquareLogo size={68} variant="emblem" />
              </motion.div>
            </div>

            {/* Typography */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="mt-6 text-center"
            >
              <div className="flex items-center gap-1 justify-center">
                <span className="font-black text-lg tracking-tight text-slate-950">LAPPY</span>
                <span className="font-black text-lg tracking-tight text-blue-700">SQUARE</span>
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Certified Refurbished Laptops
              </p>
            </motion.div>

            {/* Infinite Horizontal Shimmer Line */}
            <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden mt-4 relative">
              <motion.div
                className="w-24 h-full bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-600 rounded-full"
                animate={{ x: [-100, 200] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
