import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { retryWhatsAppNotification } from '@/lib/whatsapp';

export async function POST(req: Request) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const { logId } = await req.json();

    if (!logId) {
      return NextResponse.json({ error: 'logId is required' }, { status: 400 });
    }

    const result = await retryWhatsAppNotification(logId);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Retry failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
