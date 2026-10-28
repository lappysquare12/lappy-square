import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ui/ProductCard';
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, ChevronRight, Award, Store } from 'lucide-react';
import { ensureFirestoreProductsSynced } from '@/lib/firestore-sync';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface BrandPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const brands = await prisma.brand.findMany({
      where: { active: true },
      select: { slug: true },
    });
    return brands.map((b) => ({ slug: b.slug }));
  } catch {
    return [
      { slug: 'apple' },
      { slug: 'dell' },
      { slug: 'hp' },
      { slug: 'lenovo' },
      { slug: 'asus' },
      { slug: 'acer' },
    ];
  }
}

export default async function SingleBrandPage({ params }: BrandPageProps) {
  await ensureFirestoreProductsSynced();
  const { slug } = await params;

  const brand = await prisma.brand.findUnique({
    where: { slug },
    include: {
      products: {
        where: { active: true },
        include: { brand: true, images: true },
        orderBy: { price: 'asc' },
      },
    },
  });

  if (!brand) {
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
              <Link href="/brands" className="hover:text-slate-900 transition-colors">Brands</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-blue-700 font-semibold">{brand.name}</span>
            </nav>

            <Link
              href="/brands"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Brands</span>
            </Link>
          </div>

          {/* Brand Banner Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>Original Hardware Lab Certified</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              {brand.name} Refurbished Laptops
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {brand.description || `Browse thoroughly tested, certified pre-owned ${brand.name} machines with genuine OEM chargers and 1-year comprehensive warranty.`}
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs text-slate-700 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                45-Point Inspected
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                100% Genuine Hardware
              </span>
              <span className="flex items-center gap-1.5">
                <Store className="w-4 h-4 text-blue-600 flex-shrink-0" />
                Store Pickup & Consultation
              </span>
              <span className="text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
                {brand.products.length} Units Available
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Products Grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {brand.products.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-4 shadow-sm">
            <p className="text-sm">No laptops currently listed under {brand.name}. Check back soon or request directly via WhatsApp!</p>
            <Link
              href="/shop"
              className="inline-block px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Browse Full Catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {brand.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

