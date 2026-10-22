'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp-order';

export default function WhatsAppFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  const defaultMessage = encodeURIComponent(
    'Hi Lappy Square team! I have a question about refurbished laptops, availability and warranty.'
  );
  const whatsappUrl = `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* Quick Prompt Bubble */}
      {isOpen && (
        <div className="mb-3 bg-white border border-[#E8E8E8] shadow-2xl rounded-2xl p-4 w-[calc(100vw-2rem)] max-w-xs sm:w-72 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-900">Lappy Square Support</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-black p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            Need advice on choosing the best refurbished laptop for your budget or specs? Chat with our hardware specialists directly on WhatsApp!
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <WhatsAppIcon className="w-4 h-4 shrink-0" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        suppressHydrationWarning
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Contact support on WhatsApp"
        title="Chat on WhatsApp"
      >
        <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>
    </div>
  );
}
