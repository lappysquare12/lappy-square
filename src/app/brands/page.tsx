import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { ArrowRight, Laptop, ChevronRight, Award, Sparkles } from 'lucide-react';

export const revalidate = 60;

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    where: { active: true },
    include: {
      products: {
        where: { active: true },
        select: { id: true, price: true },
      },
    },
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="bg-[#F8FAFC] text-slate-800 min-h-screen pb-16">
      {/* Header Banner */}
      <section className="relative pt-8 pb-8 bg-white border-b border-slate-200/90 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <nav className="text-xs text-slate-500 mb-4 flex items-center gap-2 font-medium">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-blue-700 font-semibold">Brand Catalog</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>Certified Tier-1 Manufacturers</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              Explore by Laptop Brand
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              Choose from the industry&apos;s leading manufacturers — Apple MacBooks, Lenovo ThinkPads, Dell Latitudes, and HP EliteBooks. All backed by 1-Year Comprehensive Warranty.
            </p>
          </div>

        </div>
      </section>

      {/* Brands Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((b) => {
            const minPrice = b.products.length > 0
              ? Math.min(...b.products.map((p) => p.price))
              : null;

            return (
              <Link
                key={b.id}
                href={`/brands/${b.slug}`}
                className="group bg-white border border-slate-200/90 hover:border-blue-600/50 rounded-3xl p-7 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl sm:text-2xl font-black text-slate-950 group-hover:text-blue-700 transition-colors">
                      {b.name}
                    </span>
                    <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60 px-3 py-1 rounded-full">
                      {b.products.length} Units In Stock
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {b.description || `Certified refurbished ${b.name} business laptops thoroughly tested with genuine OEM parts.`}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    {minPrice ? `From ₹${minPrice.toLocaleString('en-IN')}` : 'View Collection'}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 group-hover:bg-blue-700 group-hover:border-blue-700 text-slate-600 group-hover:text-white flex items-center justify-center transition-all shadow-xs">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
