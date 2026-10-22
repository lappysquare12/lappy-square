import React from 'react';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import SettingsForm from './SettingsForm';
import ChangePasswordForm from './ChangePasswordForm';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  await requireAuth(['SUPER_ADMIN', 'ADMIN']);

  let setting = await prisma.websiteSetting.findFirst();
  if (!setting) {
    setting = await prisma.websiteSetting.create({
      data: {},
    });
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Website Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure global store parameters, announcement notices, support contact, and policies.
        </p>
      </div>

      {/* Admin Password & Security */}
      <ChangePasswordForm />

      {/* Website General Settings */}
      <SettingsForm
        initialData={{
          id: setting.id,
          siteName: setting.siteName,
          tagline: setting.tagline,
          brandAccent: setting.brandAccent,
          supportEmail: setting.supportEmail,
          supportPhone: setting.supportPhone,
          supportAddress: setting.supportAddress,
          announcementText: setting.announcementText,
          announcementActive: setting.announcementActive,
          freeShippingThreshold: setting.freeShippingThreshold,
          defaultShippingCost: setting.defaultShippingCost,
          taxPercentage: setting.taxPercentage,
          returnWindowDays: setting.returnWindowDays,
          warrantyText: setting.warrantyText,
          metaTitle: setting.metaTitle,
          metaDescription: setting.metaDescription,
          instagramUrl: setting.instagramUrl,
          facebookUrl: setting.facebookUrl,
          youtubeUrl: setting.youtubeUrl,
          linkedinUrl: setting.linkedinUrl,
          twitterUrl: setting.twitterUrl,
          whatsappNumber: setting.whatsappNumber,
        }}
      />
    </div>
  );
}
