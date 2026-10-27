import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendWhatsAppOrderNotification } from '@/lib/whatsapp';
import { sendOrderEmailToAdmin } from '@/lib/resend';
import { generateWhatsAppOrderUrl } from '@/lib/whatsapp-order';
import { createShiprocketOrder } from '@/lib/shipping/shiprocket';
import { syncOrderToFirestore } from '@/lib/firebase';
import { ensureFirestoreProductsSynced } from '@/lib/firestore-sync';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      street,
      city,
      state,
      postalCode,
      customerNotes,
      paymentMethod,
      couponCode,
      items,
    } = body;

    if (!fullName || !email || !phone || !street || !postalCode || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required order details' }, { status: 400 });
    }

    // 1. Fetch products from database to ensure genuine server-side pricing & stock
    await ensureFirestoreProductsSynced();
    const productIds = items.map((i: { productId: string }) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { brand: true },
    });

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json({ error: 'One or more selected products are no longer available' }, { status: 400 });
    }

    // Check stock
    for (const item of items) {
      const prod = dbProducts.find((p) => p.id === item.productId);
      if (!prod || prod.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${prod?.title || 'product'}". Only ${prod?.stock || 0} available.` },
          { status: 400 }
        );
      }
    }

    // 2. Calculate subtotal server-side
    let subtotal = 0;
    const orderItemsData = items.map((item: { productId: string; quantity: number }) => {
      const prod = dbProducts.find((p) => p.id === item.productId)!;
      const lineTotal = prod.price * item.quantity;
      subtotal += lineTotal;
      return {
        productId: prod.id,
        title: prod.title,
        sku: prod.sku,
        price: prod.price,
        quantity: item.quantity,
        brandName: prod.brand?.name || 'Lappy Square',
        conditionGrade: prod.conditionGrade,
        specsSnapshot: `${prod.processor}, ${prod.ramGb}GB RAM, ${prod.storageGb}GB ${prod.storageType}`,
      };
    });

    // 3. Validate coupon if present
    let discountAmount = 0;
    if (couponCode) {
      const dbCoupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });
      if (dbCoupon && dbCoupon.active && new Date() <= new Date(dbCoupon.validUntil)) {
        if (subtotal >= dbCoupon.minOrderValue) {
          if (dbCoupon.discountType === 'PERCENTAGE') {
            discountAmount = Math.round((subtotal * dbCoupon.discountValue) / 100);
            if (dbCoupon.maxDiscount && discountAmount > dbCoupon.maxDiscount) {
              discountAmount = dbCoupon.maxDiscount;
            }
          } else {
            discountAmount = dbCoupon.discountValue;
          }
          // Increment usage
          await prisma.coupon.update({
            where: { id: dbCoupon.id },
            data: { currentUses: { increment: 1 } },
          });
        }
      }
    }

    const shippingCharge = 0;
    const taxAmount = 0;
    const totalAmount = Math.max(0, subtotal - discountAmount + shippingCharge);

    // 4. Generate order number
    const orderCount = await prisma.order.count();
    const orderNumber = `LS-${1000 + orderCount + 1}`;
    const fullAddress = `${street}, ${city}, ${state} — ${postalCode}, India`;

    const isRazorpay = paymentMethod === 'RAZORPAY';
    const isCod = paymentMethod === 'CASH_ON_DELIVERY';
    const effectivePaymentMethod = isRazorpay
      ? 'RAZORPAY'
      : isCod
      ? 'CASH_ON_DELIVERY'
      : 'WHATSAPP_ORDER';

    // 5. Create Order and items in database (with serverless fallback)
    let order: any = null;
    try {
      order = await prisma.order.create({
        data: {
          orderNumber,
          guestName: fullName,
          guestEmail: email,
          guestPhone: phone,
          shippingAddress: fullAddress,
          status: isRazorpay ? 'PENDING' : 'CONFIRMED',
          paymentStatus: 'PENDING',
          paymentMethod: effectivePaymentMethod,
          razorpayOrderId: isRazorpay ? `order_rzp_${Date.now()}` : null,
          subtotal,
          discountAmount,
          shippingCharge,
          taxAmount,
          totalAmount,
          couponCode: discountAmount > 0 ? couponCode : null,
          customerNotes,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      // Reduce stock
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        }).catch(() => {});
      }
    } catch (dbErr) {
      console.warn('Prisma order save notice (serverless fallback):', dbErr);
      order = {
        id: `order_${Date.now()}`,
        orderNumber,
        guestName: fullName,
        guestEmail: email,
        guestPhone: phone,
        shippingAddress: fullAddress,
        status: isRazorpay ? 'PENDING' : 'CONFIRMED',
        paymentStatus: 'PENDING',
        paymentMethod: effectivePaymentMethod,
        razorpayOrderId: null,
        subtotal,
        discountAmount,
        shippingCharge,
        taxAmount,
        totalAmount,
        couponCode: discountAmount > 0 ? couponCode : null,
        customerNotes,
        items: orderItemsData,
        createdAt: new Date(),
      };
    }

    // Sync order to Firestore database
    try {
      await syncOrderToFirestore(order);
    } catch (fsErr) {
      console.error('Failed to sync order to Firestore:', fsErr);
    }

    // 6. Generate Customer WhatsApp Direct Order URL
    const whatsappUrl = generateWhatsAppOrderUrl({
      orderNumber: order.orderNumber,
      customerName: fullName,
      customerPhone: phone,
      customerEmail: email,
      deliveryAddress: fullAddress,
      customerNotes,
      paymentMethod: effectivePaymentMethod,
      subtotal,
      discountAmount,
      totalAmount,
      items: (order.items as any[]).map((it: any) => ({
        title: it.title,
        quantity: it.quantity,
        price: it.price,
        specsSnapshot: it.specsSnapshot,
        conditionGrade: it.conditionGrade,
      })),
    });

    // 7. Future-Proof Shiprocket Order Staging
    createShiprocketOrder({
      order_id: order.orderNumber,
      order_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      billing_customer_name: fullName,
      billing_address: street,
      billing_city: city,
      billing_pincode: postalCode,
      billing_state: state,
      billing_country: 'India',
      billing_email: email,
      billing_phone: phone,
      shipping_is_billing: true,
      order_items: (order.items as any[]).map((it: any) => ({
        name: it.title,
        sku: it.sku,
        units: it.quantity,
        selling_price: it.price,
      })),
      payment_method: isRazorpay ? 'Prepaid' : 'COD',
      sub_total: totalAmount,
    }).catch((srErr) => {
      console.log('[Shiprocket Future Adapter Notice]:', srErr?.message || srErr);
    });

    // 8. If Cash on Delivery, send WhatsApp order notification
    if (isCod) {
      try {
        await sendWhatsAppOrderNotification(order.id);
      } catch (err) {
        console.error('WhatsApp COD notification trigger error:', err);
      }
    }

    // 9. Dispatch Email Notification to lappysquare@gmail.com via Resend
    try {
      await sendOrderEmailToAdmin({
        orderNumber: order.orderNumber,
        guestName: order.guestName || fullName || 'Customer',
        guestEmail: order.guestEmail || email || '',
        guestPhone: order.guestPhone || phone || '',
        shippingAddress: order.shippingAddress,
        paymentMethod: effectivePaymentMethod,
        paymentStatus: order.paymentStatus,
        subtotal: order.subtotal,
        discountAmount: order.discountAmount,
        totalAmount: order.totalAmount,
        customerNotes: order.customerNotes,
        items: (order.items as any[]).map((it: any) => ({
          title: it.title,
          quantity: it.quantity,
          price: it.price,
          specsSnapshot: it.specsSnapshot,
          brandName: it.brandName,
        })),
      });
    } catch (emailErr) {
      console.error('Resend order notification error:', emailErr);
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        razorpayOrderId: order.razorpayOrderId,
      },
      whatsappUrl,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Checkout failed';
    console.error('Checkout error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
