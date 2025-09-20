import { Metadata } from 'next';
import { auth } from '@/auth';
import { unauthorized } from 'next/navigation';
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

  // Check if user is authenticated
  if (!session?.user) {
    unauthorized();
  }

  // Check if user has admin-level role (admin, superadmin, etc.)
  // Reject teachers and students
  const userRole = (session.user as any)?.role?.toLowerCase() || '';
  if (!userRole.includes('admin')) {
    unauthorized();
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}