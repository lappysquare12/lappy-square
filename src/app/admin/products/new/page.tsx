'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Laptop, Sparkles, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import CloudinaryMultiImageUploader from '@/components/admin/CloudinaryMultiImageUploader';

export default function NewProductPage() {
  const router = useRouter();

  const [brands, setBrands] = useState<Array<{ id: string; name: string }>>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80',
  ]);
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
    processor: 'Intel Core i7',
    processorModel: 'Core i7-10610U vPro (Hexa-Core up to 4.9GHz)',
    processorGen: '10th Gen',
    ramGb: '16',
    ramType: '16GB LPDDR3 2133MHz',
    storageGb: '512',
    storageType: '512GB M.2 NVMe SSD',
    screenSize: '14.0 Inch',
    displayResolution: '14.0 Inch FHD IPS 400 nits PrivacyGuard Display (1920 x 1080)',
    graphicsCard: 'Intel UHD Graphics 620',
    os: 'Windows 11 Pro Genuine (100% Genuine License)',
    batteryHealth: '90% Certified OEM Health',
    batteryBackupHours: '8-10 Hours',
    weightKg: '1.4 kg',
    warrantyMonths: '12',
    includedAccessories: '1x Original OEM Power Adapter & Power Cable, 1x Lappy Square Laptop Bag, 1x 45-Point Certificate, 1x Warranty Card',
    useCase: 'C-Suite, Founders, Frequent Flyers, Consulting',
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
          images: images.length > 0 ? images : [formData.imageUrl],
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

        {/* Section 3: Full Technical Specifications */}
        <div className="space-y-5">
          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              3. Full Technical Specifications (Storefront Specs Table)
            </h2>
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              Live on Product Details Page
            </span>
          </div>

          {/* Row 1: Processor & Generation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Processor Family *</label>
              <input
                type="text"
                value={formData.processor}
                onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
                required
                placeholder="e.g. Intel Core i7 / Apple M1 / AMD Ryzen 7"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Processor Model & Clock</label>
              <input
                type="text"
                value={formData.processorModel}
                onChange={(e) => setFormData({ ...formData, processorModel: e.target.value })}
                placeholder="e.g. Core i7-10610U vPro (Hexa-Core up to 4.9GHz)"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Generation</label>
              <input
                type="text"
                value={formData.processorGen}
                onChange={(e) => setFormData({ ...formData, processorGen: e.target.value })}
                placeholder="e.g. 10th Gen / 11th Gen / Apple Silicon"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
              />
            </div>
          </div>

          {/* Row 2: RAM & Storage */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">RAM Memory (GB) *</label>
              <select
                value={formData.ramGb}
                onChange={(e) => setFormData({ ...formData, ramGb: e.target.value })}
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none font-semibold"
              >
                <option value="4">4 GB RAM</option>
                <option value="8">8 GB RAM</option>
                <option value="16">16 GB RAM</option>
                <option value="32">32 GB RAM</option>
                <option value="64">64 GB RAM</option>
                <option value="128">128 GB RAM</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">RAM Type & Speed</label>
              <input
                type="text"
                value={formData.ramType}
                onChange={(e) => setFormData({ ...formData, ramType: e.target.value })}
                placeholder="e.g. 16GB LPDDR3 2133MHz / DDR4"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Storage (GB SSD) *</label>
              <select
                value={formData.storageGb}
                onChange={(e) => setFormData({ ...formData, storageGb: e.target.value })}
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none font-semibold"
              >
                <option value="128">128 GB SSD</option>
                <option value="256">256 GB SSD</option>
                <option value="512">512 GB SSD</option>
                <option value="1024">1 TB SSD</option>
                <option value="2048">2 TB SSD</option>
                <option value="4096">4 TB SSD</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Storage Type & Bus</label>
              <input
                type="text"
                value={formData.storageType}
                onChange={(e) => setFormData({ ...formData, storageType: e.target.value })}
                placeholder="e.g. 512GB M.2 NVMe SSD"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
              />
            </div>
          </div>

          {/* Row 3: Display & Graphics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Screen Size</label>
              <input
                type="text"
                value={formData.screenSize}
                onChange={(e) => setFormData({ ...formData, screenSize: e.target.value })}
                placeholder="e.g. 14.0 Inch / 13.3 Inch / 15.6 Inch"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Screen Size & Res (Full Display Specs)</label>
              <input
                type="text"
                value={formData.displayResolution}
                onChange={(e) => setFormData({ ...formData, displayResolution: e.target.value })}
                placeholder="e.g. 14.0 Inch FHD IPS 400 nits PrivacyGuard Display (1920 x 1080)"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Graphics Controller</label>
              <input
                type="text"
                value={formData.graphicsCard}
                onChange={(e) => setFormData({ ...formData, graphicsCard: e.target.value })}
                placeholder="e.g. Intel UHD Graphics 620 / NVIDIA RTX 3050"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
              />
            </div>
          </div>

          {/* Row 4: OS, Battery & Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Operating System</label>
              <input
                type="text"
                value={formData.os}
                onChange={(e) => setFormData({ ...formData, os: e.target.value })}
                placeholder="e.g. Windows 11 Pro Genuine (100% Genuine License)"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Battery Health *</label>
              <input
                type="text"
                value={formData.batteryHealth}
                onChange={(e) => setFormData({ ...formData, batteryHealth: e.target.value })}
                placeholder="e.g. 90% Certified OEM Health"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Battery Backup Duration</label>
              <input
                type="text"
                value={formData.batteryBackupHours}
                onChange={(e) => setFormData({ ...formData, batteryBackupHours: e.target.value })}
                placeholder="e.g. 8-10 Hours / 6-8 Hours"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Weight</label>
              <input
                type="text"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                placeholder="e.g. 1.09 kg / 1.4 kg"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
              />
            </div>
          </div>

          {/* Row 5: Warranty & What's in the Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Warranty Period (Months)</label>
              <select
                value={formData.warrantyMonths}
                onChange={(e) => setFormData({ ...formData, warrantyMonths: e.target.value })}
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none font-semibold"
              >
                <option value="6">6 Months Comprehensive Warranty</option>
                <option value="12">12 Months Comprehensive Warranty</option>
                <option value="24">24 Months Extended Warranty</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">What&apos;s in the Box & Accessories (Comma-separated)</label>
              <input
                type="text"
                value={formData.includedAccessories}
                onChange={(e) => setFormData({ ...formData, includedAccessories: e.target.value })}
                placeholder="e.g. 1x Original OEM Power Adapter & Power Cable, 1x Lappy Square Laptop Bag, 1x 45-Point Certificate, 1x Warranty Card"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none"
              />
            </div>
          </div>

          {/* Row 6: Detailed Condition Overview (Description) */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Detailed Condition Overview (Editorial Review)</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Weighing only 1.09 kg, the X1 Carbon combines aerospace-grade carbon fiber and magnesium alloy with an unmatched typing experience..."
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none text-xs"
            />
          </div>

          {/* Row 7: Recommended Use / Audience */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 text-xs">
              Recommended Use / Audience
            </label>
            <input
              type="text"
              value={formData.useCase}
              onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
              placeholder="e.g. C-Suite, Founders, Frequent Flyers, Consulting, Programming"
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none text-xs"
            />
            {/* Quick Preset Tags */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 font-semibold mr-1">Quick Add:</span>
              {[
                'C-Suite, Founders, Frequent Flyers, Consulting',
                'Programming & Coding',
                'Business & Corporate',
                'Students & College',
                'Graphic Design & 4K Video',
                'Gaming & High Performance',
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
            4. Image Gallery &amp; Marketing Badges
          </h2>

          <div className="bg-[#F7F8FA] border border-[#E8E8E8] rounded-2xl p-4 sm:p-5">
            <CloudinaryMultiImageUploader
              images={images}
              onChange={setImages}
            />
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
