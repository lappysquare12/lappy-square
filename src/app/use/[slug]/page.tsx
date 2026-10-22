import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ui/ProductCard';
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, ChevronRight, Layers } from 'lucide-react';
import { ensureFirestoreProductsSynced } from '@/lib/firestore-sync';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface UseCasePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      where: { active: true },
      select: { slug: true },
    });
    return categories.map((c) => ({ slug: c.slug }));
  } catch {
    return [
      { slug: 'student-laptops' },
      { slug: 'business-laptops' },
      { slug: 'programming-laptops' },
      { slug: 'creator-laptops' },
      { slug: 'gaming-laptops' },
    ];
  }
}

export default async function UseCasePage({ params }: UseCasePageProps) {
  await ensureFirestoreProductsSynced();
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { active: true },
        include: { brand: true, images: true },
        orderBy: { price: 'asc' },
      },
    },
  });

  if (!category) {
    notFound();
  }

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
              <Link href="/shop" className="hover:text-slate-900 transition-colors">Use Cases</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-blue-700 font-semibold">{category.name}</span>
            </nav>

            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Laptops</span>
            </Link>
          </div>

          {/* Banner Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Tailored Hardware Profile</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              {category.name} Laptops
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {category.description || `Handpicked certified refurbished laptops optimized specifically for ${category.name} with verified thermal stability.`}
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
                {category.products.length} Matching Models
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Products Grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {category.products.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-4 shadow-sm">
            <p className="text-sm">No laptops found under {category.name} at this moment. Explore our full catalog!</p>
            <Link
              href="/shop"
              className="inline-block px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Browse Full Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {category.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

