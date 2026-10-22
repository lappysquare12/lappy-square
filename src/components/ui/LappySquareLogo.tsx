'use client';

import React from 'react';

interface LappySquareLogoProps {
  className?: string;
  size?: number; // size in px
  variant?: 'emblem' | 'horizontal' | 'compact';
  showSubtitle?: boolean;
}

export default function LappySquareLogo({
  className = '',
  size = 44,
  variant = 'horizontal',
  showSubtitle = true,
}: LappySquareLogoProps) {
  // Exact circular emblem matching the real shop signage
  const Emblem = ({ emblemSize }: { emblemSize: number }) => (
    <svg
      width={emblemSize}
      height={emblemSize}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0 transition-transform duration-300 hover:rotate-3"
    >
      {/* Outer Circle Ring */}
      <circle cx="200" cy="200" r="192" fill="#FFFFFF" stroke="#0F172A" strokeWidth="9" />
      <circle cx="200" cy="200" r="184" fill="#FFFFFF" stroke="#1D4ED8" strokeWidth="2.5" />

      {/* Monogram Background Accent */}
      <defs>
        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="charcoalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>

      {/* Big Bold 'L' in Charcoal / Black */}
      {/* Vertical stem of L */}
      <path
        d="M 135 70 L 175 70 L 175 185 L 210 185 L 200 215 L 135 215 Z"
        fill="url(#charcoalGrad)"
      />
      {/* 3D highlight bevel on L */}
      <path
        d="M 135 70 L 148 70 L 148 202 L 200 202 L 195 215 L 135 215 Z"
        fill="#334155"
        opacity="0.4"
      />

      {/* Interlocking 'S' in Royal Blue */}
      <path
        d="M 195 75 C 220 75 260 75 268 75 C 274 75 278 80 278 87 L 278 108 C 278 114 273 118 266 118 L 222 118 C 214 118 210 123 210 130 C 210 137 215 142 223 142 L 260 142 C 273 142 280 152 280 165 L 280 195 C 280 207 271 216 258 216 L 195 216 L 208 190 L 255 190 C 259 190 262 187 262 183 L 262 173 C 262 169 259 166 255 166 L 215 166 C 196 166 188 152 188 135 L 188 108 C 188 90 200 75 220 75 Z"
        fill="url(#blueGrad)"
      />

      {/* Stylized Laptop Graphic */}
      {/* Laptop Screen */}
      <path
        d="M 190 205 L 275 205 L 265 248 L 140 248 Z"
        fill="none"
        stroke="#0F172A"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* Laptop Screen Inner Glass */}
      <path
        d="M 194 211 L 269 211 L 261 243 L 149 243 Z"
        fill="#F8FAFC"
        stroke="#2563EB"
        strokeWidth="1.5"
      />
      {/* Laptop Base */}
      <path
        d="M 132 250 L 272 250 C 276 250 278 253 277 256 L 272 264 C 270 266 267 267 264 267 L 140 267 C 137 267 134 266 132 264 L 127 256 C 126 253 128 250 132 250 Z"
        fill="#0F172A"
      />
      {/* Laptop Trackpad & Notch accent */}
      <rect x="190" y="254" width="24" height="4" rx="2" fill="#2563EB" />

      {/* LAPPY text */}
      <text
        x="200"
        y="308"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="900"
        fontSize="44"
        letterSpacing="5"
        fill="#0F172A"
      >
        LAPPY
      </text>

      {/* — SQUARE — with dashes */}
      <line x1="115" y1="326" x2="152" y2="326" stroke="#1D4ED8" strokeWidth="4.5" strokeLinecap="round" />
      <text
        x="200"
        y="333"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="800"
        fontSize="21"
        letterSpacing="7"
        fill="#1D4ED8"
      >
        SQUARE
      </text>
      <line x1="248" y1="326" x2="285" y2="326" stroke="#1D4ED8" strokeWidth="4.5" strokeLinecap="round" />

      {/* Dark Bottom Segment Banner */}
      <path
        d="M 105 348 C 135 365 167 374 200 374 C 233 374 265 365 295 348 L 290 380 C 263 392 232 398 200 398 C 168 398 137 392 110 380 Z"
        fill="#0F172A"
      />

      {/* LAPTOPS • ACCESSORIES • SERVICE text */}
      <text
        x="200"
        y="363"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontWeight="700"
        fontSize="10"
        letterSpacing="2"
        fill="#FFFFFF"
      >
        LAPTOPS • ACCESSORIES • SERVICE
      </text>

      {/* Shopping Cart Icon at the very bottom */}
      <g transform="translate(191, 372) scale(0.7)">
        <path
          d="M 0 2 L 4 2 L 8 16 L 22 16 L 25 6 L 6 6"
          fill="none"
          stroke="#2563EB"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="20" r="2.5" fill="#2563EB" />
        <circle cx="20" cy="20" r="2.5" fill="#2563EB" />
      </g>
    </svg>
  );

  if (variant === 'emblem') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <Emblem emblemSize={size} />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-3 flex-shrink-0 ${className}`}>
      <Emblem emblemSize={size} />
      <div className="flex-shrink-0">
        <div className="flex items-center gap-1 leading-none">
          <span className="font-black text-lg sm:text-xl tracking-tighter text-slate-950">
            LAPPY
          </span>
          <span className="font-black text-lg sm:text-xl tracking-tighter text-blue-700">
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

