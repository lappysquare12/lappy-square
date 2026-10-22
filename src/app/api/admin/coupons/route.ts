import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ coupons });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const body = await req.json();
    const { code, description, discountType, discountValue, minOrderValue, maxDiscount, validUntil } = body;

    if (!code || !discountValue) {
      return NextResponse.json({ error: 'Code and discount value are required' }, { status: 400 });
    }

    const created = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        description,
        discountType: discountType || 'PERCENTAGE',
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue || 0),
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 180 * 24 * 3600 * 1000),
      },
    });

    return NextResponse.json({ success: true, coupon: created });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Create failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
