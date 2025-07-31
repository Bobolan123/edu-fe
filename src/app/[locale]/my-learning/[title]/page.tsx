import CourseDetail from "@/components/CourseDetail/CourseDetail";
import {
    ICategory,
    ICourse,
    ICourseContent,
    IEnrollment,
    ILecture,
} from "../../../../../types/entities";
import { sendRequest } from "../../../../../utils/api";
import { extractIds } from "../../../../../utils/utils";
import CourseLesson from "@/components/My-learning/CourseLesson/CourseLesson";
import CourseLearningNavbar from "@/components/My-learning/CourseLesson/CourseLearningNavbar";
import { IReviewDistribution } from "../../../../../types/resData";
import { auth } from "@/auth";
import { getAllReviews } from "@/actions/reviewsAction";

export type EnrollmentProgress = {
    enrollment: IEnrollment;
    lectureProgress: ILecture[];
    progressPercentage: number;
};

interface Params {
    params: { title: string };
    searchParams: { id: string };
}

export default async function CourseDetailPage({
    params,
    searchParams,
}: Params) {
    const { id } = await searchParams;

    const session = await auth();

    const resContent = await sendRequest<IBackendRes<ICourseContent>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/content/${id}`,
        nextOption: {
            next: {
                tags: [`course-content-${id}`],
            },
        },
    });

    const resEnrollmentProgress = await sendRequest<
        IBackendRes<EnrollmentProgress>
    >({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/enrollments/user/${session?.user?.id}/course/${id}/progress`,
        nextOption: {
            next: {
                tags: [`enrollment-progress-${id}`],
            },
        },
    });

    const reviewDistribution = await sendRequest<
        IBackendRes<IReviewDistribution>
    >({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/reviews/distribution`,
        queryParams: {
            id,
        },
    });

    const resUserReviews = await getAllReviews({
        courseId: +id,
    });
    console.log(resUserReviews)
    
    return (    
        <div className="min-h-screen bg-white">
            <CourseLearningNavbar
                course={
                    resEnrollmentProgress?.data?.enrollment?.course as ICourse
                }
                courseContent={resContent?.data as ICourseContent}
                enrollmentProgress={
                    resEnrollmentProgress?.data as EnrollmentProgress
                }
            />
            <CourseLesson
                courseContent={resContent?.data as ICourseContent}
                course={
                    resEnrollmentProgress?.data?.enrollment?.course as ICourse
                }
                enrollmentProgress={
                    resEnrollmentProgress?.data as EnrollmentProgress
                }
                reviewDistribution={
                    reviewDistribution?.data as IReviewDistribution
                }
            />
        </div>
    );
}
