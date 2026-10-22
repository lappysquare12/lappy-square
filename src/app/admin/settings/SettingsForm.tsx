'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Check, Loader2, Globe, Shield, Phone, Sparkles, Truck, AlertCircle, Share2 } from 'lucide-react';
import {
  WhatsAppIcon,
  InstagramIcon,
  FacebookIcon,
  YouTubeIcon,
  LinkedInIcon,
  XIcon
} from '@/components/ui/SocialIcons';

interface WebsiteSettingData {
  id: string;
  siteName: string;
  tagline: string;
  brandAccent: string;
  supportEmail: string;
  supportPhone: string;
  supportAddress: string;
  announcementText: string;
  announcementActive: boolean;
  freeShippingThreshold: number;
  defaultShippingCost: number;
  taxPercentage: number;
  returnWindowDays: number;
  warrantyText: string;
  metaTitle: string;
  metaDescription: string;
  googleSiteVerification?: string;
  googleAnalyticsId?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  whatsappNumber?: string;
}

export default function SettingsForm({ initialData }: { initialData: WebsiteSettingData }) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update settings');

      setSavedSuccess(true);
      router.refresh();
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs">
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-2xl flex items-center gap-2.5 shadow-xs animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully! Changes are now live across the website.</span>
        </div>
      )}

      {/* 1. BRAND IDENTITY & TOP ANNOUNCEMENT MARQUEE */}
      <div className="bg-white rounded-3xl border border-[#E8E8E8] p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-950 font-bold text-sm">
          <Globe className="w-4 h-4 text-blue-700" />
          <span>1. Brand Identity & Header Offers Scrollbar</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Store / Website Name</label>
            <input
              type="text"
              name="siteName"
              value={formData.siteName}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 font-bold text-slate-900 bg-[#F7F8FA]"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tagline</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 font-medium text-slate-800 bg-[#F7F8FA]"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Official Brand Accent Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                name="brandAccent"
                value={formData.brandAccent}
                onChange={handleChange}
                className="w-10 h-10 rounded-xl border border-[#E8E8E8] cursor-pointer p-0.5 bg-white"
              />
              <input
                type="text"
                name="brandAccent"
                value={formData.brandAccent}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 font-mono text-slate-800 bg-[#F7F8FA]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="announcementActive"
              name="announcementActive"
              checked={formData.announcementActive}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded border-[#E8E8E8]"
            />
            <label htmlFor="announcementActive" className="font-bold text-slate-800 cursor-pointer">
              Enable Animated Offers Marquee in Website Header
            </label>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Announcement Ticker / Offer Scrollbar Text
          </label>
          <input
            type="text"
            name="announcementText"
            value={formData.announcementText}
            onChange={handleChange}
            placeholder="Special Offer: Free Pan-India Insured Express Shipping & 1-Year Comprehensive Warranty on all Laptops!"
            className="w-full px-3.5 py-2.5 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 bg-[#F7F8FA]"
          />
          {formData.announcementText && (
            <div className="mt-2 p-2.5 bg-slate-900 text-white rounded-xl text-[11px] font-medium flex items-center gap-2 overflow-hidden">
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">PREVIEW</span>
              <span className="truncate">{formData.announcementText}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. CUSTOMER SUPPORT & STORE CONTACT */}
      <div className="bg-white rounded-3xl border border-[#E8E8E8] p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-950 font-bold text-sm">
          <Phone className="w-4 h-4 text-blue-700" />
          <span>2. Customer Support & Experience Center</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Support Email Address</label>
            <input
              type="email"
              name="supportEmail"
              value={formData.supportEmail}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 font-medium text-slate-900 bg-[#F7F8FA]"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Official WhatsApp & Hotline Phone</label>
            <input
              type="text"
              name="supportPhone"
              value={formData.supportPhone}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 font-medium text-slate-900 bg-[#F7F8FA]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Official Experience Center / Store Address</label>
          <textarea
            name="supportAddress"
            rows={2}
            value={formData.supportAddress}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 bg-[#F7F8FA]"
          />
        </div>
      </div>

      {/* 3. WARRANTY, SHIPPING & TAX POLICIES */}
      <div className="bg-white rounded-3xl border border-[#E8E8E8] p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-950 font-bold text-sm">
          <Shield className="w-4 h-4 text-blue-700" />
          <span>3. Warranty, Shipping & Return Policies</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Return & Replacement Window (Days)</label>
            <input
              type="number"
              name="returnWindowDays"
              value={formData.returnWindowDays}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 font-bold text-slate-900 bg-[#F7F8FA]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Free Shipping Minimum Cart (₹)</label>
            <input
              type="number"
              name="freeShippingThreshold"
              value={formData.freeShippingThreshold}
              onChange={handleChange}
              placeholder="0 for 100% Free Shipping"
              className="w-full px-3.5 py-2.5 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 font-bold text-slate-900 bg-[#F7F8FA]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">GST Tax Percentage (%)</label>
            <input
              type="number"
              name="taxPercentage"
              value={formData.taxPercentage}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 font-bold text-slate-900 bg-[#F7F8FA]"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Standard Warranty Statement</label>
          <input
            type="text"
            name="warrantyText"
            value={formData.warrantyText}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 bg-[#F7F8FA]"
          />
        </div>
      </div>

      {/* 4. GLOBAL SEO SETTINGS */}
      <div className="bg-white rounded-3xl border border-[#E8E8E8] p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-950 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-blue-700" />
          <span>4. Global Search Engine Optimization (SEO)</span>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Default Meta Title</label>
          <input
            type="text"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 bg-[#F7F8FA] font-medium"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Default Meta Description</label>
          <textarea
            name="metaDescription"
            rows={2}
            value={formData.metaDescription}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 bg-[#F7F8FA]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Google Search Console Verification Token / Tag
            </label>
            <input
              type="text"
              name="googleSiteVerification"
              value={formData.googleSiteVerification || ''}
              onChange={handleChange}
              placeholder="e.g. google-site-verification token or ID"
              className="w-full px-3.5 py-2.5 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 bg-[#F7F8FA] font-mono text-xs"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Injected into &lt;meta name=&quot;google-site-verification&quot;&gt; in site header.
            </p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Google Analytics 4 / Tag Manager ID
            </label>
            <input
              type="text"
              name="googleAnalyticsId"
              value={formData.googleAnalyticsId || ''}
              onChange={handleChange}
              placeholder="e.g. G-B9SHC5R303 or AW-693921886"
              className="w-full px-3.5 py-2.5 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 bg-[#F7F8FA] font-mono text-xs"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Automatically runs official gtag.js tracking on all customer visits.
            </p>
          </div>
        </div>

        <div className="p-3 bg-blue-50/60 border border-blue-200/60 rounded-xl flex items-center justify-between text-xs text-blue-900">
          <div>
            <p className="font-bold">Google XML Sitemap URL:</p>
            <p className="text-slate-600 font-mono text-[11px]">/sitemap.xml (Automatically generated with all products &amp; pages)</p>
          </div>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-blue-700 text-white rounded-lg font-bold text-[11px] hover:bg-blue-800"
          >
            Open Sitemap
          </a>
        </div>
      </div>

      {/* 5. OFFICIAL SOCIAL MEDIA CHANNELS & PROFILES */}
      <div className="bg-white rounded-3xl border border-[#E8E8E8] p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-950 font-bold text-sm">
          <Share2 className="w-4 h-4 text-blue-700" />
          <span>5. Official Social Media Channels & Profile Links</span>
        </div>
        <p className="text-xs text-slate-500">
          Configure social media profiles and channels. These links are automatically updated on the website footer, contact pages, and brand channels.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 font-bold text-slate-700 mb-1">
              <span className="w-5 h-5 rounded-md bg-emerald-50 text-[#25D366] flex items-center justify-center">
                <WhatsAppIcon className="w-3.5 h-3.5" />
              </span>
              <span>WhatsApp Business Support Number</span>
            </label>
            <input
              type="text"
              name="whatsappNumber"
              value={formData.whatsappNumber || '+91 93769 88788'}
              onChange={handleChange}
              placeholder="+91 93769 88788"
              className="w-full px-3.5 py-2.5 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 bg-[#F7F8FA] font-medium"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 font-bold text-slate-700 mb-1">
              <span className="w-5 h-5 rounded-md bg-pink-50 text-[#E1306C] flex items-center justify-center">
                <InstagramIcon className="w-3.5 h-3.5" />
              </span>
              <span>Instagram Profile URL</span>
            </label>
            <input
              type="url"
              name="instagramUrl"
              value={formData.instagramUrl || ''}
              onChange={handleChange}
              placeholder="https://www.instagram.com/lappy_square/"
              className="w-full px-3.5 py-2.5 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 bg-[#F7F8FA]"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 font-bold text-slate-700 mb-1">
              <span className="w-5 h-5 rounded-md bg-blue-50 text-[#1877F2] flex items-center justify-center">
                <FacebookIcon className="w-3.5 h-3.5" />
              </span>
              <span>Facebook Page URL</span>
            </label>
            <input
              type="url"
              name="facebookUrl"
              value={formData.facebookUrl || ''}
              onChange={handleChange}
              placeholder="https://www.facebook.com/61593042681135/"
              className="w-full px-3.5 py-2.5 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 bg-[#F7F8FA]"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 font-bold text-slate-700 mb-1">
              <span className="w-5 h-5 rounded-md bg-red-50 text-[#FF0000] flex items-center justify-center">
                <YouTubeIcon className="w-3.5 h-3.5" />
              </span>
              <span>YouTube Channel URL</span>
            </label>
            <input
              type="url"
              name="youtubeUrl"
              value={formData.youtubeUrl || ''}
              onChange={handleChange}
              placeholder="https://youtube.com/@lappysquare"
              className="w-full px-3.5 py-2.5 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 text-slate-900 bg-[#F7F8FA]"
            />
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-700/20 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Website Details</span>
        </button>
      </div>
    </form>
  );
}
