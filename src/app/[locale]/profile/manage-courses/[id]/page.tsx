
import { notFound } from 'next/navigation';
import { sendRequest } from '../../../../../../ultils/api';
import { ICourse } from '../../../../../../types/entities';
import EditCourseClient from '@/components/profile/CourseManagement/EditCourseClient';

interface Props {
  params: { id: string };
}

export default async function EditCoursePage({ params }: Props) {
  const id = params.id;

  const course = await sendRequest<IBackendRes<ICourse>>({
    method: 'GET',
    url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${id}`,
    nextOption: { cache: 'no-store' },
  });

  if (!course) return notFound();

  return <EditCourseClient course={course.data as ICourse} />;
}
