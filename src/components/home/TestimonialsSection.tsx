'use client';

import React from 'react';
import { Star, ShieldCheck, Laptop } from 'lucide-react';

export default function TestimonialsSection() {
  const googleReviewsUrl =
    'https://www.google.com/search?gs_ssp=eJzj4tVP1zc0rMquKEsrSkkyYLRSNagwtjRLSTJNNbJMTjQ2T7MwtzKoSDWxSDE3Mk01NUw1TEm0NPYSzkksKKhUKC4sTSxKVchKzCwoLQIAVf0Xfg&q=lappy+square+jaipur';

  const testimonials = [
    {
      name: 'Rohan Sharma',
      location: 'Mansarovar, Jaipur',
      product: 'Apple MacBook Pro M1 (16GB / 512GB)',
      rating: 5,
      date: 'Google Verified Review • 2 weeks ago',
      review:
        'Visited the Lappy Square store near Vijay Path Chauraha in Mansarovar. The MacBook condition was literally 10/10 like brand new with 94% battery health. Got complete 45-point diagnostics certificate and tested everything on the spot. Best price in Jaipur!',
    },
    {
      name: 'Pooja Choudhary',
      location: 'Vaishali Nagar, Jaipur',
      product: 'Dell Latitude 7420 (Core i7 11th Gen)',
      rating: 5,
      date: 'Google Verified Review • 1 month ago',
      review:
        'Found them through Google and Instagram. Staff is super transparent, showed me multiple options and gave 45-point testing report with immediate bill. The laptop runs smoothly without any heating issues. Highly recommended for students and professionals!',
    },
    {
      name: 'Ankit Meena',
      location: 'Malviya Nagar, Jaipur',
      product: 'Lenovo ThinkPad T14 Gen 2 (Ryzen 5 PRO)',
      rating: 5,
      date: 'Google Verified Review • 3 weeks ago',
      review:
        'Best refurbished laptop dealer in Jaipur! Seamless testing, original fast charger included, and customer support on WhatsApp is super responsive. Saved more than ₹70,000 compared to new.',
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-[#E8E8E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3.5 py-1.5 rounded-full text-xs font-bold">
            <span className="flex items-center text-amber-500">★★★★★</span>
            <span>4.9 / 5.0 Star Rated on Google</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Loved by Customers in Jaipur & Pan-India
          </h2>
          <p className="text-sm text-slate-600">
            Real Google reviews from verified buyers who visited our Mansarovar, Jaipur experience center.
          </p>

          <div className="pt-2">
            <a
              href={googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:scale-102"
            >
              <span>Read All Google Reviews</span>
              <span className="text-blue-400">↗</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#F7F8FA] border border-[#E8E8E8] rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Rating stars & Google badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    Google Review
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded-md inline-flex items-center gap-1.5 mb-3">
                  <Laptop className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.product}</span>
                </p>

                <p className="text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{t.review}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-slate-500">{t.location}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Buyer</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
