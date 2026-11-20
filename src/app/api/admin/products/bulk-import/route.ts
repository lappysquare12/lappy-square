import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import * as XLSX from 'xlsx';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { syncProductToFirestore } from '@/lib/firebase';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80';

export async function POST(req: Request) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);

    let rawRows: any[] = [];

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'No Excel file uploaded' }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      rawRows = XLSX.utils.sheet_to_json(worksheet);
    } else {
      const body = await req.json();
      rawRows = Array.isArray(body.rows) ? body.rows : [];
    }

    if (!rawRows || rawRows.length === 0) {
      return NextResponse.json({ error: 'Excel sheet has no product rows to import.' }, { status: 400 });
    }

    const defaultBrand = await prisma.brand.findFirst();
    const defaultCategory = await prisma.category.findFirst();

    if (!defaultBrand || !defaultCategory) {
      return NextResponse.json({ error: 'No default brand or category found in database.' }, { status: 400 });
    }

    const allBrands = await prisma.brand.findMany();
    const brandMap = new Map<string, string>();
    for (const b of allBrands) {
      brandMap.set(b.name.toLowerCase().trim(), b.id);
      brandMap.set(b.slug.toLowerCase().trim(), b.id);
    }

    let createdCount = 0;
    const errors: Array<{ row: number; title?: string; error: string }> = [];

    for (let i = 0; i < rawRows.length; i++) {
      const row = rawRows[i];
      const rowNum = i + 2; // Accounting for 1-based index and header row

      const title = String(row['Title'] || row['title'] || row['Laptop Title'] || '').trim();
      const priceRaw = row['Price'] || row['price'] || row['Selling Price'];
      const price = Number(priceRaw);

      if (!title) {
        errors.push({ row: rowNum, error: 'Title is empty, skipping row.' });
        continue;
      }

      if (isNaN(price) || price <= 0) {
        errors.push({ row: rowNum, title, error: `Invalid price: ${priceRaw}` });
        continue;
      }

      const originalPriceRaw = row['OriginalPrice'] || row['originalPrice'] || row['MRP'] || row['Original Price'];
      const originalPrice = Number(originalPriceRaw) || Math.round(price * 2.5);

      const brandName = String(row['Brand'] || row['brand'] || '').trim();
      let brandId = defaultBrand.id;
      if (brandName) {
        const foundId = brandMap.get(brandName.toLowerCase());
        if (foundId) {
          brandId = foundId;
        } else {
          // Auto create missing brand
          try {
            const newB = await prisma.brand.create({
              data: {
                name: brandName,
                slug: brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                active: true,
              },
            });
            brandId = newB.id;
            brandMap.set(brandName.toLowerCase(), newB.id);
          } catch {
            brandId = defaultBrand.id;
          }
        }
      }

      const seriesRaw = String(row['Series'] || row['series'] || '').trim();
      const conditionInput = String(row['Condition'] || row['condition'] || 'Like New').toUpperCase().replace(/[^A-Z]/g, '');
      let conditionGrade: 'LIKE_NEW' | 'EXCELLENT' | 'GOOD' = 'LIKE_NEW';
      if (conditionInput.includes('EXCELLENT')) conditionGrade = 'EXCELLENT';
      else if (conditionInput.includes('GOOD') || conditionInput.includes('FAIR')) conditionGrade = 'GOOD';

      const processor = String(row['Processor'] || row['processor'] || 'Intel Core i5').trim();
      const processorModel = String(row['ProcessorModel'] || row['processorModel'] || `${processor} OEM`).trim();
      const processorGen = String(row['ProcessorGen'] || row['processorGen'] || '').trim() || null;

      const ramGb = Number(row['RAM_GB'] || row['RAM'] || row['ramGb'] || 16);
      const ramType = String(row['RAM_Type'] || row['ramType'] || 'DDR4').trim();
      const storageGb = Number(row['Storage_GB'] || row['Storage'] || row['storageGb'] || 512);
      const storageType = String(row['Storage_Type'] || row['storageType'] || 'SSD').trim();
      const screenSize = String(row['ScreenSize'] || row['screenSize'] || '14.0 Inch FHD').trim();
      const displayResolution = String(row['DisplayResolution'] || row['displayResolution'] || '1920 x 1080 FHD IPS').trim();
      const graphicsCard = String(row['GraphicsCard'] || row['graphicsCard'] || 'Integrated Graphics').trim();
      const os = String(row['OS'] || row['os'] || 'Windows 11 Pro').trim();
      const batteryHealth = String(row['BatteryHealth'] || row['batteryHealth'] || '90% Certified OEM Health').trim();
      const batteryBackupHours = String(row['BatteryBackupHours'] || row['batteryBackupHours'] || '5-7 Hours').trim();
      const warrantyMonths = Number(row['WarrantyMonths'] || row['warrantyMonths'] || 12);
      const includedAccessories = String(row['IncludedAccessories'] || row['includedAccessories'] || 'Original Charger, Power Cable, Lappy Square Laptop Bag, 45-Point Certificate').trim();
      const weightKg = String(row['WeightKg'] || row['weightKg'] || '1.4 kg').trim();
      const description = String(row['Description'] || row['description'] || '45-Point Certified Refurbished Laptop with 1-Year Warranty.').trim();
      const stock = Number(row['Stock'] || row['stock'] || 1);

      // Generate unique slug
      const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      let slug = `${baseSlug}-${Date.now().toString().slice(-4)}-${i}`;
      let counter = 1;
      while (await prisma.product.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${Date.now().toString().slice(-4)}-${i}-${counter++}`;
      }

      // Generate unique SKU
      const brandCode = brandName ? brandName.slice(0, 3).toUpperCase() : 'LS';
      let sku = `LS-${brandCode}-${Math.floor(1000 + Math.random() * 9000)}`;
      while (await prisma.product.findUnique({ where: { sku } })) {
        sku = `LS-${brandCode}-${Math.floor(10000 + Math.random() * 90000)}`;
      }

      try {
        const newProduct = await prisma.product.create({
          data: {
            title,
            slug,
            sku,
            series: seriesRaw || null,
            brandId,
            categoryId: defaultCategory.id,
            conditionGrade,
            price,
            originalPrice,
            stock,
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
            description,
            useCase: 'Business & Everyday, Programming, Students',
            featured: true,
            bestSeller: createdCount < 6,
            isNewArrival: true,
            active: true,
            images: {
              create: [
                {
                  url: PLACEHOLDER_IMAGE,
                  isPrimary: true,
                  displayOrder: 0,
                },
              ],
            },
          },
          include: {
            brand: true,
            category: true,
            images: true,
          },
        });

        // Sync product to Firestore Cloud
        try {
          await syncProductToFirestore(newProduct);
        } catch (fsErr) {
          console.warn(`Firestore sync note for row ${rowNum}:`, fsErr);
        }

        createdCount++;
      } catch (dbErr: any) {
        errors.push({ row: rowNum, title, error: dbErr?.message || 'Database insert failed' });
      }
    }

    try {
      revalidatePath('/admin/products');
      revalidatePath('/shop');
      revalidatePath('/');
    } catch {}

    return NextResponse.json({
      success: true,
      importedCount: createdCount,
      totalRows: rawRows.length,
      errors,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Bulk import failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
