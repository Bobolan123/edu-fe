"use client";

import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import {
    Typography,
    IconButton,
    Tabs,
    Tab,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Checkbox,
    LinearProgress,
    Rating,
    Slider,
} from "@mui/material";
import { ExpandMore, Close, Search } from "@mui/icons-material";
import { ICourse, ICourseContent } from "../../../../types/entities";
import CourseOverview from "./Overview";
import ChatBot from "./LeaningTool";

interface ICourseLesson {
    courseContent: ICourseContent;
    course: ICourse;
}

export default function CourseLesson({ courseContent, course }: ICourseLesson) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [expandedSection, setExpandedSections] = useState<string[]>([]);

    const playerRef = useRef<ReactPlayer | null>(null);
    const videoUrl = courseContent.sections[0]?.lectures[0]?.videoUrl ?? "";
    const [curVideoUrl, setCurVideoUrl] = useState(videoUrl);

    const feedbackData = [
        { stars: 5, percentage: 46 },
        { stars: 4, percentage: 38 },
        { stars: 3, percentage: 13 },
        { stars: 2, percentage: 2 },
        { stars: 1, percentage: 1 },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Video Player */}
                <div className="bg-black" style={{ height: 400 }}>
                    <ReactPlayer
                        key={curVideoUrl} 
                        ref={playerRef}
                        url={curVideoUrl}
                        playing={isPlaying}
                        controls
                        onPause={() => setIsPlaying(false)}
                        onPlay={() => setIsPlaying(true)}
                        width="100%"
                        height="100%"
                    />
                </div>

                {/* Tabs */}
                <div className="bg-white border-t">
                    <Tabs
                        value={activeTab}
                        onChange={(_, val) => setActiveTab(val)}
                        className="px-4"
                    >
                        <Tab label="Overview" />
                        <Tab label="Reviews" />
                        <Tab label="Learning tools" />
                    </Tabs>
                </div>
                <div>
                    {activeTab === 0 && (
                        <>
                            <CourseOverview course={course} />
                        </>
                    )}
                </div>

                {/* Feedback Tab */}
                <div>
                    {activeTab === 1 && (
                        <div>
                            <Typography
                                variant="h5"
                                className="mb-6 font-semibold text-gray-800"
                            >
                                Student feedback
                            </Typography>
                            <div className="flex items-start space-x-8">
                                <div className="text-center">
                                    <Typography
                                        variant="h2"
                                        className="font-bold text-orange-500 mb-2"
                                    >
                                        4.4
                                    </Typography>
                                    <Rating
                                        value={4.4}
                                        readOnly
                                        precision={0.1}
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    {feedbackData.map(
                                        ({ stars, percentage }) => (
                                            <div
                                                key={stars}
                                                className="flex items-center space-x-3"
                                            >
                                                <Rating
                                                    value={stars}
                                                    readOnly
                                                    size="small"
                                                />
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={percentage}
                                                    className="flex-1 h-2 bg-gray-200"
                                                    sx={{
                                                        "& .MuiLinearProgress-bar":
                                                            {
                                                                backgroundColor:
                                                                    stars >= 4
                                                                        ? "#f59e0b"
                                                                        : "#6b7280",
                                                            },
                                                    }}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    className="text-blue-600 font-medium w-12"
                                                >
                                                    {percentage}%
                                                </Typography>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    {activeTab === 2 && (
                        <>
                            <ChatBot />
                        </>
                    )}
                </div>
            </div>

            {/* Sidebar */}
            <div className="w-4/12 bg-white border-l border-gray-200 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                    <Typography variant="h6" className="font-semibold">
                        Course content
                    </Typography>
                    <IconButton size="small">
                        <Close />
                    </IconButton>
                </div>
                <div className="flex-1 overflow-auto">
                    {courseContent.sections.map((section) => (
                        <Accordion
                            key={section._id}
                            expanded={expandedSection.includes(section._id)}
                            onChange={() => {
                                setExpandedSections((prev) =>
                                    prev.includes(section._id)
                                        ? prev.filter(
                                              (id) => id !== section._id
                                          )
                                        : [...prev, section._id]
                                );
                            }}
                            className="shadow-none border-b"
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                className="px-4"
                            >
                                <div className="flex-1">
                                    <Typography
                                        variant="subtitle2"
                                        className="font-semibold mb-1"
                                    >
                                        {section.title}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        className="text-gray-600"
                                    >
                                        {section.lectures.length} lectures
                                    </Typography>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails className="px-4">
                                {section.lectures.map((lecture, index) => (
                                    <div
                                        key={lecture._id}
                                        className="flex items-center py-1 px-1 hover:bg-gray-100"
                                    >
                                        <button
                                            onClick={() =>
                                                setCurVideoUrl(lecture.videoUrl)
                                            }
                                        >
                                            <div className="flex-1">
                                                <Typography
                                                    variant="body2"
                                                    className="mb-1"
                                                >
                                                    {index + 1}. {lecture.title}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    className="text-gray-600 flex items-center"
                                                >
                                                    <span className="mr-1">
                                                        ▶
                                                    </span>{" "}
                                                    {lecture.totalDuration}
                                                </Typography>
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            </div>
        </div>
    );
}
