'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, Star, Video, ArrowRight, X, ExternalLink } from 'lucide-react';

interface VideoReviewItem {
  id: string;
  title: string;
  customerName: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  laptopModel: string | null;
  rating: number;
}

export default function HomeVideoReviews({
  reviews,
}: {
  reviews: VideoReviewItem[];
}) {
  const [selectedVideo, setSelectedVideo] = useState<VideoReviewItem | null>(null);

  // Fallback items if none are yet in the database
  const displayReviews: VideoReviewItem[] = reviews.length > 0 ? reviews : [
    {
      id: 'demo-1',
      title: 'MacBook Air M1 Unboxing & Genuine Battery Health Review',
      customerName: 'Aman Verma',
      laptopModel: 'Apple MacBook Air M1',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      rating: 5,
    },
    {
      id: 'demo-2',
      title: 'Lenovo ThinkPad T14 Testing - Corporate Grade Refurbished',
      customerName: 'Pooja Khandelwal',
      laptopModel: 'Lenovo ThinkPad T14 Gen 2',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
      rating: 5,
    },
    {
      id: 'demo-3',
      title: 'HP EliteBook 840 G7 - Best Value Laptop for Coding & Office',
      customerName: 'Vikram Rajput',
      laptopModel: 'HP EliteBook 840 G7 i7',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
      rating: 5,
    },
  ];

  // Helper to extract YouTube embed URL
  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
      }
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URL(url).searchParams;
        const id = urlParams.get('v');
        return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
      }
      if (url.includes('youtube.com/shorts/')) {
        const id = url.split('youtube.com/shorts/')[1]?.split('?')[0];
        return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
      }
    } catch {
      // ignore
    }
    return url;
  };

  return (
    <section className="py-16 sm:py-20 bg-slate-950 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold text-blue-400 mb-3">
              <Video className="w-3.5 h-3.5 text-blue-400" />
              <span>Real Buyers • Real Feedback</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Customer Video Reviews & Unboxings
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Watch real customers review the physical condition, battery health, and packaging of our certified refurbished laptops.
            </p>
          </div>

          <Link
            href="/video-reviews"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors group"
          >
            <span>View All Video Reviews</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayReviews.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedVideo(item)}
              className="group cursor-pointer bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20 flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail with Play Button */}
                <div className="relative aspect-video bg-slate-800 overflow-hidden">
                  <img
                    src={
                      item.thumbnailUrl ||
                      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'
                    }
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors" />

                  {/* Play Button Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-13 h-13 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 group-hover:scale-110 group-hover:bg-blue-500 transition-all">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </div>

                  <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded text-white flex items-center gap-1">
                    <Video className="w-3 h-3 text-red-400" /> Watch Clip
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-300 ml-1">5.0</span>
                  </div>

                  <h3 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-200">{item.customerName}</span>
                    {item.laptopModel && ` • ${item.laptopModel}`}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs text-blue-400 font-semibold group-hover:underline">
                <span>Play customer video</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="pr-4">
                <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1">
                  {selectedVideo.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedVideo.customerName} • {selectedVideo.laptopModel}
                </p>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-black">
              <iframe
                src={getEmbedUrl(selectedVideo.videoUrl)}
                title={selectedVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
