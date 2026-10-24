import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateSqlite() {
  const dbUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
  console.log(`[migrate-sqlite] Checking database at: ${dbUrl}`);

  // Only run SQLite-specific schema migrations if connecting to SQLite
  if (dbUrl.startsWith('file:') || !dbUrl.includes('://')) {
    try {
      // 1. Check WebsiteSetting table for missing SEO / Google columns
      const settingCols = await prisma.$queryRawUnsafe("PRAGMA table_info('WebsiteSetting');");
      if (Array.isArray(settingCols) && settingCols.length > 0) {
        const colNames = new Set(settingCols.map((c) => c.name));

        if (!colNames.has('googleSiteVerification')) {
          console.log('[migrate-sqlite] Adding missing column: WebsiteSetting.googleSiteVerification');
          await prisma.$executeRawUnsafe(
            "ALTER TABLE \"WebsiteSetting\" ADD COLUMN \"googleSiteVerification\" TEXT DEFAULT '';"
          );
        } else {
          console.log('[migrate-sqlite] Column WebsiteSetting.googleSiteVerification already exists.');
        }

        if (!colNames.has('googleAnalyticsId')) {
          console.log('[migrate-sqlite] Adding missing column: WebsiteSetting.googleAnalyticsId');
          await prisma.$executeRawUnsafe(
            "ALTER TABLE \"WebsiteSetting\" ADD COLUMN \"googleAnalyticsId\" TEXT DEFAULT '';"
          );
        } else {
          console.log('[migrate-sqlite] Column WebsiteSetting.googleAnalyticsId already exists.');
        }
      }

      // 2. Check for missing VideoReview table
      const tables = await prisma.$queryRawUnsafe(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='VideoReview';"
      );

      if (!tables || tables.length === 0) {
        console.log('[migrate-sqlite] Creating missing table: VideoReview');
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "VideoReview" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "title" TEXT NOT NULL,
            "customerName" TEXT NOT NULL,
            "videoUrl" TEXT NOT NULL,
            "thumbnailUrl" TEXT,
            "laptopModel" TEXT,
            "rating" INTEGER NOT NULL DEFAULT 5,
            "featured" BOOLEAN NOT NULL DEFAULT 1,
            "displayOrder" INTEGER NOT NULL DEFAULT 0,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `);
      } else {
        console.log('[migrate-sqlite] Table VideoReview already exists.');
      }

      // 3. Fix any broken / 404 Unsplash image URLs in the database
      try {
        const invalidUrlCount = await prisma.productImage.updateMany({
          where: {
            url: { contains: '1544731612' }
          },
          data: {
            url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80'
          }
        });
        if (invalidUrlCount.count > 0) {
          console.log(`[migrate-sqlite] Repaired ${invalidUrlCount.count} invalid ProductImage URLs.`);
        }
      } catch (imgErr) {
        console.log('[migrate-sqlite] Image repair notice:', imgErr.message);
      }

      // 4. Checkpoint WAL changes directly into the main dev.db file
      try {
        await prisma.$queryRawUnsafe('PRAGMA wal_checkpoint(TRUNCATE);');
        console.log('[migrate-sqlite] SQLite WAL checkpoint completed.');
      } catch (walErr) {
        console.log('[migrate-sqlite] Note: WAL checkpoint skipped:', walErr.message);
      }

      console.log('[migrate-sqlite] All schema migrations verified successfully.');
    } catch (err) {
      console.error('[migrate-sqlite] Migration notice:', err);
    }
  } else {
    console.log('[migrate-sqlite] Non-SQLite database detected. Skipping SQLite-specific migrations.');
  }
}

migrateSqlite()
  .catch((e) => {
    console.error('[migrate-sqlite] Fatal migration error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
