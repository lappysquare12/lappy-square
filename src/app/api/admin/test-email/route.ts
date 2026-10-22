import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { resend, ADMIN_NOTIFICATION_EMAIL, RESEND_FROM_EMAIL } from '@/lib/resend';

export async function POST() {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);

    if (!resend) {
      return NextResponse.json(
        {
          success: false,
          error:
            'RESEND_API_KEY is not set in .env yet. Please provide your Resend API key (e.g. re_xxxxxx) in .env.',
        },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: [ADMIN_NOTIFICATION_EMAIL],
      subject: '✅ Lappy Square — Test Email Delivery Successful',
      html: `
        <div style="font-family: sans-serif; padding: 24px; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #0284c7; margin-top: 0;">Lappy Square Resend Integration Connected!</h2>
          <p>Congratulations! Your email notification pipeline is successfully configured.</p>
          <p>All future order notifications and customer inquiries will automatically be sent to <strong>${ADMIN_NOTIFICATION_EMAIL}</strong>.</p>
          <div style="background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 12px; color: #64748b; margin-top: 16px;">
            Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
          </div>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Test email successfully sent to ${ADMIN_NOTIFICATION_EMAIL}!`,
      id: data?.id,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to dispatch test email' },
      { status: 500 }
    );
  }
}
