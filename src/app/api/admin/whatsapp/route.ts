import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);

    let setting = await prisma.whatsAppSetting.findFirst();
    if (!setting) {
      setting = await prisma.whatsAppSetting.create({
        data: {
          enabled: true,
          businessNumber: '+919376988788',
          recipientNumber: '+919376988788',
        },
      });
    }

    const logs = await prisma.whatsAppLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        order: {
          select: { orderNumber: true, totalAmount: true, guestName: true },
        },
      },
    });

    // Mask access token for security
    const sanitizedSetting = {
      ...setting,
      accessToken: setting.accessToken ? '••••••••••••••••' + setting.accessToken.slice(-6) : '',
    };

    return NextResponse.json({ setting: sanitizedSetting, logs });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unauthorized';
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const body = await req.json();

    const existing = await prisma.whatsAppSetting.findFirst();

    // If access token was not modified (contains masked dots), keep original token
    let tokenToSave = body.accessToken;
    if (tokenToSave && tokenToSave.includes('••••') && existing) {
      tokenToSave = existing.accessToken;
    }

    const updated = await prisma.whatsAppSetting.upsert({
      where: { id: existing?.id || 'default-whatsapp' },
      update: {
        enabled: Boolean(body.enabled),
        businessNumber: body.businessNumber,
        recipientNumber: body.recipientNumber,
        businessAccountId: body.businessAccountId,
        phoneNumberId: body.phoneNumberId,
        accessToken: tokenToSave,
        notifyOnOrder: Boolean(body.notifyOnOrder),
        notifyOnPayment: Boolean(body.notifyOnPayment),
        notifyOnShipment: Boolean(body.notifyOnShipment),
        notifyOnDelivery: Boolean(body.notifyOnDelivery),
        notifyOnCancel: Boolean(body.notifyOnCancel),
        templateOrderPlaced: body.templateOrderPlaced || 'order_notification_lappy_square',
        templatePaymentVerified: body.templatePaymentVerified || 'payment_verified_lappy_square',
      },
      create: {
        id: 'default-whatsapp',
        enabled: Boolean(body.enabled),
        businessNumber: body.businessNumber,
        recipientNumber: body.recipientNumber,
        businessAccountId: body.businessAccountId,
        phoneNumberId: body.phoneNumberId,
        accessToken: tokenToSave,
        notifyOnOrder: Boolean(body.notifyOnOrder),
        notifyOnPayment: Boolean(body.notifyOnPayment),
        notifyOnShipment: Boolean(body.notifyOnShipment),
        notifyOnDelivery: Boolean(body.notifyOnDelivery),
        notifyOnCancel: Boolean(body.notifyOnCancel),
        templateOrderPlaced: body.templateOrderPlaced || 'order_notification_lappy_square',
        templatePaymentVerified: body.templatePaymentVerified || 'payment_verified_lappy_square',
      },
    });

    return NextResponse.json({ success: true, setting: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Update failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
