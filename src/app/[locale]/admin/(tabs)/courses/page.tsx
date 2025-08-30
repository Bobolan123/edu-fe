import AdminCoursesPage from '@/components/Admin/Courses/AdminCoursesPage';
import { getCoursesForAdmin } from '@/actions/coursesAction';
import { getCategories } from '@/actions/categoriesAction';
import { redirect } from 'next/navigation';

interface CoursesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    categoryIds?: string | string[];
    status?: string;
    includeDeleted?: string;
  }>;
}

export default async function CoursesPage(props : CoursesPageProps) {
  const searchParams = await props.searchParams;
  try {
    const page = parseInt(searchParams.page || '1');
    const limit = 10;
    const search = searchParams.search;
    // Parse categoryIds from URL parameters
    let categoryIds: number[] | undefined;
    if (searchParams.categoryIds) {
      if (Array.isArray(searchParams.categoryIds)) {
        categoryIds = searchParams.categoryIds.map(Number).filter(Boolean);
      } else {
        categoryIds = [Number(searchParams.categoryIds)].filter(Boolean);
      }
      if (categoryIds.length === 0) {
        categoryIds = undefined;
      }
    }
    const status = searchParams.status !== 'all' ? searchParams.status : undefined;
    const includeDeleted = searchParams.includeDeleted === 'true';
    
    const coursesResponse = await getCoursesForAdmin(page, limit, search, categoryIds, status, includeDeleted);
    const categories = await getCategories(1, 50);
    return (
      <AdminCoursesPage 
        courses={coursesResponse} 
        categories={categories.data?.result || []}
        searchParams={searchParams}
      />
    );
  } catch (error) {
    console.error('Error fetching courses:', error);
    redirect('/admin?error=failed-to-load-courses');
  }
}