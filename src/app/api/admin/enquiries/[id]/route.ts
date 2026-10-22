import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { deleteEnquiryFromFirestore } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER']);
    const { id } = await params;
    const { status, adminNotes } = await req.json();

    const updated = await prisma.contactEnquiry.update({
      where: { id },
      data: { status, adminNotes },
    });

    // Also sync status update to Firestore
    try {
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'lappy-square';
      await fetch(
        `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/enquiries/${encodeURIComponent(id)}?updateMask.fieldPaths=status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: {
              status: { stringValue: status },
            },
          }),
        }
      );
    } catch (fsErr) {
      console.warn('Firestore enquiry status sync notice:', fsErr);
    }

    revalidatePath('/admin/enquiries');
    return NextResponse.json({ success: true, enquiry: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Update failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const { id } = await params;

    // 1. Delete from Firestore cloud documents FIRST so background sync never brings it back
    await deleteEnquiryFromFirestore(id);

    // 2. Delete from Prisma SQLite database
    await prisma.contactEnquiry.deleteMany({
      where: { id },
    });

    revalidatePath('/admin/enquiries');
    return NextResponse.json({ success: true, message: 'Enquiry deleted' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Delete failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
