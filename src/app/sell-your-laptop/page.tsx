'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Truck,
  Sparkles,
  DollarSign,
  Laptop,
  Check,
  Send,
  Loader2,
  Lock,
  ThumbsUp
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';
import ScrollReveal from '@/components/ui/ScrollReveal';
import BrandLogo from '@/components/ui/BrandLogos';

export default function SellYourLaptopPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Delhi NCR',
    brand: 'apple',
    model: 'MacBook Air M1',
    processor: 'Apple Silicon M1 / Intel Core i5',
    ram: '16GB',
    storage: '512GB SSD',
    condition: 'Flawless (No dents, pristine screen)',
    batteryWorking: 'Yes (Health > 80%)',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const brandOptions = [
    { slug: 'apple', name: 'Apple' },
    { slug: 'dell', name: 'Dell' },
    { slug: 'hp', name: 'HP' },
    { slug: 'lenovo', name: 'Lenovo' },
    { slug: 'asus', name: 'ASUS' },
    { slug: 'acer', name: 'Acer' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Format rich WhatsApp message with all laptop specs
    const waText = `*SELL YOUR LAPTOP VALUATION REQUEST — LAPPY SQUARE*

*Customer Name:* ${formData.name}
*WhatsApp Phone:* ${formData.phone}
*Pickup City:* ${formData.city}

*Laptop Details:*
• Brand: ${formData.brand.toUpperCase()}
• Model: ${formData.model}
• Processor: ${formData.processor}
• RAM: ${formData.ram}
• Storage: ${formData.storage}
• Physical Condition: ${formData.condition}
• Battery Status: ${formData.batteryWorking}

Hello Lappy Square Team, I submitted this laptop buyback request on your website. Please share the best cash quotation!`;

    const generatedWaUrl = `https://wa.me/919376988788?text=${encodeURIComponent(waText)}`;
    setWhatsappUrl(generatedWaUrl);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: `${formData.phone.replace(/[^0-9]/g, '')}@lappysquare-quote.com`,
          phone: formData.phone,
          city: formData.city,
          type: 'SELL_LAPTOP',
          deviceDetails: `${formData.brand.toUpperCase()} ${formData.model} | ${formData.processor} | ${formData.ram} | ${formData.storage} | Condition: ${formData.condition} | Battery: ${formData.batteryWorking}`,
          message: `Sell valuation quote requested from ${formData.city}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to submit quote request');
      
      setSubmitted(true);

      // Auto-open WhatsApp chat with pre-filled specifications
      try {
        window.open(generatedWaUrl, '_blank');
      } catch {}
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please connect with our team on WhatsApp directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 sm:py-16 selection:bg-blue-700 selection:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-700 transition-colors font-medium">Home</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold">Sell Your Laptop / Instant Buyback</span>
        </nav>

        {/* HERO SECTION */}
        <ScrollReveal direction="up" delay={0.05}>
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white rounded-3xl p-8 sm:p-12 lg:p-14 border border-slate-800 shadow-2xl">
            <div className="relative z-10 max-w-2xl space-y-5">
              <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-300 tracking-wide uppercase backdrop-blur-md">
                <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                <span>Instant Valuation & Doorstep Payout</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Sell Your Used Laptop <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">For The Highest Price In India</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Get an instant quote, zero-deduction doorstep pickup, on-the-spot UPI bank transfer, and certified DoD cryptographic data wipe for 100% privacy protection.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* 3 VALUE PILLARS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-950">Instant On-Spot Payment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Immediate UPI transfer, IMPS, or cash payout as soon as our diagnostic technician inspects your device at your doorstep.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-950">Free Doorstep Pickup</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Zero shipping charges or transit hassle. Our courier or engineer arrives right at your home or office.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-950">Certified Data Wiping</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We sanitize all drives using multi-pass military standard wiping software, ensuring your personal files can never be recovered.
            </p>
          </div>
        </div>

        {/* VALUATION CALCULATOR FORM */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Step-by-Step Estimator</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
              Select Your Laptop Configuration
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Fill in your hardware details below to receive an instant price valuation quote.
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-950">Valuation Request Confirmed!</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg mx-auto">
                  Our buyback valuation specialist has received your laptop specs and is calculating your maximum cash offer. You will receive a WhatsApp message within 15 minutes.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-[#25D366]/25 transition-all"
                  >
                    <WhatsAppIcon className="w-4 h-4 shrink-0" />
                    <span>Open Chat on WhatsApp with Specs</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3.5 bg-slate-950 hover:bg-black text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all"
                >
                  Estimate Another Laptop
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {error && (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 font-medium">
                  {error}
                </div>
              )}

              {/* BRAND PILLS WITH REAL LOGOS */}
              <div>
                <label className="block font-bold text-slate-800 mb-2">1. Select Laptop Brand</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {brandOptions.map((b) => (
                    <button
                      type="button"
                      key={b.slug}
                      onClick={() => setFormData({ ...formData, brand: b.slug })}
                      className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                        formData.brand === b.slug
                          ? 'border-blue-700 bg-blue-50/70 text-blue-900 shadow-sm'
                          : 'border-slate-200 hover:border-slate-400 bg-white text-slate-700'
                      }`}
                    >
                      <div className="h-7 flex items-center">
                        <BrandLogo brand={b.slug} size="md" />
                      </div>
                      <span className="font-bold text-xs">{b.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* MODEL & PROCESSOR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Model Name / Series <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ThinkPad T480 / Dell Latitude 5400 / MacBook Air M1"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600 font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Processor</label>
                  <input
                    type="text"
                    placeholder="e.g. Intel Core i5 8th Gen / Apple M1"
                    value={formData.processor}
                    onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600 text-slate-900"
                  />
                </div>
              </div>

              {/* RAM & SSD CONFIG */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">RAM Capacity</label>
                  <select
                    value={formData.ram}
                    onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600 font-semibold text-slate-800"
                  >
                    <option value="4GB">4 GB RAM</option>
                    <option value="8GB">8 GB RAM</option>
                    <option value="16GB">16 GB RAM</option>
                    <option value="32GB">32 GB RAM</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Storage SSD</label>
                  <select
                    value={formData.storage}
                    onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600 font-semibold text-slate-800"
                  >
                    <option value="128GB SSD">128 GB SSD</option>
                    <option value="256GB SSD">256 GB SSD</option>
                    <option value="512GB SSD">512 GB SSD</option>
                    <option value="1TB SSD">1 TB SSD</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Physical Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600 font-semibold text-slate-800"
                  >
                    <option value="Flawless (No dents, pristine screen)">Flawless (Pristine, Zero Scratches)</option>
                    <option value="Good (Minor normal wear, fully working)">Good (Normal Daily Wear)</option>
                    <option value="Average (Noticeable scratches/dents)">Average (Visible Scratches)</option>
                  </select>
                </div>
              </div>

              {/* CONTACT DETAILS FOR ON-SPOT QUOTE */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Where should we send your cash quote?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Name <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">WhatsApp Phone <span className="text-rose-500">*</span></label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pickup City</label>
                    <input
                      type="text"
                      placeholder="Delhi, Noida, Gurugram, etc."
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-700/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  <span>Get Maximum Cash Offer Now</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
