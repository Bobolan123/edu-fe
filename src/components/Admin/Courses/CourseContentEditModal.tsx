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
    School,
} from "@mui/icons-material";
import { ICourse, ICourseSection, ICourseLecture, QuizContent } from "../../../../types/entities";
import { useEffect, useState } from "react";
import { uploadVideoToLecture, saveCourseContent, getCourseStructure } from "@/actions/courseContentAction";
import { toastService } from "@/services/toast";
import { isValidCloudinaryVideoUrl } from "../../../utils/utils";
import CaptionManagement from "../../common/courses/CaptionManagement";
import QuizEditor from "../../My-courses/ManageDetailCourse/QuizEditor";

interface CourseContentEditModalProps {
    open: boolean;
    onClose: () => void;
    course: ICourse | null;
    onSuccess?: () => void;
}

export default function CourseContentEditModal({
    open,
    onClose,
    course,
    onSuccess
}: CourseContentEditModalProps) {
    const [localSections, setLocalSections] = useState<ICourseSection[]>([]);
    const [expandedVideos, setExpandedVideos] = useState<{
        [key: string]: boolean;
    }>({});

    // Loading states
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingVideos, setUploadingVideos] = useState<{
        [key: string]: boolean;
    }>({});
    const [deletingItems, setDeletingItems] = useState<{
        [key: string]: boolean;
    }>({});

    // Store pending video uploads for new lectures (with temp IDs)
    const [pendingVideoUploads, setPendingVideoUploads] = useState<Map<string, File>>(new Map());

    useEffect(() => {
        const fetchCourseContent = async () => {
            if (!course?.id || !open) return;

            setLoading(true);
            try {
                const courseStructure = await getCourseStructure(course.id);
                if (courseStructure?.sections) {
                    setLocalSections([...courseStructure.sections]);
                } else {
                    setLocalSections([]);
                }
            } catch (error) {
                console.error('Error fetching course content:', error);
                toastService.error('Failed to load course content');
                setLocalSections([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseContent();
    }, [course?.id, open]);

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
            toastService.success("Section removed");
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to remove section";
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
            toastService.success("Lecture removed");
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to remove lecture";
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

    const handleQuizContentChange = (
        sectionIndex: number,
        lectureIndex: number,
        newQuizContent: QuizContent
    ) => {
        const updated = [...localSections];
        updated[sectionIndex].lectures[lectureIndex].content = newQuizContent;
        setLocalSections(updated);
    };

    const handleVideoUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        sectionIndex: number,
        lectureIndex: number
    ) => {
        const file = e.target.files?.[0];
        if (!file || !course) return;

        const key = `${sectionIndex}-${lectureIndex}`;
        const section = localSections[sectionIndex];
        const lecture = section.lectures[lectureIndex];

        // Check if this is a new lecture (temp ID) or existing lecture (real UUID)
        const isNewLecture = lecture.id.startsWith('temp-');

        if (isNewLecture) {
            // Store file for later upload after saving
            const newPendingUploads = new Map(pendingVideoUploads);
            newPendingUploads.set(lecture.id, file);
            setPendingVideoUploads(newPendingUploads);

            toastService.info("Video will be uploaded when you save changes");
            return;
        }

        // Existing lecture - upload immediately
        setUploadingVideos((prev) => ({ ...prev, [key]: true }));

        try {
            await uploadVideoToLecture(course.id, section.id, lecture.id, file);

            toastService.success("Video uploaded successfully");

        } catch (error) {
            console.error(error);
            const errorMessage =
                error instanceof Error ? error.message : "Video upload failed.";
            toastService.error(errorMessage);
        } finally {
            setUploadingVideos((prev) => ({ ...prev, [key]: false }));
        }
    };

    const handleSaveChanges = async () => {
        if (!course) return;

        setIsSaving(true);
        try {
            // Step 1: Save course content structure
            // Backend automatically deletes sections/lectures not included in payload
            const savedSections = await saveCourseContent(course.id, localSections);

            // Step 2: Upload pending videos (for new lectures)
            if (pendingVideoUploads.size > 0) {
                // Create mapping from temp IDs to real IDs
                const idMapping = new Map<string, { realId: string, sectionId: string }>();

                localSections.forEach((section, sIndex) => {
                    section.lectures.forEach((lecture, lIndex) => {
                        if (lecture.id?.startsWith('temp-')) {
                            idMapping.set(lecture.id, {
                                realId: savedSections[sIndex].lectures[lIndex].id,
                                sectionId: savedSections[sIndex].id
                            });
                        }
                    });
                });

                // Upload videos with real IDs
                const uploadPromises = [];
                for (const [tempId, videoFile] of pendingVideoUploads.entries()) {
                    const mapping = idMapping.get(tempId);
                    if (mapping) {
                        uploadPromises.push(
                            uploadVideoToLecture(
                                course.id,
                                mapping.sectionId,
                                mapping.realId,
                                videoFile
                            )
                        );
                    }
                }

                await Promise.all(uploadPromises);
                setPendingVideoUploads(new Map());
            }


            // Call onSuccess callback and close modal
            onSuccess?.();
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

    if (!course) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2, maxHeight: '90vh' }
            }}
        >
            <DialogTitle
                sx={{
                    m: 0,
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: 'primary.main',
                    color: 'white',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <School />
                    <Box>
                        <Typography variant="h6">Edit Course Content</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {course.title}
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    onClick={onClose}
                    sx={{ color: 'white' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" fontWeight={600}>
                                Course Sections
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddSection}
                                disabled={isSaving}
                            >
                                Add Section
                            </Button>
                        </Box>

                        {localSections.length === 0 && (
                            <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'grey.50', borderRadius: 2 }}>
                                <School sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    No sections yet
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Add your first section to get started with course content
                                </Typography>
                            </Box>
                        )}

                        {localSections.map((section, sectionIndex) => (
                            <Box
                                key={sectionIndex}
                                sx={{
                                    bgcolor: 'background.paper',
                                    border: 1,
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    mb: 2,
                                    p: 2,
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 2 }}>
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
                                        placeholder="Section title"
                                    />
                                    <IconButton
                                        onClick={() => handleDeleteSection(sectionIndex)}
                                        disabled={isSaving || deletingItems[`section-${sectionIndex}`]}
                                        size="small"
                                        color="error"
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
                                    sx={{ mb: 2 }}
                                >
                                    {section.lectures.length} lectures
                                </Typography>

                                {section.lectures.map((lecture, lectureIndex) => {
                                    const videoKey = `${sectionIndex}-${lectureIndex}`;
                                    const isQuiz = lecture.contentType === 'quiz';

                                    return (
                                        <Box
                                            key={lectureIndex}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                bgcolor: 'grey.50',
                                                borderRadius: 1,
                                                p: 1.5,
                                                mb: 1,
                                                border: 1,
                                                borderColor: 'divider',
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                                {isQuiz ? (
                                                    <QuizIcon fontSize="small" color="secondary" />
                                                ) : (
                                                    <PlayArrow fontSize="small" color="primary" />
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
                                                    placeholder="Lecture title"
                                                />

                                                <IconButton
                                                    onClick={() => toggleVideo(sectionIndex, lectureIndex)}
                                                    size="small"
                                                    color="primary"
                                                >
                                                    {expandedVideos[videoKey] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                </IconButton>

                                                <IconButton
                                                    onClick={() => handleDeleteLecture(sectionIndex, lectureIndex)}
                                                    disabled={isSaving || deletingItems[`lecture-${sectionIndex}-${lectureIndex}`]}
                                                    size="small"
                                                    color="error"
                                                >
                                                    {deletingItems[`lecture-${sectionIndex}-${lectureIndex}`] ? (
                                                        <CircularProgress size={16} />
                                                    ) : (
                                                        <Delete fontSize="small" />
                                                    )}
                                                </IconButton>
                                            </Box>

                                            <Collapse in={expandedVideos[videoKey]}>
                                                {isQuiz ? (
                                                    <Box sx={{ mt: 2 }}>
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
                                                    <Box sx={{ mt: 2 }}>
                                                        {lecture.content && 'videoUrl' in lecture.content && isValidCloudinaryVideoUrl(
                                                            lecture.content.videoUrl
                                                        ) && (
                                                            <video
                                                                controls
                                                                style={{ width: '40%', borderRadius: 4 }}
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
                                                                <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                                                                    <Typography variant="caption" color="warning.dark">
                                                                        ⚠️ Invalid video URL format. Please upload a new video.
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                    </Box>
                                                )}
                                            </Collapse>

                                            {!isQuiz && (
                                            <Box sx={{ mt: 1 }}>
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
                                                            sx={{ height: 6, borderRadius: 1 }}
                                                        />
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            Uploading video...
                                                        </Typography>
                                                    </Box>
                                                )}

                                                {/* Caption Management */}
                                                {lecture.content && 'videoUrl' in lecture.content && isValidCloudinaryVideoUrl(lecture.content.videoUrl) && lecture.id && (
                                                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
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

                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={() => handleAddLecture(sectionIndex, 'video')}
                                        disabled={isSaving}
                                        startIcon={<PlayArrow />}
                                        color="primary"
                                    >
                                        Add Video Lecture
                                    </Button>
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={() => handleAddLecture(sectionIndex, 'quiz')}
                                        disabled={isSaving}
                                        startIcon={<QuizIcon />}
                                        color="secondary"
                                    >
                                        Add Quiz
                                    </Button>
                                </Box>
                            </Box>
                        ))}
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Button onClick={onClose} disabled={isSaving}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    startIcon={isSaving ? <CircularProgress size={16} /> : undefined}
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
