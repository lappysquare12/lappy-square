import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export const revalidate = 3600; // revalidate hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lappysquare.com';

  // 1. Static Pages & Core Hubs
  const staticRoutes: MetadataRoute.Sitemap = [
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/shop', changeFrequency: 'daily', priority: 0.95 },
    { path: '/deals', changeFrequency: 'daily', priority: 0.9 },
    { path: '/brands', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/budget', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/blogs', changeFrequency: 'daily', priority: 0.85 },
    { path: '/collection/macbook', changeFrequency: 'daily', priority: 0.9 },
    { path: '/collection/windows', changeFrequency: 'daily', priority: 0.9 },
    { path: '/collection/gaming', changeFrequency: 'daily', priority: 0.85 },
    { path: '/collection/student', changeFrequency: 'daily', priority: 0.85 },
    { path: '/collection/development', changeFrequency: 'daily', priority: 0.85 },
    { path: '/budget/under-20000', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/budget/under-30000', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/budget/under-50000', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/budget/premium', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/use/coding', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/use/business', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/use/students', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/use/gaming', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/use/graphic-design', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/video-reviews', changeFrequency: 'weekly', priority: 0.75 },
    { path: '/exchange', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/sell-your-laptop', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/corporate-enquiry', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/compare', changeFrequency: 'weekly', priority: 0.65 },
    { path: '/faq', changeFrequency: 'monthly', priority: 0.65 },
    { path: '/track-order', changeFrequency: 'weekly', priority: 0.6 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/warranty', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/shipping-policy', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/return-refund-policy', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/cancellation-policy', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/privacy-policy', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/terms-and-conditions', changeFrequency: 'monthly', priority: 0.5 },
  ].map((item) => ({
    url: `${baseUrl}${item.path}`,
    lastModified: new Date(),
    changeFrequency: item.changeFrequency as MetadataRoute.Sitemap[number]['changeFrequency'],
    priority: item.priority,
  }));

  // 2. Dynamic Products
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
    });
    productRoutes = products.map((p) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    }));
  } catch (err) {
    console.error('Error generating product sitemap entries:', err);
  }

  // 3. Dynamic Brands
  let brandRoutes: MetadataRoute.Sitemap = [];
  try {
    const brands = await prisma.brand.findMany({
      where: { active: true },
      select: { slug: true, createdAt: true },
    });
    brandRoutes = brands.map((b) => ({
      url: `${baseUrl}/brands/${b.slug}`,
      lastModified: b.createdAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    }));
  } catch (err) {
    console.error('Error generating brand sitemap entries:', err);
  }

  // 4. Dynamic Blog Articles
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogs = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
    blogRoutes = blogs.map((post) => ({
      url: `${baseUrl}/blogs/${post.slug}`,
      lastModified: post.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    }));
  } catch (err) {
    console.error('Error generating blog sitemap entries:', err);
  }

  return [...staticRoutes, ...productRoutes, ...brandRoutes, ...blogRoutes];
}
