'use client';

import React, { useState, useMemo } from 'react';
import EnquiryStatusSelector from './EnquiryStatusSelector';
import {
  Users,
  Mail,
  Phone,
  Calendar,
  MessageCircle,
  Laptop,
  MapPin,
  Search,
  Sparkles,
  CheckCircle2,
  Clock,
  Filter,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';

export interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string | null;
  type: string;
  deviceDetails?: string | null;
  message?: string | null;
  status: string;
  createdAt: string | Date;
}

export default function EnquiriesAdminClient({
  initialEnquiries,
}: {
  initialEnquiries: EnquiryItem[];
}) {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(initialEnquiries);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'SELL_LAPTOP' | 'GENERAL' | 'NEW' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');

  // Stats calculation
  const totalCount = enquiries.length;
  const sellCount = enquiries.filter((e) => e.type === 'SELL_LAPTOP').length;
  const newCount = enquiries.filter((e) => e.status === 'NEW').length;
  const inProgressCount = enquiries.filter((e) => e.status === 'IN_PROGRESS' || e.status === 'CONTACTED').length;
  const resolvedCount = enquiries.filter((e) => e.status === 'RESOLVED').length;

  // Filtered leads
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((enq) => {
      // Tab filter
      if (activeTab === 'SELL_LAPTOP' && enq.type !== 'SELL_LAPTOP') return false;
      if (activeTab === 'GENERAL' && enq.type === 'SELL_LAPTOP') return false;
      if (activeTab === 'NEW' && enq.status !== 'NEW') return false;
      if (activeTab === 'IN_PROGRESS' && enq.status !== 'IN_PROGRESS' && enq.status !== 'CONTACTED') return false;
      if (activeTab === 'RESOLVED' && enq.status !== 'RESOLVED') return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = enq.name?.toLowerCase().includes(q);
        const matchesPhone = enq.phone?.toLowerCase().includes(q);
        const matchesEmail = enq.email?.toLowerCase().includes(q);
        const matchesCity = enq.city?.toLowerCase().includes(q);
        const matchesSpecs = enq.deviceDetails?.toLowerCase().includes(q);
        const matchesMessage = enq.message?.toLowerCase().includes(q);
        return matchesName || matchesPhone || matchesEmail || matchesCity || matchesSpecs || matchesMessage;
      }

      return true;
    });
  }, [enquiries, activeTab, searchQuery]);

  const handleStatusChange = (id: string, newStatus: string) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
  };

  const getWhatsappUrl = (enq: EnquiryItem) => {
    const cleanPhone = enq.phone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const replyText = encodeURIComponent(
      `Hello ${enq.name}, thank you for contacting Lappy Square regarding ${
        enq.type === 'SELL_LAPTOP' ? 'selling your laptop' : 'laptop buyback/inquiry'
      }. We reviewed your details (${enq.deviceDetails || enq.message || ''}) and are ready with your valuation!`
    );
    return `https://wa.me/${formattedPhone}?text=${replyText}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight flex items-center gap-2.5">
            <span>Customer Leads & Enquiries</span>
            <span className="text-xs font-extrabold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">
              {totalCount} Total
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review sell-laptop trade-in valuations, customer inquiries, and respond instantly with 1-click WhatsApp.
          </p>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Leads</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalCount}</p>
          <span className="text-[11px] text-slate-400 font-medium">All recorded customer queries</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Sell Laptop</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-950 mt-2">{sellCount}</p>
          <span className="text-[11px] text-emerald-700 font-medium">Trade-in valuation requests</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">New / Pending</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-950 mt-2">{newCount}</p>
          <span className="text-[11px] text-blue-700 font-medium">Requires initial response</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Resolved</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-950 mt-2">{resolvedCount}</p>
          <span className="text-[11px] text-purple-700 font-medium">Closed customer cases</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, email, city, laptop model..."
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 rounded-xl py-2 pl-9 pr-8 text-xs font-medium outline-none transition-all text-slate-900 placeholder-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredEnquiries.length}</span> of {totalCount} leads
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
          {[
            { key: 'ALL', label: 'All Leads', count: totalCount },
            { key: 'SELL_LAPTOP', label: 'Sell Laptops', count: sellCount },
            { key: 'GENERAL', label: 'General Inquiry', count: totalCount - sellCount },
            { key: 'NEW', label: 'New', count: newCount },
            { key: 'IN_PROGRESS', label: 'In Progress / Contacted', count: inProgressCount },
            { key: 'RESOLVED', label: 'Resolved', count: resolvedCount },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {filteredEnquiries.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No matching leads found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No inquiries match "${searchQuery}". Try searching with a different name or phone number.`
              : 'There are currently no enquiries in this filter category.'}
          </p>
          {(searchQuery || activeTab !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveTab('ALL');
              }}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View (lg:block) */}
          <div className="hidden lg:block bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[1050px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider">
                    <th className="py-3.5 px-4 w-32">Date / Time</th>
                    <th className="py-3.5 px-4 w-36">Lead Type</th>
                    <th className="py-3.5 px-4 w-60">Customer Contact</th>
                    <th className="py-3.5 px-4 min-w-[280px]">Device Specs & Message</th>
                    <th className="py-3.5 px-4 w-40">Status</th>
                    <th className="py-3.5 px-4 w-36 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredEnquiries.map((enq) => {
                    const cleanPhone = enq.phone?.replace(/[^0-9]/g, '') || '';
                    const whatsappUrl = getWhatsappUrl(enq);

                    return (
                      <tr key={enq.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Date / Time */}
                        <td className="py-4 px-4 align-top whitespace-nowrap">
                          <p className="font-bold text-slate-800">
                            {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {new Date(enq.createdAt).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </td>

                        {/* Lead Type */}
                        <td className="py-4 px-4 align-top">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg tracking-wide ${
                              enq.type === 'SELL_LAPTOP'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/80'
                                : 'bg-slate-100 text-slate-800 border border-slate-200'
                            }`}
                          >
                            {enq.type === 'SELL_LAPTOP' && <Laptop className="w-3 h-3 text-emerald-700" />}
                            <span>{enq.type === 'SELL_LAPTOP' ? 'Sell Laptop' : 'Inquiry'}</span>
                          </span>
                          {enq.city && (
                            <div className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold mt-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <span className="truncate">{enq.city}</span>
                            </div>
                          )}
                        </td>

                        {/* Customer Contact */}
                        <td className="py-4 px-4 align-top">
                          <p className="font-bold text-slate-950 text-sm">{enq.name}</p>
                          {enq.phone && (
                            <a
                              href={`tel:${enq.phone}`}
                              className="text-xs text-blue-700 font-mono font-semibold hover:underline block mt-0.5"
                            >
                              {enq.phone}
                            </a>
                          )}
                          {enq.email && (
                            <p className="text-[11px] text-slate-400 font-normal mt-0.5 break-all">
                              {enq.email}
                            </p>
                          )}
                        </td>

                        {/* Device Specs & Message */}
                        <td className="py-4 px-4 align-top">
                          {enq.deviceDetails && (
                            <div className="bg-emerald-50/90 border border-emerald-200/90 text-emerald-950 p-2.5 rounded-xl mb-2 leading-relaxed">
                              <p className="font-bold text-emerald-900 text-xs mb-1 flex items-center gap-1.5">
                                <Laptop className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                                <span>Submitted Laptop Specs:</span>
                              </p>
                              <p className="font-mono text-[11px] text-emerald-900 leading-snug whitespace-pre-wrap">
                                {enq.deviceDetails}
                              </p>
                            </div>
                          )}
                          {enq.message && (
                            <div className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl text-slate-700 text-xs leading-relaxed">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                                Customer Note:
                              </span>
                              <p className="whitespace-pre-wrap">{enq.message}</p>
                            </div>
                          )}
                          {!enq.deviceDetails && !enq.message && (
                            <span className="text-slate-400 italic text-[11px]">No additional details provided</span>
                          )}
                        </td>

                        {/* Status Column */}
                        <td className="py-4 px-4 align-top">
                          <EnquiryStatusSelector
                            enquiryId={enq.id}
                            currentStatus={enq.status}
                            onStatusChange={(newSt) => handleStatusChange(enq.id, newSt)}
                          />
                        </td>

                        {/* Actions Column */}
                        <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                          {cleanPhone ? (
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
                              title={`Reply to ${enq.name} on WhatsApp`}
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                              <span>WhatsApp</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 text-[11px]">No phone</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile & Tablet Card View (lg:hidden) */}
          <div className="lg:hidden space-y-3.5">
            {filteredEnquiries.map((enq) => {
              const cleanPhone = enq.phone?.replace(/[^0-9]/g, '') || '';
              const whatsappUrl = getWhatsappUrl(enq);

              return (
                <div
                  key={enq.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5"
                >
                  {/* Card Header Row */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-lg ${
                        enq.type === 'SELL_LAPTOP'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {enq.type === 'SELL_LAPTOP' && <Laptop className="w-3 h-3 text-emerald-700" />}
                      <span>{enq.type === 'SELL_LAPTOP' ? 'Sell Laptop' : 'General Inquiry'}</span>
                    </span>

                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-1">
                    <p className="font-bold text-slate-950 text-base">{enq.name}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      {enq.phone && (
                        <a
                          href={`tel:${enq.phone}`}
                          className="font-mono text-blue-700 font-semibold flex items-center gap-1 hover:underline"
                        >
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{enq.phone}</span>
                        </a>
                      )}
                      {enq.city && (
                        <span className="text-slate-600 flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{enq.city}</span>
                        </span>
                      )}
                    </div>
                    {enq.email && (
                      <p className="text-[11px] text-slate-400 break-all">{enq.email}</p>
                    )}
                  </div>

                  {/* Device Specs Details */}
                  {enq.deviceDetails && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-3 rounded-xl text-xs space-y-1">
                      <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <Laptop className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Submitted Laptop Specs:</span>
                      </p>
                      <p className="font-mono text-[11px] text-emerald-900 whitespace-pre-wrap">
                        {enq.deviceDetails}
                      </p>
                    </div>
                  )}

                  {/* Customer Message */}
                  {enq.message && (
                    <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl text-xs text-slate-700 space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Customer Message:
                      </span>
                      <p className="whitespace-pre-wrap">{enq.message}</p>
                    </div>
                  )}

                  {/* Card Actions Footer */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                    <EnquiryStatusSelector
                      enquiryId={enq.id}
                      currentStatus={enq.status}
                      onStatusChange={(newSt) => handleStatusChange(enq.id, newSt)}
                    />

                    {cleanPhone && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                        <span>WhatsApp Reply</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

    </div>
  );
}
