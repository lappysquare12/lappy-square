'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Check,
  Loader2,
  Sparkles,
  Laptop,
  ShieldCheck,
  Upload,
  Image as ImageIcon,
  Copy,
  Tag
} from 'lucide-react';
import CloudinaryMultiImageUploader from '@/components/admin/CloudinaryMultiImageUploader';

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
  series?: string | null;
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
  displayResolution?: string | null;
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
  brandSeries = [],
}: {
  product: ProductData;
  brands: Brand[];
  categories: Category[];
  brandSeries?: Array<{ id: string; brandId: string; name: string; slug: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedSku, setCopiedSku] = useState(false);
  const [seriesList, setSeriesList] = useState<Array<{ id: string; brandId: string; name: string; slug: string }>>(brandSeries);
  const [isCustomSeries, setIsCustomSeries] = useState(false);
  const [images, setImages] = useState<string[]>(
    product.images && product.images.length > 0
      ? product.images.map((img) => img.url)
      : [product.images?.[0]?.url || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80']
  );
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: product.title,
    slug: product.slug,
    sku: product.sku,
    brandId: product.brandId,
    series: product.series || '',
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
    displayResolution: product.displayResolution || '',
    graphicsCard: product.graphicsCard || 'Integrated Graphics',
    os: product.os || 'Windows 11 Pro Genuine',
    batteryHealth: product.batteryHealth || '90%+ Certified Health',
    batteryBackupHours: product.batteryBackupHours || '4-6 Hours',
    warrantyMonths: String(product.warrantyMonths),
    includedAccessories: product.includedAccessories || 'Original Charger, Power Cable, Lappy Square Laptop Bag, Warranty Card',
    weightKg: product.weightKg || '1.4 kg',
    useCase: product.useCase || 'Business, Students, Programming',
    description: product.description || '',
    featured: product.featured,
    bestSeller: product.bestSeller,
    isDealOfTheDay: product.isDealOfTheDay,
    active: product.active,
    imageUrl: product.images[0]?.url || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80',
  });

  useEffect(() => {
    fetch('/api/admin/meta')
      .then((r) => r.json())
      .then((data) => {
        if (data.brandSeries) {
          setSeriesList(data.brandSeries);
        }
      })
      .catch(() => {});
  }, []);

  const handleCopy = (text: string, type: 'id' | 'sku') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedSku(true);
      setTimeout(() => setCopiedSku(false), 2000);
    }
  };

  const handleRegenerateSlug = () => {
    const slugified = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData((prev) => ({ ...prev, slug: slugified || 'laptop' }));
  };

  const handleRegenerateSku = () => {
    const brandObj = brands.find((b) => b.id === formData.brandId);
    const bCode = (brandObj?.name || 'LAP').slice(0, 3).toUpperCase();
    const sCode = (formData.series || 'MOD').slice(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
    const genSku = `LS-${bCode}-${sCode || 'GEN'}-${Math.floor(100 + Math.random() * 900)}`;
    setFormData((prev) => ({ ...prev, sku: genSku }));
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
          images: images,
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
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Edit Laptop: {product.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {/* Product ID Pill with Copy */}
              <button
                type="button"
                onClick={() => handleCopy(product.id, 'id')}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-mono transition-colors"
                title="Click to copy Product ID"
              >
                <span>ID: {product.id}</span>
                {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
              </button>

              {/* SKU / Item Code Pill with Copy */}
              <button
                type="button"
                onClick={() => handleCopy(formData.sku, 'sku')}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-[11px] font-mono font-bold transition-colors"
                title="Click to copy Item Code"
              >
                <span>Item Code: {formData.sku}</span>
                {copiedSku ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-blue-600" />}
              </button>
            </div>
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
          <span>1. Core Model &amp; Brand Identity</span>
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

        {/* Slug & Item Code (SKU) row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">URL Slug *</label>
              <button
                type="button"
                onClick={handleRegenerateSlug}
                className="text-[11px] text-blue-700 font-bold hover:underline"
              >
                🔄 Re-sync from Title
              </button>
            </div>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 font-mono text-xs text-slate-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              💡 <strong>Slug:</strong> Web URL link identifier (e.g. lappy.com/product/<strong>{formData.slug}</strong>).
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Product Item Code (SKU) *</label>
              <button
                type="button"
                onClick={handleRegenerateSku}
                className="text-[11px] text-blue-700 font-bold hover:underline"
              >
                ⚡ Auto Code
              </button>
            </div>
            <input
              type="text"
              required
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 font-mono text-xs uppercase font-bold text-slate-900"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              🏷️ Product item code used by clients for orders, WhatsApp inquiry, and store lookup.
            </p>
          </div>
        </div>

        {/* Brand, Brand Series/Type, Category, Grade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Brand</label>
            <select
              value={formData.brandId}
              onChange={(e) => {
                const newBrandId = e.target.value;
                setFormData((prev) => ({ ...prev, brandId: newBrandId, series: '' }));
                setIsCustomSeries(false);
              }}
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
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Series / Model Line
            </label>
            {!isCustomSeries ? (
              <select
                value={formData.series}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setIsCustomSeries(true);
                    setFormData({ ...formData, series: '' });
                  } else {
                    setFormData({ ...formData, series: e.target.value });
                  }
                }}
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 font-semibold text-slate-800 text-xs"
              >
                <option value="">Select Series / Model (e.g. MacBook Air, Latitude)</option>
                {(() => {
                  const selectedBrand = brands.find((b) => b.id === formData.brandId);
                  const brandNameLower = (selectedBrand?.name || '').toLowerCase();
                  
                  const dbMatches = seriesList.filter(
                    (s) => !formData.brandId || s.brandId === formData.brandId
                  );

                  const fallbackMap: Record<string, string[]> = {
                    apple: ['MacBook Air', 'MacBook Pro', 'iMac & Mac Mini'],
                    dell: ['Latitude', 'XPS', 'Inspiron', 'Precision', 'Alienware', 'Vostro'],
                    lenovo: ['ThinkPad', 'ThinkPad X1', 'IdeaPad', 'Legion', 'ThinkBook', 'Yoga'],
                    hp: ['EliteBook', 'ProBook', 'ZBook', 'Pavilion', 'Envy', 'Omen', 'Spectre'],
                    asus: ['ZenBook', 'ROG Gaming', 'TUF Gaming', 'VivoBook', 'ExpertBook'],
                    acer: ['Swift', 'Aspire', 'Predator', 'Nitro'],
                  };

                  const fallbackList = fallbackMap[brandNameLower] || [];

                  const options = dbMatches.length > 0 
                    ? dbMatches.map((s) => s.name)
                    : fallbackList;

                  return options.map((optName) => (
                    <option key={optName} value={optName}>
                      {optName}
                    </option>
                  ));
                })()}
                <option value="__custom__">+ Type New Series Name...</option>
              </select>
            ) : (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={formData.series}
                  onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                  placeholder="Type series name (e.g. MacBook Air M2, Latitude 5420)"
                  className="w-full bg-[#F7F8FA] border border-blue-500 rounded-xl p-2.5 outline-none text-xs text-slate-900 font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setIsCustomSeries(false)}
                  className="text-[11px] text-slate-500 hover:text-black px-2.5 py-2.5 rounded-xl bg-slate-100 whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            )}
            
            {/* Clean Actions & Helpers Row */}
            <div className="flex items-center justify-between gap-1.5 mt-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setIsCustomSeries(!isCustomSeries)}
                className="text-blue-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                {isCustomSeries ? '← Select from List' : '+ Type New Series'}
              </button>
              <Link
                href="/admin/brands"
                target="_blank"
                className="text-slate-500 hover:text-blue-700 font-semibold whitespace-nowrap inline-flex items-center gap-0.5"
              >
                <span>Manage All</span>
                <span>→</span>
              </Link>
            </div>
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

      {/* SECTION 3: FULL TECHNICAL SPECIFICATIONS */}
      <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>3. Full Technical Specifications (Storefront Specs Table)</span>
          </h2>
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
            All details live on product page
          </span>
        </div>

        {/* Row 1: Processor & Generation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Processor Family *</label>
            <input
              type="text"
              value={formData.processor}
              onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
              placeholder="e.g. Intel Core i7 / Apple M1"
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Processor Model & Clock</label>
            <input
              type="text"
              value={formData.processorModel}
              onChange={(e) => setFormData({ ...formData, processorModel: e.target.value })}
              placeholder="e.g. Core i7-10610U vPro (Hexa-Core up to 4.9GHz)"
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Generation</label>
            <input
              type="text"
              value={formData.processorGen}
              onChange={(e) => setFormData({ ...formData, processorGen: e.target.value })}
              placeholder="e.g. 10th Gen / 11th Gen / Apple Silicon"
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* Row 2: RAM & Storage */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">RAM Capacity (GB) *</label>
            <select
              value={formData.ramGb}
              onChange={(e) => setFormData({ ...formData, ramGb: e.target.value })}
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 font-semibold"
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
            <label className="block font-bold text-slate-700 mb-1">RAM Type & Frequency</label>
            <input
              type="text"
              value={formData.ramType}
              onChange={(e) => setFormData({ ...formData, ramType: e.target.value })}
              placeholder="e.g. 16GB LPDDR3 2133MHz / DDR4 3200MHz"
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Storage SSD (GB) *</label>
            <select
              value={formData.storageGb}
              onChange={(e) => setFormData({ ...formData, storageGb: e.target.value })}
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 font-semibold"
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
            <label className="block font-bold text-slate-700 mb-1">Storage Type & Interface</label>
            <input
              type="text"
              value={formData.storageType}
              onChange={(e) => setFormData({ ...formData, storageType: e.target.value })}
              placeholder="e.g. 512GB M.2 NVMe SSD / PCIe Gen4"
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* Row 3: Display & Graphics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Screen Size</label>
            <input
              type="text"
              value={formData.screenSize}
              onChange={(e) => setFormData({ ...formData, screenSize: e.target.value })}
              placeholder="e.g. 14.0 Inch / 13.3 Inch / 15.6 Inch"
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Screen Size & Res (Full Display Specs)</label>
            <input
              type="text"
              value={formData.displayResolution}
              onChange={(e) => setFormData({ ...formData, displayResolution: e.target.value })}
              placeholder="e.g. 14.0 Inch FHD IPS 400 nits PrivacyGuard Display (1920 x 1080)"
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Graphics Controller</label>
            <input
              type="text"
              value={formData.graphicsCard}
              onChange={(e) => setFormData({ ...formData, graphicsCard: e.target.value })}
              placeholder="e.g. Intel UHD Graphics 620 / NVIDIA RTX 3050"
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* Row 4: OS, Battery, Weight & Warranty */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Operating System</label>
            <input
              type="text"
              value={formData.os}
              onChange={(e) => setFormData({ ...formData, os: e.target.value })}
              placeholder="e.g. Windows 11 Pro Genuine (100% Genuine License)"
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Battery Health Status</label>
            <input
              type="text"
              value={formData.batteryHealth}
              onChange={(e) => setFormData({ ...formData, batteryHealth: e.target.value })}
              placeholder="e.g. 90% Certified OEM Health"
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Battery Backup Duration</label>
            <input
              type="text"
              value={formData.batteryBackupHours}
              onChange={(e) => setFormData({ ...formData, batteryBackupHours: e.target.value })}
              placeholder="e.g. 8-10 Hours / 6-8 Hours"
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Weight</label>
            <input
              type="text"
              value={formData.weightKg}
              onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
              placeholder="e.g. 1.09 kg / 1.4 kg"
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* Row 5: Warranty & What's in the Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
          <div className="lg:col-span-5 space-y-2">
            <label className="block font-bold text-slate-700">
              Warranty Coverage (Months) *
            </label>
            
            {/* Manual numeric input */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="60"
                value={formData.warrantyMonths}
                onChange={(e) => setFormData({ ...formData, warrantyMonths: e.target.value })}
                placeholder="Enter months (e.g. 1, 3, 6, 12, 24, 36)"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none font-black text-slate-950 text-sm focus:border-blue-600"
              />
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Months</span>
            </div>

            {/* Quick 1 to 3 Presets */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick 1 to 3 Selectors:</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: '1 Year (12M)', val: '12' },
                  { label: '2 Years (24M)', val: '24' },
                  { label: '3 Years (36M)', val: '36' },
                  { label: '6 Months', val: '6' },
                  { label: '3 Months', val: '3' },
                  { label: '1 Month', val: '1' },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setFormData({ ...formData, warrantyMonths: preset.val })}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                      formData.warrantyMonths === preset.val
                        ? 'bg-blue-700 text-white border-blue-700 shadow-2xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">What&apos;s in the Box & Accessories (Comma-separated)</label>
            <input
              type="text"
              value={formData.includedAccessories}
              onChange={(e) => setFormData({ ...formData, includedAccessories: e.target.value })}
              placeholder="e.g. 1x Original OEM Power Adapter & Power Cable, 1x Lappy Square Laptop Bag, 1x 45-Point Certificate, 1x Warranty Card"
              className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600"
            />
          </div>
        </div>

        {/* Row 6: Recommended Use */}
        <div className="pt-2 text-xs">
          <label className="block font-bold text-slate-700 mb-1">
            Recommended Use / Audience
          </label>
          <input
            type="text"
            value={formData.useCase}
            onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
            placeholder="e.g. C-Suite, Founders, Frequent Flyers, Consulting, Programming"
            className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 text-xs font-medium"
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

      {/* SECTION 4: MEDIA & MARKETING FLAGS */}
      <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-950 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span>4. Media & Display Flags</span>
        </h2>

        <div className="bg-[#F7F8FA] border border-[#E8E8E8] rounded-2xl p-4 sm:p-5">
          <CloudinaryMultiImageUploader
            images={images}
            onChange={setImages}
          />
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
