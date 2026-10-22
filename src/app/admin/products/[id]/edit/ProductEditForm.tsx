'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Check, Loader2, Sparkles, Laptop, ShieldCheck, Upload, Image as ImageIcon } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductData {
  id: string;
  title: string;
  slug: string;
  sku: string;
  brandId: string;
  categoryId: string;
  conditionGrade: string;
  price: number;
  originalPrice: number;
  stock: number;
  processor: string;
  processorModel?: string | null;
  processorGen?: string | null;
  ramGb: number;
  ramType?: string | null;
  storageGb: number;
  storageType?: string | null;
  screenSize?: string | null;
  graphicsCard?: string | null;
  os?: string | null;
  batteryHealth?: string | null;
  batteryBackupHours?: string | null;
  warrantyMonths: number;
  includedAccessories?: string | null;
  weightKg?: string | null;
  useCase?: string | null;
  description?: string | null;
  featured: boolean;
  bestSeller: boolean;
  isDealOfTheDay: boolean;
  active: boolean;
  images: { url: string }[];
}

export default function ProductEditForm({
  product,
  brands,
  categories,
}: {
  product: ProductData;
  brands: Brand[];
  categories: Category[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: product.title,
    brandId: product.brandId,
    categoryId: product.categoryId,
    conditionGrade: product.conditionGrade,
    price: String(product.price),
    originalPrice: String(product.originalPrice),
    stock: String(product.stock),
    processor: product.processor,
    processorModel: product.processorModel || '',
    processorGen: product.processorGen || '11th Gen',
    ramGb: String(product.ramGb),
    ramType: product.ramType || 'DDR4',
    storageGb: String(product.storageGb),
    storageType: product.storageType || 'SSD',
    screenSize: product.screenSize || '14.0 Inch FHD',
    graphicsCard: product.graphicsCard || 'Integrated Graphics',
    os: product.os || 'Windows 11 Pro Genuine',
    batteryHealth: product.batteryHealth || '90%+ Certified Health',
    batteryBackupHours: product.batteryBackupHours || '4-6 Hours',
    warrantyMonths: String(product.warrantyMonths),
    includedAccessories: product.includedAccessories || 'Original Charger, Power Cable, Lappy Square Laptop Bag',
    weightKg: product.weightKg || '1.4 kg',
    useCase: product.useCase || 'Business, Students, Programming',
    description: product.description || '',
    featured: product.featured,
    bestSeller: product.bestSeller,
    isDealOfTheDay: product.isDealOfTheDay,
    active: product.active,
    imageUrl: product.images[0]?.url || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80',
  });

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
    setSuccess(false);

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          originalPrice: Number(formData.originalPrice || formData.price),
          stock: Number(formData.stock),
          ramGb: Number(formData.ramGb),
          storageGb: Number(formData.storageGb),
          warrantyMonths: Number(formData.warrantyMonths),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update laptop');

      setSuccess(true);
      router.refresh();
      setTimeout(() => {
        router.push('/admin/products');
      }, 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error updating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
            title="Back to Inventory"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-950 tracking-tight">
              Edit Laptop: {product.title}
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              SKU: {product.sku} • ID: {product.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/product/${product.slug}`}
            target="_blank"
            className="px-4 py-2 text-xs font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Preview Live
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-700/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Product updated successfully! Returning to inventory...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium rounded-2xl">
          {error}
        </div>
      )}

      {/* SECTION 1: CORE IDENTITY & BRAND */}
      <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-950 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Laptop className="w-4 h-4 text-blue-700" />
          <span>1. Core Model & Brand Identity</span>
        </h2>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Laptop Model Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none focus:border-blue-600 font-bold text-slate-900 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Brand</label>
            <select
              value={formData.brandId}
              onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 font-semibold text-slate-800 text-xs"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category / Use</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 font-semibold text-slate-800 text-xs"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Refurbished Grade</label>
            <select
              value={formData.conditionGrade}
              onChange={(e) => setFormData({ ...formData, conditionGrade: e.target.value })}
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 font-semibold text-slate-800 text-xs"
            >
              <option value="LIKE_NEW">Grade A+ (Like New, Zero Scratches)</option>
              <option value="EXCELLENT">Grade A (Pristine Condition)</option>
              <option value="GOOD">Grade B (Certified Tested)</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 2: PRICING & INVENTORY */}
      <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-950 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sparkles className="w-4 h-4 text-blue-700" />
          <span>2. Pricing & Stock Availability</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Selling Price (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none focus:border-blue-600 font-black text-slate-950 text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Original Retail Price (₹)</label>
            <input
              type="number"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none focus:border-blue-600 font-semibold text-slate-700 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Stock Units</label>
            <input
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none focus:border-blue-600 font-semibold text-slate-700 text-sm"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: HARDWARE SPECIFICATIONS */}
      <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-950 flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-4 h-4 text-blue-700" />
          <span>3. Detailed Hardware Specifications</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Processor</label>
            <input
              type="text"
              value={formData.processor}
              onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">RAM Capacity (GB)</label>
            <select
              value={formData.ramGb}
              onChange={(e) => setFormData({ ...formData, ramGb: e.target.value })}
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 font-semibold"
            >
              <option value="8">8 GB RAM</option>
              <option value="16">16 GB RAM</option>
              <option value="32">32 GB RAM</option>
              <option value="64">64 GB RAM</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Storage SSD (GB)</label>
            <select
              value={formData.storageGb}
              onChange={(e) => setFormData({ ...formData, storageGb: e.target.value })}
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 font-semibold"
            >
              <option value="256">256 GB SSD</option>
              <option value="512">512 GB SSD</option>
              <option value="1024">1 TB SSD</option>
              <option value="2048">2 TB SSD</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Screen Size & Display</label>
            <input
              type="text"
              value={formData.screenSize}
              onChange={(e) => setFormData({ ...formData, screenSize: e.target.value })}
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Graphics Card</label>
            <input
              type="text"
              value={formData.graphicsCard}
              onChange={(e) => setFormData({ ...formData, graphicsCard: e.target.value })}
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Operating System</label>
            <input
              type="text"
              value={formData.os}
              onChange={(e) => setFormData({ ...formData, os: e.target.value })}
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Battery Health Status</label>
            <input
              type="text"
              value={formData.batteryHealth}
              onChange={(e) => setFormData({ ...formData, batteryHealth: e.target.value })}
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Battery Backup Duration</label>
            <input
              type="text"
              value={formData.batteryBackupHours}
              onChange={(e) => setFormData({ ...formData, batteryBackupHours: e.target.value })}
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Warranty Period (Months)</label>
            <select
              value={formData.warrantyMonths}
              onChange={(e) => setFormData({ ...formData, warrantyMonths: e.target.value })}
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 font-semibold"
            >
              <option value="6">6 Months Warranty</option>
              <option value="12">12 Months Comprehensive Warranty</option>
              <option value="24">24 Months Extended Warranty</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Included Accessories</label>
            <input
              type="text"
              value={formData.includedAccessories}
              onChange={(e) => setFormData({ ...formData, includedAccessories: e.target.value })}
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Weight</label>
            <input
              type="text"
              value={formData.weightKg}
              onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* Use Case / Recommended Audience */}
        <div className="pt-2 text-xs">
          <label className="block font-bold text-slate-700 mb-1">
            By Use Case / Recommended Audience
          </label>
          <input
            type="text"
            value={formData.useCase}
            onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
            placeholder="e.g. Programming, Coding, Business, Students, Gaming"
            className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 text-xs font-medium"
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

      {/* SECTION 4: MEDIA & MARKETING FLAGS */}
      <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-950 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span>4. Media & Display Flags</span>
        </h2>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700">Primary Laptop Image</label>
            <span className="text-[10px] font-semibold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Cloudinary Enabled
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#F7F8FA] border border-[#E8E8E8] rounded-2xl p-4">
            <div className="w-24 h-24 rounded-xl bg-white border border-slate-200 overflow-hidden flex-shrink-0 relative flex items-center justify-center shadow-xs">
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
                    <span>Upload New Photo to Cloudinary</span>
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
                className="w-full bg-white border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 font-mono text-xs text-slate-800"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Editorial Description & Overview</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed description of cosmetic condition, ports, and display..."
            className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none focus:border-blue-600 text-xs text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-xs font-bold text-slate-700">Featured Listing</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.bestSeller}
              onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-xs font-bold text-slate-700">Best Seller</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isDealOfTheDay}
              onChange={(e) => setFormData({ ...formData, isDealOfTheDay: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-xs font-bold text-slate-700">Deal of the Day</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-xs font-bold text-slate-700">Listing Active / Visible</span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <Link
          href="/admin/products"
          className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-700/20 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Laptop Changes</span>
        </button>
      </div>
    </form>
  );
}
