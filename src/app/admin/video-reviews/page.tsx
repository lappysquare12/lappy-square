import React from 'react';
import prisma from '@/lib/prisma';
import VideoReviewsAdminClient from './VideoReviewsAdminClient';

export const metadata = {
  title: 'Video Reviews Management | Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminVideoReviewsPage() {
  const videoReviews = await prisma.videoReview.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Customer Video Reviews</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage YouTube shorts, customer unboxing videos, and review clips shown on the website.
        </p>
      </div>

      <VideoReviewsAdminClient initialReviews={videoReviews} />
    </div>
  );
}
