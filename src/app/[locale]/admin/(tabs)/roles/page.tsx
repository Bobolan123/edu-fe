import AdminRolesPage from '@/components/Admin/Roles/AdminRolesPage';
import { getRoles, getPermissionsForRoles } from '@/actions/rolesAction';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Roles Management - Admin Dashboard',
  description: 'Manage user roles and permissions in the educational platform',
};

interface RolesPageProps {
  searchParams: Promise<{
    search?: string;
    permissionsPage?: string;
    permissionsSearch?: string;
    permissionsModule?: string;
    permissionsMethod?: string;
  }>;
}

export default async function RolesPage(props: RolesPageProps) {
  const searchParams = await props.searchParams;
  
  try {
    const permissionsPage = parseInt(searchParams.permissionsPage || '1');
    const permissionsTake = 100; // Load more permissions for role management
    
    const [rolesResponse, permissionsResponse] = await Promise.all([
      getRoles(),
      getPermissionsForRoles({
        page: permissionsPage,
        take: permissionsTake,
        search: searchParams.permissionsSearch,
        module: searchParams.permissionsModule,
        method: searchParams.permissionsMethod,
        order: 'ASC',
        orderBy: 'module'
      })
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