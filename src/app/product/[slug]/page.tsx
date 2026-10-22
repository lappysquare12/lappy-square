import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductDetailClient from './ProductDetailClient';
import type { Metadata } from 'next';
import { ensureFirestoreProductsSynced } from '@/lib/firestore-sync';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      select: { slug: true },
    });
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}


export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { brand: true, images: true },
  });

  if (!product) {
    return { title: 'Product Not Found | Lappy Square' };
  }

  const imageUrl = product.images[0]?.url || '/og-image.jpg';

  return {
    title: `${product.title} — Lappy Square Refurbished`,
    description: `Buy certified refurbished ${product.title} with ${product.ramGb}GB RAM, ${product.storageGb}GB ${product.storageType}, 45-point testing, and 1-year warranty.`,
    openGraph: {
      title: `${product.title} | Lappy Square`,
      description: `Certified Refurbished • ₹${product.price.toLocaleString('en-IN')} (Original: ₹${product.originalPrice.toLocaleString('en-IN')})`,
      images: [{ url: imageUrl }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  await ensureFirestoreProductsSynced();
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { displayOrder: 'asc' } },
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
      },
      faqs: {
        where: { active: true },
        orderBy: { displayOrder: 'asc' },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // JSON-LD Structured Data for Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images.map((i) => i.url),
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand.name,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      itemCondition: 'https://schema.org/RefurbishedCondition',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Lappy Square',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: Math.max(1, product.reviewCount),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}
