import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ success: true, banners });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error fetching banners';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);

    const body = await req.json();
    const { title, subtitle, imageUrl, linkUrl, badgeText, ctaText, sectionKey, active, displayOrder } = body;

    if (!title?.trim() || !imageUrl?.trim()) {
      return NextResponse.json(
        { error: 'Banner title and image URL are required.' },
        { status: 400 }
      );
    }

    const banner = await prisma.banner.create({
      data: {
        title: title.trim(),
        subtitle: subtitle?.trim() || null,
        imageUrl: imageUrl.trim(),
        linkUrl: linkUrl?.trim() || '/shop',
        badgeText: badgeText?.trim() || null,
        ctaText: ctaText?.trim() || 'Get Today\'s Best Price',
        sectionKey: sectionKey?.trim() || 'HERO',
        active: active !== undefined ? Boolean(active) : true,
        displayOrder: Number(displayOrder) || 0,
      },
    });

    revalidatePath('/');
    revalidatePath('/admin/banners');

    return NextResponse.json({ success: true, banner }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error creating banner';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);

    const body = await req.json();
    const { id, title, subtitle, imageUrl, linkUrl, badgeText, ctaText, sectionKey, active, displayOrder } = body;

    if (!id) {
      return NextResponse.json({ error: 'Banner ID is required.' }, { status: 400 });
    }

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(subtitle !== undefined && { subtitle: subtitle.trim() || null }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl.trim() }),
        ...(linkUrl !== undefined && { linkUrl: linkUrl.trim() }),
        ...(badgeText !== undefined && { badgeText: badgeText?.trim() || null }),
        ...(ctaText !== undefined && { ctaText: ctaText.trim() }),
        ...(sectionKey !== undefined && { sectionKey: sectionKey.trim() }),
        ...(active !== undefined && { active: Boolean(active) }),
        ...(displayOrder !== undefined && { displayOrder: Number(displayOrder) }),
      },
    });

    revalidatePath('/');
    revalidatePath('/admin/banners');

    return NextResponse.json({ success: true, banner });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error updating banner';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Banner ID is required.' }, { status: 400 });
    }

    await prisma.banner.delete({
      where: { id },
    });

    revalidatePath('/');
    revalidatePath('/admin/banners');

    return NextResponse.json({ success: true, message: 'Banner deleted successfully' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error deleting banner';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
