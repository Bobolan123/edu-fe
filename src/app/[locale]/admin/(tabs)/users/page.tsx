import AdminUsersPage from '@/components/Admin/Users/AdminUsersPage';
import { getUsers } from '@/actions/userActions';
import { redirect } from 'next/navigation';
import { getRoles } from '@/actions/rolesAction';

interface UsersPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    role?: string;
    status?: string;
  }>;
}

export default async function UsersPage(props: UsersPageProps) {
  const searchParams = await props.searchParams;
  
  try {
    const page = parseInt(searchParams.page || '1');
    const limit = 10;
    const search = searchParams.search;
    const role = searchParams.role !== 'all' ? searchParams.role : undefined;
    const status = searchParams.status !== 'all' ? searchParams.status : undefined;
    
    const usersResponse = await getUsers(page, limit, search, role, status);
    const roles = await getRoles();
    console.log(roles)
    return (
      <AdminUsersPage 
        users={usersResponse} 
        roles={roles}
        searchParams={searchParams}
      />
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    redirect('/admin?error=failed-to-load-users');
  }
}