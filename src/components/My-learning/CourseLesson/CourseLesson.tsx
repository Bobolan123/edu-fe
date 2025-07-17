"use client";

import { useState } from "react";
import ReactPlayer from "react-player";
import {
    Typography,
    IconButton,
    Tabs,
    Tab,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Rating,
    LinearProgress,
} from "@mui/material";
import { ExpandMore, Close } from "@mui/icons-material";
import { Bot } from "lucide-react";
import { ICourse, ICourseContent } from "../../../../types/entities";
import CourseOverview from "./Overview";
import ChatBot from "./LeaningTool";
import { IReviewDistribution } from "../../../../types/resData";

interface ICourseLesson {
    courseContent: ICourseContent;
    course: ICourse;
    reviewDistribution?: IReviewDistribution;
}

export default function CourseLesson({
    courseContent,
    course,
    reviewDistribution,
}: ICourseLesson) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [expandedSection, setExpandedSection] = useState<string | false>(
        false
    );
    const [isOpen, setIsOpen] = useState(false);

    const videoUrl = courseContent?.sections?.[0]?.lectures?.[0]?.videoUrl ?? "";
    const [curVideoUrl, setCurVideoUrl] = useState(videoUrl);

    return (
        <div className="flex h-screen bg-gray-100 relative">
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Video */}
                <div className="bg-black w-full" style={{ height: "calc(130vh * 0.5)" }}>
                    <ReactPlayer
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
                    </Tabs>
                </div>

                {/* Tab Content */}
                <div className="p-4">
                    {activeTab === 0 && <CourseOverview course={course} />}

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
                                        {reviewDistribution?.average_rating ?? "N/A"}
                                    </Typography>
                                    <Rating
                                        value={reviewDistribution?.average_rating ?? 0}
                                        readOnly
                                        precision={0.1}
                                    />
                                    <Typography variant="body2" className="text-gray-600 mt-1">
                                        {reviewDistribution?.total_reviews ?? 0} reviews
                                    </Typography>
                                </div>
                                <div className="flex-1 space-y-2">
                                    {reviewDistribution?.distribution?.map(
                                        ({ stars, percentage, count }) => (
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
                                                        "& .MuiLinearProgress-bar": {
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
                    {courseContent?.sections?.map((section) => (
                        <Accordion
                            key={section._id}
                            expanded={expandedSection === section._id}
                            onChange={() =>
                                setExpandedSection(
                                    expandedSection === section._id
                                        ? false
                                        : section._id
                                )
                            }
                            className="shadow-none border-b"
                        >
                            <AccordionSummary expandIcon={<ExpandMore />} className="px-4">
                                <div className="flex-1">
                                    <Typography
                                        variant="subtitle2"
                                        className="font-semibold mb-1"
                                    >
                                        {section.title}
                                    </Typography>
                                    <Typography variant="caption" className="text-gray-600">
                                        {section.lectures?.length} lectures
                                    </Typography>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails className="px-4">
                                {section.lectures?.map((lecture, index) => (
                                    <div
                                        key={lecture?._id}
                                        className="flex items-center py-1 px-1 hover:bg-gray-100"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCurVideoUrl(lecture?.videoUrl ?? "")
                                            }
                                            className="w-full text-left"
                                        >
                                            <div className="flex-1">
                                                <Typography
                                                    variant="body2"
                                                    className="mb-1"
                                                >
                                                    {index + 1}. {lecture?.title}
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

            {/* Chat Widget */}
            <div className="fixed bottom-4 right-4 z-50 p-1 sm:p-0">
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg flex items-center justify-center hover:scale-105 transition-all duration-200"
                >
                    {isOpen ? <Close className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </button>

                {isOpen && (
                    <div className="animate-fade-in mt-2 w-[350px] h-[500px] rounded-xl overflow-hidden shadow-xl">
                        <ChatBot />
                    </div>
                )}
            </div>
        </div>
    );
}
