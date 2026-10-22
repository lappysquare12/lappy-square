'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';

interface FilterProps {
  brands: Array<{ id: string; name: string; slug: string }>;
  categories: Array<{ id: string; name: string; slug: string }>;
}

export default function ShopFilters({ brands }: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const currentBrand = searchParams.get('brand') || '';
  const currentSort = searchParams.get('sort') || '';
  const currentRam = searchParams.get('ram') || '';
  const currentStorage = searchParams.get('storage') || '';
  const currentGrade = searchParams.get('grade') || '';
  const currentUseCase = searchParams.get('useCase') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const setPriceRange = (min: string, max: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set('minPrice', min);
    else params.delete('minPrice');

    if (max) params.set('maxPrice', max);
    else params.delete('maxPrice');

    router.push(`/shop?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/shop');
  };

  const hasActiveFilters =
    Boolean(currentBrand || currentRam || currentStorage || currentGrade || currentUseCase || currentMinPrice || currentMaxPrice);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Active Filters</span>
            <button
              onClick={clearAllFilters}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {currentBrand && (
              <span className="bg-white border border-slate-200 text-blue-700 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium shadow-2xs">
                Brand: {currentBrand}
                <button onClick={() => updateParam('brand', '')}><X className="w-3 h-3 text-slate-400 hover:text-slate-700" /></button>
              </span>
            )}
            {currentRam && (
              <span className="bg-white border border-slate-200 text-blue-700 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium shadow-2xs">
                RAM: {currentRam}GB
                <button onClick={() => updateParam('ram', '')}><X className="w-3 h-3 text-slate-400 hover:text-slate-700" /></button>
              </span>
            )}
            {currentGrade && (
              <span className="bg-white border border-slate-200 text-blue-700 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium shadow-2xs">
                Grade: {currentGrade}
                <button onClick={() => updateParam('grade', '')}><X className="w-3 h-3 text-slate-400 hover:text-slate-700" /></button>
              </span>
            )}
            {(currentMinPrice || currentMaxPrice) && (
              <span className="bg-white border border-slate-200 text-blue-700 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium shadow-2xs">
                Price: {currentMinPrice ? `₹${Number(currentMinPrice).toLocaleString('en-IN')}` : '0'} – {currentMaxPrice ? `₹${Number(currentMaxPrice).toLocaleString('en-IN')}` : 'Any'}
                <button onClick={() => setPriceRange('', '')}><X className="w-3 h-3 text-slate-400 hover:text-slate-700" /></button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Sort By Dropdown */}
      <div>
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
          Sort Products By
        </label>
        <select
          value={currentSort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium rounded-xl p-3 outline-none focus:bg-white focus:border-blue-600 transition-colors"
        >
          <option value="">Featured / Recommended</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Customer Rated</option>
          <option value="bestseller">Best Selling First</option>
          <option value="newest">Recently Certified / Newest</option>
        </select>
      </div>

      {/* Budget Range Presets */}
      <div className="border-t border-slate-100 pt-4">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          Budget Range
        </label>
        <div className="space-y-1 text-xs">
          {[
            { label: 'All Budgets', min: '', max: '' },
            { label: 'Under ₹15,000', min: '0', max: '15000' },
            { label: '₹15,000 – ₹25,000', min: '15000', max: '25000' },
            { label: '₹25,000 – ₹40,000', min: '25000', max: '40000' },
            { label: '₹40,000 – ₹60,000', min: '40000', max: '60000' },
            { label: 'Above ₹60,000', min: '60000', max: '999999' },
          ].map((b, i) => {
            const isSelected = currentMinPrice === b.min && currentMaxPrice === b.max;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setPriceRange(b.min, b.max)}
                className={`w-full text-left px-3 py-2 rounded-xl transition-all font-medium ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Selection */}
      <div className="border-t border-slate-100 pt-4">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          Brand Maker
        </label>
        <div className="space-y-1 text-xs">
          <button
            type="button"
            onClick={() => updateParam('brand', '')}
            className={`w-full text-left px-3 py-2 rounded-xl transition-all font-medium ${
              !currentBrand
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Brands
          </button>
          {brands.map((b) => {
            const isSelected = currentBrand === b.slug;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => updateParam('brand', isSelected ? '' : b.slug)}
                className={`w-full text-left px-3 py-2 rounded-xl transition-all font-medium ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {b.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Condition Grade */}
      <div className="border-t border-slate-100 pt-4">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          Cosmetic Grade
        </label>
        <div className="space-y-1 text-xs">
          {[
            { label: 'All Grades', val: '' },
            { label: 'Grade A+ (Like New)', val: 'LIKE_NEW' },
            { label: 'Grade A (Pristine)', val: 'EXCELLENT' },
            { label: 'Grade B (Refurbished)', val: 'GOOD' },
          ].map((g) => {
            const isSelected = currentGrade === g.val;
            return (
              <button
                key={g.val}
                type="button"
                onClick={() => updateParam('grade', g.val)}
                className={`w-full text-left px-3 py-2 rounded-xl transition-all font-medium ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* RAM Options */}
      <div className="border-t border-slate-100 pt-4">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          RAM Memory
        </label>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {['8', '16', '32'].map((ramVal) => {
            const isSelected = currentRam === ramVal;
            return (
              <button
                key={ramVal}
                type="button"
                onClick={() => updateParam('ram', isSelected ? '' : ramVal)}
                className={`py-2 rounded-xl text-center transition-all font-semibold border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                {ramVal}GB
              </button>
            );
          })}
        </div>
      </div>

      {/* Storage Options */}
      <div className="border-t border-slate-100 pt-4">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          SSD Storage
        </label>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {[
            { label: '256GB', val: '256' },
            { label: '512GB', val: '512' },
            { label: '1TB', val: '1024' },
          ].map((st) => {
            const isSelected = currentStorage === st.val;
            return (
              <button
                key={st.val}
                type="button"
                onClick={() => updateParam('storage', isSelected ? '' : st.val)}
                className={`py-2 rounded-xl text-center transition-all font-semibold border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-bold py-3 px-4 rounded-2xl flex items-center justify-between shadow-xs"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Filter & Sort Inventory</span>
          </span>
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">
              Active
            </span>
          )}
        </button>
      </div>

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block bg-white border border-slate-200 rounded-3xl p-6 shadow-xs sticky top-28 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Filter Catalogue</span>
          </h2>
        </div>
        <FilterContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-xs lg:hidden">
          <div className="ml-auto w-full max-w-xs bg-white border-l border-slate-200 h-full p-6 overflow-y-auto flex flex-col justify-between shadow-xl text-slate-800">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Filters & Sorting</h3>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterContent />
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
