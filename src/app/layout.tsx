import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { CompareProvider } from '@/context/CompareContext';
import { WishlistProvider } from '@/context/WishlistContext';
import SiteLayoutWrapper from '@/components/layout/SiteLayoutWrapper';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-poppins',
  fallback: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://lappysquare.com'),
  title: {
    default: 'Lappy Square — Certified Refurbished & Second-Hand Laptops in India',
    template: '%s | Lappy Square',
  },
  description:
    'Shop 100% certified second-hand, open-box and refurbished laptops in India from Lappy Square. 45-point lab inspection, 1-Year Warranty, genuine chargers, free express dispatch across India. Apple MacBook, Lenovo ThinkPad, Dell Latitude & HP EliteBook.',
  keywords: [
    'Lappy Square',
    'lappysquare',
    'lappysquare.com',
    'lappy square jaipur',
    'lappy square refurbished laptops',
    'refurbished laptops india',
    'second hand laptops',
    'used macbook pro india',
    'refurbished dell latitude',
    'refurbished thinkpad india',
    'cheap laptops for coding',
    'buy refurbished laptop jaipur',
    'certified refurbished laptops',
    'best refurbished laptop site india',
  ],
  alternates: {
    canonical: 'https://lappysquare.com',
  },
  openGraph: {
    title: 'Lappy Square — Certified Refurbished & Second-Hand Laptops in India',
    description:
      'Up to 70% off retail prices on Apple MacBooks, ThinkPads, and Dell laptops with 45-point testing report, genuine accessories and 1-Year Warranty.',
    url: 'https://lappysquare.com',
    siteName: 'Lappy Square',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Lappy Square Certified Refurbished Laptops',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lappy Square — Certified Refurbished Laptops India',
    description:
      'Buy 45-point inspected second hand and refurbished laptops with 1-Year Warranty & Free All-India Delivery.',
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&h=630&q=80'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.png?v=3', type: 'image/png' },
      { url: '/icon.png?v=3', type: 'image/png' },
      { url: '/favicon.ico?v=3' },
    ],
    shortcut: '/favicon.png?v=3',
    apple: '/apple-icon.png?v=3',
  },
  verification: {
    google: 'Ns81kohTB9WgHYt48KBOZ68FqyfffHgwnwaaRnmGGE4',
  },
};

import Script from 'next/script';
import prisma from '@/lib/prisma';

const GOOGLE_VERIFICATION_TOKEN = 'Ns81kohTB9WgHYt48KBOZ68FqyfffHgwnwaaRnmGGE4';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let gsc = GOOGLE_VERIFICATION_TOKEN;
  let gaId = '';

  try {
    const setting = await prisma.websiteSetting.findFirst({
      select: { googleSiteVerification: true, googleAnalyticsId: true },
    });
    gsc = setting?.googleSiteVerification || process.env.GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || GOOGLE_VERIFICATION_TOKEN;
    gaId = setting?.googleAnalyticsId || process.env.NEXT_PUBLIC_GA_ID || process.env.GOOGLE_ANALYTICS_ID || process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '';
  } catch (err) {
    gsc = process.env.GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || GOOGLE_VERIFICATION_TOKEN;
    gaId = process.env.NEXT_PUBLIC_GA_ID || process.env.GOOGLE_ANALYTICS_ID || process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '';
  }

  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png?v=3" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon.png?v=3" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png?v=3" />
        <link rel="shortcut icon" href="/favicon.ico?v=3" />
        <meta name="google-site-verification" content={gsc} />
        {/* Schema.org JSON-LD Structured Data for Google Ranking */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://lappysquare.com/#organization',
                  name: 'Lappy Square',
                  alternateName: 'LappySquare',
                  url: 'https://lappysquare.com',
                  logo: 'https://lappysquare.com/icon.png',
                  contactPoint: {
                    '@type': 'ContactPoint',
                    telephone: '+91-9376988788',
                    contactType: 'customer service',
                    areaServed: 'IN',
                    availableLanguage: ['English', 'Hindi'],
                  },
                  sameAs: [
                    'https://www.instagram.com/lappysquare',
                    'https://wa.me/919376988788',
                  ],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://lappysquare.com/#website',
                  url: 'https://lappysquare.com',
                  name: 'Lappy Square',
                  description: 'Certified Refurbished & Second Hand Laptops in India',
                  publisher: {
                    '@id': 'https://lappysquare.com/#organization',
                  },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://lappysquare.com/shop?q={search_term_string}',
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'Store',
                  '@id': 'https://lappysquare.com/#store',
                  name: 'Lappy Square — Certified Refurbished Laptops',
                  image: 'https://lappysquare.com/icon.png',
                  telephone: '+91-9376988788',
                  priceRange: '₹15,000 - ₹1,50,000',
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Jaipur',
                    addressRegion: 'Rajasthan',
                    addressCountry: 'IN',
                  },
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: '26.9124',
                    longitude: '75.7873',
                  },
                  openingHoursSpecification: {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                    opens: '10:00',
                    closes: '20:00',
                  },
                },
              ],
            }),
          }}
        />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-blue-700 selection:text-white"
        suppressHydrationWarning
      >
        <CartProvider>
          <CompareProvider>
            <WishlistProvider>
              <SiteLayoutWrapper>{children}</SiteLayoutWrapper>
            </WishlistProvider>
          </CompareProvider>
        </CartProvider>
      </body>
    </html>
  );
}
