"use client";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Button,
    Typography,
    IconButton,
    TextField,
    Collapse,
    CircularProgress,
    LinearProgress,
    Stack,
} from "@mui/material";
import {
    Close as CloseIcon,
    PlayArrow,
    Delete,
    CloudUpload,
    Add as AddIcon,
    Quiz as QuizIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { ICourseSection, ICourseLecture } from "../../../../types/entities";
import { useEffect, useState } from "react";
import { uploadVideoToLecture, saveCourseContent } from "@/actions/courseContentAction";
// Removed useLoadingState import
import { toastService } from "@/services/toast";
import { isValidCloudinaryVideoUrl } from "../../../utils/utils";
import CaptionManagement from "../../common/courses/CaptionManagement";
import QuizEditor from "./QuizEditor";
import { QuizContent } from "../../../../types/entities";

interface ManageCourseContentModalProps {
    open: boolean;
    onClose: () => void;
    sections: ICourseSection[];
    courseId: number;
}

export default function ManageCourseContentModal({
    open,
    onClose,
    sections,
    courseId,
}: ManageCourseContentModalProps) {
    const [localSections, setLocalSections] = useState<ICourseSection[]>(sections);
    const [expandedVideos, setExpandedVideos] = useState<{
        [key: string]: boolean;
    }>({});

    // Loading states
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingVideos, setUploadingVideos] = useState<{
        [key: string]: boolean;
    }>({});
    const [uploadProgress, setUploadProgress] = useState<{
        [key: string]: number;
    }>({});
    const [deletingItems, setDeletingItems] = useState<{
        [key: string]: boolean;
    }>({});

    useEffect(() => {
        if (open) {
            setLocalSections(sections);
        }
    }, [open, sections]);

    const toggleVideo = (sectionIndex: number, lectureIndex: number) => {
        const key = `${sectionIndex}-${lectureIndex}`;
        setExpandedVideos((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleAddSection = () => {
        const newSection: ICourseSection = {
            id: `temp-${Date.now()}`,
            title: `New Section ${localSections.length + 1}`,
            orderIndex: localSections.length,
            lectures: [],
        };
        setLocalSections([...localSections, newSection]);
    };

    const handleDeleteSection = async (sectionIndex: number) => {
        const key = `section-${sectionIndex}`;
        setDeletingItems((prev) => ({ ...prev, [key]: true }));

        try {
            await new Promise((resolve) => setTimeout(resolve, 300));
            const updated = localSections.filter((_, i) => i !== sectionIndex);
            setLocalSections(updated);
            toastService.success("Section deleted successfully");
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to delete section";
            toastService.error(errorMessage);
        } finally {
            setDeletingItems((prev) => ({ ...prev, [key]: false }));
        }
    };

    const handleAddLecture = (sectionIndex: number, contentType: 'video' | 'quiz' = 'video') => {
        const updated = [...localSections];
        const newLecture: ICourseLecture = {
            id: `temp-${Date.now()}`,
            title: contentType === 'quiz'
                ? `New Quiz ${updated[sectionIndex].lectures.filter(l => l.contentType === 'quiz').length + 1}`
                : `New Lecture ${updated[sectionIndex].lectures.filter(l => l.contentType === 'video').length + 1}`,
            contentType: contentType,
            orderIndex: updated[sectionIndex].lectures.length,
            content: contentType === 'video'
                ? {
                    videoUrl: "",
                    cloudinaryPublicId: "",
                    quality: []
                  }
                : {
                    questions: [],
                    passingScore: 70,
                    allowMultipleAttempts: true
                  }
        };
        updated[sectionIndex].lectures.push(newLecture);
        setLocalSections(updated);
    };

    const handleDeleteLecture = async (
        sectionIndex: number,
        lectureIndex: number
    ) => {
        const key = `lecture-${sectionIndex}-${lectureIndex}`;
        setDeletingItems((prev) => ({ ...prev, [key]: true }));

        try {
            await new Promise((resolve) => setTimeout(resolve, 300));
            const updated = [...localSections];
            updated[sectionIndex].lectures.splice(lectureIndex, 1);
            setLocalSections(updated);
            toastService.success("Lecture deleted successfully");
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to delete lecture";
            toastService.error(errorMessage);
        } finally {
            setDeletingItems((prev) => ({ ...prev, [key]: false }));
        }
    };

    const handleSectionTitleChange = (
        sectionIndex: number,
        newTitle: string
    ) => {
        const updated = [...localSections];
        updated[sectionIndex].title = newTitle;
        setLocalSections(updated);
    };

    const handleLectureFieldChange = (
        sectionIndex: number,
        lectureIndex: number,
        field: keyof ICourseLecture,
        value: string
    ) => {
        const updated = [...localSections];
        if (field === 'title') {
            updated[sectionIndex].lectures[lectureIndex].title = value;
        }
        setLocalSections(updated);
    };

    const handleVideoUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        sectionIndex: number,
        lectureIndex: number
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const key = `${sectionIndex}-${lectureIndex}`;
        setUploadingVideos((prev) => ({ ...prev, [key]: true }));
        setUploadProgress((prev) => ({ ...prev, [key]: 0 }));

        const section = localSections[sectionIndex];
        const lecture = section.lectures[lectureIndex];

        try {
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => ({
                    ...prev,
                    [key]: Math.min((prev[key] || 0) + 10, 90),
                }));
            }, 200);

           const res = await uploadVideoToLecture(courseId, section.id, lecture.id, file);
           toastService.success("Video uploaded successfully");
           
            clearInterval(progressInterval);
            setUploadProgress((prev) => ({ ...prev, [key]: 100 }));

            setTimeout(() => {
                setUploadProgress((prev) => ({ ...prev, [key]: 0 }));
            }, 1000);

        } catch (error) {
            console.error(error);
            const errorMessage =
                error instanceof Error ? error.message : "Video upload failed.";
            toastService.error(errorMessage);
        } finally {
            setUploadingVideos((prev) => ({ ...prev, [key]: false }));
        }
    };

    const handleQuizContentChange = (
        sectionIndex: number,
        lectureIndex: number,
        newQuizContent: QuizContent
    ) => {
        const updated = [...localSections];
        updated[sectionIndex].lectures[lectureIndex].content = newQuizContent;
        setLocalSections(updated);
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const res = await saveCourseContent(courseId, localSections);
            if(res.statusCode === 200) {
                toastService.success(res.message);
            } else {
                toastService.error(res.message);
            }
            onClose();
        } catch (error) {
            console.error(error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to save course content.";
            toastService.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "24px",
                    background:
                        "linear-gradient(135deg, #faf5ff 0%, #f0f9ff 100%)",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    boxShadow: "0 20px 60px rgba(139, 92, 246, 0.15)",
                    backdropFilter: "blur(10px)",
                    maxHeight: "90vh",
                },
            }}
        >
            <DialogTitle
                sx={{
                    background: "linear-gradient(45deg, #2563eb, #3b82f6)",
                    color: "white",
                    borderRadius: "24px 24px 0 0",
                    position: "relative",
                    textAlign: "center",
                    py: 3,
                    mb: 2,
                }}
            >
                <Typography component="span" className="font-bold text-xl">
                    📝 Edit Course Content
                </Typography>
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 16,
                        top: 16,
                        color: "white",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4, maxHeight: "60vh", overflowY: "auto" }}>
                <Box className="flex justify-between items-center mb-4">
                    <Typography
                        variant="h6"
                        className="font-bold text-gray-800"
                    >
                        Course Sections
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddSection}
                        sx={{
                            background:
                                "linear-gradient(45deg, #2563eb, #3b82f6)",
                            borderRadius: "16px",
                            textTransform: "none",
                            fontWeight: "bold",
                        }}
                    >
                        Add Section
                    </Button>
                </Box>

                {localSections.map((section, sectionIndex) => (
                    <Box
                        key={sectionIndex}
                        className="bg-white/80 border border-blue-100 rounded-2xl mb-6 p-4 shadow-sm backdrop-blur-sm"
                    >
                        <Box className="flex justify-between items-center gap-2 mb-2">
                            <TextField
                                value={section.title}
                                onChange={(e) =>
                                    handleSectionTitleChange(
                                        sectionIndex,
                                        e.target.value
                                    )
                                }
                                size="small"
                                fullWidth
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "12px",
                                    },
                                }}
                            />
                            <IconButton
                                onClick={() => handleDeleteSection(sectionIndex)}
                                disabled={isSaving || deletingItems[`section-${sectionIndex}`]}
                                size="small"
                                sx={{ color: "#dc2626" }}
                            >
                                {deletingItems[`section-${sectionIndex}`] ? (
                                    <CircularProgress size={16} />
                                ) : (
                                    <Delete fontSize="small" />
                                )}
                            </IconButton>
                        </Box>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            className="mb-3"
                        >
                            {section.lectures.length} lectures
                        </Typography>

                        {section.lectures.map((lecture, lectureIndex) => {
                            const videoKey = `${sectionIndex}-${lectureIndex}`;

                            return (
                                <Box
                                    key={lectureIndex}
                                    className="flex flex-col bg-blue-50/50 rounded-xl p-3 mb-2 border border-blue-100"
                                >
                                    <Box className="flex items-center gap-2 w-full">
                                        {lecture.contentType === 'quiz' ? (
                                            <QuizIcon fontSize="small" sx={{ color: "#7c3aed" }} />
                                        ) : (
                                            <PlayArrow fontSize="small" sx={{ color: "#2563eb" }} />
                                        )}

                                        <TextField
                                            value={lecture.title}
                                            onChange={(e) =>
                                                handleLectureFieldChange(
                                                    sectionIndex,
                                                    lectureIndex,
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                            size="small"
                                            fullWidth
                                            sx={{
                                                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                                            }}
                                        />

                                        <IconButton
                                            onClick={() => toggleVideo(sectionIndex, lectureIndex)}
                                            size="small"
                                            sx={{ color: "#3b82f6" }}
                                        >
                                            {expandedVideos[videoKey] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </IconButton>

                                        <IconButton
                                            onClick={() => handleDeleteLecture(sectionIndex, lectureIndex)}
                                            disabled={isSaving || deletingItems[`lecture-${sectionIndex}-${lectureIndex}`]}
                                            size="small"
                                            sx={{ color: "#dc2626" }}
                                        >
                                            {deletingItems[`lecture-${sectionIndex}-${lectureIndex}`] ? (
                                                <CircularProgress size={16} />
                                            ) : (
                                                <Delete fontSize="small" />
                                            )}
                                        </IconButton>
                                    </Box>

                                    <Collapse in={expandedVideos[videoKey]}>
                                        {lecture.contentType === 'quiz' ? (
                                            <Box className="mt-2">
                                                {lecture.content && 'questions' in lecture.content && (
                                                    <QuizEditor
                                                        quizContent={lecture.content}
                                                        onChange={(newContent) =>
                                                            handleQuizContentChange(
                                                                sectionIndex,
                                                                lectureIndex,
                                                                newContent
                                                            )
                                                        }
                                                    />
                                                )}
                                            </Box>
                                        ) : (
                                            <>
                                                {lecture.content && 'videoUrl' in lecture.content && isValidCloudinaryVideoUrl(
                                                    lecture.content.videoUrl
                                                ) && (
                                                    <video
                                                        controls
                                                        width="40%"
                                                        className="rounded-xl mt-2 border border-purple-200"
                                                    >
                                                        <source
                                                            src={lecture.content.videoUrl}
                                                            type="video/mp4"
                                                        />
                                                    </video>
                                                )}
                                                {lecture.content && 'videoUrl' in lecture.content && !isValidCloudinaryVideoUrl(
                                                    lecture.content.videoUrl
                                                ) &&
                                                    lecture.content.videoUrl && (
                                                        <Box className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                                                            <Typography
                                                                variant="caption"
                                                                className="text-yellow-700"
                                                            >
                                                                ⚠️ Invalid video URL
                                                                format. Please upload a
                                                                new video.
                                                            </Typography>
                                                        </Box>
                                                    )}
                                            </>
                                        )}
                                    </Collapse>

                                    {lecture.contentType === 'video' && (
                                    <Box className="mt-2">
                                        <input
                                            type="file"
                                            accept="video/*"
                                            hidden
                                            id={`video-upload-${sectionIndex}-${lectureIndex}`}
                                            onChange={(e) =>
                                                handleVideoUpload(
                                                    e,
                                                    sectionIndex,
                                                    lectureIndex
                                                )
                                            }
                                            disabled={
                                                uploadingVideos[
                                                    `${sectionIndex}-${lectureIndex}`
                                                ] || isSaving
                                            }
                                        />
                                        <label
                                            htmlFor={`video-upload-${sectionIndex}-${lectureIndex}`}
                                        >
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                component="span"
                                                disabled={
                                                    uploadingVideos[
                                                        `${sectionIndex}-${lectureIndex}`
                                                    ] || isSaving
                                                }
                                                startIcon={
                                                    uploadingVideos[
                                                        `${sectionIndex}-${lectureIndex}`
                                                    ] ? (
                                                        <CircularProgress
                                                            size={16}
                                                        />
                                                    ) : (
                                                        <CloudUpload fontSize="small" />
                                                    )
                                                }
                                                sx={{
                                                    borderRadius: "12px",
                                                    textTransform: "none",
                                                    fontWeight: "medium",
                                                    borderColor: "#2563eb",
                                                    color: "#2563eb",
                                                    "&:hover": {
                                                        borderColor: "#1d4ed8",
                                                        backgroundColor:
                                                            "rgba(37, 99, 235, 0.05)",
                                                    },
                                                }}
                                            >
                                                {uploadingVideos[
                                                    `${sectionIndex}-${lectureIndex}`
                                                ]
                                                    ? "Uploading..."
                                                    : (lecture.content && 'videoUrl' in lecture.content && isValidCloudinaryVideoUrl(
                                                          lecture.content.videoUrl
                                                      )) ? "Replace Video" : "Upload Video"}
                                            </Button>
                                        </label>

                                        {uploadingVideos[
                                            `${sectionIndex}-${lectureIndex}`
                                        ] && (
                                            <Box sx={{ mt: 1 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={
                                                        uploadProgress[
                                                            `${sectionIndex}-${lectureIndex}`
                                                        ] || 0
                                                    }
                                                    sx={{
                                                        height: 6,
                                                        borderRadius: 3,
                                                        backgroundColor:
                                                            "#e5e7eb",
                                                        "& .MuiLinearProgress-bar":
                                                            {
                                                                borderRadius:
                                                                    "3px",
                                                                background:
                                                                    "linear-gradient(45deg, #2563eb, #3b82f6)",
                                                            },
                                                    }}
                                                />
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {uploadProgress[
                                                        `${sectionIndex}-${lectureIndex}`
                                                    ] || 0}
                                                    % uploaded
                                                </Typography>
                                            </Box>
                                        )}

                                        {/* Caption Management */}
                                        {lecture.content && 'videoUrl' in lecture.content && isValidCloudinaryVideoUrl(lecture.content.videoUrl) && lecture.id && (
                                            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                                <CaptionManagement
                                                    lectureId={lecture.id}
                                                    lectureTitle={lecture.title}
                                                    size="small"
                                                    showTitle={true}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                    )}
                                </Box>
                            );
                        })}

                        <Box className="flex justify-center gap-2 mt-3">
                            <Button
                                variant="text"
                                size="small"
                                onClick={() => handleAddLecture(sectionIndex, 'video')}
                                disabled={isSaving}
                                startIcon={<PlayArrow />}
                                sx={{
                                    color: "#2563eb",
                                    textTransform: "none",
                                    fontWeight: "medium",
                                    "&:hover": {
                                        backgroundColor:
                                            "rgba(37, 99, 235, 0.05)",
                                    },
                                }}
                            >
                                Add Video Lecture
                            </Button>
                            <Button
                                variant="text"
                                size="small"
                                onClick={() => handleAddLecture(sectionIndex, 'quiz')}
                                disabled={isSaving}
                                startIcon={<QuizIcon />}
                                sx={{
                                    color: "#7c3aed",
                                    textTransform: "none",
                                    fontWeight: "medium",
                                    "&:hover": {
                                        backgroundColor:
                                            "rgba(124, 58, 237, 0.05)",
                                    },
                                }}
                            >
                                Add Quiz
                            </Button>
                        </Box>
                    </Box>
                ))}
            </DialogContent>

            <DialogActions sx={{ p: 4, pt: 2 }}>
                <Stack
                    direction="row"
                    spacing={2}
                    width="100%"
                    justifyContent="center"
                >
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        disabled={isSaving}
                        sx={{
                            borderRadius: "16px",
                            textTransform: "none",
                            px: 4,
                            py: 1.5,
                            fontWeight: "bold",
                            borderColor: "#d1d5db",
                            color: "#6b7280",
                            minWidth: 120,
                        }}
                    >
                        ❌ Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleSaveChanges}
                        disabled={isSaving}
                        sx={{
                            background:
                                "linear-gradient(45deg, #10b981, #059669)",
                            borderRadius: "16px",
                            textTransform: "none",
                            px: 4,
                            py: 1.5,
                            fontWeight: "bold",
                            minWidth: 160,
                            "&:hover": {
                                background:
                                    "linear-gradient(45deg, #059669, #047857)",
                            },
                        }}
                    >
                        {isSaving ? "Saving Changes..." : "💾 Save All Changes"}
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
}
