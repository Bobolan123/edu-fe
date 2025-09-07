import Courses from "@/components/Courses/Courses";
import { sendRequest } from "../../../utils/api";
import { ICategory, ICourse } from "../../../../types/entities";
import { getSession } from "next-auth/react";
import { auth } from "@/auth";

export default async function CoursesPage(props: {
    searchParams?: {
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
    };
}) {
    const session = await auth();
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
            minRating: searchParams?.minRating || searchParams?.rating,
            maxRating: searchParams?.maxRating,
            minPrice: searchParams?.minPrice,
            maxPrice: searchParams?.maxPrice,
            instructorSearch: searchParams?.instructorSearch,
            orderBy: searchParams?.orderBy || 'id',
            order: searchParams?.order || 'DESC',
            categoryIds: searchParams?.categoryIds,
            userId: session?.user?.id,
            excludeEnrolled: true,

        },
        nextOption: { cache: "no-cache" },
    });
    console.log(resCourses)

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
