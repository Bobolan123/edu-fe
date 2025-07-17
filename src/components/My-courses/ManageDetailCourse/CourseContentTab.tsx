"use client";

import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    IconButton,
    TextField,
    Collapse,
    CircularProgress,
    LinearProgress,
    Skeleton,
} from "@mui/material";
import {
    PlayArrow,
    Delete,
    Edit,
    Visibility,
    Save as SaveIcon,
    ExpandMore,
    CloudUpload,
} from "@mui/icons-material";
import { ILecture, ISection } from "../../../../types/entities";
import { useEffect, useState } from "react";
import { sendRequest, sendRequestFile } from "../../../../utils/api";
import { toast } from "react-toastify";
import { revalidateTag } from "next/cache";
import { saveCourseContent, uploadLectureVideo } from "@/actions";
import { LoadingButton, useLoadingState } from "@/components/common/Loading";
import { toastService } from "@/services/toast";

interface ICourseContentTabProps {
    sections: ISection[];
    courseId: number;
}

const CourseContentTab: React.FC<ICourseContentTabProps> = ({
    sections,
    courseId,
}) => {
    const [localSections, setLocalSections] = useState<ISection[]>(sections);
    const [editingSectionIndex, setEditingSectionIndex] = useState<
        number | null
    >(null);
    const [editingLecture, setEditingLecture] = useState<{
        sectionIndex: number;
        lectureIndex: number;
    } | null>(null);
    const [expandedVideos, setExpandedVideos] = useState<{
        [key: string]: boolean;
    }>({});
    
    // Loading states
    const { loading: isSaving, withLoading } = useLoadingState();
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
        setLocalSections(sections);
    }, [sections]);

    const toggleVideo = (sectionIndex: number, lectureIndex: number) => {
        const key = `${sectionIndex}-${lectureIndex}`;
        setExpandedVideos((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleAddSection = () => {
        const newSection: ISection = {
            title: `New Section ${localSections.length + 1}`,
            totalLectures: 0,
            lectures: [],
        };
        setLocalSections([...localSections, newSection]);
    };

    const handleDeleteSection = async (sectionIndex: number) => {
        const key = `section-${sectionIndex}`;
        setDeletingItems(prev => ({ ...prev, [key]: true }));
        
        try {
            // Add a small delay to show loading state
            await new Promise(resolve => setTimeout(resolve, 300));
            const updated = localSections.filter((_, i) => i !== sectionIndex);
            setLocalSections(updated);
            toastService.success('Section deleted successfully');
        } catch (error) {
            toastService.error('Failed to delete section');
        } finally {
            setDeletingItems(prev => ({ ...prev, [key]: false }));
        }
    };

    const handleAddLecture = (sectionIndex: number) => {
        const updated = [...localSections];
        updated[sectionIndex].lectures.push({
            title: `New Lecture ${updated[sectionIndex].lectures.length + 1}`,
            videoUrl: "",
        });
        updated[sectionIndex].totalLectures += 1;
        setLocalSections(updated);
    };

    const handleDeleteLecture = async (
        sectionIndex: number,
        lectureIndex: number
    ) => {
        const key = `lecture-${sectionIndex}-${lectureIndex}`;
        setDeletingItems(prev => ({ ...prev, [key]: true }));
        
        try {
            // Add a small delay to show loading state
            await new Promise(resolve => setTimeout(resolve, 300));
            const updated = [...localSections];
            updated[sectionIndex].lectures.splice(lectureIndex, 1);
            updated[sectionIndex].totalLectures -= 1;
            setLocalSections(updated);
            toastService.success('Lecture deleted successfully');
        } catch (error) {
            toastService.error('Failed to delete lecture');
        } finally {
            setDeletingItems(prev => ({ ...prev, [key]: false }));
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
        field: keyof ILecture,
        value: string
    ) => {
        const updated = [...localSections];
        updated[sectionIndex].lectures[lectureIndex][field] = value;
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
        setUploadingVideos(prev => ({ ...prev, [key]: true }));
        setUploadProgress(prev => ({ ...prev, [key]: 0 }));

        const formData = new FormData();
        formData.append("file", file);
        formData.append("sectionIndex", sectionIndex.toString());
        formData.append("lectureIndex", lectureIndex.toString());

        try {
            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => ({
                    ...prev,
                    [key]: Math.min((prev[key] || 0) + 10, 90)
                }));
            }, 200);

            await uploadLectureVideo(courseId, formData);
            
            clearInterval(progressInterval);
            setUploadProgress(prev => ({ ...prev, [key]: 100 }));
            
            // Small delay to show 100% progress
            setTimeout(() => {
                setUploadProgress(prev => ({ ...prev, [key]: 0 }));
            }, 1000);

            toastService.success("Video uploaded and updated!");
        } catch (error) {
            console.error(error);
            toastService.error("Video upload failed.");
        } finally {
            setUploadingVideos(prev => ({ ...prev, [key]: false }));
        }
    };

    const handleSaveChanges = async () => {
        await withLoading(async () => {
            try {
                const res = await saveCourseContent(courseId, localSections);
                toastService.success("Course content saved successfully!");
            } catch (error) {
                console.error(error);
                toastService.error("Failed to save course content.");
            }
        });
    };
 
    return (
        <Card>
            <CardContent>
                <Box className="flex justify-between items-center mb-4">
                    <Typography variant="h6">Course Content</Typography>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleAddSection}
                    >
                        + Add Section
                    </Button>
                </Box>

                {localSections.map((section, sectionIndex) => (
                    <Box
                        key={sectionIndex}
                        className="bg-white border rounded mb-6 p-4 shadow-sm"
                    >
                        <Box className="flex justify-between items-center mb-2">
                            {editingSectionIndex === sectionIndex ? (
                                <TextField
                                    value={section.title}
                                    onChange={(e) =>
                                        handleSectionTitleChange(
                                            sectionIndex,
                                            e.target.value
                                        )
                                    }
                                    size="small"
                                    onBlur={() => setEditingSectionIndex(null)}
                                />
                            ) : (
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                >
                                    {section.title}
                                </Typography>
                            )}
                            <Box className="flex gap-2">
                                <IconButton
                                    onClick={() =>
                                        setEditingSectionIndex(sectionIndex)
                                    }
                                    disabled={isSaving}
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                    onClick={() =>
                                        handleDeleteSection(sectionIndex)
                                    }
                                    disabled={isSaving || deletingItems[`section-${sectionIndex}`]}
                                >
                                    {deletingItems[`section-${sectionIndex}`] ? (
                                        <CircularProgress size={16} />
                                    ) : (
                                        <Delete fontSize="small" color="error" />
                                    )}
                                </IconButton>
                            </Box>
                        </Box>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            className="mb-3"
                        >
                            {section.totalLectures} lectures
                        </Typography>

                        {section.lectures.map((lecture, lectureIndex) => {
                            const isEditing =
                                editingLecture?.sectionIndex === sectionIndex &&
                                editingLecture?.lectureIndex === lectureIndex;
                            const videoKey = `${sectionIndex}-${lectureIndex}`;

                            return (
                                <Box
                                    key={lectureIndex}
                                    className="flex flex-col bg-gray-100 rounded p-3 mb-2"
                                >
                                    <Box className="flex items-center gap-2 w-full">
                                        <PlayArrow fontSize="small" />
                                        {isEditing ? (
                                            <>
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
                                                    sx={{ mr: 1 }}
                                                />
                                                <IconButton
                                                    onClick={() =>
                                                        setEditingLecture(null)
                                                    }
                                                >
                                                    <SaveIcon />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <>
                                                <Typography>
                                                    {lecture.title}
                                                </Typography>
                                                <Box className="ml-auto flex items-center gap-2">
                                                    <IconButton
                                                        onClick={() =>
                                                            toggleVideo(
                                                                sectionIndex,
                                                                lectureIndex
                                                            )
                                                        }
                                                        disabled={isSaving}
                                                    >
                                                        <Visibility fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() =>
                                                            setEditingLecture({
                                                                sectionIndex,
                                                                lectureIndex,
                                                            })
                                                        }
                                                        disabled={isSaving}
                                                    >
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() =>
                                                            handleDeleteLecture(
                                                                sectionIndex,
                                                                lectureIndex
                                                            )
                                                        }
                                                        disabled={isSaving || deletingItems[`lecture-${sectionIndex}-${lectureIndex}`]}
                                                    >
                                                        {deletingItems[`lecture-${sectionIndex}-${lectureIndex}`] ? (
                                                            <CircularProgress size={16} />
                                                        ) : (
                                                            <Delete
                                                                fontSize="small"
                                                                color="error"
                                                            />
                                                        )}
                                                    </IconButton>
                                                </Box>
                                            </>
                                        )}
                                    </Box>

                                    <Collapse in={expandedVideos[videoKey]}>
                                        {lecture.videoUrl && (
                                            <video
                                                controls
                                                width="30%"
                                                className="rounded mt-2"
                                            >
                                                <source
                                                    src={lecture.videoUrl}
                                                    type="video/mp4"
                                                />
                                            </video>
                                        )}
                                    </Collapse>

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
                                            disabled={uploadingVideos[`${sectionIndex}-${lectureIndex}`] || isSaving}
                                        />
                                        <label
                                            htmlFor={`video-upload-${sectionIndex}-${lectureIndex}`}
                                        >
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                component="span"
                                                disabled={uploadingVideos[`${sectionIndex}-${lectureIndex}`] || isSaving}
                                                startIcon={
                                                    uploadingVideos[`${sectionIndex}-${lectureIndex}`] ? (
                                                        <CircularProgress size={16} />
                                                    ) : (
                                                        <CloudUpload fontSize="small" />
                                                    )
                                                }
                                            >
                                                {uploadingVideos[`${sectionIndex}-${lectureIndex}`]
                                                    ? "Uploading..."
                                                    : lecture.videoUrl
                                                    ? "Replace Video"
                                                    : "Upload Video"}
                                            </Button>
                                        </label>
                                        
                                        {uploadingVideos[`${sectionIndex}-${lectureIndex}`] && (
                                            <Box sx={{ mt: 1 }}>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={uploadProgress[`${sectionIndex}-${lectureIndex}`] || 0}
                                                    sx={{ height: 6, borderRadius: 3 }}
                                                />
                                                <Typography variant="caption" color="text.secondary">
                                                    {uploadProgress[`${sectionIndex}-${lectureIndex}`] || 0}% uploaded
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            );
                        })}

                        <Box className="text-center mt-3">
                            <Button
                                variant="text"
                                size="small"
                                onClick={() => handleAddLecture(sectionIndex)}
                                disabled={isSaving}
                            >
                                + Add Lecture
                            </Button>
                        </Box>
                    </Box>
                ))}

                <Box className="flex justify-center mt-6">
                    <LoadingButton
                        loading={isSaving}
                        loadingText="Saving changes..."
                        variant="contained"
                        color="primary"
                        onClick={handleSaveChanges}
                        size="large"
                        sx={{
                            minWidth: 160,
                            height: 48,
                        }}
                    >
                        Save Changes
                    </LoadingButton>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CourseContentTab;
