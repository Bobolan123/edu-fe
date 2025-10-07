"use client";

import type React from "react";
import { useState } from "react";
import { type SelectChangeEvent } from "@mui/material";
import { ICategory, ICourseContent } from "../../../../types/entities";
import {
    createCourse,
    uploadThumbnail,
} from "@/actions/coursesAction";
import {
    batchUpdateCourseContent,
    uploadVideoToLecture,
} from "@/actions/courseContentAction";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useCurrency } from "../../../context/CurrencyContext";
import { useRouter } from "next/navigation";
import CourseBasicInfo from "./CourseBasicInfo";
import CourseContentBuilder from "./CourseContentBuilder";
import { CourseFormState } from "./types";
import { toastService } from "@/services/toast";

const initialCourseState: CourseFormState = {
    title: "",
    description: "",
    language: "English",
    price: 0,
    preview_url: "",
    thumbnail_url: null,
    categories: [],
    isActive: true,
};

const initialContentState: ICourseContent = {
    sections: [
        {
            id: "temp-section-1",
            title: "Introduction",
            description: "Introduction to the course",
            orderIndex: 0,
            lectures: [
                {
                    id: "temp-lecture-1",
                    title: "Welcome to the Course",
                    description: "Course overview and introduction",
                    contentType: "video" as const,
                    orderIndex: 0,
                    durationSeconds: 0,
                    isPreview: true,
                    content: {
                        videoUrl: "",
                        thumbnailUrl: "",
                        cloudinaryPublicId: "",
                        quality: [],
                    },
                    videoFile: null,
                },
            ],
        },
    ],
    metadata: {
        language: "English",
        level: "Beginner",
        whatYoullLearn: ["Basic understanding of the subject"],
    },
};

interface ICreateCoursePageProps {
    categories: ICategory[];
}

