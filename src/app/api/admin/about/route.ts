import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export const DEFAULT_ABOUT_CONTENT = {
  heroBadge: 'Our Heritage & Mission',
  heroTitle: 'Democratizing Flagship Laptops Through Certified Refurbishing',
  heroSubtitle: 'Founded with a mission to make enterprise-grade computing accessible to every student, software engineer, creator, and growing business in India. At Lappy Square, we bridge the gap between premium computing and sensible budgets.',
  founderName: 'Pankaj Jain',
  founderRole: 'Founder & CEO',
  founderImage: '/images/pankaj-jain-founder.jpg',
  founderQuote: 'Quality is not an accident; it is always the result of intelligent hardware diagnostics, certified engineering standards, and sincere customer care.',
  founderBio1: 'With over a decade of hands-on expertise in the IT hardware lifecycle, Pankaj Jain established Lappy Square in Jaipur to solve a fundamental dilemma: Why should students, programmers, and small businesses settle for low-end plastic laptops when enterprise-grade ThinkPads, MacBooks, and Latitudes could be sustainably revitalized?',
  founderBio2: 'Under his leadership, Lappy Square has evolved into Jaipur’s premier destination for certified pre-owned computing — transitioning the second-hand market into a laboratory-grade, transparent, and customer-first retail experience.',
  stats: [
    { label: 'Refurbished Laptops Delivered', value: '12,500+', desc: 'Across 19,000+ PIN codes in India' },
    { label: 'Hardware Diagnostic Checkpoints', value: '45 Points', desc: 'Tested by certified hardware engineers' },
    { label: 'Customer Satisfaction Score', value: '99.4%', desc: 'Verified 5-star Google & website ratings' },
    { label: 'E-Waste Prevented in Landfills', value: '18+ Tons', desc: 'Enterprise aluminum & silicon revived' },
  ],
  storeAddress: 'Paris Tower, Near Vijay Path, Ward 27, Chauraha, Mansarovar, Jaipur, Rajasthan 302020',
  storePhone: '+91 93769 88788',
  storeEmail: 'lappysquare@gmail.com',
};

export async function GET() {
  try {
    const setting = (await prisma.websiteSetting.findFirst()) as any;

    if (setting?.aboutContent) {
      try {
        const parsed = JSON.parse(setting.aboutContent);
        return NextResponse.json({
          success: true,
          content: { ...DEFAULT_ABOUT_CONTENT, ...parsed },
        });
      } catch {
        // fallback
      }
    }

    return NextResponse.json({
      success: true,
      content: DEFAULT_ABOUT_CONTENT,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);
    const body = await req.json();

    const jsonString = JSON.stringify(body);

    let setting = (await prisma.websiteSetting.findFirst()) as any;
    if (!setting) {
      setting = await (prisma.websiteSetting as any).create({
        data: {
          aboutContent: jsonString,
        },
      });
    } else {
      setting = await (prisma.websiteSetting as any).update({
        where: { id: setting.id },
        data: {
          aboutContent: jsonString,
        },
      });
    }

    // Record audit log
    try {
      await prisma.auditLog.create({
        data: {
          adminId: user.userId,
          action: 'UPDATE_ABOUT_PAGE_CMS',
          entity: 'WebsiteSetting',
          entityId: setting.id,
          details: 'Updated About Us page text, founder profile, and stats',
        },
      });
    } catch {
      // ignore audit log failure
    }

    return NextResponse.json({ success: true, content: body });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
