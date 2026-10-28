import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const setting = await prisma.websiteSetting.findFirst({
      select: {
        siteName: true,
        tagline: true,
        supportEmail: true,
        supportPhone: true,
        supportAddress: true,
        announcementText: true,
        announcementActive: true,
        warrantyText: true,
        instagramUrl: true,
        facebookUrl: true,
        youtubeUrl: true,
        linkedinUrl: true,
        twitterUrl: true,
        whatsappNumber: true,
      },
    });

    return NextResponse.json({
      success: true,
      setting: setting || {
        siteName: 'Lappy Square',
        tagline: 'Certified Pre-Owned & Refurbished Laptops',
        supportEmail: 'lappysquare@gmail.com',
        supportPhone: '+91 93769 88788',
        supportAddress: 'Paris Tower, Near Vijay Path Chauraha, Madhyam Marg, Mansarovar, Jaipur, Rajasthan 302020',
        announcementText: 'Special Offer: Free Pan-India Insured Express Shipping & 1-Year Comprehensive Warranty on all Laptops!',
        announcementActive: true,
        warrantyText: '1-Year Certified Warranty with 45-point testing report included.',
        instagramUrl: 'https://www.instagram.com/lappy_square/',
        facebookUrl: 'https://www.facebook.com/61593042681135/',
        youtubeUrl: 'https://youtube.com/@lappysquare',
        linkedinUrl: 'https://linkedin.com/company/lappysquare',
        twitterUrl: 'https://twitter.com/lappysquare',
        whatsappNumber: '+91 93769 88788',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
