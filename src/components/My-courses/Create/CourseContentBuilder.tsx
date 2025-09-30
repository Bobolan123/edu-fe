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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
} from "@mui/material";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    ExpandMore as ExpandMoreIcon,
    VideoLibrary as VideoIcon,
    Quiz as QuizIcon,
} from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { ICourseSection, ICourseLecture, QuizContent } from "../../../../types/entities";
import VideoUpload from "@/components/common/courses/VideoUpload";
import QuizBuilder from "./QuizBuilder";
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

    const addLecture = (sectionIndex: number, contentType: 'video' | 'quiz' = 'video') => {
        const defaultContent = contentType === 'video'
            ? {
                videoUrl: "",
                cloudinaryPublicId: "",
                quality: []
              }
            : {
                questions: [],
                passingScore: 70,
                timeLimit: undefined,
                allowMultipleAttempts: true
              };

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
                                  contentType: contentType,
                                  orderIndex: section.lectures.length,
                                  durationSeconds: 0,
                                  isPreview: false,
                                  content: defaultContent
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

    const updateLectureContentType = (
        sectionIndex: number,
        lectureIndex: number,
        newContentType: 'video' | 'quiz'
    ) => {
        const defaultContent = newContentType === 'video'
            ? {
                videoUrl: "",
                cloudinaryPublicId: "",
                quality: []
              }
            : {
                questions: [],
                passingScore: 70,
                timeLimit: undefined,
                allowMultipleAttempts: true
              };

        const updatedContent = {
            ...content,
            sections: content.sections.map((section, i) =>
                i === sectionIndex
                    ? {
                          ...section,
                          lectures: section.lectures.map((lecture, j) =>
                              j === lectureIndex
                                  ? {
                                      ...lecture,
                                      contentType: newContentType,
                                      content: defaultContent,
                                      videoFile: undefined
                                    }
                                  : lecture
                          ),
                      }
                    : section
            ),
        };
        onContentChange(updatedContent);
    };

    const updateQuizContent = (
        sectionIndex: number,
        lectureIndex: number,
        quizContent: QuizContent
    ) => {
        const updatedContent = {
            ...content,
            sections: content.sections.map((section, i) =>
                i === sectionIndex
                    ? {
                          ...section,
                          lectures: section.lectures.map((lecture, j) =>
                              j === lectureIndex
                                  ? { ...lecture, content: quizContent }
                                  : lecture
                          ),
                      }
                    : section
            ),
        };
        onContentChange(updatedContent);
    };

    const countCompletedLectures = () => {
        return content.sections.reduce(
            (total, section) =>
                total +
                section.lectures.filter((lecture) => {
                    if (lecture.contentType === 'video') {
                        return (lecture.videoFile) || (lecture.content && 'videoUrl' in lecture.content && lecture.content.videoUrl);
                    } else if (lecture.contentType === 'quiz') {
                        return lecture.content && 'questions' in lecture.content && lecture.content.questions.length > 0;
                    }
                    return false;
                }).length,
            0
        );
    };

    const validateLectureContent = () => {
        const missingContent: string[] = [];

        content.sections.forEach((section, sectionIndex) => {
            section.lectures.forEach((lecture, lectureIndex) => {
                if (lecture.contentType === 'video') {
                    const hasVideoFile = lecture.videoFile;
                    const hasExistingVideo = lecture.content && 'videoUrl' in lecture.content &&
                                            lecture.content.videoUrl && lecture.content.videoUrl.trim() !== "";

                    if (!hasVideoFile && !hasExistingVideo) {
                        missingContent.push(
                            `Section ${sectionIndex + 1}, Lecture ${lectureIndex + 1}: Missing video content`
                        );
                    }
                } else if (lecture.contentType === 'quiz') {
                    if (!lecture.content || !('questions' in lecture.content) || lecture.content.questions.length === 0) {
                        missingContent.push(
                            `Section ${sectionIndex + 1}, Lecture ${lectureIndex + 1}: Missing quiz questions`
                        );
                    } else {
                        // Validate quiz questions
                        const quiz = lecture.content as QuizContent;
                        quiz.questions.forEach((question, qIndex) => {
                            if (!question.question.trim()) {
                                missingContent.push(
                                    `Section ${sectionIndex + 1}, Lecture ${lectureIndex + 1}, Question ${qIndex + 1}: Missing question text`
                                );
                            }
                            if (question.type === 'multiple_choice' && (!question.options || question.options.some(opt => !opt.trim()))) {
                                missingContent.push(
                                    `Section ${sectionIndex + 1}, Lecture ${lectureIndex + 1}, Question ${qIndex + 1}: Missing or empty answer options`
                                );
                            }
                            if (question.type === 'fill_blank' && !question.correctAnswer) {
                                missingContent.push(
                                    `Section ${sectionIndex + 1}, Lecture ${lectureIndex + 1}, Question ${qIndex + 1}: Missing correct answer`
                                );
                            }
                        });
                    }
                }
            });
        });

        return missingContent;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const missingContent = validateLectureContent();
        if (missingContent.length > 0) {
           toastService.error(`Please complete the following:\n${missingContent.join('\n')}`);
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
                                    Completed Lectures: {countCompletedLectures()} / {content.sections.reduce((total, section) => total + section.lectures.length, 0)}
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
                                                                {/* Lecture Header */}
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
                                                                    <Chip
                                                                        icon={lecture.contentType === 'video' ? <VideoIcon /> : <QuizIcon />}
                                                                        label={lecture.contentType === 'video' ? 'Video' : 'Quiz'}
                                                                        color={lecture.contentType === 'video' ? 'primary' : 'secondary'}
                                                                        variant="outlined"
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

                                                                {/* Content Type Selector */}
                                                                <FormControl size="small" sx={{ minWidth: 160 }}>
                                                                    <InputLabel>Content Type</InputLabel>
                                                                    <Select
                                                                        value={lecture.contentType}
                                                                        label="Content Type"
                                                                        onChange={(e) =>
                                                                            updateLectureContentType(
                                                                                sectionIndex,
                                                                                lectureIndex,
                                                                                e.target.value as 'video' | 'quiz'
                                                                            )
                                                                        }
                                                                    >
                                                                        <MenuItem value="video">
                                                                            <div className="flex items-center gap-2">
                                                                                <VideoIcon />
                                                                                Video Lecture
                                                                            </div>
                                                                        </MenuItem>
                                                                        <MenuItem value="quiz">
                                                                            <div className="flex items-center gap-2">
                                                                                <QuizIcon />
                                                                                Quiz
                                                                            </div>
                                                                        </MenuItem>
                                                                    </Select>
                                                                </FormControl>

                                                                {/* Conditional Content */}
                                                                {lecture.contentType === 'video' ? (
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
                                                                ) : (
                                                                    <QuizBuilder
                                                                        quizContent={lecture.content as QuizContent}
                                                                        onQuizChange={(quiz) =>
                                                                            updateQuizContent(
                                                                                sectionIndex,
                                                                                lectureIndex,
                                                                                quiz
                                                                            )
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                        </Card>
                                                    )
                                                )}

                                                <div className="flex gap-2">
                                                    <Button
                                                        startIcon={<VideoIcon />}
                                                        onClick={() =>
                                                            addLecture(sectionIndex, 'video')
                                                        }
                                                        variant="outlined"
                                                        size="small"
                                                    >
                                                        Add Video Lecture
                                                    </Button>
                                                    <Button
                                                        startIcon={<QuizIcon />}
                                                        onClick={() =>
                                                            addLecture(sectionIndex, 'quiz')
                                                        }
                                                        variant="outlined"
                                                        size="small"
                                                        color="secondary"
                                                    >
                                                        Add Quiz
                                                    </Button>
                                                </div>
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

                    {countCompletedLectures() > 0 && (
                        <Card className="shadow-lg">
                            <CardHeader
                                title={
                                    <Typography
                                        variant="h6"
                                        component="h2"
                                        className="font-semibold"
                                    >
                                        Course Content Summary
                                    </Typography>
                                }
                            />
                            <CardContent>
                                <div className="space-y-2">
                                    {content.sections.map((section, sectionIndex) =>
                                        section.lectures.map((lecture, lectureIndex) => {
                                            const isCompleted = (() => {
                                                if (lecture.contentType === 'video') {
                                                    return lecture.videoFile || (lecture.content && 'videoUrl' in lecture.content && lecture.content.videoUrl);
                                                } else if (lecture.contentType === 'quiz') {
                                                    return lecture.content && 'questions' in lecture.content && lecture.content.questions.length > 0;
                                                }
                                                return false;
                                            })();

                                            if (!isCompleted) return null;

                                            return (
                                                <div
                                                    key={`${sectionIndex}-${lectureIndex}`}
                                                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {lecture.contentType === 'video' ? (
                                                            <VideoIcon color="primary" />
                                                        ) : (
                                                            <QuizIcon color="secondary" />
                                                        )}
                                                        <Typography
                                                            variant="body2"
                                                            className="font-medium"
                                                        >
                                                            Section {sectionIndex + 1} - Lecture {lectureIndex + 1}: {lecture.title || "Untitled"}
                                                        </Typography>
                                                    </div>
                                                    <Chip
                                                        label={lecture.contentType === 'video' ? 'Video Ready' : `Quiz (${(lecture.content as QuizContent).questions.length} questions)`}
                                                        color={lecture.contentType === 'video' ? 'primary' : 'secondary'}
                                                        size="small"
                                                    />
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