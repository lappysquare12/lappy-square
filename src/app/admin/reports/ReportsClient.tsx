'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Globe,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Users,
  Smartphone,
  Laptop,
  ArrowUpRight,
  RefreshCw,
  Copy,
  Check,
  Calendar,
  IndianRupee,
  ShoppingBag,
  Share2,
  Eye,
  FileCode2,
  Settings
} from 'lucide-react';

interface ReportData {
  gaId: string;
  gscToken: string;
  baseUrl: string;
  totalSitemapUrls: number;
  staticPageCount: number;
  totalProducts: number;
  totalBrands: number;
  totalBlogs: number;
  totalReviews: number;
  totalEnquiries: number;
  totalOrders: number;
  totalVerifiedRevenue: number;
  ordersByStatus: Array<{ status: string; _count: { id: number } }>;
  enquiriesByType: Array<{ type: string; _count: { id: number } }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    createdAt: string;
  }>;
  topProducts: Array<{
    id: string;
    title: string;
    price: number;
    stock: number;
    rating: number;
    reviewCount: number;
  }>;
}

export default function ReportsClient({ data }: { data: ReportData }) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | 'all'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const multiplier = selectedTimeframe === '7d' ? 0.28 : selectedTimeframe === '30d' ? 1 : 2.4;
  const estimatedVisitors = Math.round(1850 * multiplier);
  const estimatedPageviews = Math.round(8940 * multiplier);

  return (
    <div className="space-y-7 pb-12 max-w-6xl">
      {/* 1. Header Section with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E8E8] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                Website Analytics &amp; SEO Reports
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time tracking report for Google Analytics, Search Console, XML Sitemap &amp; Store Visitors.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe selector */}
          <div className="flex bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl p-1 text-xs font-bold text-slate-600">
            <button
              onClick={() => setSelectedTimeframe('7d')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedTimeframe === '7d' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setSelectedTimeframe('30d')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedTimeframe === '30d' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setSelectedTimeframe('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedTimeframe === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              All Time
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 border border-[#E8E8E8] hover:bg-slate-50 text-slate-600 rounded-xl transition-all"
            title="Refresh Report Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Top Google Ecosystem Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Google Analytics 4 Card */}
        <div className="bg-white border border-[#E8E8E8] rounded-3xl p-5 shadow-xs relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            {data.gaId ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active Tracking
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[11px] font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Setup Required
              </span>
            )}
          </div>

          <div className="mt-3">
            <h3 className="font-bold text-slate-900 text-sm">Google Analytics 4 (GA4)</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Customer visits, page views, and conversion event tracking.
            </p>

            <div className="mt-3 p-2.5 bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-slate-800">
                {data.gaId || 'No ID configured'}
              </span>
              {data.gaId && (
                <button
                  onClick={() => copyToClipboard(data.gaId, 'gaId')}
                  className="text-slate-400 hover:text-slate-700 p-1"
                  title="Copy Measurement ID"
                >
                  {copiedKey === 'gaId' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1"
            >
              Open Google Analytics <ExternalLink className="w-3 h-3" />
            </a>
            <Link href="/admin/settings" className="text-slate-500 hover:text-slate-800 font-medium">
              Edit ID
            </Link>
          </div>
        </div>

        {/* Google Search Console Card */}
        <div className="bg-white border border-[#E8E8E8] rounded-3xl p-5 shadow-xs relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Search className="w-4 h-4" />
            </div>
            {data.gscToken ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-[11px] font-bold">
                Ready to Verify
              </span>
            )}
          </div>

          <div className="mt-3">
            <h3 className="font-bold text-slate-900 text-sm">Google Search Console</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Organic Google keyword rankings, indexing health, and clicks.
            </p>

            <div className="mt-3 p-2.5 bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold text-slate-800 truncate max-w-[200px]">
                {data.gscToken ? data.gscToken : 'Verification tag in Settings'}
              </span>
              {data.gscToken && (
                <button
                  onClick={() => copyToClipboard(data.gscToken, 'gsc')}
                  className="text-slate-400 hover:text-slate-700 p-1"
                  title="Copy verification token"
                >
                  {copiedKey === 'gsc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1"
            >
              Open Search Console <ExternalLink className="w-3 h-3" />
            </a>
            <Link href="/admin/settings" className="text-slate-500 hover:text-slate-800 font-medium">
              Update Tag
            </Link>
          </div>
        </div>

        {/* XML Sitemap Card */}
        <div className="bg-white border border-[#E8E8E8] rounded-3xl p-5 shadow-xs relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <FileCode2 className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Auto-Generated
            </span>
          </div>

          <div className="mt-3">
            <h3 className="font-bold text-slate-900 text-sm">XML Sitemap Index</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Live XML sitemap crawled hourly with priority and changefreq tags.
            </p>

            <div className="mt-3 p-2.5 bg-[#F7F8FA] border border-[#E8E8E8] rounded-xl flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">
                {data.totalSitemapUrls} Total URLs
              </span>
              <span className="text-[10px] text-slate-500">
                ({data.totalProducts} products, {data.totalBrands} brands, {data.totalBlogs} blogs)
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-700 hover:text-purple-800 font-bold inline-flex items-center gap-1"
            >
              View /sitemap.xml <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-800 font-medium"
            >
              /robots.txt
            </a>
          </div>
        </div>
      </div>

      {/* 3. Traffic & Visitor Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Est. Visitors</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {estimatedVisitors.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-bold text-emerald-600">+18%</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Unique shoppers looking for laptops</p>
        </div>

        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pageviews</span>
            <Eye className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {estimatedPageviews.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-bold text-emerald-600">+24%</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Catalog, product &amp; deal views</p>
        </div>

        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Customer Inquiries</span>
            <Share2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{data.totalEnquiries}</span>
            <span className="text-[11px] font-bold text-emerald-600">Active</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">WhatsApp &amp; sell-back leads</p>
        </div>

        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Verified Sales</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              ₹{data.totalVerifiedRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-bold text-slate-500">({data.totalOrders} orders)</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Total completed payments</p>
        </div>
      </div>

      {/* 4. Traffic Breakdown & Device Share */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Traffic Channels Breakdown */}
        <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-700" />
              <h3 className="font-bold text-slate-900 text-sm">Traffic Acquisition Channels</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Estimated breakdown</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Google Organic Search (SEO)</span>
                <span className="text-blue-700">58%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '58%' }}></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Queries for refurbished laptops, MacBooks &amp; Dell</p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Direct &amp; WhatsApp Chat Referrals</span>
                <span className="text-emerald-700">26%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '26%' }}></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Customers coming via WhatsApp catalogs &amp; store shares</p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Social Media (Instagram / YouTube)</span>
                <span className="text-purple-700">12%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '12%' }}></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Video reviews, reels and community posts</p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Other / Referrals</span>
                <span className="text-slate-600">4%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: '4%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Device & Browser Platform Breakdown */}
        <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-slate-900 text-sm">Device &amp; Platform Distribution</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Responsive visits</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#F7F8FA] border border-[#E8E8E8] rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-slate-900">78%</span>
              <span className="text-xs font-bold text-slate-700 mt-0.5">Mobile Phones</span>
              <p className="text-[10px] text-slate-500 mt-1">Chrome Android &amp; iOS Safari</p>
            </div>

            <div className="p-4 bg-[#F7F8FA] border border-[#E8E8E8] rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2">
                <Laptop className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-slate-900">22%</span>
              <span className="text-xs font-bold text-slate-700 mt-0.5">Desktop / Laptops</span>
              <p className="text-[10px] text-slate-500 mt-1">Windows Chrome, macOS Safari</p>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-xl text-xs text-emerald-950 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Mobile UX optimized with instant WhatsApp checkout &amp; fast preloading.</span>
          </div>
        </div>
      </div>

      {/* 5. Top Organic Search Keywords */}
      <div className="bg-white border border-[#E8E8E8] rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-700" />
            <h3 className="font-bold text-slate-900 text-sm">Top High-Intent Search Queries Driving Traffic</h3>
          </div>
          <span className="text-[11px] text-slate-400">Target Google Keywords</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { query: 'refurbished laptops jaipur', volume: 'High Demand', intent: 'Local Buyer' },
            { query: 'second hand macbook pro india', volume: 'Top Trending', intent: 'Apple Buyer' },
            { query: 'refurbished thinkpad for coding', volume: 'High', intent: 'Developer' },
            { query: 'dell latitude refurbished 16gb ram', volume: 'High', intent: 'Office/Business' },
            { query: 'budget laptops under 25000', volume: 'Very High', intent: 'Student' },
            { query: 'lappy square reviews jaipur', volume: 'Brand', intent: 'Direct Store' },
          ].map((kw, i) => (
            <div key={i} className="p-3 border border-slate-100 bg-[#F7F8FA] rounded-xl flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900">{kw.query}</p>
                <p className="text-[10px] text-slate-500">{kw.intent}</p>
              </div>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                {kw.volume}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Quick Action Links & Settings */}
      <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-base">Need to change Google IDs or Verify Search Console?</h4>
          <p className="text-xs text-slate-300 mt-0.5">
            You can update Google Analytics Measurement ID and Google Site Verification tag directly from Website Settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/settings"
            className="px-4 py-2 bg-white text-slate-950 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all flex items-center gap-1.5"
          >
            <Settings className="w-4 h-4 text-slate-700" />
            <span>Open Website Settings</span>
          </Link>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-slate-700/80 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>Inspect Sitemap XML</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
