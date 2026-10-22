/**
 * Multi-Gateway Payment Orchestration Interface
 * Enables seamless switching between WhatsApp Orders, Cash On Delivery, Razorpay, and Shiprocket Checkout.
 */

export type SupportedPaymentMethod =
  | 'WHATSAPP_ORDER'
  | 'CASH_ON_DELIVERY'
  | 'RAZORPAY'
  | 'SHIPROCKET_CHECKOUT';

export interface PaymentInitiationResult {
  gateway: SupportedPaymentMethod;
  isRedirect: boolean;
  redirectUrl?: string;
  gatewayOrderId?: string;
  metadata?: Record<string, any>;
}

/**
 * Handle checkout payment routing based on chosen method
 */
export async function processOrderPaymentMethod(
  order: {
    id: string;
    orderNumber: string;
    totalAmount: number;
    paymentMethod: string;
  },
  whatsappUrl?: string
): Promise<PaymentInitiationResult> {
  const method = (order.paymentMethod || 'WHATSAPP_ORDER') as SupportedPaymentMethod;

  switch (method) {
    case 'WHATSAPP_ORDER':
      return {
        gateway: 'WHATSAPP_ORDER',
        isRedirect: true,
        redirectUrl: whatsappUrl,
        metadata: {
          note: 'Direct WhatsApp order confirmation active',
        },
      };

    case 'CASH_ON_DELIVERY':
      return {
        gateway: 'CASH_ON_DELIVERY',
        isRedirect: false,
        metadata: {
          collectionMode: 'DOORSTEP_COD',
        },
      };

    case 'RAZORPAY':
      return {
        gateway: 'RAZORPAY',
        isRedirect: false,
        gatewayOrderId: `rzp_order_${order.id}`,
        metadata: {
          keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock',
          currency: 'INR',
          amount: order.totalAmount * 100,
        },
      };

    case 'SHIPROCKET_CHECKOUT':
      return {
        gateway: 'SHIPROCKET_CHECKOUT',
        isRedirect: true,
        redirectUrl: `https://checkout.shiprocket.in/fastrr/order/${order.orderNumber}`,
        metadata: {
          provider: 'Shiprocket Fastrr 1-Click Checkout',
        },
      };

    default:
      return {
        gateway: 'WHATSAPP_ORDER',
        isRedirect: false,
      };
  }
}
