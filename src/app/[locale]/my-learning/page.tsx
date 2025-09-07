import { sendRequest } from "../../../utils/api";
import { ICourse } from "../../../../types/entities";
import { auth } from "@/auth";
import MyLearning from "@/components/My-learning/MyLearning";


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
  const searchParams = props.searchParams || {};
  const session = await auth();
  
  const resEnrolledCourses = await sendRequest<IModelPaginate<EnrolledCourse>>({
    method: "GET",
    url: `${process.env.NEXT_PUBLIC_SERVER}/enrollments/user/${session?.user?.id}/courses`,
    queryParams: {
      search: searchParams?.filter,
      page: searchParams?.page,
      take: searchParams?.take,
    },
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  });
  return <MyLearning enrolledCourses={resEnrolledCourses?.data?.result || []} />;
}
