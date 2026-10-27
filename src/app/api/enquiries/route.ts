import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEnquiryEmailToAdmin } from '@/lib/resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, city, type, deviceDetails, message } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone number are required' }, { status: 400 });
    }

    const effectiveEmail = email && email.trim().length > 0 ? email.trim() : 'customer@lappysquare.com';
    const stringDeviceDetails = typeof deviceDetails === 'object' ? JSON.stringify(deviceDetails) : (deviceDetails || null);
    const enquiryId = `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // 1. Dispatch email notification to lappysquare@gmail.com via Resend
    let emailStatus = false;
    try {
      const emailResult = await sendEnquiryEmailToAdmin({
        name: name.trim(),
        email: effectiveEmail,
        phone: phone.trim(),
        city: city || null,
        type: type || 'GENERAL',
        deviceDetails: stringDeviceDetails,
        message: message || null,
      });
      emailStatus = emailResult.success;
      if (!emailResult.success) {
        console.warn('Resend enquiry email notice:', emailResult.error);
      }
    } catch (emailErr) {
      console.error('Resend enquiry email dispatch error:', emailErr);
    }

    // 2. Persist to Prisma Database (wrapped in try/catch to support read-only serverless environments)
    let savedToDb = false;
    try {
      await prisma.contactEnquiry.create({
        data: {
          id: enquiryId,
          name: name.trim(),
          email: effectiveEmail,
          phone: phone.trim(),
          city: city || null,
          type: type || 'GENERAL',
          deviceDetails: stringDeviceDetails,
          message: message || null,
          status: 'NEW',
        },
      });
      savedToDb = true;
    } catch (dbErr) {
      console.warn('Database enquiry log note (serverless read-only fallback):', dbErr);
    }

    // 3. Sync contact enquiry to Firestore Database
    try {
      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      const docRef = doc(db, 'enquiries', enquiryId);
      await setDoc(docRef, {
        id: enquiryId,
        name: name.trim(),
        email: effectiveEmail,
        phone: phone.trim(),
        city: city || null,
        type: type || 'GENERAL',
        deviceDetails: stringDeviceDetails,
        message: message || null,
        status: 'NEW',
        savedToDb,
        emailStatus,
        createdAt: serverTimestamp(),
      });
    } catch (fsErr) {
      console.log('Firestore enquiry sync notice:', fsErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been received. Our team will contact you within 24 hours.',
      enquiryId,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to submit enquiry';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
