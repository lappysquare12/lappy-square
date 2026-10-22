import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);

    const videoReviews = await prisma.videoReview.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ success: true, videoReviews });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);

    const body = await req.json();
    const { title, customerName, videoUrl, thumbnailUrl, laptopModel, rating, featured, displayOrder } = body;

    if (!title?.trim() || !customerName?.trim() || !videoUrl?.trim()) {
      return NextResponse.json(
        { error: 'Title, customer name, and video URL are required.' },
        { status: 400 }
      );
    }

    const review = await prisma.videoReview.create({
      data: {
        title: title.trim(),
        customerName: customerName.trim(),
        videoUrl: videoUrl.trim(),
        thumbnailUrl: thumbnailUrl?.trim() || null,
        laptopModel: laptopModel?.trim() || null,
        rating: Number(rating) || 5,
        featured: featured !== undefined ? Boolean(featured) : true,
        displayOrder: Number(displayOrder) || 0,
      },
    });

    revalidatePath('/video-reviews');
    revalidatePath('/');

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error creating video review';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);

    const body = await req.json();
    const { id, title, customerName, videoUrl, thumbnailUrl, laptopModel, rating, featured, displayOrder } = body;

    if (!id) {
      return NextResponse.json({ error: 'Video review ID is required.' }, { status: 400 });
    }

    const updated = await prisma.videoReview.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(customerName !== undefined && { customerName: customerName.trim() }),
        ...(videoUrl !== undefined && { videoUrl: videoUrl.trim() }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl: thumbnailUrl?.trim() || null }),
        ...(laptopModel !== undefined && { laptopModel: laptopModel?.trim() || null }),
        ...(rating !== undefined && { rating: Math.min(5, Math.max(1, Number(rating))) }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(displayOrder !== undefined && { displayOrder: Number(displayOrder) }),
      },
    });

    revalidatePath('/video-reviews');
    revalidatePath('/');

    return NextResponse.json({ success: true, review: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error updating video review';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Video review ID is required.' }, { status: 400 });
    }

    await prisma.videoReview.delete({
      where: { id },
    });

    revalidatePath('/video-reviews');
    revalidatePath('/');

    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

