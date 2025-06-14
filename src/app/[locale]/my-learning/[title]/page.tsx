import CourseDetail from "@/components/CourseDetail/CourseDetail";
import {
    ICategory,
    ICourse,
    ICourseContent,
} from "../../../../../types/entities";
import { sendRequest } from "../../../../../utils/api";
import { extractIds } from "../../../../../utils/utils";
import CourseLesson from "@/components/My-learning/CourseLesson/CourseLesson";
import { IReviewDistribution } from "../../../../../types/resData";

interface Params {
    params: { title: string };
    searchParams: { id: string };
}

export default async function CourseDetailPage({
    params,
    searchParams,
}: Params) {
    const { id } = await searchParams;

    const resCourse = await sendRequest<IBackendRes<ICourse>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${id}`,
    });
    const resContent = await sendRequest<IBackendRes<ICourseContent>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/content/${id}`,
    });

    const reviewDistribution = await sendRequest<IBackendRes<IReviewDistribution>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/reviews/distribution`,
        queryParams:{
            id
        }
    });

        return (
        <div>
            <CourseLesson
                courseContent={resContent?.data as ICourseContent}
                course={resCourse?.data as ICourse}
                reviewDistribution={reviewDistribution?.data as IReviewDistribution} 
            />
        </div>
    );
}
