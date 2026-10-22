'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Edit3, Tag, Calendar, Percent, IndianRupee } from 'lucide-react';

export interface CouponItemData {
  id: string;
  code: string;
  description?: string | null;
  discountType: string;
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number | null;
  currentUses: number;
  maxUses: number;
  validUntil: string;
  active: boolean;
}

interface EditCouponModalProps {
  coupon: CouponItemData | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditCouponModal({
  coupon,
  isOpen,
  onClose,
  onSuccess,
}: EditCouponModalProps) {
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderValue, setMinOrderValue] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [active, setActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (coupon) {
      setCode(coupon.code || '');
      setDescription(coupon.description || '');
      setDiscountType(coupon.discountType || 'PERCENTAGE');
      setDiscountValue(coupon.discountValue !== undefined ? String(coupon.discountValue) : '');
      setMinOrderValue(coupon.minOrderValue !== undefined ? String(coupon.minOrderValue) : '0');
      setMaxDiscount(coupon.maxDiscount ? String(coupon.maxDiscount) : '');
      setMaxUses(coupon.maxUses ? String(coupon.maxUses) : '100');
      if (coupon.validUntil) {
        try {
          const d = new Date(coupon.validUntil);
          setValidUntil(d.toISOString().split('T')[0]);
        } catch {
          setValidUntil('');
        }
      }
      setActive(coupon.active ?? true);
      setError(null);
    }
  }, [coupon]);

  if (!isOpen || !coupon) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) {
      setError('Coupon code and discount value are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          description: description.trim() || null,
          discountType,
          discountValue: Number(discountValue),
          minOrderValue: Number(minOrderValue || 0),
          maxDiscount: maxDiscount ? Number(maxDiscount) : null,
          maxUses: maxUses ? Number(maxUses) : 100,
          validUntil: validUntil ? new Date(validUntil).toISOString() : undefined,
          active,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update coupon');
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating coupon';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 tracking-tight">Edit Coupon</h3>
              <p className="text-[11px] text-slate-500 font-mono font-semibold">{coupon.code}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Coupon Code *</label>
              <div className="relative">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FESTIVE20"
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-600 outline-none font-mono font-bold uppercase tracking-wider"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Discount Type *</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-600 outline-none font-semibold text-slate-800"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Flat Amount (₹)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Discount Value * {discountType === 'PERCENTAGE' ? '(%)' : '(₹)'}
              </label>
              <div className="relative">
                {discountType === 'PERCENTAGE' ? (
                  <Percent className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                ) : (
                  <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                )}
                <input
                  type="number"
                  required
                  min="1"
                  max={discountType === 'PERCENTAGE' ? '100' : undefined}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={discountType === 'PERCENTAGE' ? '10' : '1500'}
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-600 outline-none font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Min Order Value (₹)</label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="0"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(e.target.value)}
                  placeholder="0"
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-600 outline-none font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {discountType === 'PERCENTAGE' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">Max Discount Cap (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  placeholder="Optional, e.g. 2500"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-600 outline-none font-semibold"
                />
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">Max Usage Limit</label>
              <input
                type="number"
                min="1"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                placeholder="100"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-600 outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Expiry Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-600 outline-none font-semibold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Description / Tagline</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Instant 10% discount on all gaming laptops"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-emerald-600 outline-none font-medium"
            />
          </div>

          {/* Active Status Checkbox */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">Coupon Active Status</span>
              <span className="text-[11px] text-slate-500">
                Inactive coupons cannot be applied by customers at checkout.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-sm"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
