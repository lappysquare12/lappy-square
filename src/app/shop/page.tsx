import React, { Suspense } from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ui/ProductCard';
import ShopFilters from './ShopFilters';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { SlidersHorizontal, Laptop, ChevronRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { Prisma } from '@prisma/client';
import { ensureFirestoreProductsSynced } from '@/lib/firestore-sync';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface ShopPageProps {
  searchParams: Promise<{
    q?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    processor?: string;
    ram?: string;
    storage?: string;
    grade?: string;
    useCase?: string;
    sort?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  await ensureFirestoreProductsSynced();
  const params = await searchParams;
  const {
    q,
    brand,
    minPrice,
    maxPrice,
    processor,
    ram,
    storage,
    grade,
    useCase,
    sort,
  } = params;

  // Build Prisma where query
  const where: Prisma.ProductWhereInput = {
    active: true,
  };

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { processor: { contains: q } },
      { description: { contains: q } },
      { sku: { contains: q } },
    ];
  }

  if (brand) {
    where.brand = {
      slug: brand,
    };
  }

  if (minPrice || maxPrice) {
    where.price = {
      gte: minPrice ? parseInt(minPrice, 10) : undefined,
      lte: maxPrice ? parseInt(maxPrice, 10) : undefined,
    };
  }

  if (processor) {
    where.processor = { contains: processor };
  }

  if (ram) {
    where.ramGb = parseInt(ram, 10);
  }

  if (storage) {
    where.storageGb = parseInt(storage, 10);
  }

  if (grade) {
    where.conditionGrade = grade as Prisma.EnumConditionGradeFilter['equals'];
  }

  if (useCase) {
    where.category = {
      slug: useCase,
    };
  }

  // Determine sorting
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
  if (sort === 'price-asc') {
    orderBy = { price: 'asc' };
  } else if (sort === 'price-desc') {
    orderBy = { price: 'desc' };
  } else if (sort === 'rating') {
    orderBy = { rating: 'desc' };
  } else if (sort === 'bestseller') {
    orderBy = { bestSeller: 'desc' };
  }

  // Fetch products and available filter data
  const [products, brands, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: {
        brand: true,
        images: true,
      },
    }),
    prisma.brand.findMany({ where: { active: true } }),
    prisma.category.findMany({ where: { active: true } }),
  ]);

  return (
    <div className="bg-[#F8FAFC] text-slate-800 min-h-screen pb-16">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200/90 pt-8 pb-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav className="text-xs text-slate-500 mb-3 flex items-center gap-2 font-medium">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-blue-600 font-semibold">Shop All Laptops</span>
            {brand && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="capitalize text-slate-900 font-bold">{brand}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Certified Refurbished Inventory</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                All Certified Laptops
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Displaying <strong className="text-slate-900 font-bold">{products.length}</strong> lab-certified machines with 45-point testing report and 1-year warranty.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 45-Point Inspected</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> 1-Year Comprehensive Warranty</span>
            </div>
          </div>

        </div>
      </section>

      {/* Layout Grid: Sidebar Filters + Products Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Left Column: Filters */}
          <div className="lg:col-span-1 sticky top-24">
            <Suspense fallback={<div className="h-96 bg-white rounded-3xl animate-pulse border border-slate-200" />}>
              <ShopFilters brands={brands} categories={categories} />
            </Suspense>
          </div>

          {/* Right Column: Products Grid */}
          <div className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Laptop className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No laptops match your criteria</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Try clearing some filter options or search for another model like ThinkPad, MacBook, or Dell Latitude.
                </p>
                <div>
                  <Link
                    href="/shop"
                    className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/20"
                  >
                    Clear All Filters
                  </Link>
                </div>
              </div>
            ) : (
              <ScrollReveal direction="up" delay={0.05}>
                <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6 sm:gap-7">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </ScrollReveal>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
