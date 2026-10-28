import React from 'react';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import BrandSeriesManager from './BrandSeriesManager';
import { Tag } from 'lucide-react';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function AdminBrandsPage() {
  await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);

  const brands = await prisma.brand.findMany({
    include: {
      series: {
        where: { active: true },
        orderBy: { displayOrder: 'asc' },
      },
      _count: {
        select: { products: true },
      },
    },
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
          <Tag className="w-4 h-4 text-blue-600" />
          <span>Catalog Hierarchy &amp; Models</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
          Brand Series &amp; Laptop Types
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage brand-specific subcategories (e.g. Apple MacBook Air &amp; Pro, Dell Latitude &amp; XPS, Lenovo ThinkPad).
        </p>
      </div>

      <BrandSeriesManager initialBrands={brands} />
    </div>
  );
}
