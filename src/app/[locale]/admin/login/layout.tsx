import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login - Educational Platform',
  description: 'Admin login for Educational Platform',
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}