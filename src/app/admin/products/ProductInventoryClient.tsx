'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Copy,
  Check,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Sparkles,
  Laptop,
  Tag
} from 'lucide-react';
import ProductTableActions from './ProductTableActions';
import FirestoreSyncButton from './FirestoreSyncButton';

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  sku: string;
  series?: string | null;
  brand: { id: string; name: string; slug: string };
  category: { id: string; name: string; slug: string };
  conditionGrade: string;
  price: number;
  originalPrice: number;
  stock: number;
  processor: string;
  ramGb: number;
  storageGb: number;
  batteryHealth?: string | null;
  active: boolean;
  images: { url: string }[];
}

export default function ProductInventoryClient({
  initialProducts,
}: {
  initialProducts: ProductItem[];
}) {
  const [products] = useState<ProductItem[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedSku, setCopiedSku] = useState<string | null>(null);

  const brands = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => {
      if (p.brand) map.set(p.brand.name, p.brand.name);
    });
    return Array.from(map.values()).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.series && p.series.toLowerCase().includes(q)) ||
        p.processor.toLowerCase().includes(q);

      const matchesBrand =
        selectedBrand === 'ALL' ||
        p.brand?.name?.toLowerCase() === selectedBrand.toLowerCase();

      return matchesSearch && matchesBrand;
    });
  }, [products, searchQuery, selectedBrand]);

  const handleCopy = (text: string, type: 'id' | 'sku') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      setCopiedSku(text);
      setTimeout(() => setCopiedSku(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-950 tracking-tight">
            Laptop Inventory ({products.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Search by Item Code, Product ID, brand series, or hardware specifications.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
          <div className="col-span-2 sm:col-auto">
            <FirestoreSyncButton />
          </div>
          <Link
            href="/admin/brands"
            className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-center"
            title="Manage Brand Series (MacBook Air/Pro, Latitude, etc.)"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Brand Series</span>
          </Link>
          <Link
            href="/admin/products/new"
            className="px-3 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-700/20 flex items-center justify-center gap-1.5 transition-all text-center"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Laptop</span>
          </Link>
        </div>
      </div>

      {/* Filter and Live Item Code Search Bar */}
      <div className="bg-white border border-[#E8E8E8] rounded-2xl p-3 sm:p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SKU, Product ID, Model, Processor..."
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl py-2.5 pl-10 pr-8 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black text-xs font-bold p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Brand Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase hidden sm:inline">Brand:</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full sm:w-auto bg-[#F8FAFC] border border-slate-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600"
            >
              <option value="ALL">All Brands ({products.length})</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Quick hint on Item Code */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex-wrap gap-2">
          <span>
            Showing <strong>{filteredProducts.length}</strong> of {products.length} laptops
          </span>
          <span className="text-slate-400 hidden sm:inline">
            💡 Click on any <strong>Item Code (SKU)</strong> to copy.
          </span>
        </div>
      </div>

      {/* Responsive Table / Card Container */}
      <div className="bg-white border border-[#E8E8E8] rounded-3xl shadow-xs overflow-hidden">
        
        {/* Mobile & Tablet Clean Card View (< lg) */}
        <div className="block lg:hidden divide-y divide-slate-100">
          {filteredProducts.map((p) => {
            const isIdCopied = copiedId === p.id;
            const isSkuCopied = copiedSku === p.sku;

            return (
              <div key={p.id} className="p-4 space-y-3">
                
                {/* Top Badges & SKU Row */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleCopy(p.sku, 'sku')}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-[10px] font-mono font-bold transition-all"
                      title="Click to copy Item Code (SKU)"
                    >
                      <span>{p.sku}</span>
                      {isSkuCopied ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-blue-500" />
                      )}
                    </button>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                      {p.brand.name} {p.series ? `• ${p.series}` : ''}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/60">
                    Grade {p.conditionGrade}
                  </span>
                </div>

                {/* Product Info Row */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200/80 relative overflow-hidden shrink-0">
                    <img
                      src={p.images[0]?.url || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=200&q=80'}
                      alt={p.title}
                      className="object-contain w-full h-full p-1"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug">
                      {p.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-slate-600 font-medium">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded">{p.processor}</span>
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded">{p.ramGb}GB RAM</span>
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded">{p.storageGb}GB SSD</span>
                      {p.batteryHealth && (
                        <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded">
                          🔋 {p.batteryHealth}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing, Stock & Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                  <div>
                    <span className="font-black text-slate-950 text-base">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    {p.originalPrice > p.price && (
                      <span className="text-[10px] text-slate-400 line-through ml-1.5">
                        ₹{p.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    <span
                      className={`block text-[10px] font-bold mt-0.5 ${
                        p.stock > 0 ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {p.stock > 0 ? `In Stock (${p.stock})` : 'Out of Stock'}
                    </span>
                  </div>

                  <div className="shrink-0">
                    <ProductTableActions product={p} />
                  </div>
                </div>

              </div>
            );
          })}
          {filteredProducts.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching laptops found. Try clearing your search.
            </div>
          )}
        </div>

        {/* Desktop Full Table View (Visible only on >= lg) */}
        <div className="hidden lg:block overflow-x-auto min-w-full">
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Item Code &amp; Photo</th>
                <th className="py-3 px-3">Laptop Model Details</th>
                <th className="py-3 px-2">Brand &amp; Series</th>
                <th className="py-3 px-2">Grade</th>
                <th className="py-3 px-2">Selling Price</th>
                <th className="py-3 px-2">Stock</th>
                <th className="py-3 px-2">Battery</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.map((p) => {
                const isIdCopied = copiedId === p.id;
                const isSkuCopied = copiedSku === p.sku;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Image & Quick Item Code */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 relative overflow-hidden flex-shrink-0">
                          <img
                            src={p.images[0]?.url || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=200&q=80'}
                            alt={p.title}
                            className="object-contain w-full h-full p-1"
                          />
                        </div>
                        <div className="space-y-1">
                          {/* Item Code (SKU) pill */}
                          <button
                            type="button"
                            onClick={() => handleCopy(p.sku, 'sku')}
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-[10px] font-mono font-bold transition-all text-left"
                            title="Click to copy Item Code"
                          >
                            <span>{p.sku}</span>
                            {isSkuCopied ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3 text-blue-500" />
                            )}
                          </button>

                          {/* Product ID pill */}
                          <button
                            type="button"
                            onClick={() => handleCopy(p.id, 'id')}
                            className="flex items-center gap-1 text-[9px] text-slate-400 hover:text-slate-700 font-mono transition-colors"
                            title="Click to copy Product ID"
                          >
                            <span>ID: {p.id.slice(0, 8)}...</span>
                            {isIdCopied ? (
                              <Check className="w-2.5 h-2.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-2.5 h-2.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Title & Hardware Specs */}
                    <td className="py-3 px-3 max-w-[260px]">
                      <p className="font-bold text-slate-900 line-clamp-1 text-xs" title={p.title}>
                        {p.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {p.processor} • {p.ramGb}GB RAM • {p.storageGb}GB SSD
                      </p>
                    </td>

                    {/* Brand & Series Type */}
                    <td className="py-3 px-2">
                      <span className="font-bold text-slate-900 block">{p.brand.name}</span>
                      {p.series ? (
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-semibold inline-block mt-0.5">
                          {p.series}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Standard</span>
                      )}
                    </td>

                    {/* Grade */}
                    <td className="py-3 px-2">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                        {p.conditionGrade}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-2">
                      <span className="font-black text-slate-950 block text-xs">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                      {p.originalPrice > p.price && (
                        <span className="text-[10px] text-slate-400 line-through">
                          ₹{p.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          p.stock > 2
                            ? 'bg-slate-100 text-slate-800'
                            : p.stock > 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {p.stock} pcs
                      </span>
                    </td>

                    {/* Battery */}
                    <td className="py-3 px-2 text-[11px] text-slate-600 whitespace-nowrap">
                      {p.batteryHealth || '85%+ OEM'}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <ProductTableActions product={p} />
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 p-4">
              <Laptop className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">No matching laptops found</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Try searching with a different Item Code, ID, or title.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
