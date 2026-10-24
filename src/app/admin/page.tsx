import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import {
  Laptop,
  ShoppingBag,
  IndianRupee,
  Users,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  BarChart3
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
    totalOrders,
    pendingOrders,
    confirmedOrders,
    orders,
    recentEnquiries,
    whatsAppLogs,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.product.count({ where: { stock: { lte: 2 } } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: { in: ['CONFIRMED', 'DELIVERED', 'SHIPPED'] } } }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    }),
    prisma.contactEnquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.whatsAppLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { order: true },
    }),
  ]);

  // Genuine database-backed revenue
  const verifiedOrders = await prisma.order.findMany({
    where: { paymentStatus: 'VERIFIED_PAID' },
    select: { totalAmount: true },
  });
  const totalVerifiedRevenue = verifiedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Store Performance Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time database analytics for Lappy Square refurbished inventory and orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/reports"
            className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Website Reports & SEO</span>
          </Link>
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5"
          >
            <span>+ Add New Laptop</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Verified Revenue */}
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-950">
            ₹{totalVerifiedRevenue.toLocaleString('en-IN')}
          </h3>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            Based on verified paid customer transactions
          </p>
        </div>

        {/* Metric 2: Orders */}
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-950">{totalOrders}</h3>
          <p className="text-[11px] text-slate-500 mt-1">
            {confirmedOrders} confirmed • {pendingOrders} pending
          </p>
        </div>

        {/* Metric 3: Active Laptops */}
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Inventory</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-950">{activeProducts}</h3>
          <p className="text-[11px] text-slate-500 mt-1">
            {totalProducts} total catalogued models
          </p>
        </div>

        {/* Metric 4: Low Stock Alert */}
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

      </div>

      {/* Two Column Section: Recent Orders & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E8E8E8] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Recent Orders
              </h2>
              <p className="text-xs text-slate-400">Latest customer purchases</p>
            </div>
            <Link href="/admin/orders" className="text-xs font-semibold text-slate-900 hover:underline">
              View All Orders →
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-2.5">Order ID</th>
                    <th className="py-2.5">Customer</th>
                    <th className="py-2.5">Items</th>
                    <th className="py-2.5">Amount</th>
                    <th className="py-2.5">Payment</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/70">
                      <td className="py-3 font-bold text-slate-900">
                        <Link href={`/admin/orders/${ord.id}`} className="hover:underline">
                          #{ord.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3">
                        <p className="font-semibold text-slate-900 truncate max-w-[120px]">{ord.guestName}</p>
                        <p className="text-[10px] text-slate-400">{ord.guestPhone}</p>
                      </td>
                      <td className="py-3 max-w-[160px] truncate">
                        {ord.items.map((i) => i.title).join(', ')}
                      </td>
                      <td className="py-3 font-bold text-slate-950">
                        ₹{ord.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.paymentStatus === 'VERIFIED_PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 15 WhatsApp Logs & Recent Leads (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
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

          {/* Recent Buyback / Contact Leads */}
          <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Customer Leads
              </h2>
              <Link href="/admin/enquiries" className="text-xs font-semibold text-slate-900 hover:underline">
                All Leads →
              </Link>
            </div>

            {recentEnquiries.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No enquiries yet.</p>
            ) : (
              <div className="space-y-3">
                {recentEnquiries.map((enq) => (
                  <div key={enq.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{enq.name}</span>
                      <span className="bg-slate-200 text-slate-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                        {enq.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">{enq.phone}</p>
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
