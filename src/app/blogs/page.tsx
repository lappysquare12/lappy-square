import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { BookOpen, ArrowRight, Calendar, User, Sparkles, ChevronRight, Clock, Award } from 'lucide-react';

export const revalidate = 60;

export default async function BlogsPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="bg-[#F8FAFC] text-slate-800 min-h-screen pb-16">
      {/* Header Banner */}
      <section className="relative pt-8 pb-8 bg-white border-b border-slate-200/90 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <nav className="text-xs text-slate-500 mb-4 flex items-center gap-2 font-medium">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-blue-700 font-semibold">Tech Guides & Hardware Reviews</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>Certified Diagnostic Lab Publications</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              Refurbished Tech Insights & Buyer Guides
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              Authentic articles written by hardware diagnostic engineers covering processor benchmark comparisons, battery health optimization, and buying guides.
            </p>
          </div>

        </div>
      </section>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blogs/${post.slug}`}
              className="group bg-white border border-slate-200/90 hover:border-blue-600/50 rounded-3xl overflow-hidden shadow-xs transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1.5"
            >
              <div>
                <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-blue-700 text-white text-[10px] font-bold px-3 py-1 rounded-lg shadow-sm uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      {new Date(post.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      {post.author}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:text-blue-800">
                <span>Read Full Engineering Guide</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
