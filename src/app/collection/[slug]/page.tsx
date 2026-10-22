import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ui/ProductCard';
import { Laptop, Sparkles, Filter, ArrowLeft, Gamepad2, GraduationCap, Code2 } from 'lucide-react';
import { AppleLogo, WindowsLogo } from '@/components/ui/BrandLogos';
import type { Metadata } from 'next';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const isApple = slug === 'macbook' || slug === 'apple';
  const isWindows = slug === 'windows';

  const title = isApple
    ? 'Certified Second-Hand & Open-Box Apple MacBooks | Lappy Square'
    : isWindows
    ? 'Certified Refurbished Windows Laptops — Dell, HP, Lenovo | Lappy Square'
    : `${slug.toUpperCase()} Laptops Collection | Lappy Square`;

  return {
    title,
    description: `Shop certified 45-point tested ${isApple ? 'Apple MacBooks' : isWindows ? 'Windows laptops' : slug} with 1-year warranty and in-store live testing.`,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;

  let whereClause: any = { active: true };
  let title = 'Laptop Collection';
  let subtitle = 'Explore certified refurbished and open-box laptops with 1-year warranty.';

  if (slug === 'macbook' || slug === 'apple') {
    whereClause.brand = { slug: 'apple' };
    title = 'Apple MacBooks (Certified Open-Box & Refurbished)';
    subtitle = 'Shop certified MacBook Pro and MacBook Air with M1/M2/M3 & Intel chips. 45-point quality checked with genuine chargers.';
  } else if (slug === 'windows') {
    whereClause.brand = { slug: { not: 'apple' } };
    title = 'Enterprise Windows Laptops';
    subtitle = 'Reliable workhorses from Dell Latitude, Lenovo ThinkPad, HP EliteBook, and ASUS. Ultra-durable performance.';
  } else if (slug === 'gaming') {
    whereClause.OR = [
      { useCase: { contains: 'gaming' } },
      { description: { contains: 'RTX' } },
      { description: { contains: 'GTX' } },
      { graphicsCard: { not: null } },
    ];
    title = 'Gaming & High-Performance Laptops';
    subtitle = 'Equipped with dedicated NVIDIA graphics, high-refresh displays, and multi-core processors.';
  } else if (slug === 'student') {
    whereClause.OR = [
      { useCase: { contains: 'student' } },
      { useCase: { contains: 'business' } },
      { price: { lte: 35000 } },
    ];
    title = 'Best Laptops for Students & Beginners';
    subtitle = 'Budget-friendly, long battery backup laptops ideal for online classes, assignments, and coding.';
  } else if (slug === 'development' || slug === 'programming') {
    whereClause.OR = [
      { ramGb: { gte: 16 } },
      { useCase: { contains: 'programming' } },
    ];
    title = 'Best Laptops for Software Coding & Development';
    subtitle = 'Fast multi-core CPUs, 16GB+ RAM, and high-speed NVMe SSDs built for Docker, IDEs, and heavy compilation.';
  } else {
    // Check if it's a budget slug e.g. under-20k
    if (slug === 'under-20k') {
      whereClause.price = { lte: 20000 };
      title = 'Laptops Under ₹20,000';
      subtitle = 'Affordable certified laptops with 1-year warranty and live store testing.';
    } else if (slug === '20k-40k') {
      whereClause.price = { gte: 20000, lte: 40000 };
      title = 'Laptops Between ₹20,000 - ₹40,000';
      subtitle = 'The sweet-spot value range with Core i5/i7, 8GB-16GB RAM, and SSDs.';
    } else if (slug === '40k-70k') {
      whereClause.price = { gte: 40000, lte: 70000 };
      title = 'Laptops Between ₹40,000 - ₹70,000';
      subtitle = 'Premium enterprise and ultrabook models with flagship build quality.';
    } else if (slug === 'above-70k') {
      whereClause.price = { gte: 70000 };
      title = 'Flagship Laptops Above ₹70,000';
      subtitle = 'Top-tier MacBooks, workstations, and high-end gaming laptops.';
    }
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    include: { brand: true, images: true },
    orderBy: { price: 'asc' },
  });

  return (
    <div className="bg-[#FAFBFD] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb & Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-blue-700">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-blue-700">Collection</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold capitalize">{slug.replace('-', ' ')}</span>
          </div>

          <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="max-w-3xl space-y-2 relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Verified Stock • 1-Year Warranty</span>
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Link
            href="/collection/macbook"
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              slug === 'macbook' || slug === 'apple'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <AppleLogo className={`w-3.5 h-3.5 ${slug === 'macbook' || slug === 'apple' ? 'text-white' : 'text-slate-900'}`} />
            <span>Apple MacBooks</span>
          </Link>
          <Link
            href="/collection/windows"
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              slug === 'windows'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <WindowsLogo className={`w-3.5 h-3.5 ${slug === 'windows' ? 'text-white' : 'text-blue-600'}`} />
            <span>Windows Laptops</span>
          </Link>
          <Link
            href="/collection/gaming"
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              slug === 'gaming'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Gaming Laptops</span>
          </Link>
          <Link
            href="/collection/student"
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              slug === 'student'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            <span>Student Laptops</span>
          </Link>
          <Link
            href="/collection/development"
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              slug === 'development'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Coding & Dev</span>
          </Link>
          <Link
            href="/shop"
            className="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap bg-white border border-slate-200 text-blue-700 hover:bg-blue-50"
          >
            View All →
          </Link>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
            <Laptop className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No products found in this collection right now</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              New lab-tested units are added daily. Browse all available laptops or chat directly on WhatsApp!
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/shop"
                className="px-5 py-2.5 bg-blue-700 text-white text-xs font-bold rounded-xl"
              >
                Browse All Laptops
              </Link>
              <a
                href="https://wa.me/919376988788?text=Hello%20Lappy%20Square%20Team!%20Do%20you%20have%20any%20laptops%20available%20in%20this%20category?"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl"
              >
                Inquire on WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
