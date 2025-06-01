import ManageDetailCourse from "@/components/My-courses/ManageDetailCourse/ManageDetailCourse";
import { sendRequest } from "../../../../../utils/api";
import { ICourse, ICourseContent } from "../../../../../types/entities";

interface IParams {
    params: { title: string };
    searchParams: { id: string };
}

export default async function ManageDetailCoursePage({
    searchParams,
}: IParams) {
    const { id } = await searchParams;

    const resCourse = await sendRequest<IBackendRes<ICourse>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${id}`,
    });

    if (!resCourse?.data) throw new Error("No course data found");

    const resContent = await sendRequest<IBackendRes<ICourseContent>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/content/${id}`,
        nextOption: {
            next: {
                tags: ["course-content"],
            },
        },
    });

    return (
        <ManageDetailCourse
            course={resCourse.data}
            courseContent={resContent.data}
        />
    );
}
