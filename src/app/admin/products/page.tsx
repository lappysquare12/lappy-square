import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import {
  Laptop,
  Plus,
  Search,
  Edit2,
  Trash2,
  BatteryCharging,
  Cpu,
  Eye,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import ProductTableActions from './ProductTableActions';
import QuickAddProductModal from './QuickAddProductModal';
import FirestoreSyncButton from './FirestoreSyncButton';
import { ensureFirestoreProductsSynced } from '@/lib/firestore-sync';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  await ensureFirestoreProductsSynced();

  const products = await prisma.product.findMany({
    include: { brand: true, category: true, images: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Laptop Inventory ({products.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage models, specifications, Cloudinary media, and live Firestore database sync.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <FirestoreSyncButton />
          <QuickAddProductModal />
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white border border-[#E8E8E8] rounded-3xl p-4 sm:p-6 shadow-xs overflow-hidden">
        <div className="overflow-x-auto -mx-1 sm:mx-0">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-2">Image</th>
                <th className="py-3">Title & SKU</th>
                <th className="py-3">Brand</th>
                <th className="py-3">Grade</th>
                <th className="py-3">Price</th>
                <th className="py-3">Stock</th>
                <th className="py-3">Battery Health</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-2">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 relative overflow-hidden">
                      <img
                        src={p.images[0]?.url || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=200&q=80'}
                        alt={p.title}
                        className="object-contain w-full h-full p-1"
                      />
                    </div>
                  </td>
                  <td className="py-3 max-w-[220px]">
                    <p className="font-bold text-slate-900 truncate">{p.title}</p>
                    <p className="text-[10px] text-slate-400">SKU: {p.sku}</p>
                    <p className="text-[10px] text-slate-500">{p.processor} • {p.ramGb}GB RAM • {p.storageGb}GB SSD</p>
                  </td>
                  <td className="py-3 font-semibold text-slate-800">
                    {p.brand.name}
                  </td>
                  <td className="py-3">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                      {p.conditionGrade}
                    </span>
                  </td>
                  <td className="py-3 font-black text-slate-950">
                    ₹{p.price.toLocaleString('en-IN')}
                    <span className="block text-[10px] text-slate-400 font-normal line-through">
                      ₹{p.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        p.stock > 2
                          ? 'bg-slate-100 text-slate-800'
                          : p.stock > 0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>
                  <td className="py-3 text-[11px] text-slate-600">
                    {p.batteryHealth || '85%+ OEM'}
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Active
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <ProductTableActions product={p} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
