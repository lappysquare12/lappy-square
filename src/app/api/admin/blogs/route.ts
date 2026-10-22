import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);
    const body = await req.json();

    const { title, slug, excerpt, content, coverImage, author, category, published, metaTitle, metaDescription } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 });
    }

    const blog = await prisma.blogPost.create({
      data: {
        title,
        slug: slug.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        excerpt: excerpt || '',
        content,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
        author: author || 'Lappy Square Editorial',
        category: category || 'Buying Guide',
        published: published !== undefined ? Boolean(published) : true,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: user.userId,
        action: 'CREATE_BLOG_POST',
        entity: 'BlogPost',
        entityId: blog.id,
        details: `Created blog post "${title}"`,
      },
    });

    return NextResponse.json({ success: true, blog });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
