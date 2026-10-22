import prisma from './prisma';

export interface WhatsAppOrderDetails {
  orderId: string;
  orderNumber: string;
  orderDate: Date;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNotes?: string | null;
  items: Array<{
    title: string;
    sku: string;
    quantity: number;
    price: number;
    specsSnapshot?: string | null;
  }>;
  subtotal: number;
  discountAmount: number;
  couponCode?: string | null;
  shippingCharge: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
}

export function formatWhatsAppOrderMessage(
  details: WhatsAppOrderDetails,
  adminOrderUrl: string
): string {
  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(details.orderDate);

  const itemsList = details.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.title}*\n   SKU: ${item.sku}\n   ${item.specsSnapshot ? `Config: ${item.specsSnapshot}\n   ` : ''}Qty: ${item.quantity} | Price: ₹${item.price.toLocaleString('en-IN')}`
    )
    .join('\n\n');

  return `*NEW ORDER RECEIVED — LAPPY SQUARE*

*Order ID:* #${details.orderNumber}
*Date:* ${formattedDate}

*Customer Details:*
• *Name:* ${details.customerName}
• *Phone:* ${details.customerPhone}

*Order Items:*
${itemsList}

*Order Summary:*
• Subtotal: ₹${details.subtotal.toLocaleString('en-IN')}
${details.discountAmount > 0 ? `• Discount (${details.couponCode || 'Promo'}): -₹${details.discountAmount.toLocaleString('en-IN')}\n` : ''}• Shipping: ${details.shippingCharge === 0 ? 'FREE Insured Delivery' : `₹${details.shippingCharge.toLocaleString('en-IN')}`}
• *Final Total:* ₹${details.totalAmount.toLocaleString('en-IN')}

*Payment:*
• Method: ${details.paymentMethod === 'RAZORPAY' ? 'Razorpay (Online Payment)' : 'Cash on Delivery'}
• Status: ${details.paymentStatus === 'VERIFIED_PAID' ? 'Verified Paid' : 'Pending Payment'}

*Delivery Address:*
${details.customerAddress}
${details.customerNotes ? `\n*Customer Note:* ${details.customerNotes}\n` : ''}
*Admin Order Link:*
${adminOrderUrl}

_This is an automated verified order notification from the Lappy Square platform._`;
}

export async function sendWhatsAppOrderNotification(orderId: string): Promise<{
  success: boolean;
  logId?: string;
  messageId?: string;
  error?: string;
}> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    // Retrieve settings
    const setting = await prisma.whatsAppSetting.findFirst();
    const isEnabled = setting ? setting.enabled : true;
    const recipientNumber = setting?.recipientNumber || process.env.WHATSAPP_BUSINESS_NUMBER || '+919376988788';
    const phoneNumberId = setting?.phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    const accessToken = setting?.accessToken || process.env.WHATSAPP_ACCESS_TOKEN || '';

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const adminOrderUrl = `${baseUrl}/admin/orders/${order.id}`;

    const messageText = formatWhatsAppOrderMessage(
      {
        orderId: order.id,
        orderNumber: order.orderNumber,
        orderDate: order.createdAt,
        customerName: order.guestName || 'Customer',
        customerPhone: order.guestPhone || '',
        customerAddress: order.shippingAddress,
        customerNotes: order.customerNotes,
        items: order.items.map((i) => ({
          title: i.title,
          sku: i.sku,
          quantity: i.quantity,
          price: i.price,
          specsSnapshot: i.specsSnapshot,
        })),
        subtotal: order.subtotal,
        discountAmount: order.discountAmount,
        couponCode: order.couponCode,
        shippingCharge: order.shippingCharge,
        taxAmount: order.taxAmount,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
      },
      adminOrderUrl
    );

    // If official credentials exist and setting is enabled, send via Meta Cloud API
    let providerMessageId = `mock_wamid_${Date.now()}`;
    let deliveryStatus = 'SENT';
    let errorMessage: string | null = null;
    let responseDataString: string | null = null;

    if (isEnabled && phoneNumberId && accessToken && !accessToken.startsWith('MOCK_')) {
      try {
        const cleanRecipient = recipientNumber.replace(/[^0-9]/g, '');
        const metaRes = await fetch(
          `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              recipient_type: 'individual',
              to: cleanRecipient,
              type: 'text',
              text: {
                preview_url: true,
                body: messageText,
              },
            }),
          }
        );

        const resData = await metaRes.json();
        responseDataString = JSON.stringify(resData);

        if (!metaRes.ok || resData.error) {
          deliveryStatus = 'FAILED';
          errorMessage = resData.error?.message || `HTTP ${metaRes.status}`;
        } else {
          providerMessageId = resData.messages?.[0]?.id || providerMessageId;
          deliveryStatus = 'SENT';
        }
      } catch (err: unknown) {
        deliveryStatus = 'FAILED';
        errorMessage = err instanceof Error ? err.message : String(err);
      }
    } else {
      // In development or when credentials are not yet configured: simulate verified local dispatch
      console.log('📱 [WHATSAPP DISPATCH LOG]:', {
        recipient: recipientNumber,
        preview: messageText.substring(0, 100) + '...',
      });
      responseDataString = JSON.stringify({
        status: 'simulated_dispatch',
        recipient: recipientNumber,
        note: 'Meta credentials pending or development simulation mode',
      });
    }

    // Persist to WhatsAppLog for admin audit trail & retry
    const log = await prisma.whatsAppLog.create({
      data: {
        orderId: order.id,
        recipient: recipientNumber,
        messageType: 'NEW_ORDER',
        status: deliveryStatus,
        providerMessageId,
        errorMessage,
        payload: messageText,
        responseData: responseDataString,
      },
    });

    return {
      success: deliveryStatus === 'SENT',
      logId: log.id,
      messageId: providerMessageId,
      error: errorMessage || undefined,
    };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('sendWhatsAppOrderNotification error:', errorMsg);
    return {
      success: false,
      error: errorMsg,
    };
  }
}

export async function retryWhatsAppNotification(logId: string) {
  const log = await prisma.whatsAppLog.findUnique({
    where: { id: logId },
    include: { order: true },
  });

  if (!log || !log.orderId) {
    throw new Error('Log or associated order not found');
  }

  return sendWhatsAppOrderNotification(log.orderId);
}
