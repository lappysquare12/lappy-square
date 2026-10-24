'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  Store,
  RotateCcw,
  BatteryCharging,
  Cpu,
  HardDrive,
  Monitor,
  Heart,
  Scale,
  ShoppingCart,
  Zap,
  MapPin,
  Check,
  Info,
  Layers,
  Star
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare, CompareProduct } from '@/context/CompareContext';
import { generateSingleProductWhatsAppUrl } from '@/lib/whatsapp-order';
import BrandLogo from '@/components/ui/BrandLogos';
import { formatMaskedPrice } from '@/lib/price';

interface ProductDetailProps {
  product: {
    id: string;
    title: string;
    slug: string;
    sku: string;
    price: number;
    originalPrice: number;
    stock: number;
    conditionGrade: 'LIKE_NEW' | 'EXCELLENT' | 'GOOD';
    processor: string;
    processorModel?: string | null;
    processorGen?: string | null;
    ramGb: number;
    ramType?: string | null;
    storageGb: number;
    storageType?: string | null;
    screenSize: string;
    displayResolution?: string | null;
    graphicsCard?: string | null;
    graphicsType?: string | null;
    os: string;
    batteryHealth?: string | null;
    batteryBackupHours?: string | null;
    warrantyMonths: number;
    includedAccessories?: string | null;
    weightKg?: string | null;
    useCase?: string | null;
    description?: string | null;
    rating: number;
    reviewCount: number;
    brand: { name: string; slug: string };
    category: { name: string; slug: string };
    images: Array<{ url: string; alt?: string | null }>;
    reviews: Array<{
      id: string;
      userName: string;
      rating: number;
      title?: string | null;
      comment: string;
      createdAt: Date;
    }>;
    faqs: Array<{
      id: string;
      question: string;
      answer: string;
    }>;
  };
}