export default function CreateCoursePage({
    categories,
}: ICreateCoursePageProps) {
    const { data: session } = useSession();
    const t = useTranslations("CreateCourse");
    const { currency } = useCurrency();
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(1);
    const [course, setCourse] = useState<CourseFormState>(initialCourseState);
    const [content, setContent] = useState<ICourseContent>(initialContentState);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [createdCourseId, setCreatedCourseId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCourseChange = (
        field: keyof CourseFormState,
        value: string | number | boolean
    ) => {
        setCourse((prev) => ({ ...prev, [field]: value }));
    };

    const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value;
        setCourse((prev) => ({
            ...prev,
            categories: typeof value === "string" ? value.split(",") : value,
        }));
    };

    const handleThumbnailUpload = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            setThumbnailFile(file);
            const url = URL.createObjectURL(file);
            setCourse((prev) => ({ ...prev, thumbnail_url: url }));
        }
    };

    const handleCourseSubmit = async (
        courseData: CourseFormState,
        thumbnailFile: File | null
    ): Promise<number> => {
        if (!session?.user?.access_token) {
            toastService.error(t("must_be_logged_in"));
            throw new Error(t("must_be_logged_in"));
        }

        setIsSubmitting(true);

        try {
            const selectedCategoryIds = courseData.categories
                .map((name) => {
                    const foundCategory = categories.find(
                        (cat) => cat.name === name
                    );
                    return foundCategory ? foundCategory.id : null;
                })
                .filter((id): id is number => id !== null);

            const resCourse = await createCourse({
                title: courseData.title,
                description: courseData.description,
                language: courseData.language,
                price: courseData.price,
                preview_url: courseData.preview_url,
                isActive: courseData.isActive,
                categoryIds: selectedCategoryIds,
                instructorId: +session?.user?.id,
            });

            if (!resCourse?.data || !resCourse.data.id) {
                throw new Error(
                    "Failed to get a valid response from course creation."
                );
            }
            toastService.success(resCourse.message);

            const newCourseId = resCourse.data.id;

            if (thumbnailFile) {
                const resThumbnail = await uploadThumbnail(
                    newCourseId.toString(),
                    thumbnailFile
                );
                toastService.success(resThumbnail.message);
            }

            setCreatedCourseId(newCourseId);
            setCurrentStep(2);

            return newCourseId;
        } catch (error) {
            console.error("Failed to create course:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred.";
            throw error;
            toastService.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleContentSubmit = async (contentData: ICourseContent) => {
        if (!session?.user?.access_token || !createdCourseId) {
            toastService.error("Missing authentication or course ID");
            throw new Error("Missing authentication or course ID");
        }

        setIsSubmitting(true);

        try {
            const batchLoadingToast = toastService.loading("Saving course content...");

            // Prepare sections for batch API - separate videos for upload
            const videoUploads: {
                sectionIndex: number;
                lectureIndex: number;
                videoFile: File;
            }[] = [];

            // Prepare sections data without video files
            const sectionsData = contentData.sections.map((section, sectionIndex) => ({
                id: section.id?.startsWith("temp-") ? undefined : section.id,
                title: section.title,
                description: section.description || "",
                orderIndex: section.orderIndex,
                lectures: section.lectures.map((lecture, lectureIndex) => {
                    // Store video file reference for later upload
                    if (lecture.contentType === "video" && lecture.videoFile) {
                        videoUploads.push({
                            sectionIndex,
                            lectureIndex,
                            videoFile: lecture.videoFile
                        });
                    }

                    return {
                        id: lecture.id?.startsWith("temp-") ? undefined : lecture.id,
                        title: lecture.title,
                        description: lecture.description || "",
                        contentType: lecture.contentType,
                        orderIndex: lecture.orderIndex,
                        durationSeconds: lecture.durationSeconds || 0,
                        isPreview: lecture.isPreview || false,
                        content: lecture.contentType === "video"
                            ? {
                                videoUrl: "",
                                cloudinaryPublicId: "",
                                quality: []
                              }
                            : lecture.content
                    };
                })
            }));

            // Step 1: Batch create/update all sections and lectures
            const batchResult = await batchUpdateCourseContent(
                createdCourseId,
                sectionsData
            );

            toastService.dismiss(batchLoadingToast);
            toastService.success("Course structure saved successfully!");

            // Step 2: Upload video files for video lectures
            if (videoUploads.length > 0) {
                for (const upload of videoUploads) {
                    const section = batchResult[upload.sectionIndex];
                    const lecture = section.lectures[upload.lectureIndex];

                    if (section?.id && lecture?.id) {
                        const uploadToast = toastService.loading(
                            `Uploading video for "${lecture.title}"...`
                        );

                        await uploadVideoToLecture(
                            createdCourseId,
                            section.id,
                            lecture.id,
                            upload.videoFile
                        );

                        toastService.dismiss(uploadToast);
                        toastService.success(`Video uploaded for "${lecture.title}"`);
                    }
                }
            }

            toastService.success(t("course_created_success"));

            // Redirect to my-courses page after successful creation
            setTimeout(() => {
                router.push("/my-courses");
            }, 1500);
        } catch (error) {
            console.error("Failed to create course content:", error);
            toastService.dismiss(); // Dismiss any loading toasts
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred.";
            toastService.error(
                t("create_course_error", { error: errorMessage })
            );
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    if (currentStep === 1) {
        return (
            <CourseBasicInfo
                course={course}
                categories={categories}
                thumbnailFile={thumbnailFile}
                currency={currency}
                onCourseChange={handleCourseChange}
                onCategoryChange={handleCategoryChange}
                onThumbnailUpload={handleThumbnailUpload}
                onSubmit={handleCourseSubmit}
                isSubmitting={isSubmitting}
            />
        );
    }

    if (currentStep === 2 && createdCourseId) {
        return (
            <CourseContentBuilder
                courseId={createdCourseId}
                content={content}
                onContentChange={setContent}
                onSubmit={handleContentSubmit}
                isSubmitting={isSubmitting}
            />
        );
    }

    return null;
}
