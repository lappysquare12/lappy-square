import prisma from './prisma';

interface FirestoreField {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  timestampValue?: string;
  mapValue?: { fields: Record<string, FirestoreField> };
  arrayValue?: { values?: FirestoreField[] };
}

let lastSyncTime = 0;
const SYNC_INTERVAL_MS = 10000; // 10 seconds throttle

export async function ensureFirestoreProductsSynced(): Promise<void> {
  const now = Date.now();
  if (now - lastSyncTime < SYNC_INTERVAL_MS) {
    return;
  }
  // Throttle immediately so timeout/offline state doesn't re-trigger on every render
  lastSyncTime = now;

  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'lappy-square';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products`,
      { cache: 'no-store', signal: controller.signal }
    ).catch(() => null);

    clearTimeout(timeoutId);
    if (!res || !res.ok) return;

    const data = await res.json().catch(() => null);
    if (!data?.documents || !Array.isArray(data.documents)) return;

    // Extract all live product IDs from Firestore cloud source of truth
    const firestoreIds = new Set<string>();
    for (const doc of data.documents) {
      const fields = doc.fields as Record<string, FirestoreField> | undefined;
      const id = fields?.id?.stringValue || doc.name.split('/').pop();
      if (id) firestoreIds.add(id);
    }

    // 1. Reconcile deleted products:
    // If a product is in local SQLite but NOT in Firestore, it was deleted!
    // Remove it from local SQLite so Netlify containers never resurrect deleted laptops!
    if (firestoreIds.size > 0) {
      const obsoleteProducts = await prisma.product.findMany({
        where: { id: { notIn: Array.from(firestoreIds) } },
        select: { id: true },
      });

      for (const p of obsoleteProducts) {
        try {
          await prisma.$transaction([
            prisma.productImage.deleteMany({ where: { productId: p.id } }),
            prisma.inventoryUnit.deleteMany({ where: { productId: p.id } }),
            prisma.cartItem.deleteMany({ where: { productId: p.id } }),
            prisma.wishlist.deleteMany({ where: { productId: p.id } }),
            prisma.review.deleteMany({ where: { productId: p.id } }),
            prisma.productFAQ.deleteMany({ where: { productId: p.id } }),
            prisma.orderItem.updateMany({ where: { productId: p.id }, data: { productId: null } }),
            prisma.product.deleteMany({ where: { id: p.id } }),
          ]);
        } catch (cleanupErr) {
          console.warn(`[Firestore Sync] Cleaned up obsolete local product ${p.id}:`, cleanupErr);
        }
      }
    }

    const existingProducts = await prisma.product.findMany({ select: { id: true } });
    const existingIds = new Set(existingProducts.map((p) => p.id));

    const defaultBrand = await prisma.brand.findFirst();
    const defaultCategory = await prisma.category.findFirst();

    for (const doc of data.documents) {
      const fields = doc.fields as Record<string, FirestoreField> | undefined;
      if (!fields) continue;

      const id = fields.id?.stringValue || doc.name.split('/').pop();
      if (!id || existingIds.has(id)) continue;

      const title = fields.title?.stringValue || 'Refurbished Laptop';
      const slug = fields.slug?.stringValue || `laptop-${id.slice(-6)}`;
      const sku = fields.sku?.stringValue || `LS-${id.slice(-6).toUpperCase()}`;
      const price = Number(fields.price?.integerValue || fields.price?.doubleValue || 0);
      const originalPrice = Number(fields.originalPrice?.integerValue || fields.originalPrice?.doubleValue || price);
      const stock = Number(fields.stock?.integerValue || 1);
      const conditionGrade = fields.conditionGrade?.stringValue || 'EXCELLENT';
      const processor = fields.processor?.stringValue || 'Intel Core i5';
      const processorModel = fields.processorModel?.stringValue || `${processor} OEM`;
      const processorGen = fields.processorGen?.stringValue || null;
      const ramGb = Number(fields.ramGb?.integerValue || 16);
      const ramType = fields.ramType?.stringValue || 'DDR4';
      const storageGb = Number(fields.storageGb?.integerValue || 512);
      const storageType = fields.storageType?.stringValue || 'SSD';
      const screenSize = fields.screenSize?.stringValue || '14.0" FHD';
      const displayResolution = fields.displayResolution?.stringValue || null;
      const graphicsCard = fields.graphicsCard?.stringValue || 'Integrated Graphics';
      const os = fields.os?.stringValue || 'Windows 11 Pro';
      const batteryHealth = fields.batteryHealth?.stringValue || '90%+ Certified Health';
      const batteryBackupHours = fields.batteryBackupHours?.stringValue || '4-6 Hours';
      const warrantyMonths = Number(fields.warrantyMonths?.integerValue || 12);
      const includedAccessories = fields.includedAccessories?.stringValue || 'Original Charger, Power Cable, Lappy Square Laptop Bag, Warranty Card';
      const weightKg = fields.weightKg?.stringValue || '1.4 kg';
      const useCase = fields.useCase?.stringValue || 'Business & Everyday, Programming, Students';
      const description = fields.description?.stringValue || null;
      const featured = Boolean(fields.featured?.booleanValue);
      const bestSeller = Boolean(fields.bestSeller?.booleanValue);
      const isDealOfTheDay = Boolean(fields.isDealOfTheDay?.booleanValue);
      const active = fields.active?.booleanValue !== undefined ? fields.active.booleanValue : true;

      let imageUrls: string[] = [];
      if (fields.images?.arrayValue?.values) {
        imageUrls = fields.images.arrayValue.values
          .map((v) => v.mapValue?.fields?.url?.stringValue || '')
          .filter(Boolean);
      }
      if (imageUrls.length === 0 && fields.primaryImageUrl?.stringValue) {
        imageUrls = [fields.primaryImageUrl.stringValue];
      }
      if (imageUrls.length === 0) {
        imageUrls = ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80'];
      }

      const brandId = fields.brandId?.stringValue;
      let brand = brandId ? await prisma.brand.findUnique({ where: { id: brandId } }) : null;
      if (!brand && fields.brandName?.stringValue) {
        brand = await prisma.brand.findFirst({ where: { name: fields.brandName.stringValue } });
      }
      if (!brand) brand = defaultBrand;

      const categoryId = fields.categoryId?.stringValue;
      let category = categoryId ? await prisma.category.findUnique({ where: { id: categoryId } }) : null;
      if (!category && fields.categoryName?.stringValue) {
        category = await prisma.category.findFirst({ where: { name: fields.categoryName.stringValue } });
      }
      if (!category) category = defaultCategory;

      if (!brand || !category) continue;

      let uniqueSlug = slug;
      let counter = 1;
      while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${slug}-${counter++}`;
      }

      await prisma.product.create({
        data: {
          id,
          title,
          slug: uniqueSlug,
          sku,
          brandId: brand.id,
          categoryId: category.id,
          price,
          originalPrice,
          stock,
          conditionGrade: conditionGrade as any,
          processor,
          processorModel,
          processorGen,
          ramGb,
          ramType,
          storageGb,
          storageType,
          screenSize,
          displayResolution,
          graphicsCard,
          os,
          batteryHealth,
          batteryBackupHours,
          warrantyMonths,
          includedAccessories,
          weightKg,
          useCase,
          description,
          featured,
          bestSeller,
          isDealOfTheDay,
          active,
          images: {
            create: imageUrls.map((url, idx) => ({
              url,
              isPrimary: idx === 0,
              displayOrder: idx,
            })),
          },
        },
      });
      existingIds.add(id);
    }

    lastSyncTime = Date.now();
  } catch (err: unknown) {
    if (process.env.NODE_ENV === 'development') {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[Firestore Sync (offline/timeout)]: Using local database (${msg})`);
    }
  }
}
