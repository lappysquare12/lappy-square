import React from 'react';
import prisma from '@/lib/prisma';
import VideoReviewsClient from './VideoReviewsClient';
import type { Metadata } from 'next';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Customer Video Reviews & Unboxing | Lappy Square',
  description: 'Watch real customer video reviews, unboxing experiences, and diagnostics tests on certified refurbished Apple MacBooks, ThinkPads, and Dell laptops.',
};

export default async function VideoReviewsPage() {
  const videoReviews = await prisma.videoReview.findMany({
    where: { featured: true },
    orderBy: { displayOrder: 'asc' },
  });

  return <VideoReviewsClient initialReviews={videoReviews} />;
}
