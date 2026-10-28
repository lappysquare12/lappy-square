'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Laptop,
  ShieldCheck,
  RotateCcw,
  Store,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Lock
} from 'lucide-react';
import LappySquareLogo from '@/components/ui/LappySquareLogo';
import {
  WhatsAppIcon,
  InstagramIcon,
  FacebookIcon,
  YouTubeIcon,
  LinkedInIcon,
  XIcon
} from '@/components/ui/SocialIcons';
import { AppleLogo, WindowsLogo } from '@/components/ui/BrandLogos';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp-order';

export default function Footer() {
  const [socials, setSocials] = useState({
    instagram: 'https://www.instagram.com/lappy_square/',
    facebook: 'https://www.facebook.com/61593042681135/',
    youtube: 'https://youtube.com/@lappysquare',
    linkedin: 'https://linkedin.com/company/lappysquare',
    twitter: 'https://twitter.com/lappysquare',
    whatsapp: '919376988788',
    phone: '+91 93769 88788',
    supportEmail: 'lappysquare@gmail.com',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.setting) {
          const s = data.setting;
          const cleanWa = s.whatsappNumber ? s.whatsappNumber.replace(/[^0-9]/g, '') : '919376988788';
          setSocials({
            instagram: s.instagramUrl || 'https://www.instagram.com/lappy_square/',
            facebook: s.facebookUrl || 'https://www.facebook.com/61593042681135/',
            youtube: s.youtubeUrl || 'https://youtube.com/@lappysquare',
            linkedin: s.linkedinUrl || 'https://linkedin.com/company/lappysquare',
            twitter: s.twitterUrl || 'https://twitter.com/lappysquare',
            whatsapp: cleanWa.length >= 10 ? cleanWa : '919376988788',
            phone: s.supportPhone || '+91 93769 88788',
            supportEmail: s.supportEmail || 'lappysquare@gmail.com',
          });
        }
      })
      .catch(() => {});
  }, []);

  const socialLinks = [
    {
      name: 'YouTube',
      href: socials.youtube,
      icon: YouTubeIcon,
      hoverClass: 'hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] text-[#FF0000]',
      bgAccent: 'bg-[#FF0000]/10'
    },
    {
      name: 'Instagram',
      href: socials.instagram,
      icon: InstagramIcon,
      hoverClass: 'hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C] text-[#E1306C]',
      bgAccent: 'bg-[#E1306C]/10'
    },
    {
      name: 'Facebook',
      href: socials.facebook,
      icon: FacebookIcon,
      hoverClass: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] text-[#1877F2]',
      bgAccent: 'bg-[#1877F2]/10'
    },
  ];

  return (
    <footer className="bg-[#F7F8FA] border-t border-[#E8E8E8] text-slate-700">
      {/* Trust Badges Banner */}
      <div className="border-b border-[#E8E8E8] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-slate-900">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">45-Point Lab Check</h4>
                <p className="text-xs text-slate-500">Rigorous diagnostic certified</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 text-slate-900">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">100% Genuine Hardware</h4>
                <p className="text-xs text-slate-500">Original OEM chargers & tested parts</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-slate-900">
                <Laptop className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Best Price in Jaipur</h4>
                <p className="text-xs text-slate-500">Save up to 70% compared to new</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 text-slate-900">
                <MapPin className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Store Consultation</h4>
                <p className="text-xs text-slate-500">Paris Tower, Mansarovar Jaipur</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info & Contact */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center py-1">
              <LappySquareLogo size={46} variant="horizontal" />
            </Link>
            
            <p className="text-sm text-slate-600 leading-relaxed pr-6">
              India&apos;s trusted destination for certified refurbished & second-hand enterprise laptops. 
              Every machine is thoroughly tested across 45 hardware checkpoints and supported by comprehensive warranty protection.
            </p>

            <div className="space-y-2 text-xs text-slate-600 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>Paris Tower, Near Vijay Path Chauraha, Madhyam Marg, Mansarovar, Jaipur, Rajasthan 302020</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <a href={`tel:${socials.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-slate-900 font-medium">{socials.phone}</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <a href={`mailto:${socials.supportEmail}`} className="hover:text-slate-900 font-medium">{socials.supportEmail}</a>
              </div>
            </div>

            {/* Official Social Media Channels */}
            <div className="pt-3">
              <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-2.5">
                Follow & Connect With Us
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105 hover:shadow-sm ${social.hoverClass}`}
                      aria-label={social.name}
                      title={social.name}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Shop Brands */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Top Brands</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/brands/apple" className="hover:text-slate-950 transition-colors">Apple MacBooks</Link></li>
              <li><Link href="/brands/dell" className="hover:text-slate-950 transition-colors">Dell Latitude & XPS</Link></li>
              <li><Link href="/brands/hp" className="hover:text-slate-950 transition-colors">HP EliteBook & ProBook</Link></li>
              <li><Link href="/brands/lenovo" className="hover:text-slate-950 transition-colors">Lenovo ThinkPad</Link></li>
              <li><Link href="/brands/asus" className="hover:text-slate-950 transition-colors">ASUS ZenBook & ROG</Link></li>
              <li><Link href="/brands/acer" className="hover:text-slate-950 transition-colors">Acer Swift & Aspire</Link></li>
              <li><Link href="/brands" className="font-semibold text-slate-900 hover:underline">All Brands →</Link></li>
            </ul>
          </div>

          {/* Customer Support & Policies */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Help & Policies</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-slate-950 transition-colors">45-Point Quality Lab</Link></li>
              <li><Link href="/about" className="hover:text-slate-950 transition-colors">Store Experience & Visit</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-slate-950 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-slate-950 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Popular Collections & Highlights */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Collections</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/collection/macbook" className="hover:text-slate-950 transition-colors flex items-center gap-1.5">
                  <AppleLogo className="w-3.5 h-3.5 text-slate-800" />
                  <span>Apple MacBooks</span>
                </Link>
              </li>
              <li>
                <Link href="/collection/windows" className="hover:text-slate-950 transition-colors flex items-center gap-1.5">
                  <WindowsLogo className="w-3.5 h-3.5 text-blue-600" />
                  <span>Windows Laptops</span>
                </Link>
              </li>
              <li><Link href="/collection/gaming" className="hover:text-slate-950 transition-colors">Best for Gaming</Link></li>
              <li><Link href="/collection/student" className="hover:text-slate-950 transition-colors">Best for Students</Link></li>
              <li><Link href="/deals" className="hover:text-slate-950 text-amber-700 font-semibold transition-colors">Deals of the Day</Link></li>
              <li><Link href="/video-reviews" className="hover:text-slate-950 text-indigo-700 font-semibold transition-colors">Customer Video Reviews</Link></li>
            </ul>

            <div className="pt-2">
              <a
                href="https://www.google.com/search?gs_ssp=eJzj4tVP1zc0rMquKEsrSkkyYLRSNagwtjRLSTJNNbJMTjQ2T7MwtzKoSDWxSDE3Mk01NUw1TEm0NPYSzkksKKhUKC4sTSxKVchKzCwoLQIAVf0Xfg&q=lappy+square+jaipur"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:shadow-md hover:border-slate-300 transition-all group"
                title="View Lappy Square Jaipur Google Reviews"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-xs text-slate-900">Google Rating</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200/60">Verified</span>
                  </div>
                  <span className="text-xs font-black text-amber-500 flex items-center gap-0.5">
                    ★ 4.9
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Lappy Square Jaipur • Mansarovar Experience Center
                </p>
                <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-blue-700 group-hover:text-blue-800">
                  <span>Read Google Reviews</span>
                  <span className="text-[10px]">↗</span>
                </div>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright, Powered By & Trust Badges */}
      <div className="border-t border-[#E8E8E8] bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-center sm:text-left">
            <p suppressHydrationWarning>© {new Date().getFullYear()} Lappy Square India. All rights reserved.</p>
            <span className="hidden sm:inline text-slate-300">•</span>
            <p className="text-slate-600 font-medium">
              Powered by{' '}
              <a
                href="https://jainup.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-slate-900 hover:text-blue-700 hover:underline transition-colors inline-flex items-center gap-1"
                title="JAINUP | Growth Systems"
              >
                <span>JAINUP | Growth Systems</span>
                <span className="text-[10px] text-blue-600 font-bold">↗</span>
              </a>
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-500 text-xs">
            <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              100% Genuine Certified
            </span>
            <span>•</span>
            <span>WhatsApp Direct Booking</span>
            <span>•</span>
            <span>In-Store Payment & UPI</span>
            <span>•</span>
            <span>1-Year Certified Warranty</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
