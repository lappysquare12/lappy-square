import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

// Initialize Firebase safely (avoiding re-initialization in Next.js hot reload)
export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(firebaseApp);

export interface FirestoreProduct {
  id: string;
  title: string;
  slug: string;
  sku: string;
  price: number;
  originalPrice: number;
  stock: number;
  conditionGrade: string;
  brandName?: string;
  brandId?: string;
  categoryName?: string;
  categoryId?: string;
  processor: string;
  processorModel?: string | null;
  processorGen?: string | null;
  ramGb: number;
  ramType?: string | null;
  storageGb: number;
  storageType?: string | null;
  screenSize?: string | null;
  graphicsCard?: string | null;
  os?: string | null;
  batteryHealth?: string | null;
  batteryBackupHours?: string | null;
  warrantyMonths: number;
  description?: string | null;
  featured: boolean;
  bestSeller: boolean;
  isDealOfTheDay: boolean;
  active: boolean;
  images: Array<{ url: string; isPrimary?: boolean; displayOrder?: number }>;
  primaryImageUrl?: string;
  updatedAt?: unknown;
  createdAt?: unknown;
}

/**
 * Upsert a product into Firestore `products` collection
 */
export async function syncProductToFirestore(product: any): Promise<void> {
  try {
    const docRef = doc(db, 'products', product.id);

    const imagesList = Array.isArray(product.images)
      ? product.images.map((img: any) => (typeof img === 'string' ? { url: img } : { url: img.url, isPrimary: img.isPrimary }))
      : product.imageUrl
      ? [{ url: product.imageUrl, isPrimary: true }]
      : [];

    const primaryImg = imagesList[0]?.url || product.imageUrl || '';

    const firestoreData: Record<string, any> = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      sku: product.sku,
      price: Number(product.price),
      originalPrice: Number(product.originalPrice || product.price),
      stock: Number(product.stock !== undefined ? product.stock : 1),
      conditionGrade: product.conditionGrade || 'EXCELLENT',
      brandId: product.brandId || '',
      brandName: product.brand?.name || product.brandName || '',
      categoryId: product.categoryId || '',
      categoryName: product.category?.name || product.categoryName || '',
      processor: product.processor || '',
      processorModel: product.processorModel || '',
      processorGen: product.processorGen || '',
      ramGb: Number(product.ramGb || 16),
      ramType: product.ramType || 'DDR4',
      storageGb: Number(product.storageGb || 512),
      storageType: product.storageType || 'SSD',
      screenSize: product.screenSize || '',
      graphicsCard: product.graphicsCard || '',
      os: product.os || 'Windows 11 Pro',
      batteryHealth: product.batteryHealth || '',
      batteryBackupHours: product.batteryBackupHours || '',
      warrantyMonths: Number(product.warrantyMonths || 12),
      description: product.description || '',
      featured: Boolean(product.featured),
      bestSeller: Boolean(product.bestSeller),
      isDealOfTheDay: Boolean(product.isDealOfTheDay),
      active: product.active !== undefined ? Boolean(product.active) : true,
      images: imagesList,
      primaryImageUrl: primaryImg,
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, firestoreData, { merge: true });
    console.log(`[Firestore] Product synced successfully: ${product.id} (${product.title})`);
  } catch (error) {
    console.error(`[Firestore Error] Failed to sync product ${product?.id} to Firestore:`, error);
  }
}

/**
 * Update product fields in Firestore
 */
export async function updateProductInFirestore(productId: string, partialData: Record<string, any>): Promise<void> {
  try {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, {
      ...partialData,
      updatedAt: serverTimestamp(),
    });
    console.log(`[Firestore] Product updated successfully: ${productId}`);
  } catch (error) {
    console.error(`[Firestore Error] Failed to update product ${productId}:`, error);
  }
}

