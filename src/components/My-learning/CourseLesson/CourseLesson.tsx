"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
// Dynamically import MuxPlayer to avoid SSR issues
const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white">Loading video player...</p>
            </div>
        </div>
    ),
});

// Fallback video player component
const FallbackVideoPlayer = ({ src, onLoadStart, onCanPlay, onError }: any) => (
    <video
        controls
        style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
        }}
        onLoadStart={onLoadStart}
        onCanPlay={onCanPlay}
        onError={onError}
        preload="metadata"
        className="bg-black"
    >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
    </video>
);
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
    Box,
    Chip,
    Tooltip,
    Checkbox,
} from "@mui/material";
import {
    ExpandMore,
    Close,
    PlayArrow,
    Pause,
    VolumeUp,
    Fullscreen,
    Speed,
} from "@mui/icons-material";
import { Bot } from "lucide-react";
import { ICourse, ICourseContent, IEnrollment, ILecture } from "../../../../types/entities";
import CourseOverview from "./Overview";
import ChatBot from "./LeaningTool";
import { IReviewDistribution } from "../../../../types/resData";
import { useSession } from "next-auth/react";
import { updateCourseContent } from "@/actions/coursesAction";
import { markLectureAsCompleted } from "@/actions/enrollmentAction";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { EnrollmentProgress } from "@/app/[locale]/my-learning/[title]/page";

interface ICourseLesson {
    courseContent: ICourseContent;
    course: ICourse;
    reviewDistribution?: IReviewDistribution;
    enrollmentProgress?: EnrollmentProgress;
}

