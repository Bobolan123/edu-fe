import Courses from "@/components/Courses/Courses";
import { ICategory, ICourse } from "../../../../types/entities";
import { auth } from "@/auth";
import { getCourses } from "@/actions/coursesAction";
import { getCategories } from "@/actions/categoriesAction";

export default async function CoursesPage(props: {
    searchParams?: Promise<{
        filter?: string;
        page?: string;
        take?: string;
        rating?: string;
        minRating?: string;
        maxRating?: string;
        minPrice?: string;
        maxPrice?: string;
        instructorSearch?: string;
        orderBy?: string;
        order?: string;
        categoryIds?: string | string[];
    }>;
}) {
    const session = await auth();
    const searchParams = (await props.searchParams) || {};
    const currentPage = Number(searchParams?.page) || 1;
    const take = Number(searchParams?.take) || 5;

    // Parse categoryIds if it's a string
    let categoryIds: number[] | undefined;
    if (searchParams?.categoryIds) {
        if (Array.isArray(searchParams.categoryIds)) {
            categoryIds = searchParams.categoryIds.map(Number).filter(Boolean);
        } else {
            categoryIds = [Number(searchParams.categoryIds)].filter(Boolean);
        }
        if (categoryIds.length === 0) {
            categoryIds = undefined;
        }
    }

    const resCourses = await getCourses({
        page: currentPage,
        limit: take,
        search: searchParams?.filter,
        minRating: searchParams?.minRating
            ? Number(searchParams.minRating)
            : searchParams?.rating
            ? Number(searchParams.rating)
            : undefined,
        maxRating: searchParams?.maxRating
            ? Number(searchParams.maxRating)
            : undefined,
        minPrice: searchParams?.minPrice
            ? Number(searchParams.minPrice)
            : undefined,
        maxPrice: searchParams?.maxPrice
            ? Number(searchParams.maxPrice)
            : undefined,
        orderBy: searchParams?.orderBy || "id",
        order: (searchParams?.order as "ASC" | "DESC") || "DESC",
        categoryIds,
        excludeEnrolled: true,
    });
    console.log(resCourses.data?.result)

    const resCategories = await getCategories();

    return (
        <Courses
            courses={resCourses?.data?.result}
            categories={resCategories?.data?.result}
            currentPage={currentPage}
            totalPages={resCourses?.data?.meta?.pageCount || 1}
            totalItems={resCourses?.data?.meta?.itemCount || 0}
        />
    );
}
