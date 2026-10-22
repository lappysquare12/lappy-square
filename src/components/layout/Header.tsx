'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  Laptop,
  Search,
  ShoppingCart,
  Heart,
  Scale,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Video,
  ArrowRight,
  PhoneCall,
  Loader2,
  Gamepad2,
  GraduationCap,
  Code2,
  Building2,
  Palette
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCompare } from '@/context/CompareContext';
import { useWishlist } from '@/context/WishlistContext';
import LappySquareLogo from '@/components/ui/LappySquareLogo';
import BrandLogo, { AppleLogo, WindowsLogo } from '@/components/ui/BrandLogos';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  sku: string;
  maskedPrice: string;
  imageUrl: string;
  specs: string;
  brandName?: string;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { compareItems } = useCompare();
  const { wishlist } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [useCaseOpen, setUseCaseOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string; email: string } | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Close mobile drawer and search dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchDropdownOpen(false);
  }, [pathname]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
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
      };
    }
  }, [mobileMenuOpen]);

  // Check login session
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  // Live autocomplete search query
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    if (searchQuery.trim().length >= 2) {
      setSearchLoading(true);
      searchDebounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
          const data = await res.json();
          if (data?.results) {
            setSearchResults(data.results);
            setSearchDropdownOpen(true);
          }
        } catch {
          // ignore
        } finally {
          setSearchLoading(false);
        }
      }, 250);
    } else {
      setSearchResults([]);
      setSearchDropdownOpen(false);
      setSearchLoading(false);
    }

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchDropdownOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        suppressHydrationWarning
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/90'
            : 'bg-white/95 backdrop-blur-md border-b border-[#E8E8E8]'
        }`}
      >
        {/* Primary Header Row */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4 md:gap-8">
            
            {/* Mobile Menu Button & Brand Logo */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 sm:p-2 text-slate-700 hover:text-black rounded-lg hover:bg-slate-100"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>

              <Link href="/" className="flex items-center group py-0.5">
                <span className="sm:hidden">
                  <LappySquareLogo size={38} variant="horizontal" />
                </span>
                <span className="hidden sm:inline-block">
                  <LappySquareLogo size={48} variant="horizontal" />
                </span>
              </Link>
            </div>

            {/* Modern Search Bar with Live Autocomplete Dropdown (Desktop) */}
            <div ref={searchContainerRef} className="hidden lg:flex flex-1 max-w-xl mx-4 relative">
              <form onSubmit={handleSearchSubmit} className="relative w-full group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) setSearchDropdownOpen(true);
                  }}
                  placeholder="Search MacBook, ThinkPad, Core i7, 16GB RAM, Dell..."
                  suppressHydrationWarning
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-blue-600 focus:bg-white text-xs font-medium rounded-full py-2.5 pl-11 pr-28 outline-none transition-all text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600/10 shadow-xs"
                />
                <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-600 absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
                
                {searchLoading && (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin absolute right-24 top-1/2 -translate-y-1/2" />
                )}

                <button
                  type="submit"
                  suppressHydrationWarning
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-1.5 rounded-full transition-all shadow-sm shadow-blue-700/20 hover:scale-105"
                >
                  Search
                </button>
              </form>

              {/* Instant Search Results Dropdown (Renewfy Style) */}
              {searchDropdownOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 divide-y divide-slate-100 max-h-96 overflow-y-auto">
                  <div className="p-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Matching Certified Laptops ({searchResults.length})</span>
                    <span className="text-blue-700 lowercase font-medium">Press Enter for all</span>
                  </div>
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      href={`/product/${item.slug}`}
                      onClick={() => setSearchDropdownOpen(false)}
                      className="p-2.5 hover:bg-slate-50 rounded-xl flex items-center justify-between gap-3 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-12 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={item.imageUrl} alt={item.title} fill className="object-contain p-1" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">{item.specs}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs font-black text-slate-950 block">{item.maskedPrice}</span>
                        <span className="text-[10px] text-emerald-600 font-bold">Best Price</span>
                      </div>
                    </Link>
                  ))}
                  <div className="p-2 text-center pt-2.5">
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={handleSearchSubmit}
                      className="text-xs font-bold text-blue-700 hover:underline"
                    >
                      View all results for &quot;{searchQuery}&quot; →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* WhatsApp Quick Link */}
              <a
                href="https://wa.me/919376988788?text=Hii%20Lappy%20Square%20Team!%20I%20want%20to%20get%20today%27s%20best%20price%20on%20laptops."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs transition-colors border border-emerald-200/60"
                title="Get Today's Best Price on WhatsApp"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden md:inline">Today&apos;s Price</span>
              </a>

              {/* Compare Tool */}
              <Link
                href="/compare"
                className="hidden sm:flex relative p-2 text-slate-700 hover:text-blue-700 rounded-full hover:bg-blue-50/60 transition-colors items-center"
                title="Compare Laptops"
              >
                <Scale className="w-5 h-5" />
                {compareItems.length > 0 && (
                  <span className="absolute top-1 right-1 bg-blue-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {compareItems.length}
                  </span>
                )}
              </Link>

              {/* Wishlist */}
              <Link
                href="/account/wishlist"
                className="relative p-1.5 sm:p-2 text-slate-700 hover:text-rose-600 rounded-full hover:bg-rose-50/60 transition-colors flex items-center"
                title="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0 right-0 bg-rose-600 text-white text-[9px] sm:text-[10px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shadow-xs">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Link */}
              <Link
                href="/cart"
                className="relative flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 text-slate-900 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-full font-bold text-xs transition-all shadow-2xs"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {itemCount > 0 && (
                  <span className="bg-blue-700 text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-[16px] sm:min-w-[18px] text-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </Link>


            </div>
          </div>
        </div>

        {/* Mobile Instant Search Bar */}
        {!mobileMenuOpen && (
          <div className="lg:hidden px-4 pb-2.5 pt-0.5 bg-white/95 border-t border-slate-100 relative">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search MacBook, ThinkPad, i7, 16GB RAM..."
                suppressHydrationWarning
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-blue-600 focus:bg-white text-xs font-medium rounded-full py-2 pl-9 pr-20 outline-none transition-all text-slate-900 placeholder-slate-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                suppressHydrationWarning
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-700 hover:bg-blue-800 text-white text-[11px] font-bold px-3 py-1 rounded-full transition-all shadow-xs"
              >
                Search
              </button>
            </form>

            {/* Mobile search dropdown */}
            {searchDropdownOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-4 right-4 mt-1 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 max-h-72 overflow-y-auto divide-y divide-slate-100">
                {searchResults.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.slug}`}
                    onClick={() => setSearchDropdownOpen(false)}
                    className="p-2 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                      <p className="text-[10px] text-slate-500 truncate">{item.specs}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-950 flex-shrink-0">{item.maskedPrice}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Secondary Desktop Navigation Row — Renewfy Aligned Category Layout */}
        <nav suppressHydrationWarning className="hidden lg:block border-t border-[#F0F0F0] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12 text-sm font-medium text-slate-700">
              <div className="flex items-center gap-4 xl:gap-6 whitespace-nowrap flex-shrink-0">
                
                {/* 1. Shop Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setShopOpen(true)}
                  onMouseLeave={() => setShopOpen(false)}
                >
                  <button
                    type="button"
                    suppressHydrationWarning
                    className="flex items-center gap-1.5 hover:text-blue-700 py-3 font-bold text-slate-900 transition-colors whitespace-nowrap"
                  >
                    <Laptop className="w-4 h-4 text-blue-700" />
                    <span>Shop</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {shopOpen && (
                    <div className="absolute top-full left-0 w-60 bg-white border border-[#E2E8F0] shadow-xl rounded-2xl p-2.5 z-50 grid grid-cols-1 gap-1">
                      <Link
                        href="/shop"
                        className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-900 hover:text-blue-700 text-xs font-bold flex items-center justify-between"
                      >
                        <span>All Products (100% Tested)</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </Link>
                      <Link
                        href="/collection/macbook"
                        className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-900 hover:text-blue-700 text-xs font-bold flex items-center justify-between"
                      >
                        <span>Apple MacBooks</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </Link>
                      <Link
                        href="/collection/windows"
                        className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-900 hover:text-blue-700 text-xs font-bold flex items-center justify-between"
                      >
                        <span>Windows Laptops</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* 2. Direct Apple Products link */}
                <Link
                  href="/collection/macbook"
                  className="hover:text-blue-700 font-semibold text-slate-800 flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <AppleLogo className="w-3.5 h-3.5 text-slate-900" />
                  <span className="font-bold text-sm">Apple Products</span>
                </Link>

                {/* 3. Direct Windows Products link */}
                <Link
                  href="/collection/windows"
                  className="hover:text-blue-700 font-semibold text-slate-800 flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <WindowsLogo className="w-3 h-3 text-blue-600" />
                  <span>Windows Products</span>
                </Link>

                {/* 4. By Brands Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setBrandsOpen(true)}
                  onMouseLeave={() => setBrandsOpen(false)}
                >
                  <button
                    type="button"
                    suppressHydrationWarning
                    className="flex items-center gap-1 hover:text-blue-700 py-3 transition-colors whitespace-nowrap"
                  >
                    <span>By Brands</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {brandsOpen && (
                    <div className="absolute top-full left-0 w-80 bg-white border border-[#E2E8F0] shadow-xl rounded-2xl p-3 z-50 grid grid-cols-1 gap-1">
                      {[
                        { name: 'Apple (MacBook Pro & Air)', slug: 'apple' },
                        { name: 'Dell (Latitude & XPS)', slug: 'dell' },
                        { name: 'HP (EliteBook & ProBook)', slug: 'hp' },
                        { name: 'Lenovo (ThinkPad & IdeaPad)', slug: 'lenovo' },
                        { name: 'ASUS (ZenBook & ROG)', slug: 'asus' },
                        { name: 'Acer (Swift & Aspire)', slug: 'acer' },
                      ].map((b) => (
                        <Link
                          key={b.slug}
                          href={`/brands/${b.slug}`}
                          className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-800 hover:text-blue-700 text-xs font-semibold flex items-center justify-between transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-1">
                            <div className="w-16 h-7 flex items-center justify-center flex-shrink-0 bg-slate-50 border border-slate-100 rounded-lg px-1.5 overflow-hidden">
                              <BrandLogo brand={b.slug} size="sm" />
                            </div>
                            <span className="truncate flex-1 font-medium">{b.name}</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-all flex-shrink-0" />
                        </Link>
                      ))}
                      <div className="border-t border-slate-100 pt-2 mt-1">
                        <Link
                          href="/brands"
                          className="text-xs text-slate-900 font-semibold hover:underline block text-center"
                        >
                          View All Brands →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. By Use Case Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setUseCaseOpen(true)}
                  onMouseLeave={() => setUseCaseOpen(false)}
                >
                  <button
                    type="button"
                    suppressHydrationWarning
                    className="flex items-center gap-1 hover:text-blue-700 py-3 transition-colors whitespace-nowrap"
                  >
                    <span>By Use Case</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {useCaseOpen && (
                    <div className="absolute top-full left-0 w-64 bg-white border border-[#E8E8E8] shadow-xl rounded-2xl p-2.5 z-50 grid grid-cols-1 gap-1">
                      {[
                        { label: 'Best for Gaming', slug: 'gaming-laptops', icon: Gamepad2, color: 'text-purple-600' },
                        { label: 'Best for Students', slug: 'student-laptops', icon: GraduationCap, color: 'text-blue-600' },
                        { label: 'Best for Coding & Dev', slug: 'programming-laptops', icon: Code2, color: 'text-emerald-600' },
                        { label: 'Best for Office & Business', slug: 'business-laptops', icon: Building2, color: 'text-amber-600' },
                        { label: 'Best for Creators & Editing', slug: 'creator-laptops', icon: Palette, color: 'text-rose-600' },
                      ].map((uc) => {
                        const Icon = uc.icon;
                        return (
                          <Link
                            key={uc.slug}
                            href={`/use/${uc.slug}`}
                            className="p-2 hover:bg-slate-50 rounded-xl text-slate-800 hover:text-blue-700 text-xs font-semibold flex items-center justify-between"
                          >
                            <span className="flex items-center gap-2">
                              <Icon className={`w-3.5 h-3.5 ${uc.color}`} />
                              <span>{uc.label}</span>
                            </span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 6. By Budget Dropdown (Renewfy Style: Under 20k, 20k-40k...) */}
                <div
                  className="relative"
                  onMouseEnter={() => setBudgetOpen(true)}
                  onMouseLeave={() => setBudgetOpen(false)}
                >
                  <button
                    type="button"
                    suppressHydrationWarning
                    className="flex items-center gap-1 hover:text-blue-700 py-3 whitespace-nowrap"
                  >
                    <span>By Budget</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {budgetOpen && (
                    <div className="absolute top-full left-0 w-60 bg-white border border-[#E8E8E8] shadow-xl rounded-2xl p-2.5 z-50 grid grid-cols-1 gap-1">
                      {[
                        { label: 'Under ₹20,000', slug: 'under-20k' },
                        { label: '₹20,000 – ₹40,000', slug: '20k-40k' },
                        { label: '₹40,000 – ₹70,000', slug: '40k-70k' },
                        { label: 'Above ₹70,000', slug: 'above-70k' },
                      ].map((bg) => (
                        <Link
                          key={bg.slug}
                          href={`/collection/${bg.slug}`}
                          className="p-2 hover:bg-slate-50 rounded-xl text-slate-800 hover:text-blue-700 text-xs font-semibold flex items-center justify-between"
                        >
                          <span>{bg.label}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* 7. Deals of the Day */}
                <Link
                  href="/deals"
                  className="hover:text-blue-700 flex items-center gap-1 text-amber-700 font-bold transition-colors whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>Deal of the Day</span>
                </Link>

                {/* 8. Video Reviews (Requirement 9!) */}
                <Link
                  href="/video-reviews"
                  className="hover:text-blue-700 font-bold text-indigo-700 flex items-center gap-1.5 transition-colors whitespace-nowrap bg-indigo-50/80 px-2.5 py-1 rounded-full border border-indigo-200/50"
                >
                  <Video className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Video Reviews</span>
                </Link>

                <Link href="/about" className="hover:text-blue-700 transition-colors whitespace-nowrap">
                  <span>About Us</span>
                </Link>
              </div>

              {/* Right Side Header CTA */}
              <div className="flex items-center gap-3 xl:gap-4 text-xs text-slate-500 font-normal whitespace-nowrap flex-shrink-0">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-full shadow-xs transition-all whitespace-nowrap"
                >
                  <PhoneCall className="w-3 h-3 text-white" />
                  <span>Contact Us</span>
                </Link>
              </div>

            </div>
          </div>
        </nav>
      </header>

      {/* Full-screen Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[9999] bg-white flex flex-col overscroll-contain animate-in fade-in duration-200">
          
          {/* Top Bar of Mobile Drawer */}
          <div className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 border-b border-slate-100 flex-shrink-0 bg-white">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center py-0.5">
              <LappySquareLogo size={36} variant="horizontal" />
            </Link>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-slate-700 hover:text-black rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-4 pb-28 space-y-6">
            
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search MacBook, ThinkPad, i7, 16GB RAM..."
                suppressHydrationWarning
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-blue-600 focus:bg-white text-xs font-medium rounded-full py-2.5 pl-10 pr-24 outline-none text-slate-900"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                suppressHydrationWarning
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-full"
              >
                Search
              </button>
            </form>

            {/* Apple & Windows Primary Buttons (Renewfy Style) */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/collection/macbook"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3.5 bg-slate-950 text-white rounded-2xl flex flex-col items-center justify-center gap-1.5 font-bold shadow-sm"
              >
                <AppleLogo className="w-5 h-5 text-white" />
                <span className="text-xs">Apple MacBooks</span>
              </Link>
              <Link
                href="/collection/windows"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3.5 bg-blue-700 text-white rounded-2xl flex flex-col items-center justify-center gap-1.5 font-bold shadow-sm"
              >
                <WindowsLogo className="w-5 h-5 text-white" />
                <span className="text-xs">Windows Laptops</span>
              </Link>
            </div>

            {/* Deals & Video Reviews Prominent Row */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/deals"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Deal of the Day</span>
              </Link>
              <Link
                href="/video-reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs"
              >
                <Video className="w-4 h-4 text-indigo-600" />
                <span>Video Reviews</span>
              </Link>
            </div>

            {/* Shop by Use Case (Best for Gaming, Students, etc.) */}
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">By Use Case</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: 'Best for Gaming', slug: 'gaming-laptops', icon: Gamepad2, color: 'text-purple-600' },
                  { label: 'Best for Students', slug: 'student-laptops', icon: GraduationCap, color: 'text-blue-600' },
                  { label: 'Best for Coding', slug: 'programming-laptops', icon: Code2, color: 'text-emerald-600' },
                  { label: 'Best for Office', slug: 'business-laptops', icon: Building2, color: 'text-amber-600' },
                  { label: 'Best for Creators', slug: 'creator-laptops', icon: Palette, color: 'text-rose-600' },
                ].map((uc) => {
                  const Icon = uc.icon;
                  return (
                    <Link
                      key={uc.slug}
                      href={`/use/${uc.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 border border-slate-200 rounded-xl font-medium text-slate-800 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${uc.color}`} />
                        <span>{uc.label}</span>
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-300" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Shop by Budget */}
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">By Budget</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: 'Under ₹20,000', slug: 'under-20k' },
                  { label: '₹20,000 – ₹40,000', slug: '20k-40k' },
                  { label: '₹40,000 – ₹70,000', slug: '40k-70k' },
                  { label: 'Above ₹70,000', slug: 'above-70k' },
                ].map((bg) => (
                  <Link
                    key={bg.slug}
                    href={`/collection/${bg.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 border border-slate-200 rounded-xl font-medium text-slate-800 flex items-center justify-between"
                  >
                    <span>{bg.label}</span>
                    <ArrowRight className="w-3 h-3 text-slate-300" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Shop by Brand */}
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">Top Brands</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer'].map((brand) => (
                  <Link
                    key={brand}
                    href={`/brands/${brand.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 border border-slate-200 rounded-xl font-bold text-center text-slate-800 hover:bg-slate-50"
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            </div>

            {/* Direct Contact & WhatsApp */}
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <a
                href="https://wa.me/919376988788?text=Hii%20Lappy%20Square%20Team!%20I%20want%20to%20get%20today%27s%20best%20price%20on%20laptops."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 px-4 bg-[#25D366] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/25 text-sm"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>Get Today&apos;s Best Price on WhatsApp</span>
              </a>

              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-xs"
              >
                <PhoneCall className="w-3.5 h-3.5 text-white" />
                <span>Contact Us & Store Addresses</span>
              </Link>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
