import React from 'react';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import ReportsClient from './ReportsClient';

export const revalidate = 0;

export default async function AdminReportsPage() {
  await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);

  const [
    setting,
    totalProducts,
    totalBrands,
    totalBlogs,
    totalReviews,
    totalEnquiries,
    totalOrders,
    verifiedOrders,
    ordersByStatus,
    enquiriesByType,
    recentOrders,
    topProducts,
  ] = await Promise.all([
    prisma.websiteSetting.findFirst(),
    prisma.product.count({ where: { active: true } }),
    prisma.brand.count({ where: { active: true } }),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.review.count({ where: { isApproved: true } }),
    prisma.contactEnquiry.count(),
    prisma.order.count(),
    prisma.order.findMany({
      where: { paymentStatus: 'VERIFIED_PAID' },
      select: { totalAmount: true },
    }),
    prisma.order.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
    prisma.contactEnquiry.groupBy({
      by: ['type'],
      _count: { id: true },
    }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        totalAmount: true,
        status: true,
        paymentStatus: true,
        paymentMethod: true,
        createdAt: true,
      },
    }),
    prisma.product.findMany({
      take: 5,
      where: { active: true },
      orderBy: { reviewCount: 'desc' },
      select: {
        id: true,
        title: true,
        price: true,
        stock: true,
        rating: true,
        reviewCount: true,
      },
    }),
  ]);

  const totalVerifiedRevenue = verifiedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // XML Sitemap entry calculation
  const staticPageCount = 35;
  const totalSitemapUrls = staticPageCount + totalProducts + totalBrands + totalBlogs;

  const gaId =
    setting?.googleAnalyticsId ||
    process.env.NEXT_PUBLIC_GA_ID ||
    process.env.GOOGLE_ANALYTICS_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ||
    '';

  const gscToken =
    setting?.googleSiteVerification ||
    process.env.GOOGLE_SITE_VERIFICATION ||
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
    '';

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lappysquare.com';

  return (
    <ReportsClient
      data={{
        gaId,
        gscToken,
        baseUrl,
        totalSitemapUrls,
        staticPageCount,
        totalProducts,
        totalBrands,
        totalBlogs,
        totalReviews,
        totalEnquiries,
        totalOrders,
        totalVerifiedRevenue,
        ordersByStatus,
        enquiriesByType,
        recentOrders: recentOrders.map((o) => ({
          ...o,
          createdAt: o.createdAt.toISOString(),
        })),
        topProducts,
      }}
    />
  );
}
