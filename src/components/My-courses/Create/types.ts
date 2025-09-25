import { ICategory, ICourseContent } from "../../../../types/entities";
import { SelectChangeEvent } from "@mui/material";

export interface CourseFormState {
    title: string;
    description: string;
    price: number;
    preview_url: string;
    thumbnail_url: string | null;
    categories: string[];
    isActive: boolean;
    language: string;
}

export interface CourseBasicInfoProps {
    course: CourseFormState;
    categories: ICategory[];
    thumbnailFile: File | null;
    currency: string;
    onCourseChange: (field: keyof CourseFormState, value: string | number | boolean) => void;
    onCategoryChange: (event: SelectChangeEvent<string[]>) => void;
    onThumbnailUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (courseData: CourseFormState, thumbnailFile: File | null) => Promise<number>;
    isSubmitting: boolean;
}

export interface CourseContentBuilderProps {
    courseId: number;
    content: ICourseContent;
    onContentChange: (content: ICourseContent) => void;
    onSubmit: (content: ICourseContent) => Promise<void>;
    isSubmitting: boolean;
}

export interface CreateCourseStepProps {
    currentStep: number;
    course: CourseFormState;
    content: ICourseContent;
    categories: ICategory[];
    onStepComplete: (step: number) => void;
}