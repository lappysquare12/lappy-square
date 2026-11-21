import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import {
  Laptop,
  Users,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Tag,
  PhoneCall,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';
import { requireAuth } from '@/lib/auth';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);

  const [
    totalProducts,
    activeProducts,
    lowStockProducts,
    totalEnquiries,
    newEnquiries,
    totalSeries,
    recentEnquiries,
    recentProducts,
    whatsAppLogs,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.product.count({ where: { stock: { lte: 2 } } }),
    prisma.contactEnquiry.count(),
    prisma.contactEnquiry.count({ where: { status: 'NEW' } }),
    prisma.brandSeries.count(),
    prisma.contactEnquiry.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        brand: true,
        price: true,
        stock: true,
        images: true,
        active: true,
      },
    }),
    prisma.whatsAppLog.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { order: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Store Performance Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time database analytics for Lappy Square refurbished inventory, customer leads, and dispatches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <span>+ Add New Laptop</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>View Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Active Inventory */}
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Inventory</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-950">{activeProducts}</h3>
          <p className="text-[11px] text-slate-500 mt-1">
            {totalProducts} total catalogued laptops
          </p>
        </div>

        {/* Metric 2: Customer Leads & Enquiries */}
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Customer Leads</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-950">{totalEnquiries}</h3>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            {newEnquiries} new inquiries awaiting response
          </p>
        </div>

        {/* Metric 3: Low Stock Alert */}
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock Units</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-950">{lowStockProducts}</h3>
          <p className="text-[11px] text-amber-700 font-medium mt-1">
            Units with ≤ 2 available devices
          </p>
        </div>

        {/* Metric 4: Brand Series Types */}
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Brand Series</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-950">{totalSeries}</h3>
          <p className="text-[11px] text-purple-700 font-medium mt-1">
            Configured brand & series categories
          </p>
        </div>
      </div>

      {/* Two Column Section: Recent Leads (8 cols) & Side Widgets (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Customer Leads Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E8E8E8] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Recent Customer Leads &amp; Inquiries
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Direct customer requests from website forms &amp; WhatsApp</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
            >
              <span>View All Leads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-500">No customer enquiries received yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 font-bold">Customer</th>
                    <th className="py-2.5 font-bold">Type</th>
                    <th className="py-2.5 font-bold">Phone / Contact</th>
                    <th className="py-2.5 font-bold">Details</th>
                    <th className="py-2.5 font-bold">Status</th>
                    <th className="py-2.5 font-bold text-right">Connect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {recentEnquiries.map((enq) => {
                    const cleanPhone = enq.phone.replace(/[^0-9]/g, '');
                    const waNumber = cleanPhone.startsWith('91') && cleanPhone.length === 12
                      ? cleanPhone
                      : cleanPhone.length === 10
                      ? `91${cleanPhone}`
                      : cleanPhone;

                    return (
                      <tr key={enq.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3">
                          <p className="font-bold text-slate-900">{enq.name}</p>
                          <p className="text-[10px] text-slate-400">
                            {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </p>
                        </td>
                        <td className="py-3">
                          <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            {enq.type}
                          </span>
                        </td>
                        <td className="py-3">
                          <p className="font-semibold text-slate-800">{enq.phone}</p>
                          {enq.email && <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{enq.email}</p>}
                        </td>
                        <td className="py-3 max-w-[200px] truncate text-slate-600">
                          {enq.deviceDetails || enq.message || 'No additional notes'}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              enq.status === 'NEW'
                                ? 'bg-emerald-100 text-emerald-800'
                                : enq.status === 'RESOLVED'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {enq.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {cleanPhone && (
                              <a
                                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello ${enq.name}, thank you for contacting Lappy Square!`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#25D366] rounded-lg transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <WhatsAppIcon className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <a
                              href={`tel:${enq.phone}`}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                              title="Call customer"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Side Column (4 Cols): Recent Products & WhatsApp Dispatches */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recent Catalog Additions */}
          <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-blue-600 shrink-0" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Recent Laptops
                </h2>
              </div>
              <Link href="/admin/products" className="text-xs font-semibold text-slate-900 hover:underline">
                Inventory →
              </Link>
            </div>

            {recentProducts.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No laptops added yet.</p>
            ) : (
              <div className="space-y-3">
                {recentProducts.map((p) => {
                  const img = p.images?.[0]?.url || '/placeholder-laptop.png';

                  return (
                    <Link
                      key={p.id}
                      href={`/admin/products/${p.id}/edit`}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-100 flex items-center gap-3 transition-colors group"
                    >
                      <div className="w-11 h-11 bg-white border border-slate-200 rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative">
                        <Image
                          src={img}
                          alt={p.title}
                          fill
                          className="object-contain p-1"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {p.title}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          ₹{p.price.toLocaleString('en-IN')} • Stock: {p.stock}
                        </p>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          p.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {p.active ? 'Active' : 'Draft'}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* WhatsApp Notification Log Preview */}
          <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  WhatsApp Dispatches
                </h2>
              </div>
              <Link href="/admin/whatsapp" className="text-xs font-semibold text-slate-900 hover:underline">
                Manage →
              </Link>
            </div>

            {whatsAppLogs.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No notification logs recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {whatsAppLogs.map((log) => (
                  <div key={log.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {log.order ? `#${log.order.orderNumber}` : log.recipient}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                          log.status === 'SENT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {new Date(log.createdAt).toLocaleTimeString('en-IN', { timeStyle: 'short' })} • To: {log.recipient}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
