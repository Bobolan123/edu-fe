import { ICourse } from "../../../../types/entities";
import { auth } from "@/auth";
import MyLearning from "@/components/My-learning/MyLearning";
import { getEnrolledCourses } from "@/actions/enrollmentAction";


export type EnrolledCourse = ICourse & {
  enrollmentId: number;
  progress: number;
  lectureProgress: number;
  dateEnrolled:Date;
};

export default async function MyLearningPage(props: {
  searchParams?: {
    filter?: string;
    page?: string;
    take?: string;
    rating?: string;
    categoryIds?: string | string[];
  };
}) {
  const searchParams = await props.searchParams || {};
  const session = await auth();
  
  const resEnrolledCourses = await getEnrolledCourses(session?.user?.id!, {
    search: searchParams?.filter,
    page: searchParams?.page,
    take: searchParams?.take,
  });
  return <MyLearning enrolledCourses={resEnrolledCourses} />;
}
