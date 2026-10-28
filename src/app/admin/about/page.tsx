import React from 'react';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import AboutCMSClient from './AboutCMSClient';
import { DEFAULT_ABOUT_CONTENT } from '@/lib/about-content';

export const metadata = {
  title: 'About Us Page CMS | Admin Panel',
};

export const dynamic = 'force-dynamic';

export default async function AdminAboutPage() {
  await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);

  let initialContent = DEFAULT_ABOUT_CONTENT;
  try {
    const setting = (await prisma.websiteSetting.findFirst()) as any;
    if (setting?.aboutContent) {
      const parsed = JSON.parse(setting.aboutContent);
      initialContent = { ...DEFAULT_ABOUT_CONTENT, ...parsed };
    }
  } catch {
    // fallback to defaults
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            About Us Page CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Edit the founder photo, narrative story, mission statements, and live statistics shown on the official /about page.
          </p>
        </div>
      </div>

      <AboutCMSClient initialContent={initialContent} />
    </div>
  );
}
