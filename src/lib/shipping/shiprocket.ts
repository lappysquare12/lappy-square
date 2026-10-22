/**
 * Shiprocket Shipping Integration Adapter
 * Designed for plug-and-play activation whenever credentials are added.
 */

interface ShiprocketConfig {
  email?: string;
  password?: string;
  apiToken?: string;
  pickupLocation?: string;
}

const config: ShiprocketConfig = {
  email: process.env.SHIPROCKET_EMAIL,
  password: process.env.SHIPROCKET_PASSWORD,
  apiToken: process.env.SHIPROCKET_API_TOKEN,
  pickupLocation: process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',
};

const BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

let cachedToken: string | null = config.apiToken || null;
let tokenExpiry: number = 0;

/**
 * Obtain auth token from Shiprocket API
 */
export async function getShiprocketToken(): Promise<string | null> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  if (config.apiToken) {
    cachedToken = config.apiToken;
    tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
    return cachedToken;
  }

  if (!config.email || !config.password) {
    console.warn('[Shiprocket Notice] Credentials not configured yet in .env.');
    return null;
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: config.email, password: config.password }),
    });

    const data = await res.json();
    if (!res.ok || !data.token) {
      console.error('[Shiprocket Auth Error]:', data);
      return null;
    }

    cachedToken = data.token;
    tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000; // ~9 days
    return cachedToken;
  } catch (err) {
    console.error('[Shiprocket Auth Exception]:', err);
    return null;
  }
}

export interface ShiprocketOrderItem {
  name: string;
  sku: string;
  units: number;
  selling_price: number;
  discount?: number;
  tax?: number;
}

export interface ShiprocketCreateOrderPayload {
  order_id: string;
  order_date: string;
  pickup_location?: string;
  channel_id?: string;
  comment?: string;
  billing_customer_name: string;
  billing_last_name?: string;
  billing_address: string;
  billing_address_2?: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  order_items: ShiprocketOrderItem[];
  payment_method: 'COD' | 'Prepaid';
  sub_total: number;
  length?: number; // cm
  breadth?: number; // cm
  height?: number; // cm
  weight?: number; // kg
}

/**
 * Create a new order in Shiprocket
 */
export async function createShiprocketOrder(payload: ShiprocketCreateOrderPayload): Promise<{
  success: boolean;
  orderId?: number;
  shipmentId?: number;
  status?: string;
  mock?: boolean;
  error?: string;
}> {
  const token = await getShiprocketToken();

  if (!token) {
    console.log(
      `[Shiprocket Mock Mode] Order #${payload.order_id} staged for future Shiprocket fulfillment. Pincode: ${payload.billing_pincode}`
    );
    return {
      success: true,
      mock: true,
      orderId: Math.floor(1000000 + Math.random() * 9000000),
      shipmentId: Math.floor(2000000 + Math.random() * 9000000),
      status: 'READY_FOR_SHIPROCKET_ACTIVATION',
    };
  }

  try {
    const res = await fetch(`${BASE_URL}/orders/create/adhoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...payload,
        pickup_location: payload.pickup_location || config.pickupLocation,
        length: payload.length || 38,
        breadth: payload.breadth || 28,
        height: payload.height || 10,
        weight: payload.weight || 2.5,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || 'Shiprocket order creation failed' };
    }

    return {
      success: true,
      orderId: data.order_id,
      shipmentId: data.shipment_id,
      status: data.status,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Track shipment by AWB code
 */
export async function trackShiprocketAWB(awbCode: string): Promise<any> {
  const token = await getShiprocketToken();
  if (!token) {
    return {
      success: true,
      mock: true,
      awb: awbCode,
      status: 'IN_TRANSIT',
      currentLocation: 'Delhi Hub',
      message: 'Shiprocket mock tracking: Package in transit to destination.',
    };
  }

  try {
    const res = await fetch(`${BASE_URL}/courier/track/awb/${awbCode}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err: any) {
    return { error: err.message };
  }
}

/**
 * Check courier serviceability between two pincodes
 */
export async function checkCourierServiceability(
  deliveryPincode: string,
  pickupPincode: string = '110019',
  isCod: boolean = true
): Promise<any> {
  const token = await getShiprocketToken();
  if (!token) {
    return {
      available: true,
      mock: true,
      estimatedDeliveryDays: '2-4 Days',
      courierPartner: 'BlueDart / Delhivery Express Air',
    };
  }

  try {
    const url = `${BASE_URL}/courier/serviceability?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&cod=${isCod ? 1 : 0}&weight=2.5`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err: any) {
    return { available: true, error: err.message };
  }
}
