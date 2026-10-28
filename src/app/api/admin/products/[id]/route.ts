import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { syncProductToFirestore, deleteProductFromFirestore, updateProductInFirestore } from '@/lib/firebase';
import { ensureFirestoreProductsSynced } from '@/lib/firestore-sync';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);
    const { id } = await params;
    const body = await req.json();

    const {
      title,
      price,
      originalPrice,
      stock,
      conditionGrade,
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
      brandId,
      categoryId,
      imageUrl,
    } = body;

    // Check if product exists in local database; if missing in serverless instance, sync from Firestore
    let existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      try {
        await ensureFirestoreProductsSynced();
        existing = await prisma.product.findUnique({ where: { id } });
      } catch (syncErr) {
        console.warn('Sync attempt before update failed:', syncErr);
      }
    }

    // Resolve brand if specified
    let resolvedBrandId = undefined;
    if (brandId) {
      const foundBrand = await prisma.brand.findFirst({
        where: {
          OR: [{ id: brandId }, { slug: brandId.toLowerCase() }, { name: { equals: brandId } }],
        },
      });
      if (foundBrand) resolvedBrandId = foundBrand.id;
    }

    // Resolve category if specified
    let resolvedCategoryId = undefined;
    if (categoryId) {
      const foundCat = await prisma.category.findFirst({
        where: {
          OR: [{ id: categoryId }, { slug: categoryId.toLowerCase() }, { name: { equals: categoryId } }],
        },
      });
      if (foundCat) resolvedCategoryId = foundCat.id;
    }

    // Auto-persist new series into BrandSeries if not present
    const targetBrandId = resolvedBrandId || existing?.brandId;
    if (body.series && targetBrandId) {
      try {
        const sName = String(body.series).trim();
        if (sName) {
          const ex = await prisma.brandSeries.findFirst({
            where: { brandId: targetBrandId, name: { equals: sName } },
          });
          if (!ex) {
            const sSlug = sName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            await prisma.brandSeries.create({
              data: {
                brandId: targetBrandId,
                name: sName,
                slug: sSlug || `series-${Date.now()}`,
                active: true,
              },
            });
          }
        }
      } catch {
        // ignore duplicate
      }
    }

    let updated = null;
    if (existing) {
      updated = await prisma.product.update({
        where: { id },
        data: {
          title: title !== undefined ? title : undefined,
          slug: body.slug !== undefined ? body.slug.toLowerCase().trim() : undefined,
          sku: body.sku !== undefined ? body.sku.toUpperCase().trim() : undefined,
          series: body.series !== undefined ? (body.series ? String(body.series).trim() : '') : undefined,
          brandId: resolvedBrandId,
          categoryId: resolvedCategoryId,
          price: price !== undefined ? Number(price) : undefined,
          originalPrice: originalPrice !== undefined ? Number(originalPrice) : undefined,
          stock: stock !== undefined ? Number(stock) : undefined,
          conditionGrade: conditionGrade !== undefined ? conditionGrade : undefined,
          processor: processor !== undefined ? processor : undefined,
          processorModel: processorModel !== undefined ? (processorModel ? String(processorModel).trim() : 'Intel Core OEM') : undefined,
          processorGen: processorGen !== undefined ? processorGen : undefined,
          ramGb: ramGb !== undefined ? Number(ramGb) : undefined,
          ramType: ramType !== undefined ? ramType : undefined,
          storageGb: storageGb !== undefined ? Number(storageGb) : undefined,
          storageType: storageType !== undefined ? storageType : undefined,
          screenSize: screenSize !== undefined ? screenSize : undefined,
          displayResolution: displayResolution !== undefined ? displayResolution : undefined,
          graphicsCard: graphicsCard !== undefined ? graphicsCard : undefined,
          os: os !== undefined ? os : undefined,
          batteryHealth: batteryHealth !== undefined ? batteryHealth : undefined,
          batteryBackupHours: batteryBackupHours !== undefined ? batteryBackupHours : undefined,
          warrantyMonths: warrantyMonths !== undefined ? Number(warrantyMonths) : undefined,
          includedAccessories: includedAccessories !== undefined ? includedAccessories : undefined,
          weightKg: weightKg !== undefined ? weightKg : undefined,
          useCase: useCase !== undefined ? useCase : undefined,
          description: description !== undefined ? description : undefined,
          featured: featured !== undefined ? Boolean(featured) : undefined,
          bestSeller: bestSeller !== undefined ? Boolean(bestSeller) : undefined,
          isDealOfTheDay: isDealOfTheDay !== undefined ? Boolean(isDealOfTheDay) : undefined,
          active: active !== undefined ? Boolean(active) : undefined,
        },
        include: {
          brand: true,
          category: true,
          images: true,
        },
      });

      // Update images: handle multiple images array or fallback to single imageUrl
      if (Array.isArray(body.images)) {
        const validImages = body.images.filter((u: unknown) => typeof u === 'string' && u.trim());
        if (validImages.length > 0) {
          await prisma.productImage.deleteMany({
            where: { productId: id },
          });
          await prisma.productImage.createMany({
            data: validImages.map((url: string, idx: number) => ({
              productId: id,
              url: url.trim(),
              isPrimary: idx === 0,
              displayOrder: idx,
            })),
          });
        }
      } else if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim()) {
        const primaryImg = await prisma.productImage.findFirst({
          where: { productId: id, isPrimary: true },
        });
        if (primaryImg) {
          await prisma.productImage.update({
            where: { id: primaryImg.id },
            data: { url: imageUrl.trim() },
          });
        } else {
          await prisma.productImage.create({
            data: {
              productId: id,
              url: imageUrl.trim(),
              isPrimary: true,
              displayOrder: 0,
            },
          });
        }
      }

      // Re-fetch updated product with fresh images for Firestore sync
      updated = await prisma.product.findUnique({
        where: { id },
        include: { brand: true, category: true, images: true },
      });
    }

    // Always update Firestore Database so state is persisted across serverless functions
    try {
      if (updated) {
        await syncProductToFirestore(updated);
      } else {
        await updateProductInFirestore(id, body);
      }
    } catch (fsErr) {
      console.error('Failed to sync updated product to Firestore:', fsErr);
    }

    try {
      revalidatePath('/admin/products');
      revalidatePath('/shop');
      revalidatePath('/');
      revalidatePath('/deals');
    } catch {}

    return NextResponse.json({ success: true, product: updated || { id, ...body } });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Update failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // 1. Remove from Firestore Database first so the live cloud inventory reflects deletion immediately
    try {
      await deleteProductFromFirestore(id);
    } catch (fsErr) {
      console.error('Failed to delete product from Firestore:', fsErr);
    }

    // 2. Delete related items safely in a transaction.
    // NOTE: Using deleteMany instead of delete prevents P2025:
    // "An operation failed because it depends on one or more records that were required but not found. No record was found for a delete."
    try {
      await prisma.$transaction([
        prisma.productImage.deleteMany({ where: { productId: id } }),
        prisma.inventoryUnit.deleteMany({ where: { productId: id } }),
        prisma.cartItem.deleteMany({ where: { productId: id } }),
        prisma.wishlist.deleteMany({ where: { productId: id } }),
        prisma.review.deleteMany({ where: { productId: id } }),
        prisma.productFAQ.deleteMany({ where: { productId: id } }),
        prisma.orderItem.updateMany({ where: { productId: id }, data: { productId: null } }),
        prisma.product.deleteMany({ where: { id } }),
      ]);
    } catch (prismaErr) {
      console.warn('Prisma deletion non-fatal warning (record may not exist in local SQLite container):', prismaErr);
    }

    try {
      revalidatePath('/admin/products');
      revalidatePath('/shop');
      revalidatePath('/');
      revalidatePath('/deals');
    } catch {}

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Delete failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
