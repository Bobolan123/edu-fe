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
} from "@mui/material";
import {
    PlayArrow,
    Delete,
    Edit,
    Visibility,
    Save as SaveIcon,
    ExpandMore,
} from "@mui/icons-material";
import { ILecture, ISection } from "../../../../types/entities";
import { useEffect, useState } from "react";
import { sendRequest } from "../../../../utils/api";
import { toast } from "react-toastify";

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

    const handleDeleteSection = (sectionIndex: number) => {
        const updated = localSections.filter((_, i) => i !== sectionIndex);
        setLocalSections(updated);
    };

    const handleAddLecture = (sectionIndex: number) => {
        const updated = [...localSections];
        updated[sectionIndex].lectures.push({
            title: `New Lecture ${updated[sectionIndex].lectures.length + 1}`,
            totalDuration: "00:00",
            videoUrl: "",
        });
        updated[sectionIndex].totalLectures += 1;
        setLocalSections(updated);
    };

    const handleDeleteLecture = (
        sectionIndex: number,
        lectureIndex: number
    ) => {
        const updated = [...localSections];
        updated[sectionIndex].lectures.splice(lectureIndex, 1);
        updated[sectionIndex].totalLectures -= 1;
        setLocalSections(updated);
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

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "your_upload_preset");
        formData.append("folder", "lectures");

        try {
            const res = await fetch(
                "https://api.cloudinary.com/v1_1/your_cloud_name/video/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();
            const videoUrl = data.secure_url;

            const updated = [...localSections];
            updated[sectionIndex].lectures[lectureIndex].videoUrl = videoUrl;
            setLocalSections(updated);
            toast.success("Video uploaded successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload video.");
        }
    };

    const handleSaveChanges = async () => {
        try {
            const res = await sendRequest({
                method: "PUT",
                url: `${process.env.NEXT_PUBLIC_SERVER}/courses/content/${courseId}`,
                body: { sections: localSections },
            });

            if (!res) throw new Error("Failed to save");
            toast.success("Course content saved successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save course content.");
        }
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
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                    onClick={() =>
                                        handleDeleteSection(sectionIndex)
                                    }
                                >
                                    <Delete fontSize="small" color="error" />
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
                                                <TextField
                                                    value={
                                                        lecture.totalDuration
                                                    }
                                                    onChange={(e) =>
                                                        handleLectureFieldChange(
                                                            sectionIndex,
                                                            lectureIndex,
                                                            "totalDuration",
                                                            e.target.value
                                                        )
                                                    }
                                                    size="small"
                                                    sx={{ width: "100px" }}
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
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {lecture.totalDuration}
                                                    </Typography>
                                                    <IconButton
                                                        onClick={() =>
                                                            toggleVideo(
                                                                sectionIndex,
                                                                lectureIndex
                                                            )
                                                        }
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
                                                    >
                                                        <Delete
                                                            fontSize="small"
                                                            color="error"
                                                        />
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
                                        />
                                        <label
                                            htmlFor={`video-upload-${sectionIndex}-${lectureIndex}`}
                                        >
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                component="span"
                                            >
                                                {lecture.videoUrl
                                                    ? "Replace Video"
                                                    : "Upload Video"}
                                            </Button>
                                        </label>
                                    </Box>
                                </Box>
                            );
                        })}

                        <Box className="text-center mt-3">
                            <Button
                                variant="text"
                                size="small"
                                onClick={() => handleAddLecture(sectionIndex)}
                            >
                                + Add Lecture
                            </Button>
                        </Box>
                    </Box>
                ))}

                <Box className="flex justify-center mt-6">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveChanges}
                    >
                        Save Changes
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CourseContentTab;
