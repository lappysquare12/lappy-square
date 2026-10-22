import React from 'react';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import BannersClient from './BannersClient';

export const revalidate = 0;

export default async function AdminBannersPage() {
  await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);

  const banners = await prisma.banner.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  const serializedBanners = banners.map((b) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
  }));

  return <BannersClient initialBanners={serializedBanners} />;
}
