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

    const { status, paymentStatus, trackingNumber, courierPartner, adminNotes } = body;

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status,
        paymentStatus,
        trackingNumber,
        courierPartner,
        adminNotes,
        shippedAt: status === 'SHIPPED' ? new Date() : undefined,
        deliveredAt: status === 'DELIVERED' ? new Date() : undefined,
      },
    });

    return NextResponse.json({ success: true, order: updated });
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

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // 1. Delete from Firestore cloud orders collection
    try {
      const { deleteOrderFromFirestore } = await import('@/lib/firebase');
      await deleteOrderFromFirestore(id);
    } catch (fsErr) {
      console.warn('Firestore order delete notice:', fsErr);
    }

    // 2. Safe transaction delete in Prisma (deleteMany avoids P2025 errors)
    try {
      await prisma.$transaction([
        prisma.orderItem.deleteMany({ where: { orderId: id } }),
        prisma.paymentTransaction.deleteMany({ where: { orderId: id } }),
        prisma.whatsAppLog.deleteMany({ where: { orderId: id } }),
        prisma.order.deleteMany({ where: { id } }),
      ]);
    } catch (prismaErr) {
      console.warn('Prisma order deletion notice:', prismaErr);
    }

    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/admin/orders');
    } catch {}

    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Delete failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
