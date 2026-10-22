import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import {
  CheckCircle2,
  Package,
  Calendar,
  CreditCard,
  MapPin,
  Truck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';
import { generateWhatsAppOrderUrl } from '@/lib/whatsapp-order';

interface OrderSuccessPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderNumber } = await params;

  if (!orderNumber) {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  const whatsappChatUrl = generateWhatsAppOrderUrl({
    orderNumber: order.orderNumber,
    customerName: order.guestName || 'Customer',
    customerPhone: order.guestPhone || '',
    customerEmail: order.guestEmail || '',
    deliveryAddress: order.shippingAddress,
    customerNotes: order.customerNotes,
    paymentMethod: order.paymentMethod,
    subtotal: order.subtotal,
    discountAmount: order.discountAmount,
    totalAmount: order.totalAmount,
    items: order.items.map((it) => ({
      title: it.title,
      quantity: it.quantity,
      price: it.price,
      specsSnapshot: it.specsSnapshot,
      conditionGrade: it.conditionGrade,
    })),
  });

  return (
    <div className="bg-[#F8FAFC] text-slate-800 min-h-screen pb-16">

      {/* Hero Celebration Banner */}
      <section className="bg-white border-b border-slate-200/90 pt-10 pb-9">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 border border-emerald-200/80 rounded-3xl mx-auto flex items-center justify-center text-emerald-600 shadow-xs">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Order Confirmed & Placed Successfully</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Thank You, {order.guestName || 'Valued Customer'}!
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            Your order <span className="font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">#{order.orderNumber}</span> has been securely saved and scheduled for priority 45-point diagnostic QA.
          </p>

          {/* 4-Step Order Progress Visualizer */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs">
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-emerald-500 rounded-full" />
                <span className="font-bold text-emerald-700 block">Confirmed</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-blue-600 animate-pulse rounded-full" />
                <span className="font-bold text-blue-700 block">Lab Testing</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-slate-200 rounded-full" />
                <span className="font-medium text-slate-400 block">Dispatch</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-slate-200 rounded-full" />
                <span className="font-medium text-slate-400 block">Delivered</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* WhatsApp Notification Card */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-[#25D366]/20">
              <WhatsAppIcon className="w-6 h-6 shrink-0" />
            </div>
            <div className="text-xs space-y-1">
              <p className="font-bold text-slate-900 text-base">
                Instant WhatsApp Confirmation Active
              </p>
              <p className="text-slate-600 leading-relaxed text-xs">
                Your order is confirmed in our database. Chat directly with our hardware specialists on WhatsApp with your Order ID <strong className="text-emerald-800 font-mono">#{order.orderNumber}</strong>.
              </p>
            </div>
          </div>

          <a
            href={whatsappChatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/20 hover:scale-[1.02] transition-all whitespace-nowrap self-stretch sm:self-auto"
          >
            <WhatsAppIcon className="w-4 h-4 shrink-0" />
            <span>Open WhatsApp Order Chat</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>

        {/* Order Details Breakdown Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Order Items & Invoicing Details
              </h2>
              <p className="text-xs text-slate-500">Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                {order.paymentMethod === 'WHATSAPP_ORDER' ? 'WHATSAPP ORDER' : 'CASH ON DELIVERY'}
              </span>
            </div>
          </div>

          {/* Purchased Units */}
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                      {item.conditionGrade}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      SKU: {item.sku}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                  {item.specsSnapshot && (
                    <p className="text-xs text-slate-500">{item.specsSnapshot}</p>
                  )}
                </div>

                <div className="text-left sm:text-right flex-shrink-0">
                  <span className="font-black text-slate-950 text-base">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  <span className="block text-[11px] text-slate-500">Qty: {item.quantity}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery & Payment Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-blue-700 font-bold uppercase tracking-wider text-[11px]">
                <MapPin className="w-3.5 h-3.5" />
                <span>Customer & Contact Details</span>
              </div>
              <p className="font-medium text-slate-900 leading-relaxed">
                {order.shippingAddress}
              </p>
              <p className="text-slate-500">Phone: <strong className="text-slate-900">{order.guestPhone}</strong></p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-blue-700 font-bold uppercase tracking-wider text-[11px]">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Payment & Protection</span>
              </div>
              <p className="text-slate-900 font-medium">
                Method: {order.paymentMethod === 'WHATSAPP_ORDER' ? 'WhatsApp Direct Booking' : 'In-Store Payment'}
              </p>
              <p className="text-emerald-700 font-semibold">
                Status: {order.paymentStatus === 'VERIFIED_PAID' ? 'Verified Paid' : 'Pending In-Store / Direct Settlement'}
              </p>
              <p className="text-slate-500">Warranty: 1-Year Full Hardware Certificate Included</p>
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount Applied ({order.couponCode || 'Promo'})</span>
                <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Pan-India Transit Insurance</span>
              <span className="text-emerald-700 font-bold">FREE</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-slate-900 block">Total Invoiced Amount</span>
                <span className="text-[10px] text-slate-500">Includes all GST & Warranty Coverage</span>
              </div>
              <span className="text-2xl font-black text-slate-950">
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/shop"
              className="w-full sm:flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold text-center transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
            >
              <span>Explore More Certified Inventory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="w-full sm:flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-bold text-center transition-colors flex items-center justify-center gap-2"
            >
              <span>Back to Home</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
