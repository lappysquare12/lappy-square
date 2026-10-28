import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  let baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://lappysquare.com');

  if (baseUrl.includes('localhost') && process.env.NODE_ENV === 'production') {
    baseUrl = 'https://lappysquare.com';
  }
  baseUrl = baseUrl.replace(/\/+$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/account/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
