import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, userName, userEmail, rating, title, comment } = body;

    if (!productId || !userName?.trim() || !comment?.trim()) {
      return NextResponse.json(
        { error: 'Product, your name, and review comments are required.' },
        { status: 400 }
      );
    }

    const numericRating = Math.min(5, Math.max(1, Number(rating) || 5));

    const newReview = await prisma.review.create({
      data: {
        productId,
        userName: userName.trim(),
        userEmail: userEmail?.trim() || null,
        rating: numericRating,
        title: title?.trim() || null,
        comment: comment.trim(),
        isVerifiedPurchase: true,
        isApproved: true, // auto-published or visible for social proof
      },
    });

    // Update product rating and review count
    try {
      const approvedReviews = await prisma.review.findMany({
        where: { productId, isApproved: true },
        select: { rating: true },
      });

      const count = approvedReviews.length;
      const avg =
        count > 0
          ? Number((approvedReviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1))
          : 5.0;

      await prisma.product.update({
        where: { id: productId },
        data: {
          rating: avg,
          reviewCount: count,
        },
      });
    } catch (e) {
      console.error('Failed to update product review metrics:', e);
    }

    revalidatePath(`/product/${productId}`);
    revalidatePath('/admin/reviews');

    return NextResponse.json(
      { success: true, message: 'Review submitted successfully!', review: newReview },
      { status: 201 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error submitting review';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
