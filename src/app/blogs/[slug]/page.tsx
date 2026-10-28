import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ArrowLeft, Calendar, User, BookOpen, Share2, ChevronRight, ShieldCheck, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 60;

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: 'Article Not Found | Lappy Square' };
  return {
    title: `${post.title} — Lappy Square Guides`,
    description: post.excerpt,
  };
}

export default async function SingleBlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-[#F8FAFC] text-slate-800 min-h-screen pb-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <nav className="text-xs text-slate-500 flex items-center gap-2 font-medium">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/blogs" className="hover:text-slate-900 transition-colors">Guides</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-blue-700 font-semibold truncate max-w-xs">{post.title}</span>
          </nav>

          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Articles</span>
          </Link>
        </div>

        {/* Content Box */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-12 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <span className="bg-blue-700 text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-xs text-slate-500 font-medium">Diagnostic Lab Report</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-500 border-b border-slate-100 pb-6">
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <User className="w-4 h-4 text-blue-600" />
              {post.author}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              {new Date(post.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </span>
          </div>

          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 850px"
              className="object-cover"
              priority
            />
          </div>

          {/* Article Body */}
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-4 pt-4 font-normal">
            {post.content}
          </div>

          {/* Bottom CTA Box */}
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Ready to buy certified hardware?</span>
              </h4>
              <p className="text-xs text-slate-500">
                Explore laptops tested across our 45-point diagnostic checklist with genuine OEM accessories.
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-5 py-3 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex-shrink-0"
            >
              <span>Explore Certified Stock</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </article>
    </div>
  );
}

