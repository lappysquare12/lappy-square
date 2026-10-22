'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, CheckCircle2, AlertCircle, Trash2, Edit2 } from 'lucide-react';
import EditCouponModal, { CouponItemData } from './EditCouponModal';

interface CouponItem {
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

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponItemData | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '10',
    minOrderValue: '15000',
    maxDiscount: '2500',
  });

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/admin/coupons');
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon "${code}"?`)) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert('Failed to delete coupon');
      }
    } catch {
      alert('Error deleting coupon');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ code: '', description: '', discountType: 'PERCENTAGE', discountValue: '10', minOrderValue: '15000', maxDiscount: '2500' });
        fetchCoupons();
      }
    } catch {
      alert('Error creating coupon');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <Tag className="w-7 h-7 text-emerald-600" />
            <span>Discount Coupons &amp; Promotions</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create percentage discounts, flat cashbacks, and minimum cart spend rules.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Cancel' : 'Create New Coupon'}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-[#E8E8E8] rounded-3xl p-6 shadow-sm space-y-4 text-xs">
          <h2 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
            New Promo Code Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Coupon Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                required
                placeholder="e.g. FESTIVE15"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none font-bold uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Discount Type</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none font-semibold"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (₹)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Discount Value *</label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                required
                placeholder="10 or 2000"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Min Order Value (₹)</label>
              <input
                type="number"
                value={formData.minOrderValue}
                onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                placeholder="15000"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Max Discount Cap (₹)</label>
              <input
                type="number"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                placeholder="2500"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g. 10% instant discount"
                className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold cursor-pointer hover:bg-slate-800 transition-colors"
            >
              Save Coupon
            </button>
          </div>
        </form>
      )}

      {/* Coupons Table */}
      <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3">Code</th>
                <th className="py-3">Discount</th>
                <th className="py-3">Min Order</th>
                <th className="py-3">Redeemed</th>
                <th className="py-3">Valid Until</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {coupons.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No discount coupons found. Click &quot;Create New Coupon&quot; to add one.
                  </td>
                </tr>
              )}
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 font-mono font-bold text-slate-900 text-xs">
                    {c.code}
                    {c.description && <span className="block font-sans text-[10px] text-slate-400 font-normal">{c.description}</span>}
                  </td>
                  <td className="py-3 font-bold text-emerald-700">
                    {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}
                  </td>
                  <td className="py-3">
                    ₹{c.minOrderValue.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3">
                    {c.currentUses} / {c.maxUses}
                  </td>
                  <td className="py-3 text-slate-500">
                    {new Date(c.validUntil).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </td>
                  <td className="py-3">
                    {c.active ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        Active
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditingCoupon(c)}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Coupon"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(c.id, c.code)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Coupon Modal */}
      {editingCoupon && (
        <EditCouponModal
          coupon={editingCoupon}
          isOpen={!!editingCoupon}
          onClose={() => setEditingCoupon(null)}
          onSuccess={fetchCoupons}
        />
      )}

    </div>
  );
}

