import Courses from "@/components/Courses/Courses";
import { sendRequest } from "../../../../ultils/api";
import { ICategory, ICourse } from "../../../../types/entities";

export default async function CoursesPage(props: {
    searchParams?: {
        filter?: string;
        page?: string;
        take?: string;
        rating?: string;
        categoryIds?: string | string[]; 
    };
}) {
    const searchParams = props.searchParams || {};
    const currentPage = Number(searchParams?.page) || 1;
    const take = Number(searchParams?.take) || 5;

    const resCourses = await sendRequest<IModelPaginate<ICourse>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses`,
        queryParams: {
            page: currentPage,
            take,
            search: searchParams?.filter,
            rating: searchParams?.rating,
            categoryIds: searchParams?.categoryIds,
        },
        nextOption: { cache: "no-cache" },
    });

    const resCategories = await sendRequest<IModelPaginate<ICategory>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/categories`,
    });

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
