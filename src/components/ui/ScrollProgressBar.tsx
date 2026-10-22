'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[100] pointer-events-none bg-transparent">
      {/* Royal Blue Animated Progress Fill */}
      <motion.div
        className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-600 origin-left shadow-[0_0_10px_rgba(37,99,235,0.8)]"
        style={{ scaleX }}
      />
    </div>
  );
}
