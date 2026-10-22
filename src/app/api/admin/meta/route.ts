import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const [brands, categories] = await Promise.all([
      prisma.brand.findMany({
        where: { active: true },
        select: { id: true, name: true, slug: true },
        orderBy: { name: 'asc' },
      }),
      prisma.category.findMany({
        where: { active: true },
        select: { id: true, name: true, slug: true },
        orderBy: { name: 'asc' },
      }),
    ]);

    return NextResponse.json({ brands, categories });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch meta';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
