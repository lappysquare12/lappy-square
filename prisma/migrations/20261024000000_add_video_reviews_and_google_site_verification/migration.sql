-- AlterTable
ALTER TABLE "WebsiteSetting" ADD COLUMN "googleSiteVerification" TEXT DEFAULT '';
ALTER TABLE "WebsiteSetting" ADD COLUMN "googleAnalyticsId" TEXT DEFAULT '';

-- CreateTable
CREATE TABLE IF NOT EXISTS "VideoReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "laptopModel" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "featured" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
