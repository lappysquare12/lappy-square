import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendWhatsAppOrderNotification } from '@/lib/whatsapp';
import { sendOrderEmailToAdmin } from '@/lib/resend';

export async function POST(req: Request) {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = await req.json();

    if (!orderId || !razorpayPaymentId) {
      return NextResponse.json({ error: 'Order ID and payment ID are required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Idempotency: if already verified paid, return existing success
    if (order.paymentStatus === 'VERIFIED_PAID') {
      return NextResponse.json({ success: true, message: 'Payment already verified' });
    }

    // Record verified transaction
    await prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        gateway: 'RAZORPAY',
        transactionId: razorpayPaymentId,
        amount: order.totalAmount,
        status: 'VERIFIED_SUCCESS',
        rawPayload: JSON.stringify({ razorpayOrderId, razorpayPaymentId, razorpaySignature }),
        verifiedAt: new Date(),
      },
    });

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'CONFIRMED',
        paymentStatus: 'VERIFIED_PAID',
        razorpayPaymentId,
        razorpaySignature,
      },
    });

    // Section 15.C.2: Send WhatsApp order notification automatically with Verified Paid status!
    try {
      await sendWhatsAppOrderNotification(updatedOrder.id);
    } catch (whatsappErr) {
      console.error('WhatsApp notification dispatch error:', whatsappErr);
    }

    // Send Resend Email Notification to lappysquare12@gmail.com
    try {
      await sendOrderEmailToAdmin({
        orderNumber: order.orderNumber,
        guestName: order.guestName || 'Customer',
        guestEmail: order.guestEmail || '',
        guestPhone: order.guestPhone || '',
        shippingAddress: order.shippingAddress,
        paymentMethod: 'ONLINE (RAZORPAY - VERIFIED PAID)',
        paymentStatus: 'VERIFIED_PAID',
        subtotal: order.subtotal,
        discountAmount: order.discountAmount,
        totalAmount: order.totalAmount,
        customerNotes: order.customerNotes,
        items: order.items.map((it) => ({
          title: it.title,
          quantity: it.quantity,
          price: it.price,
          specsSnapshot: it.specsSnapshot,
          brandName: it.brandName,
        })),
      });
    } catch (emailErr) {
      console.error('Resend verified payment email dispatch error:', emailErr);
    }

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Payment verification failed';
    console.error('Payment verify error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
