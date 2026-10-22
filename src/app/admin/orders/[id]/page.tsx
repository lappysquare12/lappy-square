import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ArrowLeft, Truck, ShieldCheck, Printer, Save } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';
import OrderStatusUpdater from './OrderStatusUpdater';
import DeleteOrderButton from './DeleteOrderButton';

export const revalidate = 0;

interface AdminOrderDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      whatsAppLogs: { orderBy: { createdAt: 'desc' } },
      paymentTransactions: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-5xl space-y-6">
      
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-black"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Order #{order.orderNumber}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/order-success/${order.orderNumber}`}
            target="_blank"
            className="px-4 py-2 border border-slate-300 hover:border-black rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice View</span>
          </Link>
          <DeleteOrderButton orderId={order.id} orderNumber={order.orderNumber} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Items & Customer Details (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Items */}
          <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 shadow-xs space-y-4 text-xs">
            <h2 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-3">
              Order Items ({order.items.length})
            </h2>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-xs">{item.title}</h3>
                    <span className="font-bold text-slate-950">
                      ₹{item.price.toLocaleString('en-IN')} x {item.quantity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    SKU: {item.sku} • Grade: {item.conditionGrade}
                  </p>
                  {item.specsSnapshot && (
                    <p className="text-[11px] text-slate-500">{item.specsSnapshot}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-slate-100 pt-3 space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({order.couponCode || 'Promo'})</span>
                  <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total Amount</span>
                <span className="text-xl font-black text-slate-950">
                  ₹{order.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping info */}
          <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 shadow-xs space-y-4 text-xs">
            <h2 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-3">
              Customer & Delivery Address
            </h2>

            <div className="space-y-2 text-slate-700">
              <p><strong>Name:</strong> {order.guestName}</p>
              <p><strong>Email:</strong> {order.guestEmail}</p>
              <p><strong>Phone:</strong> {order.guestPhone}</p>
              <p><strong>Delivery Address:</strong> {order.shippingAddress}</p>
              {order.customerNotes && (
                <p><strong>Customer Instructions:</strong> {order.customerNotes}</p>
              )}
            </div>
          </div>

        </div>

        {/* Right: Status Updater & WhatsApp Logs (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <OrderStatusUpdater order={order} />

          {/* WhatsApp Logs for this order */}
          <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 shadow-xs space-y-4 text-xs">
            <div className="flex items-center gap-2 pb-2 border-slate-100 border-b">
              <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" />
              <h2 className="font-bold text-slate-900 uppercase tracking-wider">
                WhatsApp Notification History
              </h2>
            </div>

            {order.whatsAppLogs.length === 0 ? (
              <p className="text-slate-500 py-2">No notification logs recorded for this order.</p>
            ) : (
              <div className="space-y-2">
                {order.whatsAppLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{log.messageType}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          log.status === 'SENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {new Date(log.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })} • To: {log.recipient}
                    </p>
                    {log.providerMessageId && (
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        ID: {log.providerMessageId}
                      </p>
                    )}
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
