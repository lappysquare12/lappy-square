import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const baseUrl = 'https://lappysquare.com';
  const prods = await prisma.product.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } });
  const brands = await prisma.brand.findMany({ where: { active: true }, select: { slug: true, createdAt: true } });
  const blogs = await prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } });

  const coreRoutes = [
    '', '/shop', '/deals', '/brands', '/budget', '/blogs',
    '/collection/macbook', '/collection/windows', '/collection/gaming',
    '/collection/student', '/collection/development',
    '/budget/under-20000', '/budget/under-30000', '/budget/under-50000', '/budget/premium',
    '/use/coding', '/use/business', '/use/students', '/use/gaming',
    '/about', '/contact', '/warranty', '/sell-your-laptop'
  ];

  const now = new Date().toISOString();
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  coreRoutes.forEach(r => {
    xml += `  <url>\n    <loc>${baseUrl}${r}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>${r === '' ? '1.0' : '0.9'}</priority>\n  </url>\n`;
  });

  prods.forEach(p => {
    xml += `  <url>\n    <loc>${baseUrl}/product/${p.slug}</loc>\n    <lastmod>${p.updatedAt ? new Date(p.updatedAt).toISOString() : now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
  });

  brands.forEach(b => {
    xml += `  <url>\n    <loc>${baseUrl}/brands/${b.slug}</loc>\n    <lastmod>${b.createdAt ? new Date(b.createdAt).toISOString() : now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  blogs.forEach(b => {
    xml += `  <url>\n    <loc>${baseUrl}/blogs/${b.slug}</loc>\n    <lastmod>${b.updatedAt ? new Date(b.updatedAt).toISOString() : now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  xml += '</urlset>';

  fs.writeFileSync('public/sitemap.xml', xml, 'utf8');
  console.log('✓ Successfully created public/sitemap.xml with', coreRoutes.length + prods.length + brands.length + blogs.length, 'URLs.');

  const robots = 'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nDisallow: /account/\n\nSitemap: https://lappysquare.com/sitemap.xml\n';
  fs.writeFileSync('public/robots.txt', robots, 'utf8');
  console.log('✓ Successfully created public/robots.txt');

  await prisma.$disconnect();
}

main().catch(console.error);
