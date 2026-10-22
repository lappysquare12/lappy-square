'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function OrderConfetti() {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#0F172A', '#3B82F6', '#F59E0B'],
      });
    } catch {
      // Ignore if canvas-confetti is not loaded
    }
  }, []);

  return null;
}
