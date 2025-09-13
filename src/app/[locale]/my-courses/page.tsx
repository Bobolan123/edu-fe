import ManageMyCourses from "@/components/My-courses/ManageMyCourses";
import { getCourses } from "@/actions/coursesAction";

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
    });

    return <ManageMyCourses courses={coursesData?.data?.result} />;
}
