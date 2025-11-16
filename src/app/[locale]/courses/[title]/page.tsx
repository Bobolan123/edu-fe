import CourseDetail from "@/components/CourseDetail/CourseDetail";
import { getCourseById } from "@/actions/coursesAction";
import { getCourseContent, getLectureCaptions } from "@/actions/courseContentAction";
import { extractIdFromSlug } from "@/utils/utils";
import { notFound } from "next/navigation";

interface Params {
    params: Promise<{ title: string }>;
    searchParams?: Promise<Record<string, string>>;
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

    // Fetch captions for the first lecture server-side (if available)
    const firstLecture = courseContent?.sections?.[0]?.lectures?.[0];

    return (
        <CourseDetail
            course={course}
            courseContent={courseContent || undefined}
        />
    );
}
