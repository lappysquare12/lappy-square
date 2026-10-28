import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get('brandId');

    const where: any = { active: true };
    if (brandId) where.brandId = brandId;

    const series = await prisma.brandSeries.findMany({
      where,
      include: {
        brand: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: [{ brand: { name: 'asc' } }, { displayOrder: 'asc' }, { name: 'asc' }],
    });

    return NextResponse.json({ success: true, series });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch series';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);
    const body = await req.json();

    const { brandId, name, slug } = body;
    if (!brandId || !name) {
      return NextResponse.json({ error: 'Brand and Series Name are required' }, { status: 400 });
    }

    const seriesSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newSeries = await prisma.brandSeries.create({
      data: {
        brandId,
        name: name.trim(),
        slug: seriesSlug,
        displayOrder: Number(body.displayOrder) || 0,
        active: body.active !== undefined ? Boolean(body.active) : true,
      },
      include: {
        brand: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json({ success: true, series: newSeries });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create series';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Series ID required' }, { status: 400 });
    }

    await prisma.brandSeries.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Series deleted' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete series';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
