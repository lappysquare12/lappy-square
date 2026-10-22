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

      {/* Orders Table Card */}
      <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3">Order Number</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Items Ordered</th>
                <th className="py-3">Payable</th>
                <th className="py-3">Payment Method</th>
                <th className="py-3">Payment Status</th>
                <th className="py-3">Fulfillment</th>
                <th className="py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80">
                  <td className="py-3 font-bold text-slate-900">
                    <Link href={`/admin/orders/${ord.id}`} className="hover:underline">
                      #{ord.orderNumber}
                    </Link>
                    <span className="block text-[10px] text-slate-400 font-normal">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', { dateStyle: 'short' })}
                    </span>
                  </td>
                  <td className="py-3">
                    <p className="font-semibold text-slate-900">{ord.guestName}</p>
                    <p className="text-[10px] text-slate-400">{ord.guestPhone}</p>
                  </td>
                  <td className="py-3 max-w-[200px]">
                    <p className="truncate font-medium text-slate-800">
                      {ord.items.map((i) => i.title).join(', ')}
                    </p>
                    <span className="text-[10px] text-slate-400">{ord.items.length} items</span>
                  </td>
                  <td className="py-3 font-black text-slate-950">
                    ₹{ord.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3">
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-bold">
                      {ord.paymentMethod === 'RAZORPAY' ? 'Razorpay' : 'COD'}
                    </span>
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
                  <td className="py-3 text-right">
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
