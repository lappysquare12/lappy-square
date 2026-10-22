'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Loader2, Sparkles, Laptop, Check, Upload, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    brandId: '',
    categoryId: '',
    conditionGrade: 'LIKE_NEW',
    price: '',
    originalPrice: '',
    stock: '1',
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
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMessage(null);

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
      setErrorMessage(err instanceof Error ? err.message : 'Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

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
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      setIsOpen(false);
      setFormData({
        title: '',
        brandId: brands[0]?.id || '',
        categoryId: categories[0]?.id || '',
        conditionGrade: 'LIKE_NEW',
        price: '',
        originalPrice: '',
        stock: '1',
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
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-3 outline-none focus:border-blue-600 font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand</label>
                  <select
                    value={formData.brandId}
                    onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
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
                  <label className="block font-bold text-slate-700 mb-1">Condition Grade</label>
                  <select
                    value={formData.conditionGrade}
                    onChange={(e) => setFormData({ ...formData, conditionGrade: e.target.value })}
                    className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 font-medium text-slate-800"
                  >
                    <option value="LIKE_NEW">Grade A+ (Like New)</option>
                    <option value="EXCELLENT">Grade A (Pristine)</option>
                    <option value="GOOD">Grade B (Certified)</option>
                  </select>
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

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-slate-700">Laptop Photo / Image</label>
                  <span className="text-[10px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Cloudinary Enabled
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* Thumbnail Preview */}
                  <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                    {uploadingImage ? (
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    ) : formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-1.5">
                    {/* Direct Cloudinary Upload Button */}
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl font-bold cursor-pointer transition-all text-xs">
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-600" />
                          <span>Uploading to Cloudinary...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5 text-sky-600" />
                          <span>Upload from Computer to Cloudinary</span>
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

                    {/* Or URL input */}
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="Or enter Cloudinary / Image URL (https://...)"
                      className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2 outline-none focus:border-blue-600 text-slate-700 text-[11px] font-mono"
                    />
                  </div>
                </div>
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