/**
 * Delete a product from Firestore
 */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  if (!productId) return;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'lappy-square';

  // 1. Direct high-speed document delete via Firestore REST API (runs in ~50ms, zero WebChannel hang)
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products/${encodeURIComponent(productId)}`,
      { method: 'DELETE' }
    );
    console.log(`[Firestore REST] Deleted product doc ${productId}: status ${res.status}`);
  } catch (err) {
    console.error(`[Firestore REST Error] Failed to delete ${productId}:`, err);
  }

  // 2. Also ensure any document with id field matching productId is removed
  try {
    const listRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products`,
      { cache: 'no-store' }
    );
    if (listRes.ok) {
      const data = await listRes.json();
      if (Array.isArray(data.documents)) {
        for (const docItem of data.documents) {
          const docId = docItem.name.split('/').pop();
          const fieldId = docItem.fields?.id?.stringValue;
          if (docId === productId || fieldId === productId) {
            await fetch(`https://firestore.googleapis.com/v1/${docItem.name}`, { method: 'DELETE' });
            console.log(`[Firestore REST] Cleaned up matching doc ${docItem.name}`);
          }
        }
      }
    }
  } catch (err) {
    console.warn(`[Firestore REST] Matching doc cleanup error for ${productId}:`, err);
  }
}

/**
 * Get all products from Firestore
 */
export async function getProductsFromFirestore(): Promise<any[]> {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map((docSnap: any) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error('[Firestore Error] Failed to fetch products:', error);
    return [];
  }
}

/**
 * Upsert an order into Firestore `orders` collection
 */
export async function syncOrderToFirestore(order: any): Promise<void> {
  try {
    const docRef = doc(db, 'orders', order.id);
    const firestoreOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.guestName || '',
      customerEmail: order.guestEmail || '',
      customerPhone: order.guestPhone || '',
      shippingAddress: order.shippingAddress || '',
      status: order.status || 'CONFIRMED',
      paymentStatus: order.paymentStatus || 'PENDING',
      paymentMethod: order.paymentMethod || 'CASH_ON_DELIVERY',
      subtotal: Number(order.subtotal || 0),
      discountAmount: Number(order.discountAmount || 0),
      totalAmount: Number(order.totalAmount || 0),
      customerNotes: order.customerNotes || '',
      items: Array.isArray(order.items)
        ? order.items.map((it: any) => ({
            title: it.title,
            quantity: Number(it.quantity || 1),
            price: Number(it.price || 0),
            specsSnapshot: it.specsSnapshot || '',
            brandName: it.brandName || '',
          }))
        : [],
      updatedAt: serverTimestamp(),
      createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : new Date().toISOString(),
    };

    await setDoc(docRef, firestoreOrder, { merge: true });
    console.log(`[Firestore] Order synced successfully: #${order.orderNumber} (${order.id})`);
  } catch (error) {
    console.error(`[Firestore Error] Failed to sync order #${order?.orderNumber} to Firestore:`, error);
  }
}

/**
 * Delete an order from Firestore via high-speed REST API
 */
export async function deleteOrderFromFirestore(orderId: string): Promise<void> {
  if (!orderId) return;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'lappy-square';

  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/orders/${encodeURIComponent(orderId)}`,
      { method: 'DELETE' }
    );
    console.log(`[Firestore REST] Deleted order doc ${orderId}: status ${res.status}`);
  } catch (err) {
    console.error(`[Firestore REST Error] Failed to delete order ${orderId}:`, err);
  }
}

/**
 * Delete an enquiry from Firestore via high-speed REST API
 */
export async function deleteEnquiryFromFirestore(enquiryId: string): Promise<void> {
  if (!enquiryId) return;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'lappy-square';

  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/enquiries/${encodeURIComponent(enquiryId)}`,
      { method: 'DELETE' }
    );
    console.log(`[Firestore REST] Deleted enquiry doc ${enquiryId}: status ${res.status}`);
  } catch (err) {
    console.error(`[Firestore REST Error] Failed to delete enquiry ${enquiryId}:`, err);
  }
}


