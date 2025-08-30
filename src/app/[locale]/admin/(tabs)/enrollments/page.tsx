import AdminEnrollmentsPage from '@/components/Admin/Enrollments/AdminEnrollmentsPage';
import { getAllEnrollmentsAdmin } from '@/actions/enrollmentAction';
import { redirect } from 'next/navigation';

interface EnrollmentsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    sortBy?: 'newest' | 'oldest' | 'progress_high' | 'progress_low';
  }>;
}

export default async function EnrollmentsPage(props: EnrollmentsPageProps) {
  const searchParams = await props.searchParams;
  
  try {
    const page = parseInt(searchParams.page || '1');
    const take = 10;
    const search = searchParams.search;
    const sortBy = searchParams.sortBy;
    
    // Map frontend sortBy values to API parameters
    let order: 'ASC' | 'DESC' = 'DESC';
    let orderBy: 'date_enrolled' | 'id' | 'course_title' | 'student_name' | 'instructor_name' = 'date_enrolled';
    
    switch (sortBy) {
      case 'newest':
        order = 'DESC';
        orderBy = 'date_enrolled';
        break;
      case 'oldest':
        order = 'ASC';
        orderBy = 'date_enrolled';
        break;
      case 'progress_high':
        // Note: API doesn't support progress sorting, fallback to date
        order = 'DESC';
        orderBy = 'date_enrolled';
        break;
      case 'progress_low':
        // Note: API doesn't support progress sorting, fallback to date
        order = 'ASC';
        orderBy = 'date_enrolled';
        break;
      default:
        order = 'DESC';
        orderBy = 'date_enrolled';
    }
    
    const enrollmentsResponse = await getAllEnrollmentsAdmin({
      page,
      take,
      search,
      order,
      orderBy
    });
    console.log(enrollmentsResponse)
    return (
      <AdminEnrollmentsPage 
        enrollments={enrollmentsResponse} 
        searchParams={searchParams}
      />
    );
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    redirect('/admin?error=failed-to-load-enrollments');
  }
}