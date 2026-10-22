'use client';

import React from 'react';
import Image from 'next/image';

interface LappySquareLogoProps {
  className?: string;
  size?: number; // size in px
  variant?: 'emblem' | 'horizontal' | 'compact';
  showSubtitle?: boolean;
  showText?: boolean;
}

export default function LappySquareLogo({
  className = '',
  size = 48,
  variant = 'horizontal',
  showSubtitle = true,
  showText = true,
}: LappySquareLogoProps) {
  if (variant === 'emblem' || !showText) {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
        <Image
          src="/logo.png?v=3"
          alt="Lappy Square Official Logo"
          width={size}
          height={size}
          className="rounded-full object-contain shrink-0 drop-shadow-xs transition-transform duration-300 hover:scale-105"
          priority
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 shrink-0 ${className}`}>
      <Image
        src="/logo.png?v=3"
        alt="Lappy Square Official Logo"
        width={size}
        height={size}
        className="rounded-full object-contain shrink-0 drop-shadow-xs transition-transform duration-300 hover:scale-105"
        priority
      />
      <div className="shrink-0">
        <div className="flex items-center gap-1 leading-none">
          <span className="font-black text-lg sm:text-xl tracking-tight text-slate-950">
            LAPPY
          </span>
          <span className="font-black text-lg sm:text-xl tracking-tight text-blue-700">
            SQUARE
          </span>
        </div>
        {showSubtitle && (
          <div className="hidden sm:flex items-center gap-1.5 mt-0.5">
            <span className="text-[9px] font-bold tracking-widest uppercase text-slate-500">
              Certified Refurbished
            </span>
            <span className="w-1 h-1 rounded-full bg-blue-600 inline-block" />
            <span className="text-[9px] font-bold text-blue-700">
              Warranty
            </span>
          </div>
        )}
      </div>
    </div>
  );
}



