import CourseDetail from "@/components/CourseDetail/CourseDetail";
import {
    ICategory,
    ICourse,
    ICourseContent,
} from "../../../../../types/entities";
import { sendRequest } from "../../../../../utils/api";
import { extractIds } from "../../../../../utils/utils";

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
        nextOption: {
            next: {
                tags: [`course-content-${id}`],
            },
        },
    });

    return (
        <CourseDetail
            course={resCourse?.data as ICourse}
            courseContent={resContent?.data as ICourseContent}
        />
    );
}
