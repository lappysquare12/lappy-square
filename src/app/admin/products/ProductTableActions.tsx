'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, Edit2, Trash2, Loader2, X, AlertTriangle, Check } from 'lucide-react';

interface ProductTableActionsProps {
  product: {
    id: string;
    slug: string;
    title: string;
    price?: number;
    originalPrice?: number;
    stock?: number;
  };
}

export default function ProductTableActions({ product }: ProductTableActionsProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Edit states
  const [price, setPrice] = useState(product.price ? String(product.price) : '');
  const [originalPrice, setOriginalPrice] = useState(product.originalPrice ? String(product.originalPrice) : '');
  const [stock, setStock] = useState(product.stock !== undefined ? String(product.stock) : '1');

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete product');
      }
      setShowDeleteModal(false);
      window.location.reload();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error deleting product');
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: Number(price),
          originalPrice: Number(originalPrice || price),
          stock: Number(stock),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update product');
      }
      setShowEditModal(false);
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error updating product');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        <Link
          href={`/product/${product.slug}`}
          target="_blank"
          className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          title="View Live Listing"
        >
          <Eye className="w-4 h-4" />
        </Link>

        <Link
          href={`/admin/products/${product.id}/edit`}
          className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit Laptop Specs & Details"
        >
          <Edit2 className="w-4 h-4" />
        </Link>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          title="Delete Product"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-950">Confirm Product Deletion</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Are you sure you want to permanently remove <strong className="text-slate-900 font-semibold">{product.title}</strong> from inventory?
                </p>
                <p className="text-[11px] text-rose-600 font-medium mt-2 bg-rose-50/80 border border-rose-100 rounded-lg p-2">
                  ⚠️ This will delete all associated photos and active cart listings.
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
                {errorMessage}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md shadow-rose-600/20 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Delete Laptop</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-950">Quick Edit Product</h3>
                <p className="text-xs text-slate-400 truncate max-w-[280px]">{product.title}</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Selling Price (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 font-bold text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Original Retail Price (₹)</label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 text-slate-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Inventory Stock Units</label>
                <input
                  type="number"
                  value={stock}
                  min="0"
                  onChange={(e) => setStock(e.target.value)}
                  required
                  className="w-full bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-2.5 outline-none focus:border-blue-600 text-slate-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-700/20 disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
