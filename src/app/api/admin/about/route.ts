import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { DEFAULT_ABOUT_CONTENT } from '@/lib/about-content';

export const dynamic = 'force-dynamic';

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
