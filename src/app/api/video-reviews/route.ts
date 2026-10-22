import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const videoReviews = await prisma.videoReview.findMany({
      where: { featured: true },
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ success: true, videoReviews });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
