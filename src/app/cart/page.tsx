'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import {
  Trash2,
  ArrowRight,
  ShieldCheck,
  Store,
  Sparkles,
  ShoppingBag,
  ArrowLeft,
  Tag,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';
import { formatMaskedPrice } from '@/lib/price';

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discountAmount,
    totalAmount,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  const itemCount = items.reduce((acc, it) => acc + it.quantity, 0);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    setCouponError(null);
    const success = await applyCoupon(couponInput.trim());
    if (!success) {
      setCouponError('Invalid or expired coupon code');
    } else {
      setCouponInput('');
    }
    setApplying(false);
  };

  const handleWhatsAppCartOrder = () => {
    const itemsList = items
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.title}*
   • Price: ₹${it.price.toLocaleString('en-IN')} | Qty: ${it.quantity}
   • Total: ₹${(it.price * it.quantity).toLocaleString('en-IN')}`
      )
      .join('\n\n');

    const couponLine = coupon
      ? `\n*Coupon Applied:* ${coupon.code} (-₹${discountAmount.toLocaleString('en-IN')})`
      : '';

    const message = `*NEW DIRECT ORDER VIA WHATSAPP — LAPPY SQUARE*
━━━━━━━━━━━━━━━━━━━━
*ITEMS IN MY CART:*
${itemsList}

*Subtotal:* ₹${subtotal.toLocaleString('en-IN')}${couponLine}
*Store Pickup & Demo:* FREE
*TOTAL PAYABLE:* *₹${totalAmount.toLocaleString('en-IN')}*

*Lappy Square Assurance:*
• 1-Year Comprehensive Warranty
• 45-Point Lab Diagnostics Report
• 7-Day Replacement Guarantee

Hello Lappy Square Team, I want to book this order on WhatsApp for store pickup / direct purchase. Please guide me with store visit and device reservation details.`;

    const whatsappNum = '919376988788';
    const url = `https://api.whatsapp.com/send?phone=${whatsappNum}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#F8FAFC] text-slate-800 min-h-[80vh] py-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center space-y-6 bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs">
          <div className="w-20 h-20 bg-blue-50 border border-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-xs">
            <ShoppingBag className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Your Cart is Empty</h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              Looks like you haven&apos;t added any certified laptops yet. Explore our inventory of verified MacBooks, ThinkPads, and Dell laptops.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 py-3.5 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-600/20 group"
            >
              <span>Explore Certified Laptops</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 1-Year Warranty</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Store className="w-3.5 h-3.5 text-blue-600" /> Store Pickup</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] text-slate-800 min-h-screen">
      {/* Modern Header Banner */}
      <section className="bg-white border-b border-slate-200/90 pt-8 pb-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav className="text-xs text-slate-500 mb-3 flex items-center gap-2 font-medium">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-blue-600 font-semibold">Shopping Bag</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Store Walk-in & Live Testing Active</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Review Your Cart
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {itemCount} {itemCount === 1 ? 'machine' : 'machines'} reserved with 45-point testing report & 1-year warranty coverage.
              </p>
            </div>

            <button
              onClick={clearCart}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold transition-all self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Empty Bag</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Cart Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Store Pickup & In-Person Demo Reassurance Bar */}
            <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 flex-shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Store Walk-in & Live Demo Available!</span>
                  <span className="text-slate-600 text-[11px]">Inspect and test your certified machine in person at our store before taking it home.</span>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider flex-shrink-0">
                Live Testing
              </span>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 hover:border-slate-300 transition-all flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3.5 sm:gap-4 w-full sm:w-auto flex-1 min-w-0">
                  <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex-shrink-0 group">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="112px"
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
                        {item.conditionGrade}
                      </span>
                      <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                        1-Yr Warranty
                      </span>
                    </div>

                    <Link
                      href={`/product/${item.slug}`}
                      className="block text-sm sm:text-base font-bold text-slate-900 hover:text-blue-600 leading-snug transition-colors line-clamp-1"
                    >
                      {item.title}
                    </Link>

                    <p className="text-xs text-slate-500 truncate">
                      {item.processor} • {item.ramGb}GB RAM • {item.storageGb}GB SSD
                    </p>

                    <div className="flex flex-wrap items-baseline gap-2 pt-1">
                      <span className="text-base sm:text-lg font-black text-slate-950">
                        {formatMaskedPrice(item.price)}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {formatMaskedPrice(item.originalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quantity and Actions */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center border border-slate-200 bg-slate-50 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 font-bold text-sm transition-colors"
                      title="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-900 min-w-[28px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-3 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 font-bold text-sm transition-colors"
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-all"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Order Summary & Coupon (4 Cols) */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            
            {/* Coupon Box */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Discount Coupon Code
                </h3>
              </div>

              {coupon ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between text-xs text-emerald-800">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{coupon.code} Applied</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 font-medium">
                      Instant discount of ₹{discountAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-bold text-rose-600 hover:underline px-2 py-1"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="e.g. WELCOME10, LAPPY2000"
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 rounded-xl px-3.5 py-2.5 outline-none uppercase focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={applying}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-600/20 disabled:opacity-50 flex-shrink-0"
                    >
                      {applying ? '...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-500">Available:</span>
                    <button
                      type="button"
                      onClick={() => setCouponInput('WELCOME10')}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-blue-700 font-semibold px-2 py-0.5 rounded border border-slate-200"
                    >
                      WELCOME10 (-10%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCouponInput('LAPPY2000')}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-blue-700 font-semibold px-2 py-0.5 rounded border border-slate-200"
                    >
                      LAPPY2000 (-₹2k)
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-blue-700 font-semibold">{itemCount} items</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Savings</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Store className="w-3.5 h-3.5 text-blue-600" />
                    <span>Store Pickup & Live Demo</span>
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                    FREE
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>GST & Testing Surcharge</span>
                  <span className="text-slate-500">Included in total</span>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">Total Amount</span>
                    <span className="text-[10px] text-slate-500">All taxes & warranty included</span>
                  </div>
                  <span className="text-2xl font-black text-slate-950">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleWhatsAppCartOrder}
                className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2.5 shadow-md shadow-[#25D366]/25 transition-all group"
              >
                <WhatsAppIcon className="w-5 h-5 fill-current" />
                <span>Order on WhatsApp (Instant Booking)</span>
              </button>

              <div className="pt-2 text-center text-[10px] text-slate-500 space-y-1.5 border-t border-slate-100">
                <div className="flex items-center justify-center gap-1.5 text-slate-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Booking & Store Pickup • 7-Day Replacement</span>
                </div>
                <p className="text-slate-500">
                  Live hardware inspection and demo available before taking the device.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
