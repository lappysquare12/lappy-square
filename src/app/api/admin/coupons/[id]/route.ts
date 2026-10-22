import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

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
