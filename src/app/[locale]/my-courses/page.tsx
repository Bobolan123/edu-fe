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
        tab?: string;
        includeDeleted?: string;
    };
}) {
    const searchParams = await props.searchParams || {};
    const session = await auth();

    const categoryIds = Array.isArray(searchParams?.categoryIds)
        ? searchParams.categoryIds.map(Number)
        : searchParams?.categoryIds
            ? [Number(searchParams.categoryIds)]
            : undefined;

    const currentTab = searchParams?.tab || 'active';
    const includeDeleted = currentTab === 'deleted' || searchParams?.includeDeleted === 'true';

    const coursesData = await getCourses({
        search: searchParams?.filter,
        minRating: searchParams?.rating ? Number(searchParams.rating) : undefined,
        categoryIds,
        page: searchParams?.page ? Number(searchParams.page) : undefined,
        limit: searchParams?.take ? Number(searchParams.take) : undefined,
        instructorId: session?.user?.id ? Number(session?.user?.id) : undefined,
        includeDeleted,
    });

    console.log()
    return <ManageMyCourses
        courses={coursesData?.data?.result}
        currentTab={currentTab}
        searchParams={searchParams}
    />;
}
