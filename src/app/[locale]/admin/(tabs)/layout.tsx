import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AdminLayoutClient from '@/components/Admin/AdminLayoutClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Educational Platform Admin Dashboard',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Middleware should handle this, but as a safeguard:
  // If no session, let middleware handle the redirect
  if (!session?.user) {
    redirect('/en/admin/login');
  }

  // Check if user has admin role - exact match like middleware
  const userRole = (session.user as any)?.role;
  console.log('[Admin Layout] User role:', userRole);
  
  if (userRole !== 'admin') {
    console.log('[Admin Layout] Access denied - not admin role');
    redirect('/en?error=admin_required');
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}