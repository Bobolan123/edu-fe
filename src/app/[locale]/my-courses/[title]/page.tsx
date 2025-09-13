import ManageDetailCourse from "@/components/My-courses/ManageDetailCourse/ManageDetailCourse";
import { ICourse, ICourseContent, IReview } from "../../../../../types/entities";
import { IStudentsResponse } from "../../../../../types/resData";
import { getCourseStudents, getCourseById, getCourseContent } from "@/actions/coursesAction";
import { getAllReviews } from "@/actions/reviewsAction";
import { slugify } from "../../../../utils/utils";

interface IParams {
    params: { title: string };
    searchParams: { 
        id: string;
        studentsPage?: string;
        studentsTake?: string;
        reviewsPage?: string;
        reviewsTake?: string;
        tab?: string;
    };
}

export default async function ManageDetailCoursePage({
    searchParams,
}: IParams) {
    const { 
        id, 
        studentsPage = '1', 
        studentsTake = '5', 
        reviewsPage = '1', 
        reviewsTake = '5', 
        tab = '0' 
    } = await searchParams;

    const resCourse = await getCourseById(id);

    if (!resCourse) throw new Error("No course data found");

    const resContent = await getCourseContent(Number(id));

    // Fetch course students data with pagination
    let studentsData: IStudentsResponse | null = null;
    try {
        const currentPage = parseInt(studentsPage);
        const pageSize = parseInt(studentsTake);
        studentsData = await getCourseStudents(parseInt(id), currentPage, pageSize);
    } catch (error) {
        console.error("Failed to fetch students data:", error);
    }
    
    // Fetch course reviews data with pagination
    let reviewsData: IModelPaginate<IReview> | null = null;
    try {
        const currentPage = parseInt(reviewsPage);
        const pageSize = parseInt(reviewsTake);
        reviewsData = await getAllReviews({
            courseId: parseInt(id),
            page: currentPage,
            take: pageSize,
        });
    } catch (error) {
        console.error("Failed to fetch reviews data:", error);
    }

    return (
        <ManageDetailCourse
            course={resCourse}
            courseContent={resContent}
            studentsData={studentsData}
            reviewsData={reviewsData}
            studentsCurrentPage={parseInt(studentsPage)}
            reviewsCurrentPage={parseInt(reviewsPage)}
            baseUrl={`/my-courses/${slugify(resCourse.title)}?id=${id}&studentsPage=${studentsPage}&studentsTake=${studentsTake}&reviewsPage=${reviewsPage}&reviewsTake=${reviewsTake}`}
            initialTab={parseInt(tab)}
        />
    );
}
