import AdminEnrollmentsPage from '@/components/Admin/Enrollments/AdminEnrollmentsPage';
import { getAllEnrollmentsAdmin } from '@/actions/enrollmentAction';
import { redirect } from 'next/navigation';

interface EnrollmentsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    orderBy?: string;
    order?: string;
    userId?: string;
    courseId?: string;
    instructorId?: string;
    courseName?: string;
    studentName?: string;
    studentEmail?: string;
    enrolledFromDate?: string;
    enrolledToDate?: string;
  }>;
}

export default async function EnrollmentsPage(props: EnrollmentsPageProps) {
  const searchParams = await props.searchParams;
  
  try {
    const page = parseInt(searchParams.page || '1');
    const take = 10;
    const search = searchParams.search;
    
    // Get sorting parameters directly from URL
    const orderBy = searchParams.orderBy || 'date_enrolled';
    const order = (searchParams.order as 'ASC' | 'DESC') || 'DESC';
    
    // Additional filter parameters
    const userId = searchParams.userId ? parseInt(searchParams.userId) : undefined;
    const courseId = searchParams.courseId ? parseInt(searchParams.courseId) : undefined;
    const instructorId = searchParams.instructorId ? parseInt(searchParams.instructorId) : undefined;
    const courseName = searchParams.courseName;
    const studentName = searchParams.studentName;
    const studentEmail = searchParams.studentEmail;
    const enrolledFromDate = searchParams.enrolledFromDate;
    const enrolledToDate = searchParams.enrolledToDate;
    
    const enrollmentsResponse = await getAllEnrollmentsAdmin({
      page,
      take,
      search,
      order,
      orderBy,
      userId,
      courseId,
      instructorId,
      courseName,
      studentName,
      studentEmail,
      enrolledFromDate,
      enrolledToDate
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