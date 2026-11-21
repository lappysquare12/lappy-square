import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { syncProductToFirestore } from '@/lib/firebase';
import { applyWhiteBackgroundToUrl, removeWhiteBackgroundFromUrl } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);

    const images = await prisma.productImage.findMany({
      select: { id: true, url: true, isPrimary: true, productId: true },
    });

    const total = images.length;
    const cloudinaryImages = images.filter((img) => img.url.includes('cloudinary.com'));
    const alreadyWhiteBg = cloudinaryImages.filter((img) => img.url.includes('e_background_removal')).length;
    const pendingWhiteBg = cloudinaryImages.length - alreadyWhiteBg;

    return NextResponse.json({
      success: true,
      stats: {
        total,
        cloudinaryCount: cloudinaryImages.length,
        alreadyWhiteBg,
        pendingWhiteBg,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const body = await req.json().catch(() => ({}));
    const action = body.action || 'apply'; // 'apply' | 'revert'

    // Fetch all images with product relationship
    const images = await prisma.productImage.findMany({
      include: { product: true },
    });

    const affectedProductIds = new Set<string>();
    let updatedCount = 0;

    for (const img of images) {
      if (!img.url.includes('cloudinary.com') || !img.url.includes('/image/upload/')) {
        continue;
      }

      const newUrl =
        action === 'revert'
          ? removeWhiteBackgroundFromUrl(img.url)
          : applyWhiteBackgroundToUrl(img.url);

      if (newUrl !== img.url) {
        await prisma.productImage.update({
          where: { id: img.id },
          data: { url: newUrl },
        });
        affectedProductIds.add(img.productId);
        updatedCount++;
      }
    }

    // Sync affected products with Firestore so live and local stay in sync
    for (const productId of affectedProductIds) {
      const fullProd = await prisma.product.findUnique({
        where: { id: productId },
        include: { brand: true, category: true, images: true },
      });
      if (fullProd) {
        try {
          await syncProductToFirestore({
            ...fullProd,
            brandName: fullProd.brand?.name,
            categoryName: fullProd.category?.name,
            images: fullProd.images.map((i) => ({ url: i.url, isPrimary: i.isPrimary })),
          });
        } catch (e) {
          console.warn('Firestore sync warning during batch white bg:', e);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message:
        action === 'revert'
          ? `Reverted ${updatedCount} images back to original background.`
          : `Successfully converted ${updatedCount} images to pure studio white background!`,
      updatedCount,
      affectedProducts: affectedProductIds.size,
    });
  } catch (error: any) {
    console.error('Batch white background error:', error);
    return NextResponse.json({ error: error?.message || 'Operation failed' }, { status: 500 });
  }
}
