import CourseDetail from "@/components/CourseDetail/CourseDetail";
import {
    ICategory,
    ICourse,
    ICourseContent,
} from "../../../../../types/entities";
import { getCourseById, getCourseContent } from "@/actions/coursesAction";
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
    
    // Extract ID from slug (e.g., "javascript-masterclass-123" -> "123")
    const courseId = extractIdFromSlug(title);
    
    if (!courseId) {
        notFound(); // Return 404 if ID cannot be extracted
    }
    
    const course = await getCourseById(courseId);
    const courseContent = await getCourseContent(Number(courseId));
    console.log(courseContent);

    return (
        <CourseDetail
            course={course}
            courseContent={courseContent || undefined}
        />
    );
}
