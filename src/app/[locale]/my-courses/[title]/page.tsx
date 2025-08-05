import ManageDetailCourse from "@/components/My-courses/ManageDetailCourse/ManageDetailCourse";
import { sendRequest } from "../../../../../utils/api";
import { ICourse, ICourseContent } from "../../../../../types/entities";
import { IStudentsResponse } from "../../../../../types/resData";
import { getCourseStudents } from "@/actions/coursesAction";
import { slugify } from "../../../../../utils/utils";

interface IParams {
    params: { title: string };
    searchParams: { 
        id: string;
        page?: string;
        take?: string;
        tab?: string;
    };
}

export default async function ManageDetailCoursePage({
    searchParams,
}: IParams) {
    const { id, page = '1', take = '5', tab = '0' } = await searchParams;

    const resCourse = await sendRequest<IBackendRes<ICourse>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${id}`,
        nextOption: {
            next: {
                tags: ["courses"],
            },
        },
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

    // Fetch course students data with pagination
    let studentsData: IStudentsResponse | null = null;
    try {
        const currentPage = parseInt(page);
        const pageSize = parseInt(take);
        studentsData = await getCourseStudents(parseInt(id), currentPage, pageSize);
    } catch (error) {
        console.error("Failed to fetch students data:", error);
    }

    return (
        <ManageDetailCourse
            course={resCourse.data}
            courseContent={resContent.data}
            studentsData={studentsData}
            currentPage={parseInt(page)}
            baseUrl={`/my-courses/${slugify(resCourse.data.title)}?id=${id}`}
            initialTab={parseInt(tab)}
        />
    );
}
