import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  ShieldCheck,
  ArrowRight,
  LogOut,
  Calendar,
  Sparkles,
  ChevronRight,
  Package,
  Clock,
  CheckCircle2
} from 'lucide-react';

export const revalidate = 0;

export default async function AccountPage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    redirect('/login');
  }

  const [user, ordersCount, recentOrders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: sessionUser.userId },
      include: { addresses: true },
    }),
    prisma.order.count({
      where: {
        OR: [
          { userId: sessionUser.userId },
          { guestEmail: sessionUser.email },
        ],
      },
    }),
    prisma.order.findMany({
      where: {
        OR: [
          { userId: sessionUser.userId },
          { guestEmail: sessionUser.email },
        ],
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ]);

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="bg-[#0B1120] text-slate-100 min-h-screen pb-16">
      {/* Header Banner */}
      <section className="relative pt-12 pb-8 border-b border-slate-800/80 overflow-hidden">
        <div className="absolute inset-0 bg-radial-[at_top] from-blue-600/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <nav className="text-xs text-slate-400 mb-4 flex items-center gap-2 font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-blue-400 font-semibold">Customer Dashboard</span>
          </nav>

          {/* Profile Header Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/20">
                <div className="w-full h-full bg-[#0B1120] rounded-[14px] flex items-center justify-center font-black text-2xl text-blue-400">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-black text-white">{user.name}</h1>
                  {user.role !== 'CUSTOMER' && (
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {user.role}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{user.email} • {user.phone || 'No phone set'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">


              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            href="/account/orders"
            className="group bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-6 transition-all duration-300 shadow-xl flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-slate-400">Total Orders</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">{ordersCount}</h3>
              <span className="text-[11px] text-blue-400 font-medium group-hover:underline flex items-center gap-1 mt-1">
                <span>View all order history</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShoppingBag className="w-7 h-7" />
            </div>
          </Link>

          <Link
            href="/account/wishlist"
            className="group bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 rounded-3xl p-6 transition-all duration-300 shadow-xl flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-slate-400">Saved Wishlist</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">Active</h3>
              <span className="text-[11px] text-rose-400 font-medium group-hover:underline flex items-center gap-1 mt-1">
                <span>View bookmarked models</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Heart className="w-7 h-7" />
            </div>
          </Link>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">Lappy Comprehensive Warranty</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">1-Year Active</h3>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Comprehensive Technical Support</span>
              </span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">Recent Hardware Orders</h2>
              <p className="text-xs text-slate-400">Track shipments, download tax invoices & warranty records</p>
            </div>
            <Link href="/account/orders" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Package className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-400">
                No orders placed yet. Explore our certified refurbished inventory!
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all"
              >
                <span>Browse Laptops</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3.5">
              {recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm">#{ord.orderNumber}</span>
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {ord.status}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">{new Date(ord.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                    </div>
                    <p className="text-slate-300">
                      {ord.items.map((i) => `${i.title} (x${i.quantity})`).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <span className="font-black text-white text-base">
                      ₹{ord.totalAmount.toLocaleString('en-IN')}
                    </span>
                    <Link
                      href={`/order-success/${ord.orderNumber}`}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20"
                    >
                      View Invoice
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
