import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ui/ProductCard';
import { ArrowLeft, Wallet, ShieldCheck, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { ensureFirestoreProductsSynced } from '@/lib/firestore-sync';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface BudgetTierPageProps {
  params: Promise<{
    tier: string;
  }>;
}

const TIER_MAP: Record<
  string,
  { min: number; max: number; title: string; subtitle: string }
> = {
  'under-15000': {
    min: 0,
    max: 15000,
    title: 'Certified Refurbished Laptops Under ₹15,000',
    subtitle: 'Great dependable laptops for student homework, online lectures, and basic accounting.',
  },
  '15000-25000': {
    min: 15000,
    max: 25000,
    title: 'Certified Laptops ₹15,000 – ₹25,000',
    subtitle: 'The ultimate value sweet spot: Intel Core i5, 8GB-16GB RAM and fast SSD storage.',
  },
  '25000-40000': {
    min: 25000,
    max: 40000,
    title: 'Certified Laptops ₹25,000 – ₹40,000',
    subtitle: 'Powerhouse machines for coding, DevOps, Zoom calls, and touchscreen convertibles.',
  },
  '40000-60000': {
    min: 40000,
    max: 60000,
    title: 'Certified Laptops ₹40,000 – ₹60,000',
    subtitle: 'Creator-grade MacBooks, AMD Ryzen 7 workstations, and high-performance business ultrabooks.',
  },
  'above-60000': {
    min: 60000,
    max: 999999,
    title: 'Flagship Laptops Above ₹60,000',
    subtitle: 'High-end 16-inch Retina MacBook Pros, studio editing machines, and gaming rigs.',
  },
};

export async function generateStaticParams() {
  return [
    { tier: 'under-15000' },
    { tier: '15000-25000' },
    { tier: '25000-40000' },
    { tier: '40000-60000' },
    { tier: 'above-60000' },
  ];
}

export default async function BudgetTierPage({ params }: BudgetTierPageProps) {
  await ensureFirestoreProductsSynced();
  const { tier } = await params;
  const config = TIER_MAP[tier];

  if (!config) {
    notFound();
  }

  const products = await prisma.product.findMany({
    where: {
      active: true,
      price: {
        gte: config.min,
        lte: config.max,
      },
    },
    include: {
      brand: true,
      images: true,
    },
    orderBy: { price: 'asc' },
  });

  return (
    <div className="bg-[#F8FAFC] text-slate-800 min-h-screen pb-16">
      {/* Header Banner */}
      <section className="relative pt-8 pb-8 bg-white border-b border-slate-200/90 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <nav className="text-xs text-slate-500 flex items-center gap-2 font-medium">
              <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href="/budget" className="hover:text-slate-900 transition-colors">Budget</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-blue-700 font-semibold">{tier}</span>
            </nav>

            <Link
              href="/budget"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Budgets</span>
            </Link>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold">
              <Wallet className="w-3.5 h-3.5 text-blue-600" />
              <span>Filtered Price Collection</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              {config.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {config.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs text-slate-700 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                45-Point Hardware Certified
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                1-Year Comprehensive Warranty
              </span>
              <span className="text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
                {products.length} Machines Available
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Products Grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {products.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-4 shadow-sm">
            <p className="text-sm">No laptops currently listed in this specific price range.</p>
            <Link
              href="/shop"
              className="inline-block px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Browse All Laptops
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

