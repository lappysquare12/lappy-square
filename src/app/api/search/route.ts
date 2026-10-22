import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { formatMaskedPrice } from '@/lib/price';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim() || '';

    if (!query || query.length < 2) {
      return NextResponse.json({ success: true, results: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        active: true,
        OR: [
          { title: { contains: query } },
          { processor: { contains: query } },
          { sku: { contains: query } },
          { brand: { name: { contains: query } } },
          { description: { contains: query } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        sku: true,
        price: true,
        originalPrice: true,
        processor: true,
        ramGb: true,
        storageGb: true,
        conditionGrade: true,
        brand: {
          select: { name: true, slug: true },
        },
        images: {
          take: 1,
          select: { url: true },
        },
      },
      take: 6,
    });

    const results = products.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      sku: p.sku,
      maskedPrice: formatMaskedPrice(p.price),
      imageUrl: p.images[0]?.url || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80',
      specs: `${p.processor} • ${p.ramGb}GB RAM • ${p.storageGb}GB SSD`,
      brandName: p.brand?.name,
    }));

    return NextResponse.json({ success: true, results });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
