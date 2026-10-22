import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const { id } = await params;
    const body = await req.json();
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      maxUses,
      validUntil,
      active,
    } = body;

    if (!code || discountValue === undefined) {
      return NextResponse.json(
        { error: 'Code and discount value are required' },
        { status: 400 }
      );
    }

    const cleanCode = code.toUpperCase().trim();

    // Check if code is already used by another coupon
    const existing = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });
    if (existing && existing.id !== id) {
      return NextResponse.json(
        { error: 'Another coupon with this code already exists' },
        { status: 400 }
      );
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data: {
        code: cleanCode,
        description: description !== undefined ? description : undefined,
        discountType: discountType || 'PERCENTAGE',
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue || 0),
        maxDiscount: maxDiscount !== null && maxDiscount !== '' ? Number(maxDiscount) : null,
        maxUses: maxUses !== undefined && maxUses !== '' ? Number(maxUses) : undefined,
        validUntil: validUntil ? new Date(validUntil) : undefined,
        active: active !== undefined ? Boolean(active) : undefined,
      },
    });

    return NextResponse.json({ success: true, coupon: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Update failed';
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

    await prisma.coupon.deleteMany({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Coupon deleted' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Delete failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

