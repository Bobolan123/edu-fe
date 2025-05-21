import CourseDetail from "@/components/CourseDetail/CourseDetail";
import { sendRequest } from "../../../../../ultils/api";
import { ICategory, ICourse } from "../../../../../types/entities";
import { extractIds } from "../../../../../ultils/ultils";

interface Params {
    params: { title: string };
    searchParams: { id: string };
}

export default async function CourseDetailPage({
    params,
    searchParams,
}: Params) {
    const resCourse = await sendRequest<IBackendRes<ICourse>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${searchParams.id}`,
    });

    let similarCourses: ICourse[] = [];

    if (resCourse?.data?.categories?.length) {
        const ids = extractIds(resCourse.data.categories as ICategory[]);

        const resSimilar = await sendRequest<IModelPaginate<ICourse>>({
            method: "GET",
            url: `${
                process.env.NEXT_PUBLIC_SERVER
            }/courses/by-category?ids=${ids.join(",")}`,
            nextOption: { cache: "no-cache" },
        });

        similarCourses = resSimilar?.data?.result || [];
    }

    return (
        <CourseDetail
            course={resCourse?.data as ICourse}
            similarCourses={similarCourses}
        />
    );
}
