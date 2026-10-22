'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCompare } from '@/context/CompareContext';
import { useCart } from '@/context/CartContext';
import {
  Scale,
  X,
  ShoppingCart,
  Trash2,
  Cpu,
  HardDrive,
  Monitor,
  BatteryCharging,
  ShieldCheck,
  Check,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { formatMaskedPrice } from '@/lib/price';

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  if (compareItems.length === 0) {
    return (
      <div className="bg-[#0B1120] text-slate-100 min-h-[75vh] py-16 flex items-center justify-center relative overflow-hidden">
        <div className="max-w-md w-full mx-auto px-4 text-center space-y-6 bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative z-10">
          <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto">
            <Scale className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">No Laptops to Compare</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Select up to 4 certified laptops across the store by tapping the scale icon to compare hardware, thermals, and prices side-by-side.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/25 group"
            >
              <span>Explore Certified Laptops</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B1120] text-slate-100 min-h-screen pb-16">
      {/* Header Banner */}
      <section className="relative pt-12 pb-8 border-b border-slate-800/80 overflow-hidden">
        <div className="absolute inset-0 bg-radial-[at_top] from-blue-600/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <nav className="text-xs text-slate-400 mb-4 flex items-center gap-2 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-blue-400 font-semibold">Side-by-Side Comparison</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
                <Scale className="w-3.5 h-3.5" />
                <span>Comparing {compareItems.length} of 4 Supported Models</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Hardware Comparison Matrix
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Detailed specs, cosmetic condition grades, battery ratings, and pricing breakdown.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/shop"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-xs font-bold rounded-xl text-white transition-all shadow-md"
              >
                + Add Another Laptop
              </Link>
              <button
                onClick={clearCompare}
                className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="p-6 bg-slate-950/80 w-52 text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Product Overview
                </th>
                {compareItems.map((item) => (
                  <th key={item.id} className="p-6 align-top border-l border-slate-800/80 min-w-[240px] bg-slate-900/50">
                    <div className="relative mb-3 space-y-3">
                      <button
                        onClick={() => removeFromCompare(item.id)}
                        className="absolute -top-2 -right-2 p-1.5 bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 border border-slate-700 rounded-full text-slate-400 transition-colors z-10"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div className="relative aspect-[4/3] w-full rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="240px"
                          className="object-contain p-3"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                          {item.brand}
                        </span>
                        <Link
                          href={`/product/${item.slug}`}
                          className="block text-xs sm:text-sm font-normal text-slate-100 hover:text-blue-400 line-clamp-2 transition-colors"
                        >
                          {item.title}
                        </Link>
                      </div>

                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-lg font-black text-white">
                          {formatMaskedPrice(item.price)}
                        </span>
                        <span className="text-xs text-slate-500 line-through">
                          {formatMaskedPrice(item.originalPrice)}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          addToCart({
                            productId: item.id,
                            title: item.title,
                            slug: item.slug,
                            sku: `CMP-${item.id.slice(0, 5)}`,
                            price: item.price,
                            originalPrice: item.originalPrice,
                            image: item.image,
                            conditionGrade: item.conditionGrade,
                            ramGb: item.ramGb,
                            storageGb: item.storageGb,
                            processor: item.processor,
                            stock: 1,
                          })
                        }
                        className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80 text-xs text-slate-300">
              <tr>
                <td className="p-4 bg-slate-950/80 font-bold text-slate-200">Condition Grade</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4 border-l border-slate-800/80">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                      {item.conditionGrade}
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 bg-slate-950/80 font-bold text-slate-200">Processor & Gen</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4 border-l border-slate-800/80 font-semibold text-white">
                    {item.processor}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 bg-slate-950/80 font-bold text-slate-200">RAM Memory</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4 border-l border-slate-800/80 font-bold text-white">
                    {item.ramGb}GB High-Speed RAM
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 bg-slate-950/80 font-bold text-slate-200">SSD Storage</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4 border-l border-slate-800/80 font-bold text-white">
                    {item.storageGb}GB NVMe SSD
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 bg-slate-950/80 font-bold text-slate-200">Screen Display</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4 border-l border-slate-800/80">
                    {item.screenSize}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 bg-slate-950/80 font-bold text-slate-200">Graphics Architecture</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4 border-l border-slate-800/80">
                    {item.graphicsCard || 'Intel UHD / Iris Xe Integrated'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 bg-slate-950/80 font-bold text-slate-200">Pre-Installed OS</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4 border-l border-slate-800/80 text-blue-400 font-medium">
                    {item.os}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 bg-slate-950/80 font-bold text-slate-200">Battery Health & Backup</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4 border-l border-slate-800/80">
                    {item.batteryHealth || '85%+ Tested'} • {item.batteryBackupHours || '4-6 Hours'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 bg-slate-950/80 font-bold text-slate-200">Lappy Comprehensive Warranty</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-4 border-l border-slate-800/80 font-bold text-emerald-400">
                    {item.warrantyMonths} Months Comprehensive Warranty
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
