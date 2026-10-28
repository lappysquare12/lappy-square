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

      // 2B. Check for missing BrandSeries table
      const brandSeriesTables = await prisma.$queryRawUnsafe(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='BrandSeries';"
      );

      if (!brandSeriesTables || brandSeriesTables.length === 0) {
        console.log('[migrate-sqlite] Creating missing table: BrandSeries');
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "BrandSeries" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "brandId" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "slug" TEXT NOT NULL,
            "displayOrder" INTEGER NOT NULL DEFAULT 0,
            "active" BOOLEAN NOT NULL DEFAULT 1,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE CASCADE
          );
        `);
      } else {
        console.log('[migrate-sqlite] Table BrandSeries already exists.');
      }

      // 2C. Check Product table for missing series column
      const productCols = await prisma.$queryRawUnsafe("PRAGMA table_info('Product');");
      if (Array.isArray(productCols) && productCols.length > 0) {
        const prodColNames = new Set(productCols.map((c) => c.name));
        if (!prodColNames.has('series')) {
          console.log('[migrate-sqlite] Adding missing column: Product.series');
          await prisma.$executeRawUnsafe(
            "ALTER TABLE \"Product\" ADD COLUMN \"series\" TEXT DEFAULT '';"
          );
        } else {
          console.log('[migrate-sqlite] Column Product.series already exists.');
        }
      }

      // 2D. Seed default Brand Series if BrandSeries is empty
      const existingSeries = await prisma.$queryRawUnsafe('SELECT COUNT(*) as count FROM "BrandSeries";');
      const seriesCount = Array.isArray(existingSeries) && existingSeries[0] ? Number(existingSeries[0].count) : 0;
      if (seriesCount === 0) {
        console.log('[migrate-sqlite] Seeding standard Brand Series (Types)...');
        const allBrands = await prisma.brand.findMany({ select: { id: true, slug: true, name: true } });
        const seriesData = {
          apple: [
            { name: 'MacBook Air', slug: 'macbook-air', displayOrder: 1 },
            { name: 'MacBook Pro', slug: 'macbook-pro', displayOrder: 2 },
            { name: 'iMac & Mac Mini', slug: 'imac-mac-mini', displayOrder: 3 },
          ],
          dell: [
            { name: 'Latitude (Enterprise)', slug: 'latitude', displayOrder: 1 },
            { name: 'XPS (Ultrabook)', slug: 'xps', displayOrder: 2 },
            { name: 'Precision (Workstation)', slug: 'precision', displayOrder: 3 },
            { name: 'Inspiron (Everyday)', slug: 'inspiron', displayOrder: 4 },
            { name: 'Alienware & G-Series', slug: 'alienware-g-series', displayOrder: 5 },
          ],
          lenovo: [
            { name: 'ThinkPad T Series', slug: 'thinkpad-t-series', displayOrder: 1 },
            { name: 'ThinkPad X1 Carbon', slug: 'thinkpad-x1-carbon', displayOrder: 2 },
            { name: 'ThinkPad L & E Series', slug: 'thinkpad-l-e-series', displayOrder: 3 },
            { name: 'IdeaPad & Yoga', slug: 'ideapad-yoga', displayOrder: 4 },
            { name: 'Legion Gaming', slug: 'legion-gaming', displayOrder: 5 },
          ],
          hp: [
            { name: 'EliteBook (Corporate)', slug: 'elitebook', displayOrder: 1 },
            { name: 'ProBook', slug: 'probook', displayOrder: 2 },
            { name: 'ZBook Workstation', slug: 'zbook-workstation', displayOrder: 3 },
            { name: 'Pavilion & Omen', slug: 'pavilion-omen', displayOrder: 4 },
            { name: 'Spectre & Envy', slug: 'spectre-envy', displayOrder: 5 },
          ],
          asus: [
            { name: 'ZenBook', slug: 'zenbook', displayOrder: 1 },
            { name: 'ROG & TUF Gaming', slug: 'rog-tuf-gaming', displayOrder: 2 },
            { name: 'ExpertBook', slug: 'expertbook', displayOrder: 3 },
            { name: 'VivoBook', slug: 'vivobook', displayOrder: 4 },
          ],
          acer: [
            { name: 'Swift', slug: 'swift', displayOrder: 1 },
            { name: 'Aspire', slug: 'aspire', displayOrder: 2 },
            { name: 'Nitro & Predator', slug: 'nitro-predator', displayOrder: 3 },
          ],
        };

        for (const brand of allBrands) {
          const brandKey = brand.slug.toLowerCase();
          const items = seriesData[brandKey] || [
            { name: `${brand.name} Standard`, slug: `${brand.slug}-standard`, displayOrder: 1 }
          ];

          for (const item of items) {
            const sid = `series_${brand.slug}_${item.slug}`.replace(/[^a-zA-Z0-9_]/g, '_');
            await prisma.$executeRawUnsafe(
              'INSERT OR IGNORE INTO "BrandSeries" ("id", "brandId", "name", "slug", "displayOrder", "active") VALUES (?, ?, ?, ?, ?, 1);',
              sid,
              brand.id,
              item.name,
              item.slug,
              item.displayOrder
            );
          }
        }
        console.log('[migrate-sqlite] Brand Series successfully seeded.');
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
