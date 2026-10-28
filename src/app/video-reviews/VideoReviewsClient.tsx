'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, X, Star, CheckCircle2, Video, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';

interface VideoReviewItem {
  id: string;
  title: string;
  customerName: string;
  videoUrl: string;
  thumbnailUrl?: string | null;
  laptopModel?: string | null;
  rating: number;
}

const DEFAULT_VIDEO_REVIEWS: VideoReviewItem[] = [
  {
    id: 'vid-1',
    title: 'Customer Unboxing & First Impressions — MacBook Pro M1',
    customerName: 'Aman Verma (Delhi)',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    laptopModel: 'Apple MacBook Pro M1 (16GB RAM / 512GB SSD)',
    rating: 5,
  },
  {
    id: 'vid-2',
    title: '1 Month Honest Coding Review — Lenovo ThinkPad T14',
    customerName: 'Priya Sundaram (Bengaluru)',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    laptopModel: 'Lenovo ThinkPad T14 Gen 2 (Core i7 / 16GB)',
    rating: 5,
  },
  {
    id: 'vid-3',
    title: 'Store Experience & 45-Point Testing Report Check',
    customerName: 'Vikram Singh (Jaipur)',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
    laptopModel: 'Dell Latitude 7420 Ultrabook',
    rating: 5,
  },
  {
    id: 'vid-4',
    title: 'Heavy Gaming & Thermal Test on Refurbished ASUS ROG',
    customerName: 'Kunal Patel (Ahmedabad)',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    laptopModel: 'ASUS ROG Strix Gaming Laptop (RTX 3060)',
    rating: 5,
  },
];

export default function VideoReviewsClient({ initialReviews }: { initialReviews: VideoReviewItem[] }) {
  const reviews = initialReviews.length > 0 ? initialReviews : DEFAULT_VIDEO_REVIEWS;
  const [activeVideo, setActiveVideo] = useState<VideoReviewItem | null>(null);

  return (
    <div className="bg-[#FAFBFD] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb & Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-blue-700">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Video Reviews</span>
          </div>

          <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="max-w-3xl space-y-3 relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide">
                <Video className="w-3.5 h-3.5" />
                <span>Real Customer Stories</span>
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Watch & Discover: Customer Video Reviews
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                See real unboxing clips, hardware diagnostics inspections, and honest long-term reviews from happy Lappy Square customers across India.
              </p>
            </div>

            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl border border-[#E8E8E8] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Video Thumbnail with Play Button */}
                <div
                  onClick={() => setActiveVideo(rev)}
                  className="relative aspect-[16/9] bg-slate-900 cursor-pointer overflow-hidden"
                >
                  <Image
                    src={rev.thumbnailUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'}
                    alt={rev.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center transition-colors group-hover:bg-black/20">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                      <Play className="w-7 h-7 fill-slate-950 ml-1" />
                    </div>
                  </div>

                  {rev.laptopModel && (
                    <span className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-lg">
                      {rev.laptopModel}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 sm:p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{rev.customerName}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                    {rev.title}
                  </h3>
                </div>
              </div>

              {/* Action bar */}
              <div className="p-4 sm:p-6 pt-0 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveVideo(rev)}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center justify-center sm:justify-start gap-1.5 py-2 sm:py-0"
                >
                  <Play className="w-3.5 h-3.5 fill-blue-700 text-blue-700" />
                  <span>Watch Video Review</span>
                </button>

                <a
                  href="https://wa.me/919376988788?text=Hello%20Lappy%20Square%20Team!%20I%20saw%20your%20customer%20video%20reviews%20and%20want%20to%20know%20more%20about%20your%20available%20laptops."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-3.5 py-2.5 sm:py-1.5 rounded-xl transition-all shadow-xs"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Ask Today&apos;s Best Price</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Video Player Modal */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl">
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors"
                aria-label="Close video player"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative aspect-video w-full bg-black">
                {activeVideo.videoUrl.includes('youtube') || activeVideo.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={activeVideo.videoUrl.replace('watch?v=', 'embed/')}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <video
                    src={activeVideo.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              <div className="p-5 bg-slate-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white">{activeVideo.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Reviewed by {activeVideo.customerName} • {activeVideo.laptopModel}
                  </p>
                </div>
                <a
                  href="https://wa.me/919376988788?text=Hello%20Lappy%20Square%20Team!%20I%20am%20interested%20in%20the%20laptop%20model%20shown%20in%20your%20video%20review."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl flex items-center gap-2 self-start sm:self-auto"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Get Today&apos;s Best Price</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
