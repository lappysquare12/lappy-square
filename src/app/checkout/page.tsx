'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import {
  ShieldCheck,
  Banknote,
  Lock,
  Truck,
  ArrowRight,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ShoppingBag,
  Zap
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discountAmount, totalAmount, coupon, clearCart } = useCart();

  useEffect(() => {
    router.replace('/cart');
  }, [router]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: 'Delhi',
    postalCode: '',
    customerNotes: '',
    paymentMethod: 'WHATSAPP_ORDER', // 'WHATSAPP_ORDER' or 'CASH_ON_DELIVERY'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="bg-[#F8FAFC] text-slate-800 min-h-[75vh] py-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center space-y-6 bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
          <div className="w-16 h-16 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
            <p className="text-xs text-slate-500 mt-1">Please add a certified laptop to proceed to checkout.</p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20"
          >
            <span>Browse Laptops</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.street || !formData.postalCode) {
      setError('Please fill in all required customer and delivery address fields.');
      return;
    }

    if (formData.phone.replace(/[^0-9]/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number for order & delivery notifications.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        customerNotes: formData.customerNotes,
        paymentMethod: formData.paymentMethod,
        couponCode: coupon?.code || null,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // If WhatsApp order or whatsappUrl provided, open WhatsApp with pre-filled message
      if (data.whatsappUrl) {
        try {
          window.open(data.whatsappUrl, '_blank');
        } catch {
          // If popup blocked, continue to order success page where button is also available
        }
      }

      clearCart();
      router.push(`/order-success/${data.order.orderNumber}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error processing order');
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] text-slate-800 min-h-screen">
      {/* Checkout Header Banner */}
      <section className="bg-white border-b border-slate-200/90 pt-8 pb-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <nav className="text-xs text-slate-500 mb-3 flex items-center gap-2 font-medium">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/cart" className="hover:text-slate-900 transition-colors">Cart</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-blue-600 font-semibold">Secure Checkout</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold mb-2">
                <Lock className="w-3.5 h-3.5" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Express Checkout & Delivery
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Verified stock reserved with 45-point testing report and genuine OEM accessories.
              </p>
            </div>

            {/* Stepper Pill */}
            <div className="flex items-center gap-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 self-start sm:self-auto text-slate-600">
              <span className="text-slate-400">1. Cart</span>
              <span className="text-slate-300">→</span>
              <span className="text-blue-700 flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                2. Shipping & Order Mode
              </span>
              <span className="text-slate-300">→</span>
              <span className="text-slate-400">3. Confirmation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <form onSubmit={handleSubmitOrder}>
          {/* Quick Order Snapshot on Mobile Devices */}
          <div className="lg:hidden mb-6 bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-xs shadow-xs">
            <div className="space-y-0.5">
              <span className="text-slate-500 font-medium">{items.length} {items.length === 1 ? 'laptop' : 'laptops'} in cart</span>
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span>Free Insured Cargo</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Payable</span>
              <span className="text-lg font-black text-slate-950">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Customer Info & Address & Payment (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step 1: Customer Contact */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold">1</span>
                    <span>Contact Information</span>
                  </h2>
                  <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">WhatsApp updates will be sent here</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Full Name *</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Email Address (For Invoices) *</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="e.g. rahul@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      10-Digit Mobile Number (For Order Confirmation & Delivery) *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 9876543210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Address */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold">2</span>
                    <span>Delivery Address</span>
                  </h2>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <Truck className="w-3.5 h-3.5" /> Free Air Cargo Express
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">House / Flat No., Society / Street Address *</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Flat 402, Sunshine Heights, Sector 62"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">City / Town *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Noida"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Uttar Pradesh"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">6-Digit PIN Code *</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                        maxLength={6}
                        placeholder="e.g. 201309"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">Delivery Instructions (Optional)</label>
                    <textarea
                      name="customerNotes"
                      value={formData.customerNotes}
                      onChange={handleChange}
                      rows={2}
                      placeholder="e.g. Deliver during business hours, call before arrival, or leave at reception."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Payment & Order Mode */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold">3</span>
                    <span>Order & Payment Mode</span>
                  </h2>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Verified Safe
                  </span>
                </div>

                <div className="space-y-3.5">
                  {/* Option 1: Direct WhatsApp Order (Primary / Recommended) */}
                  <label
                    className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'WHATSAPP_ORDER'
                        ? 'bg-emerald-50/70 border-emerald-500 shadow-xs'
                        : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="WHATSAPP_ORDER"
                      checked={formData.paymentMethod === 'WHATSAPP_ORDER'}
                      onChange={handleChange}
                      className="mt-1 accent-emerald-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center">
                            <WhatsAppIcon className="w-4 h-4 shrink-0" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-slate-900">Order via WhatsApp</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-emerald-700" />
                          <span>Instant Confirmation</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                        Your order is securely saved in our database and pre-filled on WhatsApp. Our hardware team immediately sends the 45-point test video & books your courier.
                      </p>
                    </div>
                  </label>

                  {/* Option 2: Cash on Delivery */}
                  <label
                    className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'CASH_ON_DELIVERY'
                        ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                        : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CASH_ON_DELIVERY"
                      checked={formData.paymentMethod === 'CASH_ON_DELIVERY'}
                      onChange={handleChange}
                      className="mt-1 accent-blue-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                            <Banknote className="w-4 h-4" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-slate-900">Cash on Delivery (COD)</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Inspect & Pay
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                        Pay cash or UPI upon delivery. You can inspect the outer tamper-proof flight seal before releasing payment.
                      </p>
                    </div>
                  </label>

                </div>
              </div>

            </div>

            {/* Right: Order Summary Box (5 Cols) */}
            <div className="lg:col-span-5 space-y-6 sticky top-24">
              
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center justify-between">
                  <span>Order Items</span>
                  <span className="text-blue-700 font-semibold">{items.length} machines</span>
                </h3>

                {/* Items preview list */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((i) => (
                    <div key={i.id} className="flex items-center gap-3 text-xs bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                      <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 relative overflow-hidden flex-shrink-0">
                        <img src={i.image} alt={i.title} className="object-contain w-full h-full p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">{i.title}</p>
                        <p className="text-[11px] text-slate-500">Qty: {i.quantity} • {i.conditionGrade}</p>
                      </div>
                      <span className="font-bold text-slate-900 whitespace-nowrap">
                        ₹{(i.price * i.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
                <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Coupon Applied ({coupon?.code})</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1 text-slate-700">
                      <Truck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Insured Express Shipping</span>
                    </span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                      FREE
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">Total Payable</span>
                      <span className="text-[10px] text-slate-500">Includes all taxes and 45-point testing report</span>
                    </div>
                    <span className="text-2xl font-black text-slate-950">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 group ${
                    formData.paymentMethod === 'WHATSAPP_ORDER'
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                  }`}
                >
                  {formData.paymentMethod === 'WHATSAPP_ORDER' ? (
                    <WhatsAppIcon className="w-5 h-5 text-white animate-bounce shrink-0" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  <span>
                    {loading
                      ? 'Confirming Order...'
                      : formData.paymentMethod === 'WHATSAPP_ORDER'
                      ? `Place Order via WhatsApp (₹${totalAmount.toLocaleString('en-IN')})`
                      : `Confirm Cash on Delivery (₹${totalAmount.toLocaleString('en-IN')})`}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="text-[10px] text-slate-500 space-y-1.5 text-center pt-2 border-t border-slate-100">
                  <p className="flex items-center justify-center gap-1.5 text-slate-700 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Immediate WhatsApp Order Confirmation Dispatched
                  </p>
                  <p className="text-slate-500">
                    Includes GST Invoice, Physical 45-Point Lab Diagnostics QA Report & 1-Year Comprehensive Warranty Certificate.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
}
