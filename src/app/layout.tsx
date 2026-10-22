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
  title: 'Lappy Square — Certified Refurbished & Second-Hand Laptops in India',
  description:
    'Shop certified second-hand, open-box and refurbished laptops from Apple, Dell, HP, Lenovo & ASUS. 45-point quality check, up to 1-year warranty, in-store live testing & pickup.',
  keywords: [
    'refurbished laptops',
    'second hand laptops',
    'used macbook pro india',
    'refurbished dell latitude',
    'cheap laptops for coding',
    'buy refurbished laptop delhi',
    'lappy square',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Lappy Square — Certified Refurbished Laptops',
    description: 'Up to 70% off retail prices on Apple MacBooks, ThinkPads, and Dell laptops with 1-year warranty.',
    type: 'website',
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
};

import Script from 'next/script';
import prisma from '@/lib/prisma';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let gsc = '';
  let gaId = '';

  try {
    const setting = await prisma.websiteSetting.findFirst({
      select: { googleSiteVerification: true, googleAnalyticsId: true },
    });
    gsc = setting?.googleSiteVerification || process.env.GOOGLE_SITE_VERIFICATION || '';
    gaId = setting?.googleAnalyticsId || process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '';
  } catch (err) {
    // fallback if db during build
  }

  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png?v=3" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon.png?v=3" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png?v=3" />
        <link rel="shortcut icon" href="/favicon.ico?v=3" />
        {gsc && <meta name="google-site-verification" content={gsc} />}
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
