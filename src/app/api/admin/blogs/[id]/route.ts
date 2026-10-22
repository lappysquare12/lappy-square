import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);
    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug ? body.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined,
        excerpt: body.excerpt,
        content: body.content,
        coverImage: body.coverImage,
        author: body.author,
        category: body.category,
        published: body.published !== undefined ? Boolean(body.published) : undefined,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: user.userId,
        action: 'UPDATE_BLOG_POST',
        entity: 'BlogPost',
        entityId: id,
        details: `Updated blog post "${updated.title}"`,
      },
    });

    return NextResponse.json({ success: true, blog: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const { id } = await params;

    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await prisma.blogPost.deleteMany({ where: { id } });

    await prisma.auditLog.create({
      data: {
        adminId: user.userId,
        action: 'DELETE_BLOG_POST',
        entity: 'BlogPost',
        entityId: id,
        details: `Deleted blog post "${post.title}"`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
