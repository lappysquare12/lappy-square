'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
  ShieldCheck,
  Send,
  Loader2,
  Headphones,
  Store
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'GENERAL' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to send enquiry');
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please chat on WhatsApp directly.');
    } finally {
      setLoading(false);
    }
  };

  const contactChannels = [
    {
      icon: Phone,
      title: 'Customer Support Hotline',
      value: '+91 93769 88788',
      sub: 'Mon - Sun: 10:00 AM - 8:30 PM IST',
      actionText: 'Call Now',
      actionHref: 'tel:+919376988788',
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      icon: WhatsAppIcon,
      title: 'Direct WhatsApp Concierge',
      value: '+91 93769 88788',
      sub: 'Instant photo requests & stock checks',
      actionText: 'Open WhatsApp Chat',
      actionHref: 'https://wa.me/919376988788?text=Hello%20Lappy%20Square%20Team%2C%20I%20need%20assistance%20regarding%20a%20laptop.',
      color: 'text-[#0E7A53] bg-[#25D366]/15 border-[#25D366]/30',
    },
    {
      icon: Mail,
      title: 'Official Email Support',
      value: 'lappysquare12@gmail.com',
      sub: 'Warranty claims & corporate invoicing',
      actionText: 'Send Email',
      actionHref: 'mailto:lappysquare12@gmail.com',
      color: 'text-slate-800 bg-slate-100 border-slate-200',
    },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 sm:py-16 selection:bg-blue-700 selection:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-700 transition-colors font-medium">Home</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold">Contact & Support</span>
        </nav>

        {/* HERO HEADER */}
        <ScrollReveal direction="up" delay={0.05}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Diagnostic Hub & Phone Lines Active Today</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
                How Can We Help You Today?
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
                Whether you need assistance choosing the right ThinkPad or MacBook, tracking a dispatched parcel, or initiating a warranty claim, our engineers are here.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs self-start md:self-auto">
              <Clock className="w-4 h-4 text-blue-700" />
              <span>Response SLA: &lt; 15 Minutes on WhatsApp</span>
            </div>
          </div>
        </ScrollReveal>

        {/* CONTACT CHANNELS MATRIX */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactChannels.map((channel, i) => {
              const IconComp = channel.icon;
              return (
                <div
                  key={i}
                  className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${channel.color}`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{channel.title}</h3>
                      <p className="text-base sm:text-lg font-black text-slate-950 mt-0.5">{channel.value}</p>
                      <p className="text-xs text-slate-500 mt-1">{channel.sub}</p>
                    </div>
                  </div>

                  <a
                    href={channel.actionHref}
                    target={channel.actionHref.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    <span>{channel.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* MAIN INTERACTIVE SECTION: FORM & ADDRESS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: INQUIRY FORM (7 COLS) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Send a Direct Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Leave your details below and a Lappy Square technician will get back to you with custom photos or answers.
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
                  <h3 className="text-xl font-black text-slate-950">Thank You! Message Received</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Your inquiry has been logged in our system. A technician will contact you via WhatsApp / Phone shortly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', message: '' });
                  }}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Send Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {error && (
                  <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 font-medium">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Full Name <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600 font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">WhatsApp / Phone Number <span className="text-rose-500">*</span></label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600 font-semibold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">What can we help you with? <span className="text-rose-500">*</span></label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ask about specific laptop models, bulk college orders, or trade-in valuations..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-600 text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-700/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* RIGHT: PHYSICAL HUB & STORE INFO (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-6 shadow-xl">
              <div className="flex items-center gap-2.5 text-blue-400 text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Physical Diagnostic Hub</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Lappy Square Experience Center
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Peris, Near, Vijay Path, Ward 27, Chauraha, Mansarover, Jaipur, Rajasthan 302020
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Store Hours:</span>
                  <strong className="text-white">Monday – Sunday (10 AM - 8:30 PM)</strong>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>In-Person Testing:</span>
                  <span className="text-emerald-400 font-bold">Free Benchmarks Allowed</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Parking:</span>
                  <span className="text-white">Customer Dedicated Parking</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://www.google.com/search?gs_ssp=eJzj4tVP1zc0rMquKEsrSkkyYLRSNagwtjRLSTJNNbJMTjQ2T7MwtzKoSDWxSDE3Mk01NUw1TEm0NPYSzkksKKhUKC4sTSxKVchKzCwoLQIAVf0Xfg&q=lappy+square+jaipur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all backdrop-blur-md"
                >
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>Open in Google Maps / Reviews</span>
                </a>
              </div>
            </div>

            <div className="bg-blue-50/80 border border-blue-200/90 rounded-3xl p-6 text-xs text-blue-900 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <Store className="w-4 h-4 text-blue-700" />
                <span>In-Store Testing & Walk-In</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Visit our experience center in Mansarovar, Jaipur to test laptops in real-time. Our technical experts will help you benchmark and inspect every machine before purchase.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
