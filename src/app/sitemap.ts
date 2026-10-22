import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export const revalidate = 3600; // revalidate hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lappysquare.com';

  // 1. Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/shop',
    '/collection/macbook',
    '/collection/windows',
    '/collection/gaming',
    '/collection/student',
    '/collection/development',
    '/deals',
    '/video-reviews',
    '/about',
    '/contact',
    '/warranty',
    '/shipping-policy',
    '/return-refund-policy',
    '/cancellation-policy',
    '/privacy-policy',
    '/terms-and-conditions',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/shop' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/collection') ? 0.9 : 0.7,
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
      priority: 0.8,
    }));
  } catch (err) {
    console.error('Error generating product sitemap entries:', err);
  }

  // 3. Dynamic Brands
  let brandRoutes: MetadataRoute.Sitemap = [];
  try {
    const brands = await prisma.brand.findMany({
      where: { active: true },
      select: { slug: true },
    });
    brandRoutes = brands.map((b) => ({
      url: `${baseUrl}/brands/${b.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (err) {
    console.error('Error generating brand sitemap entries:', err);
  }

  return [...staticRoutes, ...productRoutes, ...brandRoutes];
}
