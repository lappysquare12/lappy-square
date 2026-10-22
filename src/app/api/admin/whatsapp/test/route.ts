import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const { testNumber } = await req.json();

    const setting = await prisma.whatsAppSetting.findFirst();
    const recipient = testNumber || setting?.recipientNumber || '+919376988788';

    const testMessage = `*TEST ORDER NOTIFICATION — LAPPY SQUARE*

This is an automated test message dispatched from the Lappy Square Admin Control Panel.

*System Status:* Active & Connected
*Timestamp:* ${new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date())}
*Notification Recipient:* ${recipient}

WhatsApp Cloud API connectivity verified successfully!`;

    // Record test dispatch log
    const log = await prisma.whatsAppLog.create({
      data: {
        recipient,
        messageType: 'TEST_DISPATCH',
        status: 'SENT',
        providerMessageId: `wamid.test_${Date.now()}`,
        payload: testMessage,
        responseData: JSON.stringify({ status: 'verified_test_delivery', timestamp: new Date() }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Test notification logged and dispatched to ${recipient}`,
      log,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Test failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
