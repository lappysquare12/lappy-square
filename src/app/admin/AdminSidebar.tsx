'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Laptop,
  ShoppingBag,
  Users,
  Tag,
  Settings,
  FileText,
  LogOut,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Menu,
  X,
  Image as ImageIcon,
  Video
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';
import LappySquareLogo from '@/components/ui/LappySquareLogo';

interface AdminSidebarProps {
  user: {
    name: string;
    role: string;
    email?: string | null;
  };
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when admin mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollY = window.scrollY;
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.overflow = originalOverflow || '';
        document.body.style.position = originalPosition || '';
        document.body.style.top = originalTop || '';
        document.body.style.width = originalWidth || '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [mobileMenuOpen]);

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Hero Banners Slider', href: '/admin/banners', icon: ImageIcon, badge: 'Slider' },
    { label: 'Product Inventory', href: '/admin/products', icon: Laptop },
    { label: 'Orders & Fulfillment', href: '/admin/orders', icon: ShoppingBag },
    { label: 'WhatsApp Integration', href: '/admin/whatsapp', icon: WhatsAppIcon, badge: 'Live' },
    { label: 'Leads & Enquiries', href: '/admin/enquiries', icon: Users },
    { label: 'Coupons & Promos', href: '/admin/coupons', icon: Tag },
    { label: 'Customer Reviews', href: '/admin/reviews', icon: Sparkles },
    { label: 'Video Reviews', href: '/admin/video-reviews', icon: Video, badge: 'Videos' },
    { label: 'Blog & CMS', href: '/admin/blogs', icon: FileText },
    { label: 'Website Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top App Bar (Visible only on < md) */}
      <div className="md:hidden sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8E8E8] px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-black rounded-lg hover:bg-slate-100"
            aria-label="Toggle admin menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link href="/admin">
            <LappySquareLogo size={32} variant="horizontal" showSubtitle={false} />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
            {user.role}
          </span>
          <Link
            href="/"
            target="_blank"
            className="p-1.5 text-slate-500 hover:text-black rounded-lg hover:bg-slate-100"
            title="Open Live Website"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] z-50 bg-black/60 backdrop-blur-xs flex overscroll-contain">
          <div className="w-72 max-w-[85vw] bg-white h-full p-4 overflow-y-auto overscroll-contain flex flex-col justify-between shadow-2xl">
            <div>
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl mb-3">
                <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email || 'Admin Staff'}</p>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-black'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </span>
                      {item.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white text-blue-700' : 'bg-emerald-500 text-white'}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#E8E8E8] space-y-2 mt-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between w-full p-2 text-xs text-slate-600 hover:text-black font-medium"
              >
                <span>Back to Store</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="w-full flex items-center gap-2 p-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-medium transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out Admin</span>
                </button>
              </form>
            </div>
          </div>
          <div className="flex-1 touch-none" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Desktop Persistent Sidebar (md and above) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-[#E8E8E8] flex-col justify-between flex-shrink-0 min-h-screen sticky top-0 h-screen">
        <div className="overflow-y-auto">
          {/* Admin Header */}
          <div className="p-4 border-b border-[#E8E8E8]">
            <Link href="/admin" className="flex items-center">
              <LappySquareLogo size={36} variant="horizontal" showSubtitle={false} />
            </Link>
          </div>

          {/* User Badge */}
          <div className="px-5 py-3 bg-slate-50 border-b border-[#E8E8E8] flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
              <span className="inline-block text-[9px] font-black uppercase text-blue-800 bg-blue-100 px-1.5 py-0.2 rounded">
                {user.role}
              </span>
            </div>
            <Link
              href="/"
              target="_blank"
              className="p-1 text-slate-400 hover:text-black rounded"
              title="Open Live Website"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-black'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </span>
                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white text-blue-700' : 'bg-emerald-500 text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#E8E8E8] space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between w-full p-2 text-xs text-slate-600 hover:text-black font-medium"
          >
            <span>Back to Store</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-2 p-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out Admin</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
