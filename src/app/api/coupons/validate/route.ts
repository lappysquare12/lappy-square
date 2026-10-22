import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.active) {
      return NextResponse.json({ error: 'Invalid or inactive coupon code' }, { status: 404 });
    }

    if (new Date() > new Date(coupon.validUntil)) {
      return NextResponse.json({ error: 'This coupon code has expired' }, { status: 400 });
    }

    if (coupon.currentUses >= coupon.maxUses) {
      return NextResponse.json({ error: 'This coupon usage limit has been reached' }, { status: 400 });
    }

    const orderSubtotal = Number(subtotal) || 0;
    if (orderSubtotal < coupon.minOrderValue) {
      return NextResponse.json(
        {
          error: `Minimum order value for coupon ${coupon.code} is ₹${coupon.minOrderValue.toLocaleString('en-IN')}`,
        },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = Math.round((orderSubtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minOrderValue,
      },
      discountAmount,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
