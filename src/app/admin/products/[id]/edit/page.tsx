import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import ProductEditForm from './ProductEditForm';

export const revalidate = 0;

interface ProductEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);
  const { id } = await params;

  const [product, brands, categories, brandSeries] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        images: true,
      },
    }),
    prisma.brand.findMany({
      where: { active: true },
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
    }),
    prisma.category.findMany({
      where: { active: true },
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
    }),
    prisma.brandSeries.findMany({
      where: { active: true },
      select: { id: true, brandId: true, name: true, slug: true },
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl space-y-6">
      <ProductEditForm
        product={product}
        brands={brands}
        categories={categories}
        brandSeries={brandSeries}
      />
    </div>
  );
}
