'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Laptop, Sparkles, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();

  const [brands, setBrands] = useState<Array<{ id: string; name: string }>>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    sku: '',
    brandId: '',
    categoryId: '',
    conditionGrade: 'LIKE_NEW',
    price: '',
    originalPrice: '',
    stock: '2',
    processor: 'Intel Core i5',
    processorModel: '',
    processorGen: '11th Gen',
    ramGb: '16',
    ramType: 'DDR4',
    storageGb: '512',
    storageType: 'NVMe SSD',
    screenSize: '14.0 Inch FHD (1920 x 1080)',
    graphicsCard: 'Intel Iris Xe Graphics',
    os: 'Windows 11 Pro Genuine',
    batteryHealth: '92% Certified OEM Health',
    batteryBackupHours: '6-8 Hours',
    warrantyMonths: '12',
    useCase: 'Business & Office, Programming, Students',
    description: '',
    featured: false,
    bestSeller: false,
    isDealOfTheDay: false,
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80',
  });

  useEffect(() => {
    // Fetch live brands and categories from DB
    fetch('/api/admin/meta')
      .then((r) => r.json())
      .then((data) => {
        if (data.brands && data.brands.length > 0) {
          setBrands(data.brands);
          setFormData((prev) => ({ ...prev, brandId: prev.brandId || data.brands[0].id }));
        }
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
          setFormData((prev) => ({ ...prev, categoryId: prev.categoryId || data.categories[0].id }));
        }
      })
      .catch(() => {});
  }, []);

  const handleTitleChange = (val: string) => {
    const slugified = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const genSku = `LS-${val.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: slugified,
      sku: prev.sku || genSku,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to upload image to Cloudinary');
      }

      setFormData((prev) => ({ ...prev, imageUrl: result.url }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          brandId: formData.brandId || brands[0]?.id,
          categoryId: formData.categoryId || categories[0]?.id,
          images: [formData.imageUrl],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save product');

      router.push('/admin/products');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error creating product');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-black"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Inventory</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-black text-slate-950 tracking-tight">
          Add New Refurbished Laptop
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Fill in accurate hardware specifications and certification details.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-[#E8E8E8] rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 text-xs">
        
        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            1. Basic Listing Details
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Laptop Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="e.g. Dell Latitude 7420 (2-in-1 Touch) — Core i7 11th Gen / 16GB / 512GB SSD"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none focus:border-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">URL Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  placeholder="dell-latitude-7420-touch"
                  className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Unique SKU *</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  required
                  placeholder="LS-DEL-LAT7420-01"
                  className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none focus:border-slate-800 uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Brand *</label>
                <select
                  value={formData.brandId}
                  onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                  className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
                >
                  <option value="">Select Brand</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category / Use Case *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Condition Grade *</label>
                <select
                  value={formData.conditionGrade}
                  onChange={(e) => setFormData({ ...formData, conditionGrade: e.target.value })}
                  className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
                >
                  <option value="LIKE_NEW">Grade A+ (Like New)</option>
                  <option value="EXCELLENT">Grade A (Excellent)</option>
                  <option value="GOOD">Grade B (Refurbished)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Inventory */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            2. Pricing & Stock
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                placeholder="29999"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Original Reference Price (₹)</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="115000"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Available Stock Units *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                min="0"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Technical Specifications */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            3. Hardware & Lab Diagnostics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Processor *</label>
              <input
                type="text"
                value={formData.processor}
                onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
                required
                placeholder="Intel Core i5 / Apple M1"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">RAM Memory (GB) *</label>
              <input
                type="number"
                value={formData.ramGb}
                onChange={(e) => setFormData({ ...formData, ramGb: e.target.value })}
                required
                placeholder="16"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Storage (GB SSD) *</label>
              <input
                type="number"
                value={formData.storageGb}
                onChange={(e) => setFormData({ ...formData, storageGb: e.target.value })}
                required
                placeholder="512"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Battery Health *</label>
              <input
                type="text"
                value={formData.batteryHealth}
                onChange={(e) => setFormData({ ...formData, batteryHealth: e.target.value })}
                placeholder="91% Tested Health"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Screen Size & Display</label>
              <input
                type="text"
                value={formData.screenSize}
                onChange={(e) => setFormData({ ...formData, screenSize: e.target.value })}
                placeholder="14.0 Inch Full HD IPS"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Operating System</label>
              <input
                type="text"
                value={formData.os}
                onChange={(e) => setFormData({ ...formData, os: e.target.value })}
                placeholder="Windows 11 Pro Genuine"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
              />
            </div>
          </div>

          {/* Use Case / Recommended Audience */}
          <div className="pt-2">
            <label className="block font-bold text-slate-700 mb-1 text-xs">
              By Use Case / Recommended Audience
            </label>
            <input
              type="text"
              value={formData.useCase}
              onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
              placeholder="e.g. Programming, Coding, Business, Students, Gaming"
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none text-xs"
            />
            {/* Quick Preset Tags */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 font-semibold mr-1">Quick Add:</span>
              {[
                'Programming & Coding',
                'Business & Corporate',
                'Students & College',
                'Graphic Design & 4K Video',
                'Gaming & High Performance',
                'Everyday Home & Streaming',
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    const current = formData.useCase ? formData.useCase.split(',').map((s) => s.trim()) : [];
                    if (!current.includes(tag)) {
                      const updated = [...current.filter(Boolean), tag].join(', ');
                      setFormData({ ...formData, useCase: updated });
                    }
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:border-blue-300 border border-slate-200 text-slate-700 hover:text-blue-700 text-[11px] rounded-lg transition-all shadow-2xs"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Imagery & Badges */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            4. Image & Marketing Badges
          </h2>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-bold text-slate-700">Laptop Photo / Image</label>
              <span className="text-[10px] font-semibold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Cloudinary Enabled
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#F7F8FA] border border-[#E8E8E8] rounded-2xl p-4">
              <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 overflow-hidden flex-shrink-0 relative flex items-center justify-center shadow-xs">
                {uploadingImage ? (
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                ) : formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-300" />
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold cursor-pointer transition-all text-xs shadow-xs">
                  {uploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Uploading to Cloudinary...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-white" />
                      <span>Upload Laptop Image (Direct to Cloudinary)</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Or paste Cloudinary / Image URL (https://...)"
                  required
                  className="w-full bg-white border border-[#E8E8E8] rounded-xl p-2.5 outline-none text-slate-800 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
              <span className="font-semibold text-slate-800">Featured Product</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.bestSeller}
                onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
              />
              <span className="font-semibold text-slate-800">Best Seller</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDealOfTheDay}
                onChange={(e) => setFormData({ ...formData, isDealOfTheDay: e.target.checked })}
              />
              <span className="font-semibold text-slate-800">Deal of the Day</span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Creating Listing...' : 'Publish to Store'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
