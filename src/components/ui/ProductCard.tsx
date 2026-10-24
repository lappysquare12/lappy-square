'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  BatteryCharging,
  Cpu,
  HardDrive,
  ShoppingCart,
  Check,
  Heart,
  Scale,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare, CompareProduct } from '@/context/CompareContext';
import BrandLogo from '@/components/ui/BrandLogos';
import { formatMaskedPrice } from '@/lib/price';
import { generateSingleProductWhatsAppUrl } from '@/lib/whatsapp-order';

export interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    sku: string;
    price: number;
    originalPrice: number;
    conditionGrade: 'LIKE_NEW' | 'EXCELLENT' | 'GOOD';
    batteryHealth?: string | null;
    warrantyMonths: number;
    ramGb: number;
    storageGb: number;
    storageType?: string | null;
    processor: string;
    screenSize?: string | null;
    stock: number;
    brand?: { name: string; slug: string } | null;
    images?: { url: string; altText?: string | null }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, items } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();

  const isCartAdded = items.some((i) => i.productId === product.id);
  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const discountPercentage = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const fallbackUrl =
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80';

  const imageUrl = product.images?.[0]?.url || fallbackUrl;
  const [imgSrc, setImgSrc] = useState(imageUrl);

  const gradeDisplay = {
    LIKE_NEW: {
      text: 'Grade A+ Like New',
      dot: 'bg-blue-600',
      badge: 'bg-blue-50/90 text-blue-800 border-blue-200/80',
    },
    EXCELLENT: {
      text: 'Grade A Pristine',
      dot: 'bg-slate-700',
      badge: 'bg-slate-100 text-slate-800 border-slate-200',
    },
    GOOD: {
      text: 'Grade B Certified',
      dot: 'bg-slate-500',
      badge: 'bg-slate-50 text-slate-700 border-slate-200',
    },
  }[product.conditionGrade] || {
    text: 'Grade A Certified',
    dot: 'bg-blue-600',
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  // Section 15.F: "Get Today's Best Price" WhatsApp URL with prefilled details
  const whatsappUrl = generateSingleProductWhatsAppUrl({
    id: product.id,
    title: product.title,
    sku: product.sku,
    slug: product.slug,
    price: product.price,
    processor: product.processor,
    ramGb: product.ramGb,
    storageGb: product.storageGb,
    conditionGrade: gradeDisplay.text,
    imageUrl: imageUrl,
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      title: product.title,
      slug: product.slug,
      sku: product.sku,
      price: product.price,
      originalPrice: product.originalPrice,
      image: imageUrl,
      conditionGrade: product.conditionGrade,
      ramGb: product.ramGb,
      storageGb: product.storageGb,
      processor: product.processor,
      stock: product.stock,
    });
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCompared) {
      removeFromCompare(product.id);
    } else {
      const comparePayload: CompareProduct = {
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        image: imageUrl,
        brand: product.brand?.name || 'Lappy Square',
        processor: product.processor,
        ramGb: product.ramGb,
        storageGb: product.storageGb,
        conditionGrade: product.conditionGrade,
        warrantyMonths: product.warrantyMonths,
        batteryHealth: product.batteryHealth || 'Tested Lab OK',
        screenSize: product.screenSize || '14.0"',
        os: 'Windows 11 Pro / macOS',
      };
      addToCompare(comparePayload);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative bg-white border border-slate-200/90 hover:border-blue-600/60 rounded-3xl p-3.5 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-15px_rgba(37,99,235,0.18)]"
    >
      <div>
        {/* Large Stage Product Image Container */}
        <div className="relative h-52 sm:h-64 md:h-72 w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50 via-slate-100/60 to-white border border-slate-200/70 p-3 sm:p-4 mb-4 sm:mb-5 group-hover:border-blue-200 transition-colors">
          
          {/* Top Header Floating Row: Grade Badge & Floating Actions (Unified flex to prevent overlapping) */}
          <div className="absolute top-2.5 inset-x-2.5 sm:top-3 sm:inset-x-3 z-10 flex items-center justify-between gap-1.5 pointer-events-none">
            {/* Grade Badge */}
            <div className="pointer-events-auto flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-slate-200/90 shadow-xs min-w-0 shrink">
              <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0 ${gradeDisplay.dot}`} />
              <span className="text-[10px] sm:text-xs font-bold text-slate-800 tracking-tight whitespace-nowrap truncate">
                {gradeDisplay.text}
              </span>
            </div>

            {/* Floating Actions (Top Right) */}
            <div className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 shrink-0">
              {/* Compare Button */}
              <button
                type="button"
                suppressHydrationWarning
                onClick={handleToggleCompare}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${
                  isCompared
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                    : 'bg-white/95 text-slate-500 border-slate-200/90 hover:text-blue-700 hover:scale-105 shadow-xs'
                }`}
                title={isCompared ? 'Remove from comparison' : 'Compare laptop specs'}
              >
                <Scale className="w-3.5 h-3.5" />
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                suppressHydrationWarning
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWishlist({
                    productId: product.id,
                    title: product.title,
                    slug: product.slug,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    image: imageUrl,
                    conditionGrade: product.conditionGrade,
                  });
                }}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-xs'
                    : 'bg-white/95 text-slate-500 border-slate-200/90 hover:text-rose-600 hover:scale-105 shadow-xs'
                }`}
                title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
              </button>
            </div>
          </div>


          {/* Big Laptop Showcase Image with Hover Zoom */}
          <Link href={`/product/${product.slug}`} className="block relative w-full h-full">
            <Image
              src={imgSrc}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain p-2.5 transition-transform duration-500 group-hover:scale-108"
              loading="lazy"
              onError={() => setImgSrc(fallbackUrl)}
            />
          </Link>

          {/* Bottom Floating Badges */}
          <div className="absolute bottom-3 inset-x-3 sm:bottom-3.5 sm:inset-x-3.5 flex items-center justify-between pointer-events-none">
            {discountPercentage > 0 ? (
              <span className="bg-rose-600 text-white font-black text-[10px] sm:text-xs px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg shadow-sm">
                SAVE {discountPercentage}%
              </span>
            ) : <span />}

            {product.batteryHealth && (
              <span className="bg-slate-950/85 backdrop-blur-md text-white font-bold text-[10px] sm:text-xs px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                <BatteryCharging className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400" />
                <span>{product.batteryHealth.split(' ')[0]}</span>
              </span>
            )}
          </div>
        </div>

        {/* Brand Row & SKU */}
        <div className="flex items-center justify-between mb-2 px-0.5 min-h-[30px]">
          {product.brand ? (
            <div className="h-7 sm:h-8 flex items-center text-slate-800">
              <BrandLogo brand={product.brand.slug} size="md" />
            </div>
          ) : (
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Lappy Square</span>
          )}
          <span className="text-[10px] sm:text-xs text-slate-400 font-mono font-medium whitespace-nowrap">
            SKU: {product.sku}
          </span>
        </div>

        {/* Title (Light & Elegant) */}
        <Link href={`/product/${product.slug}`} className="block mb-3 px-0.5">
          <h3 className="text-sm sm:text-base md:text-lg font-light text-slate-800 line-clamp-2 leading-snug hover:text-blue-700 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Spacious Modern Specifications Grid (2x2 Matrix) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-5 sm:mb-6 text-[11px] sm:text-xs text-slate-700">
          <div className="flex items-center gap-2 bg-slate-50/90 border border-slate-200/80 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl">
            <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
            <span className="truncate font-semibold">{product.processor}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50/90 border border-slate-200/80 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-600 flex-shrink-0" />
            <span className="truncate font-bold">{product.ramGb}GB RAM</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50/90 border border-slate-200/80 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl">
            <HardDrive className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
            <span className="truncate font-semibold">{product.storageGb}GB SSD</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50/90 border border-blue-200 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-blue-900">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-700 flex-shrink-0" />
            <span className="truncate font-extrabold">{product.warrantyMonths}M Warranty</span>
          </div>
        </div>
      </div>

      {/* Pricing & High-Impact Action Bar */}
      <div className="pt-3.5 sm:pt-4 border-t border-slate-100 px-0.5">
        <div className="flex flex-wrap items-baseline gap-2 mb-3.5 sm:mb-4">
          <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-950 tracking-tight" title="Get Today's Best Price on WhatsApp">
            {formatMaskedPrice(product.price)}
          </span>
          <span className="text-xs sm:text-sm text-slate-400 line-through">
            {formatMaskedPrice(product.originalPrice)}
          </span>
          <span className="text-[10px] sm:text-xs text-emerald-700 font-extrabold ml-auto flex items-center gap-1 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
            Special Price Today
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {/* Get Today's Best Price (Primary WhatsApp Action) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md shadow-[#25D366]/25 transition-all text-center group/btn"
            title="Get Today's Best Price on WhatsApp"
          >
            <WhatsAppIcon className="w-4 h-4 shrink-0 transition-transform group-hover/btn:scale-110" />
            <span className="whitespace-nowrap font-bold">Get Today&apos;s Best Price</span>
          </a>

          {/* View Details */}
          <Link
            href={`/product/${product.slug}`}
            className="w-full py-2 sm:py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-black text-white transition-all shadow-xs text-center"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
