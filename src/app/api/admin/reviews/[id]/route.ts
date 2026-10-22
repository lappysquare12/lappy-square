import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);
    const { id } = await params;
    const body = await req.json();
    const { userName, userEmail, rating, title, comment, isVerifiedPurchase, isApproved } = body;

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        ...(userName !== undefined && { userName: userName.trim() }),
        ...(userEmail !== undefined && { userEmail: userEmail ? userEmail.trim() : null }),
        ...(rating !== undefined && { rating: Math.min(5, Math.max(1, Number(rating))) }),
        ...(title !== undefined && { title: title ? title.trim() : null }),
        ...(comment !== undefined && { comment: comment.trim() }),
        ...(isVerifiedPurchase !== undefined && { isVerifiedPurchase: Boolean(isVerifiedPurchase) }),
        ...(isApproved !== undefined && { isApproved: Boolean(isApproved) }),
      },
    });

    // Recalculate average rating & review count for the product
    const approvedReviews = await prisma.review.findMany({
      where: { productId: updated.productId, isApproved: true },
      select: { rating: true },
    });

    const newAvg =
      approvedReviews.length > 0
        ? Number(
            (
              approvedReviews.reduce((sum, r) => sum + r.rating, 0) /
              approvedReviews.length
            ).toFixed(1)
          )
        : 5.0;

    await prisma.product.update({
      where: { id: updated.productId },
      data: {
        rating: newAvg,
        reviewCount: approvedReviews.length,
      },
    });

    revalidatePath(`/product/${id}`);
    revalidatePath('/admin/reviews');

    return NextResponse.json({ success: true, review: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error updating review';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const { id } = await params;

    const existing = await prisma.review.findUnique({ where: { id } });
    if (existing) {
      await prisma.review.delete({ where: { id } });

      // Recalculate product rating
      const approvedReviews = await prisma.review.findMany({
        where: { productId: existing.productId, isApproved: true },
        select: { rating: true },
      });

      const newAvg =
        approvedReviews.length > 0
          ? Number(
              (
                approvedReviews.reduce((sum, r) => sum + r.rating, 0) /
                approvedReviews.length
              ).toFixed(1)
            )
          : 5.0;

      await prisma.product.update({
        where: { id: existing.productId },
        data: {
          rating: newAvg,
          reviewCount: approvedReviews.length,
        },
      });
    }

    revalidatePath('/admin/reviews');

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error deleting review';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
