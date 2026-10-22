import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ui/ProductCard';
import { Sparkles, Zap, ShieldCheck, ChevronRight, Clock, Flame } from 'lucide-react';
import { ensureFirestoreProductsSynced } from '@/lib/firestore-sync';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function DealsPage() {
  await ensureFirestoreProductsSynced();
  const deals = await prisma.product.findMany({
    where: { active: true, isDealOfTheDay: true },
    include: { brand: true, images: true },
    orderBy: { price: 'asc' },
  });

  return (
    <div className="bg-[#0B1120] text-slate-100 min-h-screen pb-16">
      {/* Header Banner */}
      <section className="relative pt-12 pb-10 border-b border-slate-800/80 overflow-hidden">
        <div className="absolute inset-0 bg-radial-[at_top] from-amber-500/20 via-blue-600/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <nav className="text-xs text-slate-400 mb-4 flex items-center gap-2 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-amber-400 font-semibold">Lightning Deals</span>
          </nav>

          <div className="bg-gradient-to-r from-amber-500/15 via-blue-600/15 to-amber-500/15 border border-amber-500/30 rounded-3xl p-6 sm:p-10 backdrop-blur-sm shadow-2xl relative overflow-hidden">
            <div className="max-w-2xl space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse fill-current" />
                <span>Limited Drops • Up to 70% Off Retail</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Daily Flagship Deals
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Handpicked premium business laptops and MacBooks at unmatched wholesale prices. Every deal is rigorously tested across 45 quality points and accompanied by our 1-Year Comprehensive Warranty.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Products Grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {deals.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-4">
            <Zap className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">No active lightning deals right now</h3>
            <p className="text-xs text-slate-400">All today&apos;s drop items have been claimed. Check back tomorrow at 10 AM!</p>
            <Link
              href="/shop"
              className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all"
            >
              Explore Full Inventory
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