export default function ProductDetailClient({ product }: ProductDetailProps) {
  const router = useRouter();
  const { addToCart, items } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'box' | 'testing'>('specs');
  const [addedToast, setAddedToast] = useState(false);

  // Customer Reviews state
  const [reviewsList, setReviewsList] = useState(product.reviews || []);
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isCartAdded = items.some((i) => i.productId === product.id);
  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const discountPercentage = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const imageUrls = product.images.length > 0
    ? product.images.map((i) => i.url)
    : ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80'];

  const gradeInfo = {
    LIKE_NEW: {
      title: 'Grade A+ (Like New)',
      desc: 'Flawless aesthetic condition with zero visible marks or scratches. 100% lab certified hardware and battery health > 90%.',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    EXCELLENT: {
      title: 'Grade A (Excellent)',
      desc: 'Minor faint hairline marks on outer base/cover only. Screen and keyboard are completely pristine. Battery health > 85%.',
      color: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    GOOD: {
      title: 'Grade B (Fair)',
      desc: 'Normal light cosmetic wear. Hardware, display and all internal circuits are 100% verified functional.',
      color: 'bg-slate-100 text-slate-800 border-slate-200',
    },
  }[product.conditionGrade];

  // Dedicated "Get Today's Best Price" WhatsApp URL with full device context
  const whatsappUrl = generateSingleProductWhatsAppUrl({
    id: product.id,
    title: product.title,
    sku: product.sku,
    slug: product.slug,
    price: product.price,
    processor: product.processor,
    ramGb: product.ramGb,
    storageGb: product.storageGb,
    conditionGrade: gradeInfo.title,
    imageUrl: imageUrls[0],
  });

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) {
      setReviewMessage({ type: 'error', text: 'Please enter your name and review comments.' });
      return;
    }

    setSubmittingReview(true);
    setReviewMessage(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userName: newName.trim(),
          userEmail: newEmail.trim() || null,
          rating: newRating,
          title: newTitle.trim() || null,
          comment: newComment.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setReviewsList([
        {
          id: data.review?.id || String(Date.now()),
          userName: newName.trim(),
          rating: newRating,
          title: newTitle.trim() || null,
          comment: newComment.trim(),
          createdAt: new Date(),
        },
        ...reviewsList,
      ]);

      setReviewMessage({
        type: 'success',
        text: 'Thank you! Your verified review has been published successfully.',
      });

      setNewName('');
      setNewEmail('');
      setNewTitle('');
      setNewComment('');
      setNewRating(5);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setReviewMessage({ type: 'error', text: msg });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(
      {
        productId: product.id,
        title: product.title,
        slug: product.slug,
        sku: product.sku,
        price: product.price,
        originalPrice: product.originalPrice,
        image: imageUrls[0],
        conditionGrade: product.conditionGrade,
        ramGb: product.ramGb,
        storageGb: product.storageGb,
        processor: product.processor,
        stock: product.stock,
      },
      quantity
    );
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };



  const handleToggleCompare = () => {
    if (isCompared) {
      removeFromCompare(product.id);
    } else {
      const comparePayload: CompareProduct = {
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        image: imageUrls[0],
        brand: product.brand.name,
        conditionGrade: product.conditionGrade,
        processor: product.processor,
        ramGb: product.ramGb,
        storageGb: product.storageGb,
        screenSize: product.screenSize,
        graphicsCard: product.graphicsCard,
        os: product.os,
        batteryHealth: product.batteryHealth,
        batteryBackupHours: product.batteryBackupHours,
        warrantyMonths: product.warrantyMonths,
      };
      addToCompare(comparePayload);
    }
  };

  return (
    <div className="bg-[#F7F8FA] min-h-screen py-6 sm:py-8 overflow-x-hidden w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-w-0">
        
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 mb-6 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-slate-900">Shop</Link>
          <span>/</span>
          <Link href={`/brands/${product.brand.slug}`} className="hover:text-slate-900">{product.brand.name}</Link>
          <span>/</span>
          <span className="text-slate-500 font-normal truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Top Product Hero Card */}
        <div className="bg-white border border-[#E8E8E8] rounded-3xl p-4 sm:p-8 lg:p-10 mb-10 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* Gallery (Left: 6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Preview Box */}
              <div className="relative aspect-[4/3] w-full rounded-2xl bg-slate-50 border border-slate-200/80 overflow-hidden flex items-center justify-center p-4 sm:p-6">
                <Image
                  src={imageUrls[selectedImageIdx] || imageUrls[0] || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80'}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-2 sm:p-4 transition-transform duration-300 hover:scale-105"
                  priority
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target && !target.src.includes('1588872657578')) {
                      target.src = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80';
                    }
                  }}
                />

                {discountPercentage > 0 && (
                  <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-rose-600 text-white font-black text-[11px] sm:text-xs px-2.5 py-1 rounded-lg shadow-sm">
                    SAVE {discountPercentage}%
                  </span>
                )}

                {product.batteryHealth && (
                  <span className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-slate-900 text-white font-medium text-[11px] sm:text-xs px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{product.batteryHealth}</span>
                  </span>
                )}
              </div>

              {/* Thumbnail Selector */}
              {imageUrls.length > 1 && (
                <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {imageUrls.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      suppressHydrationWarning
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-50 border-2 overflow-hidden flex-shrink-0 transition-all ${
                        selectedImageIdx === idx
                          ? 'border-slate-900 shadow-sm'
                          : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={url}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        sizes="80px"
                        className="object-contain p-1.5"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* 45-Point Lab Guarantee Tag */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Lappy Square Assured Quality</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Tested across 45 hardware and software checkpoints. Includes physical inspection certificate & original charger.
                  </p>
                </div>
              </div>
            </div>

            {/* Product Meta & Purchase Actions (Right: 6 Cols) */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6">
              
              {/* Brand & SKU */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-6 sm:h-7 flex items-center shrink-0">
                    <BrandLogo brand={product.brand.slug} size="md" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-500 truncate">
                    {product.brand.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
                  <span className="text-[10px] sm:text-xs text-slate-400 font-mono font-medium whitespace-nowrap">
                    SKU: {product.sku}
                  </span>
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={handleToggleCompare}
                    className={`p-1.5 sm:p-2 rounded-full border transition-colors ${
                      isCompared
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'border-slate-200 text-slate-600 hover:text-black hover:border-slate-400'
                    }`}
                    title={isCompared ? 'In Comparison' : 'Compare Laptop'}
                  >
                    <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() =>
                      toggleWishlist({
                        productId: product.id,
                        title: product.title,
                        slug: product.slug,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: imageUrls[0],
                        conditionGrade: product.conditionGrade,
                      })
                    }
                    className={`p-1.5 sm:p-2 rounded-full border transition-colors ${
                      isWishlisted
                        ? 'bg-rose-50 border-rose-300 text-rose-600'
                        : 'border-slate-200 text-slate-600 hover:text-rose-600 hover:border-slate-400'
                    }`}
                    title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Title (Light & Elegant) */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-light text-slate-800 tracking-normal leading-snug">
                {product.title}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-slate-500 font-medium">
                  ({product.reviewCount} Reviews)
                </span>
                <span className="text-emerald-700 font-semibold">• In Stock ({product.stock} units)</span>
              </div>

              {/* Price Block */}
              <div className="p-4 bg-[#F7F8FA] rounded-2xl border border-slate-200/80 space-y-1">
                <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-slate-950" title="Get Today's Best Price on WhatsApp">
                    {formatMaskedPrice(product.price)}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 line-through">
                    {formatMaskedPrice(product.originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Special Offer Today
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Inclusive of all taxes • Store Pickup & Live Demo Available • 1-Year Comprehensive Warranty
                </p>
              </div>

              {/* Condition Grade Card */}
              <div className={`p-4 rounded-2xl border ${gradeInfo.color}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold tracking-wide uppercase">
                    Condition Grade: {gradeInfo.title}
                  </span>
                  <span className="text-[10px] font-semibold bg-white px-2 py-0.5 rounded-full border border-current">
                    Verified
                  </span>
                </div>
                <p className="text-xs leading-relaxed opacity-90">{gradeInfo.desc}</p>
              </div>

              {/* Key Specs Matrix */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Processor</p>
                    <p className="font-semibold text-slate-900 truncate">{product.processor}</p>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">RAM Memory</p>
                    <p className="font-semibold text-slate-900 truncate">{product.ramGb}GB {product.ramType || 'DDR4'}</p>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
                  <HardDrive className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Storage</p>
                    <p className="font-semibold text-slate-900 truncate">{product.storageGb}GB {product.storageType || 'SSD'}</p>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
                  <Monitor className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Display</p>
                    <p className="font-semibold text-slate-900 truncate">{product.screenSize}</p>
                  </div>
                </div>
              </div>



              {/* High Impact Action Buttons */}
              <div className="space-y-3 pt-2">
                {/* 1. Primary Action: Get Today's Best Price on WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 sm:py-4 px-6 rounded-2xl font-bold text-sm sm:text-base bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-2.5 shadow-lg shadow-[#25D366]/25 transition-all text-center group"
                >
                  <WhatsAppIcon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
                  <span>Get Today&apos;s Best Price</span>
                </a>

                {/* 2. Secondary Action: Add to Cart */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white flex-shrink-0">
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2.5 text-slate-600 hover:text-black font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="px-3.5 text-xs font-bold text-slate-900">{quantity}</span>
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3.5 py-2.5 text-slate-600 hover:text-black font-bold text-sm"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                      isCartAdded
                        ? 'bg-blue-700 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{isCartAdded ? 'Added to Cart' : 'Add to Cart'}</span>
                  </button>
                </div>
              </div>

              {addedToast && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Successfully added to your shopping cart!</span>
                </div>
              )}

              {/* Guarantees Bar */}
              <div className="border-t border-slate-100 pt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-600">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-slate-900 mx-auto mb-1" />
                  <span className="font-semibold block text-slate-900">{product.warrantyMonths} Months</span>
                  <span>Store Warranty</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <RotateCcw className="w-4 h-4 text-slate-900 mx-auto mb-1" />
                  <span className="font-semibold block text-slate-900">7 Days</span>
                  <span>Replacement</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <Store className="w-4 h-4 text-slate-900 mx-auto mb-1" />
                  <span className="font-semibold block text-slate-900">Store Pickup</span>
                  <span>Live Testing</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Deep Dive Tabs: Specifications, In The Box, Reviews */}
        <div className="bg-white border border-[#E8E8E8] rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm mb-12 overflow-hidden">
          {/* Tab Buttons */}
          <div className="flex border-b border-slate-200 gap-4 sm:gap-6 mb-8 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${
                activeTab === 'specs'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Full Technical Specifications
            </button>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setActiveTab('box')}
              className={`pb-3 text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${
                activeTab === 'box'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              What&apos;s in the Box & Accessories
            </button>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setActiveTab('testing')}
              className={`pb-3 text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${
                activeTab === 'testing'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              45-Point Lab Diagnostic
            </button>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Customer Reviews ({product.reviews.length})
            </button>
          </div>

          {/* Tab 1: Specs */}
          {activeTab === 'specs' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs text-slate-700">
                <div className="p-3 bg-[#F7F8FA] rounded-xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 sm:gap-2">
                  <span className="font-medium text-slate-500 shrink-0">Processor & Model</span>
                  <span className="font-bold text-slate-900 text-right break-words min-w-0">
                    {product.processor} {product.processorModel ? `(${product.processorModel})` : ''}
                  </span>
                </div>
                <div className="p-3 bg-[#F7F8FA] rounded-xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 sm:gap-2">
                  <span className="font-medium text-slate-500 shrink-0">Generation</span>
                  <span className="font-bold text-slate-900 text-right break-words min-w-0">{product.processorGen || 'OEM Verified'}</span>
                </div>
                <div className="p-3 bg-[#F7F8FA] rounded-xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 sm:gap-2">
                  <span className="font-medium text-slate-500 shrink-0">Installed RAM</span>
                  <span className="font-bold text-slate-900 text-right break-words min-w-0">
                    {product.ramType ? product.ramType : `${product.ramGb}GB High-Speed`}
                  </span>
                </div>
                <div className="p-3 bg-[#F7F8FA] rounded-xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 sm:gap-2">
                  <span className="font-medium text-slate-500 shrink-0">Storage Capacity</span>
                  <span className="font-bold text-slate-900 text-right break-words min-w-0">
                    {product.storageType ? product.storageType : `${product.storageGb}GB SSD`}
                  </span>
                </div>
                <div className="p-3 bg-[#F7F8FA] rounded-xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 sm:gap-2">
                  <span className="font-medium text-slate-500 shrink-0">Screen Size & Res</span>
                  <span className="font-bold text-slate-900 text-right break-words min-w-0">
                    {product.displayResolution || `${product.screenSize} Full HD Display`}
                  </span>
                </div>
                <div className="p-3 bg-[#F7F8FA] rounded-xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 sm:gap-2">
                  <span className="font-medium text-slate-500 shrink-0">Graphics Controller</span>
                  <span className="font-bold text-slate-900 text-right break-words min-w-0">{product.graphicsCard || 'Integrated Graphics'}</span>
                </div>
                <div className="p-3 bg-[#F7F8FA] rounded-xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 sm:gap-2">
                  <span className="font-medium text-slate-500 shrink-0">Operating System</span>
                  <span className="font-bold text-slate-900 text-right break-words min-w-0">
                    {product.os.toLowerCase().includes('genuine') ? product.os : `${product.os} (100% Genuine License)`}
                  </span>
                </div>
                <div className="p-3 bg-[#F7F8FA] rounded-xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 sm:gap-2">
                  <span className="font-medium text-slate-500 shrink-0">Battery Health & Backup</span>
                  <span className="font-bold text-slate-900 text-right break-words min-w-0">{product.batteryHealth} • {product.batteryBackupHours || '4-6 Hours'}</span>
                </div>
                <div className="p-3 bg-[#F7F8FA] rounded-xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 sm:gap-2">
                  <span className="font-medium text-slate-500 shrink-0">Weight</span>
                  <span className="font-bold text-slate-900 text-right break-words min-w-0">{product.weightKg || '1.4 kg'}</span>
                </div>
                <div className="p-3 bg-[#F7F8FA] rounded-xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 sm:gap-2">
                  <span className="font-medium text-slate-500 shrink-0">Recommended Use</span>
                  <span className="font-bold text-slate-900 text-right break-words min-w-0">{product.useCase || 'Business & Everyday'}</span>
                </div>
              </div>

              {product.description && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 mb-2">Detailed Condition Overview</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">{product.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: In The Box */}
          {activeTab === 'box' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <h4 className="text-sm font-bold text-slate-900">What&apos;s in the Box & Accessories</h4>
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1x Certified Refurbished {product.title}</span>
                </li>
                {product.includedAccessories ? (
                  product.includedAccessories
                    .split(',')
                    .map((item, idx) => item.trim())
                    .filter(Boolean)
                    .map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))
                ) : (
                  <>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>1x Original OEM Power Adapter & Power Cable</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>1x Lappy Square Premium Protective Padded Laptop Sleeve</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>1x Signed 45-Point Hardware Quality Certificate</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>1x Lappy Square Warranty Card with direct technical helpline</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}

          {/* Tab 3: Testing */}
          {activeTab === 'testing' && (
            <div className="space-y-4 text-xs text-slate-600">
              <h4 className="text-sm font-bold text-slate-900">Standard Lab Verification Protocol</h4>
              <p>Every device passes 45 checkpoints prior to dispatch:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="font-bold text-slate-900 mb-1">Display Diagnostics</p>
                  <p>100% dead pixel scan, RGB color gradient test, hinge tension, zero backlight bleed.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="font-bold text-slate-900 mb-1">Thermals & CPU</p>
                  <p>10-minute maximum load benchmark, fresh thermal compound, whisper-quiet fan bearings.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="font-bold text-slate-900 mb-1">Battery & Ports</p>
                  <p>Full discharge cycle profiling, charging voltage test, all USB & Type-C data transfer verified.</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Existing Reviews List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900">
                    Customer Feedback ({reviewsList.length})
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating} Average Rating</span>
                  </div>
                </div>

                {reviewsList.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    No reviews yet for this model. Be the first to share your experience!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {reviewsList.map((rev) => (
                      <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200/50">
                              Verified Purchase
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rev.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {rev.title && <h5 className="text-xs font-bold text-slate-900">{rev.title}</h5>}
                        <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Write a Review Section */}
              <div className="p-5 sm:p-6 bg-slate-50/80 border border-slate-200 rounded-3xl space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Write a Review for {product.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Share your experience to help other laptop buyers make informed decisions.
                  </p>
                </div>

                {reviewMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      reviewMessage.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    <span>{reviewMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Rating</label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-slate-600 ml-2">{newRating} / 5 Stars</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        required
                        className="w-full bg-white border border-slate-200 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email (Optional)</label>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="e.g. rahul@example.com"
                        className="w-full bg-white border border-slate-200 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Review Headline</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Excellent condition, battery backup is 6+ hours!"
                      className="w-full bg-white border border-slate-200 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Review *</label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Tell us about laptop performance, keyboard feel, battery, packaging, etc..."
                      rows={3}
                      required
                      className="w-full bg-white border border-slate-200 text-xs rounded-xl p-3 outline-none focus:border-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Verified Review'}
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
