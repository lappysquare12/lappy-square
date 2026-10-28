'use client';

import React, { useState } from 'react';
import { Tag, Plus, Trash2, Check, Loader2, Sparkles, AlertCircle, Laptop, ArrowRight } from 'lucide-react';

interface SeriesItem {
  id: string;
  brandId: string;
  name: string;
  slug: string;
  displayOrder: number;
  active: boolean;
  brand?: { id: string; name: string; slug: string };
}

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  series: SeriesItem[];
  _count?: { products: number };
}

interface BrandSeriesManagerProps {
  initialBrands: BrandItem[];
}

export default function BrandSeriesManager({ initialBrands }: BrandSeriesManagerProps) {
  const [brands, setBrands] = useState<BrandItem[]>(initialBrands);
  const [selectedBrandId, setSelectedBrandId] = useState<string>(
    initialBrands[0]?.id || ''
  );

  // New series state
  const [newSeriesName, setNewSeriesName] = useState('');
  const [addingSeries, setAddingSeries] = useState(false);
  const [seriesError, setSeriesError] = useState<string | null>(null);
  const [seriesSuccess, setSeriesSuccess] = useState<string | null>(null);

  // Deleting state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const selectedBrand = brands.find((b) => b.id === selectedBrandId) || brands[0];

  const handleAddSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeriesName.trim() || !selectedBrandId) return;

    setAddingSeries(true);
    setSeriesError(null);
    setSeriesSuccess(null);

    try {
      const res = await fetch('/api/admin/brands/series', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: selectedBrandId,
          name: newSeriesName.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add series');

      // Update local state
      setBrands((prev) =>
        prev.map((b) => {
          if (b.id === selectedBrandId) {
            return {
              ...b,
              series: [...b.series, data.series],
            };
          }
          return b;
        })
      );

      setNewSeriesName('');
      setSeriesSuccess(`Added "${data.series.name}" to ${selectedBrand?.name || 'brand'}!`);
      setTimeout(() => setSeriesSuccess(null), 3000);
    } catch (err: unknown) {
      setSeriesError(err instanceof Error ? err.message : 'Error adding series');
    } finally {
      setAddingSeries(false);
    }
  };

  const handleDeleteSeries = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the series "${name}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/brands/series?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete series');

      setBrands((prev) =>
        prev.map((b) => {
          if (b.id === selectedBrandId) {
            return {
              ...b,
              series: b.series.filter((s) => s.id !== id),
            };
          }
          return b;
        })
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error deleting series');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro info box */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 sm:p-5 text-xs text-blue-900 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-sm text-blue-950">
            Brand Sub-Categories &amp; Model Series Management
          </p>
          <p className="text-blue-800 leading-relaxed">
            Organize each brand into its actual laptop types (e.g. Apple has <strong>MacBook Air</strong> and <strong>MacBook Pro</strong>; Dell has <strong>Latitude</strong> and <strong>XPS</strong>; Lenovo has <strong>ThinkPad</strong>).
            These series automatically populate the dropdown when adding or editing laptops in the admin panel and allow filtered browsing in the store.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Brand Selector, Right Series List */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Brand List (4 cols) */}
        <div className="md:col-span-4 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Select Brand ({brands.length})
          </h2>

          <div className="bg-white border border-[#E8E8E8] rounded-2xl p-2 space-y-1 shadow-2xs">
            {brands.map((b) => {
              const isSelected = b.id === selectedBrandId;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setSelectedBrandId(b.id);
                    setSeriesError(null);
                    setSeriesSuccess(null);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all text-xs font-bold ${
                    isSelected
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-current opacity-80" />
                    <span>{b.name}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {b.series?.length || 0} Types
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Series List & Add Series (8 cols) */}
        <div className="md:col-span-8 space-y-4">
          {selectedBrand ? (
            <div className="bg-white border border-[#E8E8E8] rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
              
              {/* Brand Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-950">
                      {selectedBrand.name} Laptop Series &amp; Types
                    </h3>
                    <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                      Brand Slug: {selectedBrand.slug}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure the models and series dropdown options for {selectedBrand.name}.
                  </p>
                </div>
              </div>

              {/* Add New Series Form */}
              <form onSubmit={handleAddSeries} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  + Add New Model / Series for {selectedBrand.name}
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={newSeriesName}
                    onChange={(e) => setNewSeriesName(e.target.value)}
                    placeholder={`e.g. ${
                      selectedBrand.name === 'Apple'
                        ? 'MacBook Air, MacBook Pro'
                        : selectedBrand.name === 'Dell'
                        ? 'Latitude, XPS, Inspiron'
                        : 'ThinkPad X1, EliteBook...'
                    }`}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-blue-700 text-slate-900"
                  />
                  <button
                    type="submit"
                    disabled={addingSeries || !newSeriesName.trim()}
                    className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50 shrink-0"
                  >
                    {addingSeries ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                    <span>Add Series</span>
                  </button>
                </div>

                {seriesSuccess && (
                  <div className="text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 animate-in fade-in">
                    <Check className="w-3.5 h-3.5" />
                    <span>{seriesSuccess}</span>
                  </div>
                )}

                {seriesError && (
                  <div className="text-rose-700 bg-rose-50 border border-rose-200 text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{seriesError}</span>
                  </div>
                )}
              </form>

              {/* Current Series List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                  <span>Current {selectedBrand.name} Series Types ({selectedBrand.series?.length || 0})</span>
                  <span>Action</span>
                </div>

                {selectedBrand.series && selectedBrand.series.length > 0 ? (
                  <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
                    {selectedBrand.series.map((item, idx) => (
                      <div
                        key={item.id}
                        className="p-3.5 sm:px-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              Slug: {item.slug}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleDeleteSeries(item.id, item.name)}
                            disabled={deletingId === item.id}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title={`Delete ${item.name}`}
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6 space-y-2">
                    <Tag className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold text-slate-600">
                      No model series added yet for {selectedBrand.name}.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Use the form above to add series like &quot;MacBook Air&quot; or &quot;MacBook Pro&quot;.
                    </p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
              <p className="text-xs text-slate-500">Select a brand to manage its series.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
