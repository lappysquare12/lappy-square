import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ArrowLeft, Package, Clock, ShieldCheck } from 'lucide-react';

export const revalidate = 0;

export default async function CustomerOrdersPage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    redirect('/login');
  }

  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { userId: sessionUser.userId },
        { guestEmail: sessionUser.email },
      ],
    },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="bg-[#F7F8FA] min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <nav className="text-xs text-slate-500 flex items-center gap-1.5">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <span>/</span>
            <Link href="/account" className="hover:text-slate-900">Account</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Orders</span>
          </nav>

          <Link
            href="/account"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-black"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Account Dashboard</span>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            My Order History ({orders.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track fulfillment status, courier tracking, and access GST invoices.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-[#E8E8E8] rounded-3xl p-12 text-center text-slate-500 space-y-4">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm">You haven&apos;t placed any laptop orders yet.</p>
            <Link
              href="/shop"
              className="inline-block px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl"
            >
              Browse Certified Laptops
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-sm space-y-4 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-sm font-black text-slate-900">Order #{ord.orderNumber}</span>
                    <span className="text-slate-400 mx-2">•</span>
                    <span className="text-slate-500">{new Date(ord.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      Status: {ord.status}
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                      Payment: {ord.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {ord.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{item.title}</p>
                        <p className="text-[11px] text-slate-500">SKU: {item.sku} • Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-slate-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Total Amount</span>
                    <span className="text-base font-black text-slate-950">
                      ₹{ord.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <Link
                    href={`/order-success/${ord.orderNumber}`}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl"
                  >
                    View Invoice & Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
