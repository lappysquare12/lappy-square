import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.startsWith('file:')) {
    return envUrl;
  }

  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, 'prisma', 'dev.db'),
    path.join(cwd, 'dev.db'),
    path.resolve(cwd, '..', 'prisma', 'dev.db'),
    path.join(process.env.LAMBDA_TASK_ROOT || '', 'prisma', 'dev.db'),
    path.join(process.env.LAMBDA_TASK_ROOT || '', 'dev.db'),
  ];

  // Detect serverless or read-only filesystem (Netlify / Vercel / AWS Lambda)
  const isServerless = Boolean(
    process.env.NETLIFY ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.VERCEL ||
    process.env.LAMBDA_TASK_ROOT
  );

  let isReadOnlyFs = isServerless;
  let existingDbPath = '';

  for (const candidate of candidates) {
    if (candidate && fs.existsSync(/*turbopackIgnore: true*/ candidate)) {
      existingDbPath = candidate;
      if (!isReadOnlyFs) {
        try {
          fs.accessSync(path.dirname(candidate), fs.constants.W_OK);
        } catch {
          isReadOnlyFs = true;
        }
      }
      break;
    }
  }

  // If running in Netlify/Serverless or on a read-only filesystem,
  // copy the database to /tmp which is guaranteed to be writable by SQLite
  if (isReadOnlyFs && existingDbPath) {
    const tmpDbPath = '/tmp/dev.db';
    try {
      if (!fs.existsSync(tmpDbPath)) {
        fs.copyFileSync(existingDbPath, tmpDbPath);
        if (fs.existsSync(`${existingDbPath}-wal`)) {
          fs.copyFileSync(`${existingDbPath}-wal`, `${tmpDbPath}-wal`);
        }
        if (fs.existsSync(`${existingDbPath}-shm`)) {
          fs.copyFileSync(`${existingDbPath}-shm`, `${tmpDbPath}-shm`);
        }
      }
      return `file:${tmpDbPath}`;
    } catch (err) {
      console.error('Failed to copy database to writable /tmp:', err);
    }
  }

  if (existingDbPath) {
    return `file:${existingDbPath.replace(/\\/g, '/')}`;
  }

  return envUrl || 'file:./prisma/dev.db';
}

const resolvedUrl = getDatabaseUrl();
process.env['DATABASE_URL'] = resolvedUrl;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: resolvedUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Non-blocking, idempotent SQLite schema check to prevent missing-column runtime crashes
let schemaChecked = false;
async function ensureSqliteSchemaSafe() {
  if (schemaChecked || !resolvedUrl.startsWith('file:')) return;
  schemaChecked = true;
  try {
    const settingCols = (await prisma.$queryRawUnsafe("PRAGMA table_info('WebsiteSetting');")) as Array<{ name: string }>;
    if (Array.isArray(settingCols) && settingCols.length > 0) {
      const colNames = new Set(settingCols.map((c) => c.name));
      if (!colNames.has('googleSiteVerification')) {
        await prisma.$executeRawUnsafe(
          "ALTER TABLE \"WebsiteSetting\" ADD COLUMN \"googleSiteVerification\" TEXT DEFAULT '';"
        );
      }
      if (!colNames.has('googleAnalyticsId')) {
        await prisma.$executeRawUnsafe(
          "ALTER TABLE \"WebsiteSetting\" ADD COLUMN \"googleAnalyticsId\" TEXT DEFAULT '';"
        );
      }
    }

    const tables = (await prisma.$queryRawUnsafe(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='VideoReview';"
    )) as Array<{ name: string }>;

    if (!tables || tables.length === 0) {
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
    }
  } catch (err) {
    // Non-fatal, prevent breaking standard operations
    console.warn('SQLite schema alignment notice:', err);
  }
}

// Trigger asynchronously in background
ensureSqliteSchemaSafe().catch(() => {});

export default prisma;

