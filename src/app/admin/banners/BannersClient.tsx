'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Edit2, CheckCircle2, Eye, EyeOff, ExternalLink, Image as ImageIcon, Sparkles } from 'lucide-react';
import CloudinaryMediaUploader from '@/components/admin/CloudinaryMediaUploader';

interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  linkUrl: string;
  badgeText?: string | null;
  ctaText: string;
  active: boolean;
  displayOrder: number;
  createdAt: string;
}

export default function BannersClient({ initialBanners }: { initialBanners: Banner[] }) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('/shop');
  const [badgeText, setBadgeText] = useState('Deal of the Day');
  const [ctaText, setCtaText] = useState("Get Today's Best Price");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [active, setActive] = useState(true);

  const openCreateModal = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setImageUrl('');
    setLinkUrl('/shop');
    setBadgeText('Deal of the Day');
    setCtaText("Get Today's Best Price");
    setDisplayOrder(banners.length);
    setActive(true);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (b: Banner) => {
    setEditingBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle || '');
    setImageUrl(b.imageUrl);
    setLinkUrl(b.linkUrl);
    setBadgeText(b.badgeText || '');
    setCtaText(b.ctaText);
    setDisplayOrder(b.displayOrder);
    setActive(b.active);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      setError('Title and Image URL are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editingBanner) {
        // Update
        const res = await fetch('/api/admin/banners', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingBanner.id,
            title,
            subtitle,
            imageUrl,
            linkUrl,
            badgeText,
            ctaText,
            displayOrder,
            active,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update banner');
        setBanners(banners.map((b) => (b.id === editingBanner.id ? data.banner : b)));
      } else {
        // Create
        const res = await fetch('/api/admin/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            subtitle,
            imageUrl,
            linkUrl,
            badgeText,
            ctaText,
            displayOrder,
            active,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create banner');
        setBanners([...banners, data.banner]);
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this homepage slider banner?')) return;

    try {
      const res = await fetch(`/api/admin/banners?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      setBanners(banners.filter((b) => b.id !== id));
    } catch (err) {
      alert('Error deleting banner');
    }
  };

  const handleToggleActive = async (b: Banner) => {
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: b.id,
          active: !b.active,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setBanners(banners.map((item) => (item.id === b.id ? data.banner : item)));
      }
    } catch {
      alert('Failed to toggle status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Homepage Hero Banners</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage the carousel slider images and offers shown on the website homepage.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Slide Banner</span>
        </button>
      </div>

      {/* Grid of Banners */}
      {banners.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Custom Banners Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Default curated banners are currently active on your homepage. Click below to add your custom store banners.
          </p>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm"
          >
            Create Your First Banner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((b) => (
            <div
              key={b.id}
              className={`bg-white rounded-3xl border ${
                b.active ? 'border-slate-200' : 'border-slate-200 opacity-60'
              } overflow-hidden shadow-sm flex flex-col justify-between`}
            >
              <div>
                {/* Image Preview */}
                <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
                  <Image
                    src={b.imageUrl}
                    alt={b.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.active
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-700 text-white'
                      }`}
                    >
                      {b.active ? 'Live on Home' : 'Disabled'}
                    </span>
                    {b.badgeText && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                        {b.badgeText}
                      </span>
                    )}
                  </div>
                  <span className="absolute bottom-2 right-2 text-[10px] bg-black/70 text-white px-2 py-0.5 rounded font-mono">
                    Order: {b.displayOrder}
                  </span>
                </div>

                {/* Banner Content */}
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{b.title}</h3>
                  {b.subtitle && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{b.subtitle}</p>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-blue-700 font-semibold truncate pt-1">
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{b.linkUrl}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleActive(b)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  {b.active ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Show</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(b)}
                    className="p-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit slide"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {editingBanner ? 'Edit Slider Banner' : 'Create New Slider Banner'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <CloudinaryMediaUploader
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
                folder="lappy-square/banners"
                mediaType="image"
                aspectRatio="banner"
                label="Banner Slide Image"
                placeholder="Upload banner from computer or paste Cloudinary URL"
                helpText="Recommended dimensions: 1920x600 px (16:7 aspect ratio)"
                required
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Main Headline / Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Certified Refurbished Apple MacBooks — Up to 60% OFF"
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subtitle / Offer Details
                </label>
                <textarea
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. 45-point quality checked, 1-year comprehensive warranty, and free Pan-India delivery."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="e.g. Deal of the Day"
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="e.g. Get Today's Best Price"
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Redirect Link URL
                  </label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="/shop or /collection/macbook"
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    min={0}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeBannerCheckbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <label htmlFor="activeBannerCheckbox" className="text-xs font-semibold text-slate-700">
                  Active (Show this slide on homepage)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingBanner ? 'Update Banner' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
