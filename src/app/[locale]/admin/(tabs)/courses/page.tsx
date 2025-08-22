import AdminCoursesPage from '@/components/Admin/Courses/AdminCoursesPage';
import { getCoursesForAdmin } from '@/actions/coursesAction';
import { getCategories } from '@/actions/categoriesAction';
import { redirect } from 'next/navigation';

interface CoursesPageProps {
  searchParams: {
    page?: string;
    search?: string;
    category?: string;
    status?: string;
  };
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  try {
    const page = parseInt(searchParams.page || '1');
    const limit = 10;
    const search = searchParams.search;
    const category = searchParams.category !== 'all' ? searchParams.category : undefined;
    const status = searchParams.status !== 'all' ? searchParams.status : undefined;

    const [coursesResponse, categories] = await Promise.all([
      getCoursesForAdmin(page, limit, search, category),
      getCategories(1, 1000)
    ]);

    return (
      <AdminCoursesPage 
        initialCourses={coursesResponse} 
        categories={categories.data?.result || []}
        searchParams={searchParams}
      />
    );
  } catch (error) {
    console.error('Error fetching courses:', error);
    redirect('/admin?error=failed-to-load-courses');
  }
}