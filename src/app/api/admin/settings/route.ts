import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    let setting = await prisma.websiteSetting.findFirst();
    if (!setting) {
      setting = await prisma.websiteSetting.create({
        data: {},
      });
    }
    return NextResponse.json({ success: true, setting });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const body = await req.json();

    let setting = await prisma.websiteSetting.findFirst();
    if (!setting) {
      setting = await prisma.websiteSetting.create({
        data: body,
      });
    } else {
      setting = await prisma.websiteSetting.update({
        where: { id: setting.id },
        data: {
          siteName: body.siteName,
          tagline: body.tagline,
          brandAccent: body.brandAccent,
          supportEmail: body.supportEmail,
          supportPhone: body.supportPhone,
          supportAddress: body.supportAddress,
          announcementText: body.announcementText,
          announcementActive: Boolean(body.announcementActive),
          freeShippingThreshold: Number(body.freeShippingThreshold) || 0,
          defaultShippingCost: Number(body.defaultShippingCost) || 0,
          taxPercentage: Number(body.taxPercentage) || 0,
          returnWindowDays: Number(body.returnWindowDays) || 7,
          warrantyText: body.warrantyText,
          metaTitle: body.metaTitle,
          metaDescription: body.metaDescription,
          instagramUrl: body.instagramUrl,
          facebookUrl: body.facebookUrl,
          youtubeUrl: body.youtubeUrl,
          linkedinUrl: body.linkedinUrl,
          twitterUrl: body.twitterUrl,
          whatsappNumber: body.whatsappNumber,
          googleSiteVerification: body.googleSiteVerification || '',
          googleAnalyticsId: body.googleAnalyticsId || '',
        },
      });
    }

    // Record audit log
    await prisma.auditLog.create({
      data: {
        adminId: user.userId,
        action: 'UPDATE_WEBSITE_SETTINGS',
        entity: 'WebsiteSetting',
        entityId: setting.id,
        details: 'Updated global site settings and announcement banner',
      },
    });

    return NextResponse.json({ success: true, setting });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