export default function     CourseLesson({
    courseContent,
    course,
    reviewDistribution,
    enrollmentProgress,
}: ICourseLesson) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);
    const [expandedSection, setExpandedSection] = useState<string | false>(
        false
    );
    const [isOpen, setIsOpen] = useState(false);
    const [currentLecture, setCurrentLecture] = useState<{
        title: string;
        videoUrl: string;
        lectureId: string;
    } | null>(null);
    const [isVideoLoading, setIsVideoLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [useFallbackPlayer, setUseFallbackPlayer] = useState(false);
    const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(
        null
    );

    const muxPlayerRef = useRef<any>(null);

    // Function to check if a lecture is completed based on enrollment progress
    const isLectureCompleted = (lectureId: string): boolean => {
        if (!enrollmentProgress?.lectureProgress) return false;
        return enrollmentProgress.lectureProgress.some(
            progressLecture => progressLecture.lectureId === lectureId
        );
    };

    // Function to handle lecture completion toggle
    const handleLectureToggle = async (lectureId: string) => {
        if (!enrollmentProgress?.enrollment.id || !course?.id) {
            toast.error("Authentication required");
            return;
        }

        try {
            
            const res = await markLectureAsCompleted(
                enrollmentProgress.enrollment.id.toString(),
                lectureId,
                course.id
            );
            toast.success("Lecture marked as completed!");
            
            // Refresh the page to update progress
            router.refresh();
            
        } catch (error) {
            console.error("Failed to mark lecture as completed:", error);
            toast.error("Failed to update lecture status");
        }
    };

    // Initialize with first lecture
    const videoUrl =
        courseContent?.sections?.[0]?.lectures?.[0]?.videoUrl ?? "";
    const firstLecture = courseContent?.sections?.[0]?.lectures?.[0];

    const [curVideoUrl, setCurVideoUrl] = useState(videoUrl);

    // Ensure component is mounted (client-side only)
    useEffect(() => {
        setIsMounted(true);

        // Initialize current lecture after mount
        if (firstLecture) {
            setCurrentLecture({
                title: firstLecture.title,
                videoUrl: firstLecture.videoUrl,
                lectureId: firstLecture._id || "",
            });
        }
    }, [firstLecture]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (loadingTimeout) {
                clearTimeout(loadingTimeout);
            }
        };
    }, [loadingTimeout]);

    const handleLectureChange = useCallback(
        (lecture: any) => {
            // Clear any existing timeout
            if (loadingTimeout) {
                clearTimeout(loadingTimeout);
            }

            setIsVideoLoading(true);
            setUseFallbackPlayer(false); // Reset fallback player

            // Set timeout for video loading (15 seconds)
            const timeout = setTimeout(() => {
                setUseFallbackPlayer(true);
                setIsVideoLoading(false);
            }, 15000);
            setLoadingTimeout(timeout);

            // Add delay to ensure state updates
            setTimeout(() => {
                setCurVideoUrl(lecture.videoUrl);
                setCurrentLecture({
                    title: lecture.title,
                    videoUrl: lecture.videoUrl,
                    lectureId: lecture._id || "",
                });
            }, 100);
        },
        [loadingTimeout]
    );

    const handleVideoLoadStart = () => {
        setIsVideoLoading(true);
    };

    const handleVideoCanPlay = () => {
        console.log("Video can play");
        setIsVideoLoading(false);

        // Clear loading timeout since video loaded successfully
        if (loadingTimeout) {
            clearTimeout(loadingTimeout);
            setLoadingTimeout(null);
        }
    };

    const handleMuxError = (e: any) => {
        setUseFallbackPlayer(true);
        setIsVideoLoading(false);
    };


    return (
        <>
            <div className="flex h-screen bg-gray-100 relative">
                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Enhanced Video Player with Mux */}
                    <div
                        className="relative bg-black w-full"
                        style={{ height: "calc(130vh * 0.5)" }}
                    >
                        {/* Video Title Overlay */}
                        <Box className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
                            <Typography
                                variant="h6"
                                className="text-white font-semibold"
                            >
                                {currentLecture?.title || "Loading..."}
                            </Typography>
                        </Box>

                        {/* Loading Overlay */}
                        {isVideoLoading && (
                            <Box className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                                <Box className="text-center">
                                    <Box className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></Box>
                                    <Typography
                                        variant="body1"
                                        className="text-white"
                                    >
                                        Loading video...
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        {/* Video Player - Mux with Fallback */}
                        {isMounted && curVideoUrl ? (
                            useFallbackPlayer ? (
                                <FallbackVideoPlayer
                                    src={curVideoUrl}
                                    onLoadStart={handleVideoLoadStart}
                                    onCanPlay={handleVideoCanPlay}
                                    onError={handleMuxError}
                                />
                            ) : (
                                <MuxPlayer
                                    key={curVideoUrl}
                                    ref={muxPlayerRef}
                                    src={curVideoUrl}
                                    autoPlay={false}
                                    loop={false}
                                    muted={false}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                    }}
                                    // Event handlers for quality monitoring
                                    onLoadStart={handleVideoLoadStart}
                                    onCanPlay={handleVideoCanPlay}
                                    onError={handleMuxError}
                                    // Enhanced quality control settings
                                    accentColor="#0ea5e9"
                                    preload="metadata"
                                    playbackRates={[
                                        0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2,
                                    ]}
                                    streamType="on-demand"
                                    preferPlayback="mse"
                                    startTime={0}
                                    defaultShowRemainingTime={true}
                                    noVolumePref={false}
                                    disablePictureInPicture={false}
                                    crossOrigin="anonymous"
                                    targetLiveWindow={10}
                                />
                            )
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                                    <p className="text-white">
                                        Initializing video player...
                                    </p>
                                </div>
                            </div>
                        )}
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
                                            {reviewDistribution?.average_rating ??
                                                "N/A"}
                                        </Typography>
                                        <Rating
                                            value={
                                                reviewDistribution?.average_rating ??
                                                0
                                            }
                                            readOnly
                                            precision={0.1}
                                        />
                                        <Typography
                                            variant="body2"
                                            className="text-gray-600 mt-1"
                                        >
                                            {reviewDistribution?.total_reviews ??
                                                0}{" "}
                                            reviews
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
                                                            "& .MuiLinearProgress-bar":
                                                                {
                                                                    backgroundColor:
                                                                        stars >=
                                                                        4
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
                                            {section.lectures?.length} lectures
                                        </Typography>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails className="px-4">
                                    {section.lectures?.map((lecture, index) => (
                                        <div
                                            key={lecture?._id}
                                            className={`flex items-center py-3 px-3 rounded-lg transition-all duration-200 group ${
                                                currentLecture?.lectureId ===
                                                lecture?._id
                                                    ? "bg-blue-50 border-l-4 border-blue-500"
                                                    : "hover:bg-gray-100"
                                            }`}
                                        >
                                            {/* Checkbox for lecture completion */}
                                            <Checkbox
                                                checked={isLectureCompleted(lecture?._id || "")}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    if (lecture?._id) {
                                                        handleLectureToggle(lecture._id);
                                                    }
                                                }}
                                                size="small"
                                                className="mr-2"
                                                sx={{
                                                    color: isLectureCompleted(lecture?._id || "")
                                                        ? "#10b981"
                                                        : "#6b7280",
                                                    "&.Mui-checked": {
                                                        color: "#10b981",
                                                    },
                                                }}
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleLectureChange(lecture)
                                                }
                                                className="w-full text-left flex items-center gap-3 cursor-pointer"
                                            >
                                                {/* Play/Current Indicator */}
                                                <Box className="flex-shrink-0">
                                                    {currentLecture?.lectureId ===
                                                    lecture?._id ? (
                                                        <Box className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                                            <PlayArrow
                                                                className="text-white"
                                                                fontSize="small"
                                                            />
                                                        </Box>
                                                    ) : (
                                                        <Box className="w-8 h-8 rounded-full bg-gray-200 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                                                            <Typography
                                                                variant="caption"
                                                                className="font-bold text-gray-600 group-hover:text-blue-600"
                                                            >
                                                                {index + 1}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>

                                                <div className="flex-1 min-w-0">
                                                    <Typography
                                                        variant="body2"
                                                        className={`font-medium line-clamp-2 ${
                                                            currentLecture?.lectureId ===
                                                            lecture?._id
                                                                ? "text-blue-700"
                                                                : "text-gray-800 group-hover:text-blue-600"
                                                        }`}
                                                    >
                                                        {lecture?.title}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        className="text-gray-500 mt-1"
                                                    >
                                                        Video 
                                                    </Typography>
                                                </div>

                                                {/* Status indicators */}
                                                <Box className="flex-shrink-0 flex items-center gap-1">
                                                    {currentLecture?.lectureId ===
                                                        lecture?._id && (
                                                        <Chip
                                                            label="Playing"
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                            sx={{
                                                                height: 20,
                                                                fontSize:
                                                                    "0.65rem",
                                                            }}
                                                        />
                                                    )}
                                                    {isLectureCompleted(lecture?._id || "") && (
                                                        <Chip
                                                            label="Completed"
                                                            size="small"
                                                            color="success"
                                                            variant="outlined"
                                                            sx={{
                                                                height: 20,
                                                                fontSize:
                                                                    "0.65rem",
                                                                bgcolor: "#f0fdf4",
                                                                borderColor: "#10b981",
                                                                color: "#10b981",
                                                            }}
                                                        />
                                                    )}
                                                </Box>
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
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg flex items-center justify-center hover:scale-105 transition-all duration-200"
                    >
                        {isOpen ? (
                            <Close className="w-5 h-5" />
                        ) : (
                            <Bot className="w-5 h-5" />
                        )}
                    </button>

                    {isOpen && (
                        <div className="animate-fade-in mt-2 w-[350px] h-[500px] rounded-xl overflow-hidden shadow-xl">
                            <ChatBot />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
