import React from 'react';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import ProductInventoryClient from './ProductInventoryClient';
import { ensureFirestoreProductsSynced } from '@/lib/firestore-sync';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);
  await ensureFirestoreProductsSynced();

  const products = await prisma.product.findMany({
    include: { brand: true, category: true, images: true },
    orderBy: { createdAt: 'desc' },
  });

  return <ProductInventoryClient initialProducts={products} />;
}
