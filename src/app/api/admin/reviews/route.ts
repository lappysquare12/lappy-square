import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);

    const reviews = await prisma.review.findMany({
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
    });

    return NextResponse.json({ success: true, reviews });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);

    const body = await req.json();
    const { productId, userName, userEmail, rating, title, comment, isVerifiedPurchase, isApproved } = body;

    if (!productId || !userName?.trim() || !comment?.trim()) {
      return NextResponse.json(
        { error: 'Product selection, customer name, and review comment are required.' },
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
        isVerifiedPurchase: isVerifiedPurchase !== undefined ? Boolean(isVerifiedPurchase) : true,
        isApproved: isApproved !== undefined ? Boolean(isApproved) : true,
      },
    });

    // Recalculate average rating & review count for the product
    try {
      const approvedReviews = await prisma.review.findMany({
        where: { productId, isApproved: true },
        select: { rating: true },
      });

      const count = approvedReviews.length;
      const avg = count > 0
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

    revalidatePath('/admin/reviews');
    revalidatePath('/products');

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error creating review';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
