'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Loader2, Sparkles, Laptop, Check, Upload, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
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

export default function QuickAddProductModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80',
  ]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [seriesList, setSeriesList] = useState<Array<{ id: string; brandId: string; name: string; slug: string }>>([]);
  const [isCustomSeries, setIsCustomSeries] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    sku: '',
    brandId: '',
    series: '',
    categoryId: '',
    conditionGrade: 'LIKE_NEW',
    price: '',
    originalPrice: '',
    stock: '1',
    warrantyMonths: '12',
    processor: 'Intel Core i5 11th Gen',
    ramGb: '16',
    storageGb: '512',
    screenSize: '14.0" FHD',
    batteryHealth: '90%+ Certified Health',
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    bestSeller: false,
    isDealOfTheDay: false,
  });

  useEffect(() => {
    if (isOpen) {
      fetch('/api/admin/meta')
        .then((r) => r.json())
        .then((data) => {
          if (data.brands?.length) {
            setBrands(data.brands);
            setFormData((prev) => ({
              ...prev,
              brandId: prev.brandId || data.brands[0].id,
            }));
          }
          if (data.categories?.length) {
            setCategories(data.categories);
            setFormData((prev) => ({
              ...prev,
              categoryId: prev.categoryId || data.categories[0].id,
            }));
          }
          if (data.brandSeries) {
            setSeriesList(data.brandSeries);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          originalPrice: Number(formData.originalPrice || formData.price),
          stock: Number(formData.stock),
          ramGb: Number(formData.ramGb),
          storageGb: Number(formData.storageGb),
          images: images.length > 0 ? images : [formData.imageUrl],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      setIsOpen(false);
      setImages(['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80']);
      setFormData({
        title: '',
        slug: '',
        sku: '',
        brandId: brands[0]?.id || '',
        series: '',
        categoryId: categories[0]?.id || '',
        conditionGrade: 'LIKE_NEW',
        price: '',
        originalPrice: '',
        stock: '1',
        warrantyMonths: '12',
        processor: 'Intel Core i5 11th Gen',
        ramGb: '16',
        storageGb: '512',
        screenSize: '14.0" FHD',
        batteryHealth: '90%+ Certified Health',
        imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80',
        featured: false,
        bestSeller: false,
        isDealOfTheDay: false,
      });

      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-700/20 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Quick Add Laptop</span>
        </button>

        <Link
          href="/admin/products/new"
          className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all hidden sm:inline-flex items-center gap-1"
        >
          <span>Full Form</span>
        </Link>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-950">Add Laptop to Inventory</h3>
                  <p className="text-xs text-slate-500">Fill key specs to immediately publish live</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Product Title / Model Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apple MacBook Pro 14 M1 Pro / Dell Latitude 5420"
                  value={formData.title}
                  onChange={(e) => {
                    const titleVal = e.target.value;
                    const slugVal = titleVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setFormData((prev) => ({
                      ...prev,
                      title: titleVal,
                      slug: slugVal,
                      sku: prev.sku || `LS-${titleVal.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
                    }));
                  }}
                  className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none focus:border-blue-600 font-semibold text-slate-900"
                />
              </div>

              {/* Brand and Series Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand *</label>
                  <select
                    value={formData.brandId}
                    onChange={(e) => {
                      const newBrandId = e.target.value;
                      setFormData((prev) => ({ ...prev, brandId: newBrandId, series: '' }));
                      setIsCustomSeries(false);
                    }}
                    className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 font-medium text-slate-800"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                    {brands.length === 0 && <option value="dell">Dell</option>}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Series / Type (e.g. MacBook Air / Pro)
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
                      className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 font-medium text-slate-800 text-xs"
                    >
                      <option value="">Select Series / Type</option>
                      {(() => {
                        const selectedBrand = brands.find((b) => b.id === formData.brandId);
                        const brandNameLower = (selectedBrand?.name || '').toLowerCase();
                        
                        const dbMatches = seriesList.filter(
                          (s) => !formData.brandId || s.brandId === formData.brandId
                        );

                        const fallbackMap: Record<string, string[]> = {
                          apple: ['MacBook Air', 'MacBook Pro', 'iMac & Mac Mini'],
                          dell: ['Latitude (Enterprise)', 'XPS (Ultrabook)', 'Precision (Workstation)', 'Inspiron (Everyday)', 'Alienware & G-Series'],
                          lenovo: ['ThinkPad T Series', 'ThinkPad X1 Carbon', 'ThinkPad L & E Series', 'IdeaPad & Yoga', 'Legion Gaming'],
                          hp: ['EliteBook (Corporate)', 'ProBook', 'ZBook Workstation', 'Pavilion & Omen', 'Spectre & Envy'],
                          asus: ['ZenBook', 'ROG & TUF Gaming', 'ExpertBook', 'VivoBook'],
                          acer: ['Swift', 'Aspire', 'Nitro & Predator'],
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
                      <option value="__custom__">+ Enter Custom...</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={formData.series}
                        onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                        placeholder="e.g. MacBook Air"
                        className="w-full bg-[#F7F8FA] border border-blue-500 rounded-xl p-2 text-xs text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setIsCustomSeries(false)}
                        className="text-[11px] text-slate-500 hover:text-black px-2 py-1 rounded bg-slate-100"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Warranty Coverage: Presets & Manual */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 text-xs">Warranty Coverage</label>
                  <span className="text-[11px] font-bold text-blue-700">
                    {formData.warrantyMonths} Months Selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formData.warrantyMonths}
                    onChange={(e) => setFormData({ ...formData, warrantyMonths: e.target.value })}
                    className="w-24 bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-bold text-slate-900 text-center"
                    placeholder="Months"
                  />
                  <div className="flex flex-wrap gap-1">
                    {[
                      { l: '1Y (12M)', v: '12' },
                      { l: '2Y (24M)', v: '24' },
                      { l: '3Y (36M)', v: '36' },
                      { l: '6M', v: '6' },
                      { l: '3M', v: '3' },
                      { l: '1M', v: '1' },
                    ].map((p) => (
                      <button
                        key={p.v}
                        type="button"
                        onClick={() => setFormData({ ...formData, warrantyMonths: p.v })}
                        className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                          formData.warrantyMonths === p.v
                            ? 'bg-blue-700 text-white border-blue-700'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p.l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Selling Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 48999"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 font-bold text-slate-950"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 115000"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 text-slate-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Count</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Processor</label>
                  <input
                    type="text"
                    value={formData.processor}
                    onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
                    className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 text-slate-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">RAM (GB)</label>
                  <select
                    value={formData.ramGb}
                    onChange={(e) => setFormData({ ...formData, ramGb: e.target.value })}
                    className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 text-slate-700 font-medium"
                  >
                    <option value="8">8 GB</option>
                    <option value="16">16 GB</option>
                    <option value="32">32 GB</option>
                    <option value="64">64 GB</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Storage SSD (GB)</label>
                  <select
                    value={formData.storageGb}
                    onChange={(e) => setFormData({ ...formData, storageGb: e.target.value })}
                    className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 text-slate-700 font-medium"
                  >
                    <option value="256">256 GB SSD</option>
                    <option value="512">512 GB SSD</option>
                    <option value="1024">1 TB SSD</option>
                    <option value="2048">2 TB SSD</option>
                  </select>
                </div>
              </div>

              <div className="bg-[#F7F8FA] border border-[#E8E8E8] rounded-2xl p-3.5">
                <CloudinaryMultiImageUploader
                  images={images}
                  onChange={setImages}
                  label="Product Photos"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="font-semibold text-slate-700">Featured Listing</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bestSeller}
                    onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="font-semibold text-slate-700">Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDealOfTheDay}
                    onChange={(e) => setFormData({ ...formData, isDealOfTheDay: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="font-semibold text-slate-700">Deal of the Day</span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Link
                  href="/admin/products/new"
                  className="text-xs font-bold text-blue-700 hover:underline"
                >
                  Need full 45-point inspection specs form?
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-700/20 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>Save & Publish Live</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
