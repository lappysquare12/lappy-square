'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Laptop, ShoppingCart, Sparkles, MessageCircle, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';
import { AppleLogo, WindowsLogo } from '@/components/ui/BrandLogos';

export default function MobileBottomBar() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  // Hide on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const whatsappInquiryUrl =
    'https://wa.me/919376988788?text=Hii%20Lappy%20Square%20Team!%20I%20am%20looking%20for%20today%27s%20best%20laptop%20price%20and%20offers.';

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5"
    >
      <div className="grid grid-cols-5 items-center justify-around text-center">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            pathname === '/' ? 'text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Home</span>
        </Link>

        {/* 2. Apple / MacBooks */}
        <Link
          href="/collection/macbook"
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            pathname?.includes('macbook') || pathname?.includes('apple')
              ? 'text-blue-700 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AppleLogo className="w-4.5 h-4.5 mb-0.5" />
          <span className="text-[10px] leading-tight font-medium">MacBooks</span>
        </Link>

        {/* 3. Center Highlight: Get Today's Best Price on WhatsApp */}
        <a
          href={whatsappInquiryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center -mt-4 group"
          title="Get Today's Best Price on WhatsApp"
        >
          <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/40 group-active:scale-95 transition-transform border-2 border-white">
            <WhatsAppIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-[10px] font-black text-emerald-800 leading-tight mt-0.5">
            Best Price
          </span>
        </a>

        {/* 4. Windows Laptops */}
        <Link
          href="/collection/windows"
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
            pathname?.includes('windows')
              ? 'text-blue-700 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <WindowsLogo className="w-4 h-4 mb-1" />
          <span className="text-[10px] leading-tight font-medium">Windows</span>
        </Link>

        {/* 5. Cart */}
        <Link
          href="/cart"
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors relative ${
            pathname === '/cart' ? 'text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 mb-0.5" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-blue-700 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-tight">Cart</span>
        </Link>
      </div>
    </nav>
  );
}
