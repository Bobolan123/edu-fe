"use client";

import type React from "react";
import { useState } from "react";
import { type SelectChangeEvent } from "@mui/material";
import {
    ICategory,
    ICourseContent,
} from "../../../../types/entities";
import {
    createCourse,
    updateCourseContent,
    uploadThumbnail,
} from "@/actions/coursesAction";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useCurrency } from "../../../context/CurrencyContext";
import CourseBasicInfo from "./CourseBasicInfo";
import CourseContentBuilder from "./CourseContentBuilder";
import { CourseFormState } from "./types";

const initialCourseState: CourseFormState = {
    title: "",
    description: "",
    language: "English",
    price: 0,
    preview_url: "",
    thumbnail_url: null,
    categories: [],
    active: true,
    duration: "",
    durationHours: "",
    durationMinutes: "",
};

const initialContentState: ICourseContent = {
    courseId: 0,
    whatYoullLearn: [""],
    sections: [
        {
            title: "Introduction",
            totalLectures: 1,
            lectures: [{ title: "", videoUrl: "" }],
        },
    ],
    totalLength: 0,
    totalLectures: 1,
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

    const [currentStep, setCurrentStep] = useState(1);
    const [course, setCourse] = useState<CourseFormState>(initialCourseState);
    const [content, setContent] = useState<ICourseContent>(initialContentState);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [createdCourseId, setCreatedCourseId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

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

    const calculateTotalDurationInMinutes = (hours: string, minutes: string): number => {
        const hoursNum = parseInt(hours) || 0;
        const minutesNum = parseInt(minutes) || 0;
        return hoursNum * 60 + minutesNum;
    };

    const handleCourseSubmit = async (courseData: CourseFormState, thumbnailFile: File | null): Promise<number> => {
        if (!session?.user?.access_token) {
            throw new Error(t("must_be_logged_in"));
        }

        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            const selectedCategoryIds = courseData.categories
                .map((name) => {
                    const foundCategory = categories.find(
                        (cat) => cat.name === name
                    );
                    return foundCategory ? foundCategory.id : null;
                })
                .filter((id): id is number => id !== null);

            // Calculate total duration in minutes
            const totalDurationInMinutes = calculateTotalDurationInMinutes(
                courseData.durationHours,
                courseData.durationMinutes
            );

            const resCourse = await createCourse(session.user.access_token, {
                title: courseData.title,
                description: courseData.description,
                language: courseData.language,
                price: courseData.price,
                preview_url: courseData.preview_url,
                active: courseData.active,
                duration: totalDurationInMinutes,
                categoryIds: selectedCategoryIds,
            });

            if (!resCourse || !resCourse.id) {
                throw new Error(
                    "Failed to get a valid response from course creation."
                );
            }

            const newCourseId = resCourse.id;

            if (thumbnailFile) {
                await uploadThumbnail(
                    session.user.access_token,
                    newCourseId.toString(),
                    thumbnailFile
                );
            }

            setCreatedCourseId(newCourseId);
            setCurrentStep(2);
            setSubmitMessage({
                type: "success",
                text: "Course created successfully! Now add your content.",
            });

            return newCourseId;
        } catch (error) {
            console.error("Failed to create course:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred.";
            setSubmitMessage({
                type: "error",
                text: t("create_course_error", { error: errorMessage }),
            });
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleContentSubmit = async (contentData: ICourseContent) => {
        if (!session?.user?.access_token || !createdCourseId) {
            throw new Error("Missing authentication or course ID");
        }

        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            await updateCourseContent(
                session.user.access_token,
                createdCourseId,
                contentData
            );

            setSubmitMessage({
                type: "success",
                text: t("course_created_success"),
            });
        } catch (error) {
            console.error("Failed to update course content:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred.";
            setSubmitMessage({
                type: "error",
                text: t("create_course_error", { error: errorMessage }),
            });
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
                submitMessage={submitMessage}
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
                submitMessage={submitMessage}
            />
        );
    }

    return null;
}
