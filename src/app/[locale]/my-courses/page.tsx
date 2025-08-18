import ManageMyCourses from "@/components/My-courses/ManageMyCourses";
import { sendRequest } from "../../../../utils/api";
import { ICourse } from "../../../../types/entities";
import { auth } from "@/auth";

export default async function ManageMyCoursesPage(props: {
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

    let courses: ICourse[] | undefined = [];

    try {
        const resCourses = await sendRequest<IModelPaginate<ICourse>>({
            method: "GET",
            url: `${process.env.NEXT_PUBLIC_SERVER}/courses`,
            queryParams: {
                search: searchParams?.filter,
                rating: searchParams?.rating,
                categoryIds: searchParams?.categoryIds,
            },
            nextOption: { cache: "no-cache" },
        });

        if (!resCourses?.data?.result) throw new Error("No course data found");

        courses = resCourses.data.result;
    } catch (error) {
        console.error("Error fetching courses:", error);
        courses = undefined;
    }

    return <ManageMyCourses courses={courses} />;
}
