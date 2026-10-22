import { Resend } from 'resend';

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY || '';
  return apiKey ? new Resend(apiKey) : null;
}

export const resend = getResendClient();

export const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'lappysquare12@gmail.com';
export const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Lappy Square <onboarding@resend.dev>';

/**
 * Send order notification email to lappysquare12@gmail.com
 */
export async function sendOrderEmailToAdmin(order: {
  orderNumber: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  discountAmount?: number;
  totalAmount: number;
  customerNotes?: string | null;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
    specsSnapshot?: string | null;
    brandName?: string | null;
  }>;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const client = getResendClient();
    if (!client) {
      console.warn(
        `[Resend Notice] RESEND_API_KEY is not set. Order #${order.orderNumber} email notification prepared for ${ADMIN_NOTIFICATION_EMAIL}.`
      );
      return { success: false, error: 'RESEND_API_KEY is not configured yet' };
    }


    const itemsHtml = order.items
      .map(
        (item) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 8px; font-weight: 600; color: #0f172a;">
            ${item.title}
            ${item.specsSnapshot ? `<div style="font-size: 11px; color: #64748b; font-weight: 400; margin-top: 2px;">${item.specsSnapshot}</div>` : ''}
          </td>
          <td style="padding: 12px 8px; text-align: center; color: #334155;">${item.quantity}</td>
          <td style="padding: 12px 8px; text-align: right; font-weight: 700; color: #0f172a;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
        </tr>`
      )
      .join('');

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>New Order #${order.orderNumber}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 28px 24px; color: #ffffff;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 20px; font-weight: 900; letter-spacing: -0.5px; color: #38bdf8;">LAPPY SQUARE</span>
              <span style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px;">NEW ORDER</span>
            </div>
            <h1 style="font-size: 22px; font-weight: 800; margin: 16px 0 4px; color: #ffffff;">
              New Order Received: #${order.orderNumber}
            </h1>
            <p style="margin: 0; font-size: 13px; color: #94a3b8;">
              Total Amount: <strong style="color: #38bdf8; font-size: 16px;">₹${order.totalAmount.toLocaleString('en-IN')}</strong> (${order.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery' : 'Online Payment'})
            </p>
          </div>

          <!-- Customer Details -->
          <div style="padding: 24px; border-bottom: 1px solid #f1f5f9;">
            <h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin: 0 0 12px;">Customer & Delivery Details</h2>
            <div style="background: #f8fafc; border-radius: 12px; padding: 14px 16px; font-size: 13px; line-height: 1.6;">
              <div><strong>Name:</strong> ${order.guestName}</div>
              <div><strong>Phone:</strong> <a href="tel:${order.guestPhone}" style="color: #0284c7; text-decoration: none;">${order.guestPhone}</a></div>
              <div><strong>Email:</strong> <a href="mailto:${order.guestEmail}" style="color: #0284c7; text-decoration: none;">${order.guestEmail}</a></div>
              <div><strong>Address:</strong> ${order.shippingAddress}</div>
              ${order.customerNotes ? `<div><strong>Customer Notes:</strong> ${order.customerNotes}</div>` : ''}
              <div style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #cbd5e1;">
                <strong>Payment Method:</strong> ${order.paymentMethod} • <strong>Status:</strong> ${order.paymentStatus}
              </div>
            </div>
          </div>

          <!-- Order Items Table -->
          <div style="padding: 24px;">
            <h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin: 0 0 12px;">Items Ordered</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background: #f1f5f9; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569;">
                  <th style="padding: 8px;">Laptop</th>
                  <th style="padding: 8px; text-align: center;">Qty</th>
                  <th style="padding: 8px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Summary -->
            <div style="margin-top: 16px; padding: 14px; background: #f8fafc; border-radius: 10px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>Subtotal:</span>
                <span>₹${order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              ${order.discountAmount ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #16a34a;">
                <span>Discount:</span>
                <span>-₹${order.discountAmount.toLocaleString('en-IN')}</span>
              </div>` : ''}
              <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 15px; color: #0f172a; padding-top: 6px; border-top: 1px solid #e2e8f0;">
                <span>Total Received:</span>
                <span style="color: #0284c7;">₹${order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 11px; color: #64748b;">
            Sent automatically by Lappy Square Store to ${ADMIN_NOTIFICATION_EMAIL}
          </div>
        </div>
      </body>
    </html>
    `;

    const { data, error } = await client.emails.send({
      from: RESEND_FROM_EMAIL,

      to: [ADMIN_NOTIFICATION_EMAIL],
      subject: `🛒 New Order #${order.orderNumber} - ₹${order.totalAmount.toLocaleString('en-IN')} by ${order.guestName}`,
      html: htmlContent,
    });

    if (error) {
      console.error('[Resend Error] Failed to send order email:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Resend Success] Order #${order.orderNumber} email sent to ${ADMIN_NOTIFICATION_EMAIL}, ID:`, data?.id);
    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error('[Resend Exception] Error sending order email:', err);
    return { success: false, error: err?.message || 'Unknown email error' };
  }
}

