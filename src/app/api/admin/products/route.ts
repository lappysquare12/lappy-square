import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { syncProductToFirestore } from '@/lib/firebase';
import { ensureFirestoreProductsSynced } from '@/lib/firestore-sync';

export async function GET(req: Request) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);
    await ensureFirestoreProductsSynced();
    const products = await prisma.product.findMany({
      include: { brand: true, category: true, images: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ products });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const body = await req.json();

    const {
      title,
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
      useCase,
      featured,
      bestSeller,
      isDealOfTheDay,
    } = body;

    if (!title || !price) {
      return NextResponse.json({ error: 'Laptop title and price are required' }, { status: 400 });
    }

    // Auto-generate or sanitize slug
    let rawSlug = body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = rawSlug;
    let counter = 1;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${rawSlug}-${counter++}`;
    }

    // Auto-generate or sanitize SKU
    let sku = (body.sku || `LS-${title.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`).toUpperCase().trim();
    while (await prisma.product.findUnique({ where: { sku } })) {
      sku = `LS-${Math.floor(10000 + Math.random() * 90000)}`;
    }

    // Resolve Brand
    let brandId = body.brandId;
    let foundBrand = null;
    if (brandId) {
      foundBrand = await prisma.brand.findFirst({
        where: {
          OR: [
            { id: brandId },
            { slug: brandId.toLowerCase() },
            { name: { equals: brandId } },
          ],
        },
      });
    }
    if (!foundBrand) {
      foundBrand = await prisma.brand.findFirst({ where: { active: true } });
    }
    if (!foundBrand) {
      foundBrand = await prisma.brand.create({
        data: { name: 'Dell', slug: 'dell', featured: true },
      });
    }

    // Resolve Category
    let categoryId = body.categoryId;
    let foundCat = null;
    if (categoryId) {
      foundCat = await prisma.category.findFirst({
        where: {
          OR: [
            { id: categoryId },
            { slug: categoryId.toLowerCase() },
            { name: { equals: categoryId } },
          ],
        },
      });
    }
    if (!foundCat) {
      foundCat = await prisma.category.findFirst({ where: { active: true } });
    }
    if (!foundCat) {
      foundCat = await prisma.category.create({
        data: { name: 'Business & Office', slug: 'business-laptops' },
      });
    }

    // Handle images
    let rawImages: string[] = [];
    if (Array.isArray(body.images)) {
      rawImages = body.images.filter(Boolean);
    } else if (body.imageUrl && typeof body.imageUrl === 'string') {
      rawImages = [body.imageUrl.trim()];
    }
    if (rawImages.length === 0) {
      rawImages = ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80'];
    }

    const seriesTrimmed = body.series ? String(body.series).trim() : '';
    if (seriesTrimmed && foundBrand?.id) {
      try {
        const existing = await prisma.brandSeries.findFirst({
          where: { brandId: foundBrand.id, name: { equals: seriesTrimmed } },
        });
        if (!existing) {
          const sSlug = seriesTrimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          await prisma.brandSeries.create({
            data: {
              brandId: foundBrand.id,
              name: seriesTrimmed,
              slug: sSlug || `series-${Date.now()}`,
              active: true,
            },
          });
        }
      } catch {
        // ignore duplicate
      }
    }

    const newProduct = await prisma.product.create({
      data: {
        title: title.trim(),
        slug,
        sku,
        series: seriesTrimmed,
        brand: {
          connect: { id: foundBrand.id },
        },
        category: {
          connect: { id: foundCat.id },
        },
        conditionGrade: conditionGrade || 'EXCELLENT',
        price: Number(price),
        originalPrice: Number(originalPrice || price),
        stock: Number(stock !== undefined ? stock : 1),
        processor: processor || 'Intel Core i5',
        processorModel: (processorModel && String(processorModel).trim()) || (processor ? `${processor} OEM` : 'Intel Core OEM'),
        processorGen: processorGen || null,
        ramGb: Number(ramGb || 16),
        ramType: ramType || 'DDR4',
        storageGb: Number(storageGb || 512),
        storageType: storageType || 'SSD',
        screenSize: screenSize || '14.0 Inch FHD',
        displayResolution: displayResolution || null,
        graphicsCard: graphicsCard || 'Integrated Graphics',
        os: os || 'Windows 11 Pro',
        batteryHealth: batteryHealth || '90%+ Certified Health',
        batteryBackupHours: batteryBackupHours || '4-6 Hours',
        warrantyMonths: Number(warrantyMonths || 12),
        includedAccessories: includedAccessories || 'Original Charger, Power Cable, Lappy Square Laptop Bag, Warranty Card',
        weightKg: weightKg || '1.4 kg',
        description: description || null,
        useCase: useCase || 'Business & Everyday, Programming, Students',
        featured: Boolean(featured),
        bestSeller: Boolean(bestSeller),
        isDealOfTheDay: Boolean(isDealOfTheDay),
        images: {
          create: rawImages.map((url: string, idx: number) => ({
            url,
            isPrimary: idx === 0,
            displayOrder: idx,
          })),
        },
      },
      include: {
        brand: true,
        category: true,
        images: true,
      },
    });

    // Link and sync product to Firestore Database immediately
    try {
      await syncProductToFirestore(newProduct);
    } catch (fsErr) {
      console.error('Failed to sync new product to Firestore:', fsErr);
    }

    try {
      revalidatePath('/admin/products');
      revalidatePath('/shop');
      revalidatePath('/');
      revalidatePath('/deals');
    } catch {}

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Create failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

