import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { syncProductToFirestore, getProductsFromFirestore } from '@/lib/firebase';

export async function POST() {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);

    const allProducts = await prisma.product.findMany({
      include: { brand: true, category: true, images: true },
    });

    let successCount = 0;
    const errors: string[] = [];

    for (const prod of allProducts) {
      try {
        await syncProductToFirestore(prod);
        successCount++;
      } catch (err: any) {
        errors.push(`Failed for ${prod.title}: ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${successCount} of ${allProducts.length} products to Firestore!`,
      total: allProducts.length,
      synced: successCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('Firestore sync error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to sync with Firestore' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);
    const firestoreProducts = await getProductsFromFirestore();
    return NextResponse.json({
      success: true,
      count: firestoreProducts.length,
      products: firestoreProducts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch Firestore products' }, { status: 500 });
  }
}
