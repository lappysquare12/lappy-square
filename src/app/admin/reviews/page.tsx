import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { Star, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import ReviewTableActions from './ReviewTableActions';
import AddReviewModal from './AddReviewModal';

export const revalidate = 0;

export default async function AdminReviewsPage() {
  await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);

  const [reviews, products] = await Promise.all([
    prisma.review.findMany({
      include: {
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.findMany({
      select: {
        id: true,
        title: true,
        brand: {
          select: { name: true },
        },
      },
      orderBy: { title: 'asc' },
    }),
  ]);

  const totalReviews = reviews.length;
  const approvedReviews = reviews.filter((r) => r.isApproved).length;
  const pendingReviews = totalReviews - approvedReviews;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Reviews</h1>
          <p className="text-sm text-slate-500 mt-1">
            Moderate, approve, and manage customer feedback and ratings across all laptops.
          </p>
        </div>
        <AddReviewModal products={products} />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#E8E8E8] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Reviews</p>
              <p className="text-xl font-bold text-slate-900">{totalReviews}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E8E8E8] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Published / Approved</p>
              <p className="text-xl font-bold text-emerald-600">{approvedReviews}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E8E8E8] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Pending Moderation</p>
              <p className="text-xl font-bold text-amber-600">{pendingReviews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E8E8E8] bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">All Reviews ({totalReviews})</h2>
          <span className="text-xs text-slate-500">Live moderating updates the public product pages immediately</span>
        </div>

        {reviews.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No customer reviews found in the database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E8E8E8] text-slate-500 font-semibold bg-slate-50/70">
                  <th className="py-3 px-4">Laptop</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Review Content</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8]">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900 max-w-[200px]">
                      <Link
                        href={`/product/${r.product.slug}`}
                        target="_blank"
                        className="hover:text-emerald-600 transition-colors line-clamp-1"
                        title={r.product.title}
                      >
                        {r.product.title}
                      </Link>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900">{r.userName}</p>
                      {r.userEmail && <p className="text-[11px] text-slate-400">{r.userEmail}</p>}
                      {r.isVerifiedPurchase && (
                        <span className="inline-block mt-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">
                          Verified Buyer
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-sm">
                      {r.title && <p className="font-semibold text-slate-900 mb-0.5">{r.title}</p>}
                      <p className="text-slate-600 line-clamp-2">{r.comment}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      {r.isApproved ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <AlertCircle className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <ReviewTableActions review={r} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
