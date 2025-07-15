"use client";

import type React from "react";
import { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    type SelectChangeEvent,
    TextField,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Alert,
} from "@mui/material";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    ExpandMore as ExpandMoreIcon,
    CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import {
    ICategory,
    ICourseContent,
    ILecture,
    ISection,
} from "../../../../types/entities";
import {
    createCourse,
    updateCourseContent,
    uploadThumbnail,
} from "@/actions/coursesAction";
import { useSession } from "next-auth/react";
import { LANGUAGES } from "../../../../common/constant";
import { useTranslations } from "next-intl";
import { useCurrency } from "../../../context/CurrencyContext";
import VideoUpload from "@/components/common/courses/VideoUpload";

interface CourseFormState {
    title: string;
    description: string;
    language: string;
    price: number;
    preview_url: string;
    thumbnail_url: string | null;
    categories: string[];
    active: boolean;
}

const initialCourseState: CourseFormState = {
    title: "",
    description: "",
    language: "English",
    price: 0,
    preview_url: "",
    thumbnail_url: null,
    categories: [],
    active: true,
};

// Default state for the course content section
const initialContentState: ICourseContent = {
    courseId: 0,
    whatYoullLearn: [""],
    sections: [
        {
            title: "Introduction",
            totalLectures: 1,
            lectures: [{  title: "", videoUrl: "", totalDuration: 0 }],
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

    const [course, setCourse] = useState<CourseFormState>(initialCourseState);
    const [content, setContent] = useState<ICourseContent>(initialContentState);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    // Course metadata handlers
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

    const addLearningPoint = () => {
        setContent((prev) => ({
            ...prev,
            whatYoullLearn: [...prev.whatYoullLearn, ""],
        }));
    };

    const removeLearningPoint = (index: number) => {
        setContent((prev) => ({
            ...prev,
            whatYoullLearn: prev.whatYoullLearn.filter((_, i) => i !== index),
        }));
    };

    const updateLearningPoint = (index: number, value: string) => {
        setContent((prev) => ({
            ...prev,
            whatYoullLearn: prev.whatYoullLearn.map((item, i) =>
                i === index ? value : item
            ),
        }));
    };

    // Section handlers
    const addSection = () => {
        setContent((prev) => ({
            ...prev,
            sections: [
                ...prev.sections,
                {
                    _id: "",
                    title: "",
                    totalLectures: 1,
                    lectures: [
                        { _id: "", title: "", videoUrl: "", totalDuration: 0 },
                    ],
                },
            ],
        }));
    };

    const removeSection = (sectionIndex: number) => {
        setContent((prev) => ({
            ...prev,
            sections: prev.sections.filter((_, i) => i !== sectionIndex),
        }));
    };

    const updateSection = (
        sectionIndex: number,
        field: keyof ISection,
        value: string
    ) => {
        setContent((prev) => ({
            ...prev,
            sections: prev.sections.map((section, i) =>
                i === sectionIndex ? { ...section, [field]: value } : section
            ),
        }));
    };

    // Lecture handlers
    const addLecture = (sectionIndex: number) => {
        setContent((prev) => ({
            ...prev,
            sections: prev.sections.map((section, i) =>
                i === sectionIndex
                    ? {
                          ...section,
                          lectures: [
                              ...section.lectures,
                              {
                                  _id: "",
                                  title: "",
                                  videoUrl: "",
                                  totalDuration: 0,
                              },
                          ],
                          totalLectures: section.lectures.length + 1,
                      }
                    : section
            ),
        }));
    };

    const removeLecture = (sectionIndex: number, lectureIndex: number) => {
        setContent((prev) => ({
            ...prev,
            sections: prev.sections.map((section, i) =>
                i === sectionIndex
                    ? {
                          ...section,
                          lectures: section.lectures.filter(
                              (_, j) => j !== lectureIndex
                          ),
                          totalLectures: Math.max(
                              0,
                              section.lectures.length - 1
                          ),
                      }
                    : section
            ),
        }));
    };

    const updateLecture = (
        sectionIndex: number,
        lectureIndex: number,
        field: keyof ILecture,
        value: string | number
    ) => {
        setContent((prev) => ({
            ...prev,
            sections: prev.sections.map((section, i) =>
                i === sectionIndex
                    ? {
                          ...section,
                          lectures: section.lectures.map((lecture, j) =>
                              j === lectureIndex
                                  ? { ...lecture, [field]: value }
                                  : lecture
                          ),
                      }
                    : section
            ),
        }));
    };

    // Calculate total duration
    const calculateTotalDuration = () => {
        return content.sections.reduce(
            (total, section) =>
                total +
                section.lectures.reduce(
                    (sectionTotal, lecture) =>
                        sectionTotal + (lecture.totalDuration || 0),
                    0
                ),
            0
        );
    };

    // Count uploaded videos
    const countUploadedVideos = () => {
        return content.sections.reduce(
            (total, section) =>
                total +
                section.lectures.filter((lecture) => lecture.videoUrl).length,
            0
        );
    };

    // Validate all videos are uploaded
    const validateVideosUploaded = () => {
        const missingVideos: string[] = [];

        content.sections.forEach((section, sectionIndex) => {
            section.lectures.forEach((lecture, lectureIndex) => {
                if (!lecture.videoUrl || lecture.videoUrl.trim() === "") {
                    missingVideos.push(
                        `Section ${sectionIndex + 1}, Lecture ${
                            lectureIndex + 1
                        }`
                    );
                }
            });
        });

        return missingVideos;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage(null);

        if (!session?.user?.access_token) {
            setSubmitMessage({
                type: "error",
                text: t("must_be_logged_in"),
            });
            setIsSubmitting(false);
            return;
        }

        try {
            // Validate all videos are uploaded
            const missingVideos = validateVideosUploaded();
            if (missingVideos.length > 0) {
                setSubmitMessage({
                    type: "error",
                    text: t("upload_videos_required", {
                        missing: missingVideos.join(", "),
                    }),
                });
                setIsSubmitting(false);
                return;
            }

            // Find the corresponding ID for each selected category name
            const selectedCategoryIds = course.categories
                .map((name) => {
                    const foundCategory = categories.find(
                        (cat) => cat.name === name
                    );
                    return foundCategory ? foundCategory.id : null;
                })
                .filter((id): id is number => id !== null);

            // Step 1: Create the course
            const resCourse = await createCourse(session.user.access_token, {
                title: course.title,
                description: course.description,
                language: course.language,
                price: course.price,
                preview_url: course.preview_url,
                active: course.active,
                duration: Math.ceil(calculateTotalDuration() / 60),
                categoryIds: selectedCategoryIds,
            });

            if (!resCourse || !resCourse.id) {
                throw new Error(
                    "Failed to get a valid response from course creation."
                );
            }

            const newCourseId = resCourse.id;

            // Step 2: Upload thumbnail if provided
            if (thumbnailFile) {
                await uploadThumbnail(
                    session.user.access_token,
                    newCourseId.toString(),
                    thumbnailFile
                );
            }

            // Step 3: Update course content with all the video URLs
            const contentToSave = {
                ...content,
                courseId: newCourseId,
                totalLength: calculateTotalDuration(),
                totalLectures: content.sections.reduce(
                    (total, section) => total + section.lectures.length,
                    0
                ),
            };

            await updateCourseContent(
                session.user.access_token,
                newCourseId,
                contentToSave
            );

            console.log("Successfully created course with ID:", newCourseId);
            console.log("Course content:", contentToSave);

            setSubmitMessage({
                type: "success",
                text: t("course_created_success"),
            });

            // Optionally reset form or redirect
            // resetForm();
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
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <Typography
                    variant="h4"
                    component="h1"
                    className="mb-8 font-bold text-gray-900"
                >
                    {t("title")}
                </Typography>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Course Metadata */}
                    <Card className="shadow-lg">
                        <CardHeader
                            title={
                                <Typography
                                    variant="h6"
                                    component="h2"
                                    className="font-semibold"
                                >
                                    {t("course_information")}
                                </Typography>
                            }
                        />
                        <CardContent className="space-y-4">
                            <TextField
                                fullWidth
                                label={t("course_title")}
                                value={course.title}
                                onChange={(e) =>
                                    handleCourseChange("title", e.target.value)
                                }
                                required
                            />

                            <TextField
                                fullWidth
                                label={t("description")}
                                multiline
                                rows={4}
                                value={course.description}
                                onChange={(e) =>
                                    handleCourseChange(
                                        "description",
                                        e.target.value
                                    )
                                }
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormControl fullWidth>
                                    <InputLabel>{t("language")}</InputLabel>
                                    <Select
                                        value={course.language}
                                        label={t("language")}
                                        onChange={(e) =>
                                            handleCourseChange(
                                                "language",
                                                e.target.value
                                            )
                                        }
                                    >
                                        {LANGUAGES.map((lang) => (
                                            <MenuItem key={lang} value={lang}>
                                                {lang}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label={`${t("price")} (${
                                        currency === "VND" ? "₫" : "$"
                                    })`}
                                    type="number"
                                    value={course.price}
                                    onChange={(e) =>
                                        handleCourseChange(
                                            "price",
                                            Number.parseFloat(e.target.value) ||
                                                0
                                        )
                                    }
                                    inputProps={{
                                        min: 0,
                                        step: currency === "VND" ? 1000 : 0.01,
                                    }}
                                    helperText={
                                        currency === "VND"
                                            ? "Giá tính bằng VND"
                                            : "Price in USD"
                                    }
                                />
                            </div>

                            <TextField
                                fullWidth
                                label={t("preview_url")}
                                type="url"
                                value={course.preview_url}
                                onChange={(e) =>
                                    handleCourseChange(
                                        "preview_url",
                                        e.target.value
                                    )
                                }
                            />

                            <div className="space-y-2">
                                <Typography
                                    variant="subtitle2"
                                    className="font-medium"
                                >
                                    {t("course_thumbnail")}
                                </Typography>
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        startIcon={<CloudUploadIcon />}
                                        className="shrink-0"
                                    >
                                        {t("upload_thumbnail")}
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleThumbnailUpload}
                                        />
                                    </Button>
                                    {course.thumbnail_url && (
                                        <img
                                            src={course.thumbnail_url}
                                            alt="Thumbnail preview"
                                            className="w-20 h-20 object-cover rounded-lg border"
                                        />
                                    )}
                                </div>
                            </div>

                            <FormControl fullWidth>
                                <InputLabel>{t("categories")}</InputLabel>
                                <Select
                                    multiple
                                    value={course.categories}
                                    onChange={handleCategoryChange}
                                    input={
                                        <OutlinedInput
                                            label={t("categories")}
                                        />
                                    }
                                    renderValue={(selected) => (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: 0.5,
                                            }}
                                        >
                                            {selected.map((value) => (
                                                <Chip
                                                    key={value}
                                                    label={value}
                                                    size="small"
                                                />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {categories.map((category) => (
                                        <MenuItem
                                            key={category.id}
                                            value={category.name}
                                        >
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </CardContent>
                    </Card>

                    {/* What You'll Learn */}
                    <Card className="shadow-lg">
                        <CardHeader
                            title={
                                <Typography
                                    variant="h6"
                                    component="h2"
                                    className="font-semibold"
                                >
                                    {t("what_students_learn")}
                                </Typography>
                            }
                        />
                        <CardContent>
                            <div className="space-y-3">
                                {content.whatYoullLearn.map((point, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <TextField
                                            fullWidth
                                            label={`${t("learning_point")} ${
                                                index + 1
                                            }`}
                                            value={point}
                                            onChange={(e) =>
                                                updateLearningPoint(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            placeholder={t(
                                                "build_fullstack_example"
                                            )}
                                        />
                                        <IconButton
                                            onClick={() =>
                                                removeLearningPoint(index)
                                            }
                                            disabled={
                                                content.whatYoullLearn.length <=
                                                1
                                            }
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                ))}
                                <Button
                                    startIcon={<AddIcon />}
                                    onClick={addLearningPoint}
                                    variant="outlined"
                                    className="mt-2"
                                >
                                    {t("add_learning_point")}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Course Content Sections */}
                    <Card className="shadow-lg">
                        <CardHeader
                            title={
                                <Typography
                                    variant="h6"
                                    component="h2"
                                    className="font-semibold"
                                >
                                    {t("course_content")}
                                </Typography>
                            }
                            subheader={
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {t("total_duration")}:{" "}
                                    {Math.ceil(calculateTotalDuration() / 60)}{" "}
                                    {t("minutes")} | Uploaded Videos:{" "}
                                    {countUploadedVideos()}
                                </Typography>
                            }
                        />
                        <CardContent>
                            <div className="space-y-4">
                                {content.sections.map(
                                    (section, sectionIndex) => (
                                        <Accordion
                                            key={sectionIndex}
                                            defaultExpanded={sectionIndex === 0}
                                            className="border border-gray-200"
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                            >
                                                <div className="flex items-center justify-between w-full mr-4">
                                                    <Typography className="font-medium">
                                                        {section.title ||
                                                            `Section ${
                                                                sectionIndex + 1
                                                            }`}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {
                                                            section.lectures
                                                                .length
                                                        }{" "}
                                                        {t("lectures")}
                                                    </Typography>
                                                </div>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2">
                                                        <TextField
                                                            fullWidth
                                                            label={t(
                                                                "section_title"
                                                            )}
                                                            value={
                                                                section.title
                                                            }
                                                            onChange={(e) =>
                                                                updateSection(
                                                                    sectionIndex,
                                                                    "title",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder={t(
                                                                "enter_section_title"
                                                            )}
                                                        />
                                                        <IconButton
                                                            onClick={() =>
                                                                removeSection(
                                                                    sectionIndex
                                                                )
                                                            }
                                                            disabled={
                                                                content.sections
                                                                    .length <= 1
                                                            }
                                                            color="error"
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </div>

                                                    <Divider />

                                                    <Typography
                                                        variant="subtitle2"
                                                        className="font-medium"
                                                    >
                                                        {t("lectures")}
                                                    </Typography>

                                                    {section.lectures.map(
                                                        (
                                                            lecture,
                                                            lectureIndex
                                                        ) => (
                                                            <Card
                                                                key={
                                                                    lectureIndex
                                                                }
                                                                variant="outlined"
                                                                className="p-4"
                                                            >
                                                                <div className="space-y-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <TextField
                                                                            fullWidth
                                                                            label={`${t(
                                                                                "lecture_title"
                                                                            )} ${
                                                                                lectureIndex +
                                                                                1
                                                                            }`}
                                                                            value={
                                                                                lecture.title
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLecture(
                                                                                    sectionIndex,
                                                                                    lectureIndex,
                                                                                    "title",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder={t(
                                                                                "enter_lecture_title"
                                                                            )}
                                                                        />
                                                                        <IconButton
                                                                            onClick={() =>
                                                                                removeLecture(
                                                                                    sectionIndex,
                                                                                    lectureIndex
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                section
                                                                                    .lectures
                                                                                    .length <=
                                                                                1
                                                                            }
                                                                            color="error"
                                                                        >
                                                                            <DeleteIcon />
                                                                        </IconButton>
                                                                    </div>

                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                        <VideoUpload
                                                                            label="Upload Video"
                                                                            existingVideoUrl={
                                                                                lecture.videoUrl
                                                                            }
                                                                            onVideoChange={(
                                                                                videoUrl
                                                                                
                                                                            ) => {
                                                                                // Update your lecture data
                                                                                updateLecture(
                                                                                    sectionIndex,
                                                                                    lectureIndex,
                                                                                    "videoUrl",
                                                                                    videoUrl
                                                                                );
                                                                            }}
                                                                        />

                                                                        <TextField
                                                                            fullWidth
                                                                            label={t(
                                                                                "duration_seconds"
                                                                            )}
                                                                            type="number"
                                                                            value={
                                                                                lecture.totalDuration ||
                                                                                0
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLecture(
                                                                                    sectionIndex,
                                                                                    lectureIndex,
                                                                                    "totalDuration",
                                                                                    Number.parseInt(
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    ) ||
                                                                                        0
                                                                                )
                                                                            }
                                                                            inputProps={{
                                                                                min: 0,
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        )
                                                    )}

                                                    <Button
                                                        startIcon={<AddIcon />}
                                                        onClick={() =>
                                                            addLecture(
                                                                sectionIndex
                                                            )
                                                        }
                                                        variant="outlined"
                                                        size="small"
                                                    >
                                                        {t("add_lecture")}
                                                    </Button>
                                                </div>
                                            </AccordionDetails>
                                        </Accordion>
                                    )
                                )}

                                <Button
                                    startIcon={<AddIcon />}
                                    onClick={addSection}
                                    variant="outlined"
                                    className="mt-4"
                                >
                                    {t("add_section")}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upload Summary */}
                    {countUploadedVideos() > 0 && (
                        <Card className="shadow-lg">
                            <CardHeader
                                title={
                                    <Typography
                                        variant="h6"
                                        component="h2"
                                        className="font-semibold"
                                    >
                                        Upload Summary
                                    </Typography>
                                }
                            />
                            <CardContent>
                                <div className="space-y-2">
                                    {content.sections.map(
                                        (section, sectionIndex) =>
                                            section.lectures.map(
                                                (lecture, lectureIndex) => {
                                                    if (!lecture.videoUrl)
                                                        return null;
                                                    return (
                                                        <div
                                                            key={`${sectionIndex}-${lectureIndex}`}
                                                            className="flex items-center justify-between p-2 bg-green-50 rounded"
                                                        >
                                                            <Typography
                                                                variant="body2"
                                                                className="font-medium"
                                                            >
                                                                Section{" "}
                                                                {sectionIndex +
                                                                    1}{" "}
                                                                - Lecture{" "}
                                                                {lectureIndex +
                                                                    1}
                                                                :{" "}
                                                                {lecture.title ||
                                                                    "Untitled"}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >
                                                                {Math.round(
                                                                    lecture.totalDuration ||
                                                                        0
                                                                )}
                                                                s
                                                            </Typography>
                                                        </div>
                                                    );
                                                }
                                            )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Submit Actions */}
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t("creating") : t("create_course")}
                        </Button>
                    </div>

                    {/* Submission Feedback */}
                    {submitMessage && (
                        <Alert severity={submitMessage.type} className="mt-4">
                            {submitMessage.text}
                        </Alert>
                    )}
                </form>
            </div>
        </div>
    );
}
