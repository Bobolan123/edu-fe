import AdminRolesPage from '@/components/Admin/Roles/AdminRolesPage';
import { getRoles } from '@/actions/rolesAction';
import { getPermissions } from '@/actions/permissionsAction';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Roles Management - Admin Dashboard',
  description: 'Manage user roles and permissions in the educational platform',
};

interface RolesPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function RolesPage(props: RolesPageProps) {
  const searchParams = await props.searchParams;
  
  try {
    const [rolesResponse, permissionsResponse] = await Promise.all([
      getRoles(),
      getPermissions(1, 100)
    ]);
    return (
      <AdminRolesPage 
        roles={rolesResponse} 
        permissions={permissionsResponse}
        searchParams={searchParams}
      />
    );
  } catch (error) {
    console.error('Error fetching roles:', error);
    redirect('/admin?error=failed-to-load-roles');
  }
}