import React from 'react';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import BlogManagerClient from './BlogManagerClient';

export const revalidate = 0;

export default async function AdminBlogsPage() {
  await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);

  const blogs = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Blog & Editorial CMS</h1>
        <p className="text-sm text-slate-500 mt-1">
          Create, edit, publish, and manage technology guides and refurbished laptop advice.
        </p>
      </div>

      <BlogManagerClient initialBlogs={blogs} />
    </div>
  );
}
