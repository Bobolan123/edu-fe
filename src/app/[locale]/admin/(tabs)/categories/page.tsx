import AdminCategoriesPage from '@/components/Admin/Categories/AdminCategoriesPage';
import { getCategories } from '@/actions/categoriesAction';
import { redirect } from 'next/navigation';

interface CategoriesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function CategoriesPage(props: CategoriesPageProps) {
  const searchParams = await props.searchParams;
  
  try {
    const page = parseInt(searchParams.page || '1');
    const limit = 10;
    const search = searchParams.search;
    
    const categoriesResponse = await getCategories({ page, limit, search });
    
    return (
      <AdminCategoriesPage 
        categories={categoriesResponse} 
        searchParams={searchParams}
      />
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    redirect('/admin?error=failed-to-load-categories');
  }
}