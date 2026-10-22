import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import HeroBanner from '@/components/home/HeroBanner';
import BrandBar from '@/components/home/BrandBar';
import BudgetSection from '@/components/home/BudgetSection';
import UseCaseSection from '@/components/home/UseCaseSection';
import TrustSection from '@/components/home/TrustSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FAQSection from '@/components/home/FAQSection';
import ProductCard from '@/components/ui/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import HomeVideoReviews from '@/components/home/HomeVideoReviews';
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { ensureFirestoreProductsSynced } from '@/lib/firestore-sync';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  await ensureFirestoreProductsSynced();

  // Fetch real database records
  const [brands, bestSellers, dealsOfDay, newArrivals, faqs, banners, videoReviews] = await Promise.all([
    prisma.brand.findMany({
      where: { active: true },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.product.findMany({
      where: { active: true, bestSeller: true },
      include: { brand: true, images: true },
      take: 6,
    }),
    prisma.product.findMany({
      where: { active: true, isDealOfTheDay: true },
      include: { brand: true, images: true },
      take: 3,
    }),
    prisma.product.findMany({
      where: { active: true, isNewArrival: true },
      include: { brand: true, images: true },
      take: 6,
    }),
    prisma.productFAQ.findMany({
      where: { active: true, productId: null },
      orderBy: { displayOrder: 'asc' },
      take: 5,
    }),
    prisma.banner.findMany({
      where: { active: true },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.videoReview.findMany({
      where: { featured: true },
      orderBy: { displayOrder: 'asc' },
      take: 6,
    }),
  ]);

  return (
    <div className="space-y-0 overflow-hidden w-full max-w-full">
      {/* 1. Hero Carousel Slider controlled from Admin */}
      <HeroBanner banners={banners} />

      {/* 2. Shop by Brand with Marquee */}
      <ScrollReveal direction="up" delay={0.05}>
        <BrandBar brands={brands} />
      </ScrollReveal>

      {/* 3. Limited-Time Deals of the Day */}
      {dealsOfDay.length > 0 && (
        <ScrollReveal direction="up" delay={0.1}>
          <section className="py-16 bg-white border-b border-[#E8E8E8]">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold mb-2">
                    <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    <span>Limited Time Lab Picks</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                    Deals of the Day
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Handpicked enterprise laptops with our deepest discounts and free express dispatch.
                  </p>
                </div>

                <Link
                  href="/deals"
                  className="self-start sm:self-auto text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1.5 transition-colors"
                >
                  <span>View All Daily Deals</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dealsOfDay.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* 4. Shop by Budget */}
      <ScrollReveal direction="up" delay={0.1}>
        <BudgetSection />
      </ScrollReveal>

      {/* 5. Best-Selling Laptops */}
      <ScrollReveal direction="up" delay={0.1}>
        <section className="py-16 bg-white border-b border-[#E8E8E8]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>Customer Favorites</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  Best-Selling Refurbished Laptops
                </h2>
              </div>

              <Link
                href="/shop"
                className="text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 transition-colors"
              >
                <span>Explore All Laptops</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 6. Shop by Use Case */}
      <ScrollReveal direction="up" delay={0.1}>
        <UseCaseSection />
      </ScrollReveal>

      {/* 7. New Arrivals */}
      {newArrivals.length > 0 && (
        <ScrollReveal direction="up" delay={0.1}>
          <section className="py-16 bg-white border-b border-[#E8E8E8]">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fresh Lab Certification</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-0.5">
                    Just In — New Arrivals
                  </h2>
                </div>

                <Link
                  href="/shop?sort=newest"
                  className="text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 transition-colors"
                >
                  <span>See All New Drops</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {newArrivals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* 8. Trust: 45-Point Inspection & 1-Year Warranty */}
      <ScrollReveal direction="up" delay={0.1}>
        <TrustSection />
      </ScrollReveal>

      {/* 9. Customer Video Reviews & Unboxings */}
      <ScrollReveal direction="up" delay={0.1}>
        <HomeVideoReviews reviews={videoReviews} />
      </ScrollReveal>

      {/* 10. Verified Reviews */}
      <ScrollReveal direction="up" delay={0.1}>
        <TestimonialsSection />
      </ScrollReveal>

      {/* 11. FAQ Accordion */}
      <ScrollReveal direction="up" delay={0.1}>
        <FAQSection faqs={faqs} />
      </ScrollReveal>
    </div>
  );
}
