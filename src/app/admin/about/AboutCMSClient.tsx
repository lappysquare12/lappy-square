'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Save,
  Check,
  Loader2,
  ExternalLink,
  Sparkles,
  Quote,
  Users,
  Image as ImageIcon,
  Building,
  BarChart3,
  BadgeCheck,
  AlertCircle
} from 'lucide-react';
import CloudinaryMediaUploader from '@/components/admin/CloudinaryMediaUploader';

interface AboutContentData {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  founderName: string;
  founderRole: string;
  founderImage: string;
  founderQuote: string;
  founderBio1: string;
  founderBio2: string;
  stats: {
    label: string;
    value: string;
    desc: string;
  }[];
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
}

export default function AboutCMSClient({
  initialContent,
}: {
  initialContent: AboutContentData;
}) {
  const [formData, setFormData] = useState<AboutContentData>(initialContent);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatChange = (
    index: number,
    field: 'label' | 'value' | 'desc',
    val: string
  ) => {
    const nextStats = [...formData.stats];
    nextStats[index] = { ...nextStats[index], [field]: val };
    setFormData({ ...formData, stats: nextStats });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update About Us content');

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving content';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Alert Banner */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-xs font-semibold animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>About Us page content successfully updated and live!</span>
          </div>
          <Link
            href="/about"
            target="_blank"
            className="flex items-center gap-1 underline text-emerald-900 font-bold"
          >
            <span>View Live Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-2 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. FOUNDER & LEADERSHIP PROFILE (HIGH PRIORITY) */}
      <div className="bg-white rounded-3xl border border-[#E8E8E8] p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-950 font-bold text-sm">
            <Users className="w-4 h-4 text-blue-700" />
            <span>1. Founder &amp; Leadership Profile</span>
          </div>
          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
            Official Bio
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1 text-xs">
              Founder Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.founderName}
              onChange={(e) =>
                setFormData({ ...formData, founderName: e.target.value })
              }
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-blue-600 outline-none text-slate-900 text-xs font-medium"
              placeholder="e.g. Pankaj Jain"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 text-xs">
              Role &amp; Designation *
            </label>
            <input
              type="text"
              required
              value={formData.founderRole}
              onChange={(e) =>
                setFormData({ ...formData, founderRole: e.target.value })
              }
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-blue-600 outline-none text-slate-900 text-xs font-medium"
              placeholder="e.g. Founder & CEO"
            />
          </div>
        </div>

        {/* Founder Photo Uploader via Cloudinary */}
        <div>
          <CloudinaryMediaUploader
            value={formData.founderImage}
            onChange={(url) => setFormData({ ...formData, founderImage: url })}
            label="Founder Portrait Photo"
            folder="lappy-square/founder"
            mediaType="image"
            placeholder="/images/pankaj-jain-founder.jpg or Cloudinary Image URL"
            helpText="Upload a high-resolution portrait photograph of the founder. Square or portrait aspect ratios work best."
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1 text-xs">
            Founder Core Quote / Philosophy *
          </label>
          <textarea
            rows={2}
            required
            value={formData.founderQuote}
            onChange={(e) =>
              setFormData({ ...formData, founderQuote: e.target.value })
            }
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-blue-600 outline-none text-slate-900 text-xs font-medium"
            placeholder="Inspiring quote from the founder..."
          />
        </div>

        <div className="space-y-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1 text-xs">
              Founder Narrative Story — Paragraph 1
            </label>
            <textarea
              rows={3}
              value={formData.founderBio1}
              onChange={(e) =>
                setFormData({ ...formData, founderBio1: e.target.value })
              }
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-blue-600 outline-none text-slate-900 text-xs"
              placeholder="Details on experience, reason for establishing Lappy Square..."
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 text-xs">
              Founder Narrative Story — Paragraph 2
            </label>
            <textarea
              rows={3}
              value={formData.founderBio2}
              onChange={(e) =>
                setFormData({ ...formData, founderBio2: e.target.value })
              }
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-blue-600 outline-none text-slate-900 text-xs"
              placeholder="Store evolution, customer-first policy, and vision..."
            />
          </div>
        </div>
      </div>

      {/* 2. HERO HEADER & MISSION STATEMENT */}
      <div className="bg-white rounded-3xl border border-[#E8E8E8] p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-950 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-blue-700" />
          <span>2. Hero Banner &amp; Brand Mission</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block font-bold text-slate-700 mb-1 text-xs">
              Top Badge Text
            </label>
            <input
              type="text"
              value={formData.heroBadge}
              onChange={(e) =>
                setFormData({ ...formData, heroBadge: e.target.value })
              }
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-blue-600 outline-none text-slate-900 text-xs font-medium"
              placeholder="e.g. Our Heritage & Mission"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 mb-1 text-xs">
              Hero Main Headline *
            </label>
            <input
              type="text"
              required
              value={formData.heroTitle}
              onChange={(e) =>
                setFormData({ ...formData, heroTitle: e.target.value })
              }
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-blue-600 outline-none text-slate-900 text-xs font-medium"
              placeholder="Main headline on the about page"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1 text-xs">
            Hero Subtitle / Mission Statement *
          </label>
          <textarea
            rows={3}
            required
            value={formData.heroSubtitle}
            onChange={(e) =>
              setFormData({ ...formData, heroSubtitle: e.target.value })
            }
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-blue-600 outline-none text-slate-900 text-xs"
            placeholder="Elaborate on the brand mission and purpose..."
          />
        </div>
      </div>

      {/* 3. KEY STATISTICS MATRIX */}
      <div className="bg-white rounded-3xl border border-[#E8E8E8] p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-950 font-bold text-sm">
            <BarChart3 className="w-4 h-4 text-blue-700" />
            <span>3. Key Achievements &amp; Statistics Matrix</span>
          </div>
          <span className="text-xs text-slate-400">4 Highlight Cards</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider">
                  Card #{idx + 1}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                    Number / Stat Value
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) =>
                      handleStatChange(idx, 'value', e.target.value)
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 bg-white outline-none focus:border-blue-600"
                    placeholder="e.g. 12,500+"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                    Metric Title
                  </label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) =>
                      handleStatChange(idx, 'label', e.target.value)
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 bg-white outline-none focus:border-blue-600"
                    placeholder="e.g. Laptops Delivered"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                  Subtext / Context
                </label>
                <input
                  type="text"
                  value={stat.desc}
                  onChange={(e) =>
                    handleStatChange(idx, 'desc', e.target.value)
                  }
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white outline-none focus:border-blue-600"
                  placeholder="e.g. Across 19,000+ PIN codes in India"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. PHYSICAL STORE LOCATION & CONTACT */}
      <div className="bg-white rounded-3xl border border-[#E8E8E8] p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-950 font-bold text-sm">
          <Building className="w-4 h-4 text-blue-700" />
          <span>4. Store Handover &amp; Consultation Desk</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 mb-1 text-xs">
              Physical Store Address
            </label>
            <input
              type="text"
              value={formData.storeAddress}
              onChange={(e) =>
                setFormData({ ...formData, storeAddress: e.target.value })
              }
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-blue-600 outline-none text-slate-900 text-xs font-medium"
              placeholder="e.g. Paris Tower, Near Vijay Path, Mansarovar Jaipur"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 text-xs">
              Desk Phone / WhatsApp
            </label>
            <input
              type="text"
              value={formData.storePhone}
              onChange={(e) =>
                setFormData({ ...formData, storePhone: e.target.value })
              }
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-blue-600 outline-none text-slate-900 text-xs font-medium"
              placeholder="+91 93769 88788"
            />
          </div>
        </div>
      </div>

      {/* Floating Save Actions Bar */}
      <div className="sticky bottom-4 z-20 bg-slate-950 text-white rounded-2xl p-4 shadow-2xl border border-slate-800 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Link
            href="/about"
            target="_blank"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open /about in New Tab</span>
          </Link>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Changes reflect immediately upon save.
          </span>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all ml-auto"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save &amp; Publish Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
