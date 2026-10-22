'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import Footer from './Footer';
import WhatsAppFloatingButton from '@/components/ui/WhatsAppFloatingButton';
import ScrollProgressBar from '@/components/ui/ScrollProgressBar';
import BrandPreloader from '@/components/ui/BrandPreloader';

export default function SiteLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // Immediately scroll to top when opening any new page
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-clip">
      <BrandPreloader />
      <ScrollProgressBar />
      <AnnouncementBar />
      <Header />
      <main className="flex-1 w-full max-w-full overflow-x-clip">{children}</main>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}