/**
 * Send Customer Enquiry / Sell Laptop Notification to lappysquare12@gmail.com
 */
export async function sendEnquiryEmailToAdmin(enquiry: {
  name: string;
  email: string;
  phone: string;
  city?: string | null;
  type?: string | null;
  deviceDetails?: string | null;
  message?: string | null;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const client = getResendClient();
    if (!client) {
      console.warn(
        `[Resend Notice] RESEND_API_KEY is not set. Enquiry from ${enquiry.name} logged for ${ADMIN_NOTIFICATION_EMAIL}.`
      );
      return { success: false, error: 'RESEND_API_KEY is not configured yet' };
    }


    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>New Inquiry Received</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 24px; color: #1e293b;">
        <div style="max-width: 550px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="background: #0f172a; padding: 20px 24px; color: #ffffff;">
            <span style="color: #38bdf8; font-size: 12px; font-weight: 700; text-transform: uppercase;">Lappy Square Inquiries</span>
            <h1 style="font-size: 20px; font-weight: 800; margin: 8px 0 0;">New Request from ${enquiry.name}</h1>
          </div>
          <div style="padding: 24px; font-size: 13px; line-height: 1.6;">
            <p><strong>Name:</strong> ${enquiry.name}</p>
            <p><strong>Phone:</strong> <a href="tel:${enquiry.phone}" style="color: #0284c7;">${enquiry.phone}</a></p>
            <p><strong>Email:</strong> <a href="mailto:${enquiry.email}" style="color: #0284c7;">${enquiry.email}</a></p>
            ${enquiry.city ? `<p><strong>City:</strong> ${enquiry.city}</p>` : ''}
            <p><strong>Inquiry Type:</strong> <span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 6px; font-weight: 600;">${enquiry.type || 'GENERAL'}</span></p>
            ${enquiry.deviceDetails ? `<p><strong>Device Details:</strong><br/><pre style="background: #f1f5f9; padding: 10px; border-radius: 8px; font-family: inherit; font-size: 12px;">${enquiry.deviceDetails}</pre></p>` : ''}
            ${enquiry.message ? `<p><strong>Message / Notes:</strong><br/>${enquiry.message}</p>` : ''}
          </div>
          <div style="background: #f1f5f9; padding: 12px 24px; text-align: center; font-size: 11px; color: #64748b;">
            Notification sent to ${ADMIN_NOTIFICATION_EMAIL}
          </div>
        </div>
      </body>
    </html>
    `;

    const { data, error } = await client.emails.send({
      from: RESEND_FROM_EMAIL,

      to: [ADMIN_NOTIFICATION_EMAIL],
      subject: `📩 New Customer Inquiry (${enquiry.type || 'General'}): ${enquiry.name} - ${enquiry.phone}`,
      html: htmlContent,
    });

    if (error) {
      console.error('[Resend Error] Failed to send enquiry email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error('[Resend Exception] Error sending enquiry email:', err);
    return { success: false, error: err?.message || 'Unknown email error' };
  }
}
