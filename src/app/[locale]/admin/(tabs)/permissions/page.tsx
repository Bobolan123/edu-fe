import { Metadata } from 'next';
import AdminPermissionsPage from '@/components/Admin/Permissions/AdminPermissionsPage';
import { getPermissions } from '@/actions/permissionsAction';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Permissions Management - Admin Dashboard',
  description: 'Manage system permissions in the educational platform',
};

interface PermissionsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    api?: string;
    description?: string;
    method?: string;
    module?: string;
    order?: 'ASC' | 'DESC';
    orderBy?: 'id' | 'api' | 'description' | 'method' | 'module' | 'created' | 'updated';
    take?: string;
  }>;
}

export default async function PermissionsPage(props: PermissionsPageProps) {
  const searchParams = await props.searchParams;
  try {
    const page = parseInt(searchParams.page || '1');
    const take = parseInt(searchParams.take || '50');
    
    const permissionsResponse = await getPermissions({
      page,
      take,
      search: searchParams.search,
      api: searchParams.api,
      description: searchParams.description,
      method: searchParams.method,
      module: searchParams.module,
      order: searchParams.order || 'DESC',
      orderBy: searchParams.orderBy || 'id',
    });
    return (
      <AdminPermissionsPage 
        permissions={permissionsResponse}
        searchParams={searchParams}
      />
    );
  } catch (error) {
    console.error('Error fetching permissions:', error);
    redirect('/admin?error=failed-to-load-permissions');
  }
}