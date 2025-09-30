import ManageMyCourses from "@/components/My-courses/ManageMyCourses";
import { getCourses } from "@/actions/coursesAction";
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
    const searchParams = await props.searchParams || {};
    const session = await auth();

    const categoryIds = Array.isArray(searchParams?.categoryIds) 
        ? searchParams.categoryIds.map(Number)
        : searchParams?.categoryIds 
            ? [Number(searchParams.categoryIds)]
            : undefined;

    const coursesData = await getCourses({
        search: searchParams?.filter,
        minRating: searchParams?.rating ? Number(searchParams.rating) : undefined,
        categoryIds,
        page: searchParams?.page ? Number(searchParams.page) : undefined,
        limit: searchParams?.take ? Number(searchParams.take) : undefined,
        instructorId: session?.user?.id ? Number(session?.user?.id) : undefined,
    });

    return <ManageMyCourses courses={coursesData?.data?.result} />;
}
