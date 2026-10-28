/**
 * Utility for formatting and generating customer WhatsApp order links
 */

export const DEFAULT_WHATSAPP_NUMBER = '919376988788';

export interface OrderWhatsAppPayload {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  customerNotes?: string | null;
  paymentMethod: string;
  totalAmount: number;
  subtotal: number;
  discountAmount?: number;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
    specsSnapshot?: string | null;
    conditionGrade?: string | null;
  }>;
}

/**
 * Format a rich, structured WhatsApp message for orders
 */
export function buildCustomerOrderWhatsAppMessage(data: OrderWhatsAppPayload): string {
  const currentDate = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date());

  const itemsFormatted = data.items
    .map((item, index) => {
      const lineTotal = (item.price * item.quantity).toLocaleString('en-IN');
      return `${index + 1}. *${item.title}*
   • Specs: ${item.specsSnapshot || 'Certified Refurbished Specs'}
   • Grade: ${item.conditionGrade || 'Grade A Certified'}
   • Qty: ${item.quantity} | Total: ₹${lineTotal}`;
    })
    .join('\n\n');

  const paymentLabel =
    data.paymentMethod === 'WHATSAPP_ORDER'
      ? 'WhatsApp Direct Confirmation'
      : data.paymentMethod === 'CASH_ON_DELIVERY'
      ? 'Cash on Delivery (COD)'
      : 'Online Payment Gateway';

  return `*NEW LAPTOP ORDER — LAPPY SQUARE*
━━━━━━━━━━━━━━━━━━━━
*Order ID:* #${data.orderNumber}
*Date:* ${currentDate}

*CUSTOMER DETAILS:*
• *Name:* ${data.customerName}
• *Phone:* ${data.customerPhone}
${data.customerEmail ? `• *Email:* ${data.customerEmail}\n` : ''}*DELIVERY ADDRESS:*
${data.deliveryAddress}
${data.customerNotes ? `\n*Notes:* ${data.customerNotes}\n` : ''}
*ORDERED ITEMS:*
${itemsFormatted}

*PAYMENT & BILLING:*
• Subtotal: ₹${data.subtotal.toLocaleString('en-IN')}
${data.discountAmount && data.discountAmount > 0 ? `• Discount: -₹${data.discountAmount.toLocaleString('en-IN')}\n` : ''}• Store Pickup & Demo: *FREE*
• *Total Payable:* *₹${data.totalAmount.toLocaleString('en-IN')}*
• Payment Method: ${paymentLabel}

*Lappy Square Assurance:*
• 45-Point Lab Diagnostics QA Report
• 100% Genuine OEM Hardware & Battery Tested
• Paris Tower, Mansarovar, Jaipur
━━━━━━━━━━━━━━━━━━━━
Hello Lappy Square Team, I have booked this order on your website. Please verify availability and share store visit / reservation details.`;
}

/**
 * Generate a direct WhatsApp click-to-chat URL
 */
export function generateWhatsAppOrderUrl(
  data: OrderWhatsAppPayload,
  customPhoneNumber?: string
): string {
  const rawNumber = (customPhoneNumber || DEFAULT_WHATSAPP_NUMBER).replace(/[^0-9]/g, '');
  const message = buildCustomerOrderWhatsAppMessage(data);
  return `https://api.whatsapp.com/send?phone=${rawNumber}&text=${encodeURIComponent(message)}`;
}

/**
 * Generate WhatsApp inquiry link for a single product
 */
export function generateSingleProductWhatsAppUrl(
  product: {
    id?: string;
    title: string;
    price?: number;
    sku?: string;
    slug?: string;
    processor?: string;
    ramGb?: number;
    storageGb?: number;
    conditionGrade?: string;
    imageUrl?: string;
  },
  customPhoneNumber?: string
): string {
  const rawNumber = (customPhoneNumber || DEFAULT_WHATSAPP_NUMBER).replace(/[^0-9]/g, '');
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lappysquare.com';
  const productUrl = product.slug ? `${baseUrl}/product/${product.slug}` : '';

  const msg = `Hii Lappy Square Team, I want this laptop. Please share today's best deal price:

• *Product:* ${product.title}
• *Product ID / SKU:* ${product.sku || product.id || 'N/A'}
• *Specs:* ${product.processor || ''}${product.ramGb ? ` | ${product.ramGb}GB RAM` : ''}${product.storageGb ? ` | ${product.storageGb}GB SSD` : ''}
• *Condition:* ${product.conditionGrade || 'Grade A Certified'}
${productUrl ? `• *Product Link:* ${productUrl}\n` : ''}${product.imageUrl ? `• *Photo:* ${product.imageUrl}\n` : ''}
Please share today's best discounted price, real photos, and store visit / pickup details. Thank you!`;

  return `https://api.whatsapp.com/send?phone=${rawNumber}&text=${encodeURIComponent(msg)}`;
}
