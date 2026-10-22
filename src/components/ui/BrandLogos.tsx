'use client';

import React from 'react';

interface BrandLogoProps {
  brand: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const BRAND_IMAGE_MAP: Record<
  string,
  { src: string; fallbackSrc: string; alt: string; isWide?: boolean }
> = {
  apple: { src: '/brands/apple.svg', fallbackSrc: '/brands/apple.png', alt: 'Apple', isWide: false },
  macbook: { src: '/brands/apple.svg', fallbackSrc: '/brands/apple.png', alt: 'Apple', isWide: false },
  dell: { src: '/brands/dell.svg', fallbackSrc: '/brands/dell.png', alt: 'Dell', isWide: false },
  hp: { src: '/brands/hp.svg', fallbackSrc: '/brands/hp.png', alt: 'HP', isWide: false },
  lenovo: { src: '/brands/lenovo.svg', fallbackSrc: '/brands/lenovo.png', alt: 'Lenovo', isWide: true },
  thinkpad: { src: '/brands/lenovo.svg', fallbackSrc: '/brands/lenovo.png', alt: 'Lenovo', isWide: true },
  asus: { src: '/brands/asus.svg', fallbackSrc: '/brands/asus.png', alt: 'ASUS', isWide: true },
  acer: { src: '/brands/acer.svg', fallbackSrc: '/brands/acer.png', alt: 'Acer', isWide: true },
};

export default function BrandLogo({ brand, className = '', size = 'md' }: BrandLogoProps) {
  const norm = (brand || '').toLowerCase().trim();

  // Find matching brand from the map
  const matchKey = Object.keys(BRAND_IMAGE_MAP).find((key) => norm.includes(key));

  if (matchKey) {
    const config = BRAND_IMAGE_MAP[matchKey];

    // Wide logos (Lenovo, Asus, Acer) vs Square/Round logos (Apple, Dell, HP)
    const wideSizeClasses = {
      sm: 'h-3 sm:h-3.5 max-w-[42px]',
      md: 'h-4 sm:h-4.5 max-w-[68px]',
      lg: 'h-5 sm:h-5.5 max-w-[85px]',
      xl: 'h-7 sm:h-8 max-w-[120px]',
    };

    const squareSizeClasses = {
      sm: 'h-3.5 sm:h-4 w-auto max-w-[22px]',
      md: 'h-5 sm:h-5.5 w-auto max-w-[34px]',
      lg: 'h-6 sm:h-6.5 w-auto max-w-[45px]',
      xl: 'h-9 sm:h-10 w-auto max-w-[65px]',
    };

    const sizeClass = config.isWide ? wideSizeClasses[size] : squareSizeClasses[size];

    return (
      <img
        src={config.src}
        alt={config.alt}
        className={`${sizeClass} w-auto max-w-full max-h-full object-contain flex-shrink-0 transition-transform ${className}`}
        loading="lazy"
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src.endsWith('.svg')) {
            target.src = config.fallbackSrc;
          }
        }}
      />
    );
  }

  // Fallback
  return (
    <span className={`font-black uppercase tracking-tight text-slate-800 text-xs sm:text-sm ${className}`}>
      {brand}
    </span>
  );
}

export function AppleLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 170 170" fill="currentColor" aria-hidden="true">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.71-11.65-14.01-6.19-9.56-11.02-20.93-14.5-34.09-3.48-13.17-5.22-25.04-5.22-35.63 0-14.12 3.65-25.79 10.96-34.99 7.31-9.2 16.48-13.88 27.53-14.05 4.35 0 9.4 1.13 15.15 3.4 5.75 2.26 9.49 3.45 11.22 3.56 1.52-.11 5.37-1.35 11.53-3.74 6.16-2.39 11.23-3.46 15.22-3.23 11.45.65 20.73 4.88 27.84 12.69-9.99 6.08-14.88 14.56-14.66 25.43.22 8.48 3.52 15.49 9.9 21.03 6.38 5.54 13.91 8.78 22.58 9.72-2.17 6.74-4.89 13.6-8.16 20.58zm-32.96-105.74c0 6.08-2.22 11.95-6.66 17.61-5.43 6.74-12.17 10.8-20.21 12.18-.22-.87-.33-1.85-.33-2.93 0-5.87 2.39-11.74 7.17-17.61 2.5-3.04 5.62-5.74 9.35-8.09 3.73-2.35 7.31-3.69 10.74-4.02.11.98.17 1.93.17 2.86z" />
    </svg>
  );
}

export function WindowsLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.949-1.801" />
    </svg>
  );
}



