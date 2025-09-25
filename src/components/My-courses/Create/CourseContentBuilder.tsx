"use client";

import type React from "react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    IconButton,
    TextField,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { ICourseSection, ICourseLecture } from "../../../../types/entities";
import VideoUpload from "@/components/common/courses/VideoUpload";
import { CourseContentBuilderProps } from "./types";
import toastService from "@/services/toast";

export default function CourseContentBuilder({
    courseId,
    content,
    onContentChange,
    onSubmit,
    isSubmitting,
}: CourseContentBuilderProps) {
    const t = useTranslations("CreateCourse");

    const addLearningPoint = () => {
        const updatedContent = {
            ...content,
            metadata: {
                ...content.metadata,
                whatYoullLearn: [...(content.metadata.whatYoullLearn || []), ""],
            }
        };
        onContentChange(updatedContent);
    };

    const removeLearningPoint = (index: number) => {
        const updatedContent = {
            ...content,
            metadata: {
                ...content.metadata,
                whatYoullLearn: (content.metadata.whatYoullLearn || []).filter((_, i) => i !== index),
            }
        };
        onContentChange(updatedContent);
    };

    const updateLearningPoint = (index: number, value: string) => {
        const updatedContent = {
            ...content,
            metadata: {
                ...content.metadata,
                whatYoullLearn: (content.metadata.whatYoullLearn || []).map((item, i) =>
                    i === index ? value : item
                ),
            }
        };
        onContentChange(updatedContent);
    };

    const addSection = () => {
        const updatedContent = {
            ...content,
            sections: [
                ...content.sections,
                {
                    id: `temp-${Date.now()}`,
                    title: "",
                    orderIndex: content.sections.length,
                    lectures: [
                        {
                            id: `temp-lecture-${Date.now()}`,
                            title: "",
                            contentType: 'video' as const,
                            orderIndex: 0,
                            content: {
                                videoUrl: "",
                                cloudinaryPublicId: "",
                                quality: []
                            }
                        },
                    ],
                },
            ],
        };
        onContentChange(updatedContent);
    };

    const removeSection = (sectionIndex: number) => {
        const updatedContent = {
            ...content,
            sections: content.sections.filter((_, i) => i !== sectionIndex),
        };
        onContentChange(updatedContent);
    };

    const updateSection = (
        sectionIndex: number,
        field: keyof ICourseSection,
        value: string
    ) => {
        const updatedContent = {
            ...content,
            sections: content.sections.map((section, i) =>
                i === sectionIndex ? { ...section, [field]: value } : section
            ),
        };
        onContentChange(updatedContent);
    };

    const addLecture = (sectionIndex: number) => {
        const updatedContent = {
            ...content,
            sections: content.sections.map((section, i) =>
                i === sectionIndex
                    ? {
                          ...section,
                          lectures: [
                              ...section.lectures,
                              {
                                  id: `temp-lecture-${Date.now()}-${section.lectures.length}`,
                                  title: "",
                                  contentType: 'video' as const,
                                  orderIndex: section.lectures.length,
                                  content: {
                                      videoUrl: "",
                                      cloudinaryPublicId: "",
                                      quality: []
                                  }
                              },
                          ],
                      }
                    : section
            ),
        };
        onContentChange(updatedContent);
    };

    const removeLecture = (sectionIndex: number, lectureIndex: number) => {
        const updatedContent = {
            ...content,
            sections: content.sections.map((section, i) =>
                i === sectionIndex
                    ? {
                          ...section,
                          lectures: section.lectures.filter(
                              (_, j) => j !== lectureIndex
                          ),
                      }
                    : section
            ),
        };
        onContentChange(updatedContent);
    };

    const updateLecture = (
        sectionIndex: number,
        lectureIndex: number,
        field: keyof ICourseLecture,
        value: string | number
    ) => {
        const updatedContent = {
            ...content,
            sections: content.sections.map((section, i) =>
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
        };
        onContentChange(updatedContent);
    };

    const countSelectedVideos = () => {
        return content.sections.reduce(
            (total, section) =>
                total +
                section.lectures.filter((lecture) =>
                    (lecture.videoFile) || (lecture.content && 'videoUrl' in lecture.content && lecture.content.videoUrl)
                ).length,
            0
        );
    };

    const validateVideosSelected = () => {
        const missingVideos: string[] = [];

        content.sections.forEach((section, sectionIndex) => {
            section.lectures.forEach((lecture, lectureIndex) => {
                const hasVideoFile = lecture.videoFile;
                const hasExistingVideo = lecture.content && 'videoUrl' in lecture.content &&
                                        lecture.content.videoUrl && lecture.content.videoUrl.trim() !== "";

                if (!hasVideoFile && !hasExistingVideo) {
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

        const missingVideos = validateVideosSelected();
        if (missingVideos.length > 0) {
           toastService.error(`Please select video files for the following lectures:\n${missingVideos.join('\n')}`);
            return;
        }

        const contentToSave = {
            ...content,
        };

        await onSubmit(contentToSave);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <Typography
                    variant="h4"
                    component="h1"
                    className="mb-8 font-bold text-gray-900"
                >
                    {t("title_content")} 
                </Typography>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                {(content.metadata.whatYoullLearn || []).map((point, index) => (
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
                                                (content.metadata.whatYoullLearn || []).length <= 1
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
                                    Selected Videos: {countSelectedVideos()}
                                </Typography>
                            }
                        />
                        <CardContent>
                            <div className="space-y-4">
                                {content.sections.map((section, sectionIndex) => (
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
                                                    {section.lectures.length}{" "}
                                                    {t("lectures")}
                                                </Typography>
                                            </div>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <TextField
                                                        fullWidth
                                                        label={t("section_title")}
                                                        value={section.title}
                                                        onChange={(e) =>
                                                            updateSection(
                                                                sectionIndex,
                                                                "title",
                                                                e.target.value
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
                                                    (lecture, lectureIndex) => (
                                                        <Card
                                                            key={lectureIndex}
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
                                                                            lectureIndex + 1
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
                                                                        label="Select Video File"
                                                                        existingVideoUrl={
                                                                            lecture.content && 'videoUrl' in lecture.content
                                                                                ? lecture.content.videoUrl
                                                                                : ""
                                                                        }
                                                                        onVideoFileChange={(
                                                                            videoFile
                                                                        ) => {
                                                                            const updatedContent = {
                                                                                ...content,
                                                                                sections: content.sections.map((section, i) =>
                                                                                    i === sectionIndex
                                                                                        ? {
                                                                                              ...section,
                                                                                              lectures: section.lectures.map((lect, j) =>
                                                                                                  j === lectureIndex
                                                                                                      ? {
                                                                                                          ...lect,
                                                                                                          videoFile
                                                                                                      }
                                                                                                      : lect
                                                                                              )
                                                                                          }
                                                                                        : section
                                                                                ),
                                                                            };
                                                                            onContentChange(updatedContent);
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
                                                        addLecture(sectionIndex)
                                                    }
                                                    variant="outlined"
                                                    size="small"
                                                >
                                                    {t("add_lecture")}
                                                </Button>
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}

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

                    {countSelectedVideos() > 0 && (
                        <Card className="shadow-lg">
                            <CardHeader
                                title={
                                    <Typography
                                        variant="h6"
                                        component="h2"
                                        className="font-semibold"
                                    >
                                        Video Selection Summary
                                    </Typography>
                                }
                            />
                            <CardContent>
                                <div className="space-y-2">
                                    {content.sections.map((section, sectionIndex) =>
                                        section.lectures.map((lecture, lectureIndex) => {
                                            const hasVideoFile = lecture.videoFile;
                                            const hasExistingVideo = lecture.content && 'videoUrl' in lecture.content && lecture.content.videoUrl;
                                            if (!hasVideoFile && !hasExistingVideo) return null;
                                            return (
                                                <div
                                                    key={`${sectionIndex}-${lectureIndex}`}
                                                    className="flex items-center justify-between p-2 bg-green-50 rounded"
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        className="font-medium"
                                                    >
                                                        Section {sectionIndex + 1} -
                                                        Lecture {lectureIndex + 1}:{" "}
                                                        {lecture.title || "Untitled"}
                                                        {hasVideoFile ? " (New File)" : " (Existing)"}
                                                    </Typography>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex justify-center items-center gap-4 mt-8">
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t("creating") : "Save Course Content"}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}