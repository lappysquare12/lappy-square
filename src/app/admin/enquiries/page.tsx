import React from 'react';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import EnquiriesAdminClient from './EnquiriesAdminClient';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

async function ensureFirestoreEnquiriesSynced() {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'lappy-square';
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/enquiries`,
      { cache: 'no-store' }
    );
    if (!res.ok) return;
    const data = await res.json();
    if (!data.documents || !Array.isArray(data.documents)) return;

    const existingEnquiries = await prisma.contactEnquiry.findMany({ select: { id: true } });
    const existingIds = new Set(existingEnquiries.map((e) => e.id));

    for (const docItem of data.documents) {
      const fields = docItem.fields;
      if (!fields) continue;
      const id = fields.id?.stringValue || docItem.name.split('/').pop();
      if (!id || existingIds.has(id)) continue;

      await prisma.contactEnquiry.create({
        data: {
          id,
          name: fields.name?.stringValue || 'Customer',
          email: fields.email?.stringValue || 'customer@lappysquare.com',
          phone: fields.phone?.stringValue || '',
          city: fields.city?.stringValue || null,
          type: (fields.type?.stringValue as any) || 'SELL_LAPTOP',
          deviceDetails: fields.deviceDetails?.stringValue || null,
          message: fields.message?.stringValue || null,
          status: (fields.status?.stringValue as any) || 'NEW',
          createdAt: fields.createdAt?.timestampValue ? new Date(fields.createdAt.timestampValue) : new Date(),
        },
      });
      existingIds.add(id);
    }
  } catch (err) {
    console.warn('Firestore enquiries sync notice:', err);
  }
}

export default async function AdminEnquiriesPage() {
  await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);
  await ensureFirestoreEnquiriesSynced();

  const enquiries = await prisma.contactEnquiry.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const serializedEnquiries = enquiries.map((e) => ({
    id: e.id,
    name: e.name,
    email: e.email,
    phone: e.phone,
    city: e.city,
    type: String(e.type),
    deviceDetails: e.deviceDetails,
    message: e.message,
    status: String(e.status),
    createdAt: e.createdAt.toISOString(),
  }));

  return <EnquiriesAdminClient initialEnquiries={serializedEnquiries} />;
}
