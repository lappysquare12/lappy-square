import { PrismaClient } from '@prisma/client';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const prisma = new PrismaClient();

const firebaseConfig = {
  apiKey: "AIzaSyDUGqIWF8HuSA_5vVZ_pnP2YlgDXd1Q8Wo",
  authDomain: "lappy-square.firebaseapp.com",
  projectId: "lappy-square",
  storageBucket: "lappy-square.firebasestorage.app",
  messagingSenderId: "353569640524",
  appId: "1:353569640524:web:4e8c0215320d5ecab024e9",
  measurementId: "G-B9SHC5R303"
};

async function syncAll() {
  console.log('🔄 Syncing all Prisma products to Firestore...');
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const products = await prisma.product.findMany({
    include: { brand: true, category: true, images: true },
  });

  console.log(`Found ${products.length} products to sync.`);

  for (const p of products) {
    const docRef = doc(db, 'products', p.id);
    await setDoc(docRef, {
      id: p.id,
      title: p.title,
      slug: p.slug,
      sku: p.sku,
      price: p.price,
      originalPrice: p.originalPrice,
      stock: p.stock,
      conditionGrade: p.conditionGrade,
      brandName: p.brand?.name || '',
      categoryName: p.category?.name || '',
      processor: p.processor,
      processorModel: p.processorModel || '',
      processorGen: p.processorGen || '',
      ramGb: p.ramGb,
      ramType: p.ramType || 'DDR4',
      storageGb: p.storageGb,
      storageType: p.storageType || 'SSD',
      screenSize: p.screenSize,
      graphicsCard: p.graphicsCard || '',
      os: p.os,
      batteryHealth: p.batteryHealth || '',
      batteryBackupHours: p.batteryBackupHours || '',
      warrantyMonths: p.warrantyMonths,
      description: p.description || '',
      featured: p.featured,
      bestSeller: p.bestSeller,
      isDealOfTheDay: p.isDealOfTheDay,
      active: p.active,
      primaryImageUrl: p.images[0]?.url || '',
      images: p.images.map((img) => ({ url: img.url, isPrimary: img.isPrimary })),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    console.log(`  ✓ Synced: ${p.title} (₹${p.price})`);
  }

  console.log(`🎉 All ${products.length} products successfully saved into Firestore collection "products"!`);
  await prisma.$disconnect();
}

syncAll().catch((err) => {
  console.error('Error syncing products to Firestore:', err);
  process.exit(1);
});
