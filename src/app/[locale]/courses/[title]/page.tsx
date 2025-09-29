import CourseDetail from "@/components/CourseDetail/CourseDetail";
import {
    ICategory,
    ICourse,
    ICourseContent,
} from "../../../../../types/entities";
import { getCourseById } from "@/actions/coursesAction";
import { getCourseContent } from "@/actions/courseContentAction";
import { extractIdFromSlug } from "@/utils/utils";
import { notFound } from "next/navigation";

interface Params {
    params: { title: string };
    searchParams?: Record<string, string>;
}

export default async function CourseDetailPage({
    params,
    searchParams,
}: Params) {
    const { title } = await params;
    
    const courseId = extractIdFromSlug(title);
    
    if (!courseId) {
        notFound(); 
    }
    
    const course = await getCourseById(courseId);
    const courseContent = await getCourseContent(Number(courseId));

    return (
        <CourseDetail
            course={course}
            courseContent={courseContent || undefined}
        />
    );
}
