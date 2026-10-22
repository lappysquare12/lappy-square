import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import AdminSidebar from './AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Strict server-side RBAC guard
  if (!user || user.role === 'CUSTOMER') {
    redirect('/login?from=/admin&error=unauthorized');
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col md:flex-row">
      
      {/* Responsive Admin Sidebar */}
      <AdminSidebar
        user={{
          name: user.name,
          role: user.role,
          email: user.email,
        }}
      />

      {/* Main Admin View Content */}
      <main className="flex-1 overflow-x-clip p-4 sm:p-6 md:p-8 lg:p-10">
        {children}
      </main>

    </div>
  );
}
