import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
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
