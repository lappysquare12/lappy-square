import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { ShoppingBag, Eye, Search, Filter } from 'lucide-react';
import OrderTableActions from './OrderTableActions';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
          Orders & Fulfillment ({orders.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor incoming purchases, verified payment references, and courier tracking details.
        </p>
      </div>

      {/* Orders Responsive Container */}
      <div className="bg-white border border-[#E8E8E8] rounded-3xl p-4 sm:p-6 shadow-xs overflow-hidden">
        
        {/* Mobile View (< md): Stacked Clean Cards */}
        <div className="block md:hidden divide-y divide-slate-100">
          {orders.map((ord) => (
            <div key={ord.id} className="py-4 space-y-3 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    href={`/admin/orders/${ord.id}`}
                    className="font-black text-blue-700 hover:underline text-xs"
                  >
                    #{ord.orderNumber}
                  </Link>
                  <span className="block text-[10px] text-slate-400">
                    {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                      dateStyle: 'medium',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ord.paymentStatus === 'VERIFIED_PAID'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ord.paymentStatus}
                  </span>
                  <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-bold">
                    {ord.status}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3 text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold text-slate-900">
                  <span>{ord.guestName}</span>
                  <span className="text-slate-500 font-mono text-[11px]">{ord.guestPhone}</span>
                </div>
                <p className="text-[11px] text-slate-600 truncate">
                  {ord.items.map((i) => i.title).join(', ')}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                  <span className="text-slate-500">{ord.items.length} item(s) • {ord.paymentMethod === 'RAZORPAY' ? 'Online' : 'COD'}</span>
                  <span className="font-black text-slate-950 text-sm">₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <OrderTableActions
                  order={{
                    id: ord.id,
                    orderNumber: ord.orderNumber,
                    guestName: ord.guestName,
                    totalAmount: ord.totalAmount,
                  }}
                />
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-center text-xs text-slate-400 py-6">No orders placed yet.</p>
          )}
        </div>

        {/* Desktop View (>= md): Full Table with min-w */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-2">Order Number</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Items Ordered</th>
                <th className="py-3 px-2">Payable</th>
                <th className="py-3 px-2">Payment Method</th>
                <th className="py-3 px-2">Payment Status</th>
                <th className="py-3 px-2">Fulfillment</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-2 font-bold text-slate-900">
                    <Link href={`/admin/orders/${ord.id}`} className="hover:underline">
                      #{ord.orderNumber}
                    </Link>
                    <span className="block text-[10px] text-slate-400 font-normal">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', { dateStyle: 'short' })}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <p className="font-semibold text-slate-900">{ord.guestName}</p>
                    <p className="text-[10px] text-slate-400">{ord.guestPhone}</p>
                  </td>
                  <td className="py-3 px-2 max-w-[200px]">
                    <p className="truncate font-medium text-slate-800">
                      {ord.items.map((i) => i.title).join(', ')}
                    </p>
                    <span className="text-[10px] text-slate-400">{ord.items.length} items</span>
                  </td>
                  <td className="py-3 px-2 font-black text-slate-950">
                    ₹{ord.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-2">
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-bold">
                      {ord.paymentMethod === 'RAZORPAY' ? 'Razorpay' : 'COD'}
                    </span>
                  </td>
                  <td className="py-3 px-2">
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
                  <td className="py-3 px-2">
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-bold">
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <OrderTableActions
                      order={{
                        id: ord.id,
                        orderNumber: ord.orderNumber,
                        guestName: ord.guestName,
                        totalAmount: ord.totalAmount,
                      }}
                    />
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
