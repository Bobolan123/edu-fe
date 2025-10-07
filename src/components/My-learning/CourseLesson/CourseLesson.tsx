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
import { Bot, Subtitles, X } from "lucide-react";
import { ICourse, ICourseContent, IEnrollment, ICourseLecture, IReview } from "../../../../types/entities";
import CourseOverview from "./Overview";
import CourseReviews from "./CourseReviews";
import ChatBot from "./LeaningTool";
import { IReviewDistribution } from "../../../../types/resData";

import { useSession } from "next-auth/react";
import { getLectureCaptions, submitQuiz } from "@/actions/courseContentAction";
import { markLectureAsCompleted } from "@/actions/enrollmentAction";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { EnrollmentProgress } from "@/app/[locale]/my-learning/[title]/page";
import QuizDisplay from "./QuizDisplay";

interface ICourseLesson {
    courseContent: ICourseContent;
    course: ICourse;
    reviewDistribution?: IReviewDistribution;
    enrollmentProgress?: EnrollmentProgress;
    resUserReviews?: IModelPaginate<IReview>;
    userReview?: IReview;
    initialCaptionUrl?: string | null;
}

export default function     CourseLesson({
    courseContent,
    course,
    reviewDistribution,
    enrollmentProgress,
    resUserReviews,
    userReview,
    initialCaptionUrl,
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
        contentType: string;
        content: any;
    } | null>(null);
    const [isVideoLoading, setIsVideoLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [useFallbackPlayer, setUseFallbackPlayer] = useState(false);
    const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(
        null
    );
    const [captionsEnabled, setCaptionsEnabled] = useState(false);
    const [captionUrl, setCaptionUrl] = useState<string | null>(initialCaptionUrl || null);
    const [quizAnswers, setQuizAnswers] = useState<Record<string, string | number | boolean>>({});
    const [quizResult, setQuizResult] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const muxPlayerRef = useRef<any>(null);

    // Handle quiz answer selection
    const handleAnswerSelect = (questionId: string, answer: string | number | boolean) => {
        setQuizAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    // Handle quiz submission
    const handleQuizSubmit = async () => {
        if (!enrollmentProgress?.enrollment.id || !currentLecture?.lectureId) {
            toast.error("Unable to submit quiz");
            return;
        }

        setIsSubmitting(true);

        try {
            const answers = Object.entries(quizAnswers).map(([questionId, answer]) => ({
                questionId,
                answer
            }));

            const result = await submitQuiz(
                enrollmentProgress.enrollment.id,
                currentLecture.lectureId,
                answers
            );

            setQuizResult(result);

            if (result.passed) {
                toast.success(`Quiz passed! Score: ${result.percentage}%`);
            } else {
                toast.warning(`Quiz not passed. Score: ${result.percentage}%`);
            }

            // Server action already revalidates "enrollment-progress" tag
            // No need to refresh the page
        } catch (error: any) {
            console.error("Failed to submit quiz:", error);
            toast.error(error.message || "Failed to submit quiz");
        } finally {
            setIsSubmitting(false);
        }
    };

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
            await markLectureAsCompleted(
                enrollmentProgress.enrollment.id.toString(),
                lectureId,
                course.id
            );

    

        } catch (error) {
            console.error("Failed to mark lecture as completed:", error);
            toast.error("Failed to update lecture status");
        }
    };

    // Get first lecture directly from server data
    const firstLecture = courseContent?.sections?.[0]?.lectures?.[0];
    const videoUrl = firstLecture?.content && 'videoUrl' in firstLecture.content
        ? firstLecture.content.videoUrl
        : "";

    const [curVideoUrl, setCurVideoUrl] = useState(videoUrl);

    // Initialize on mount only
    useEffect(() => {
        setIsMounted(true);

        // Initialize current lecture from server data only if not already set
        if (firstLecture && !currentLecture) {
            const lectureVideoUrl = firstLecture.content && 'videoUrl' in firstLecture.content
                ? firstLecture.content.videoUrl
                : "";
            setCurrentLecture({
                title: firstLecture.title,
                videoUrl: lectureVideoUrl,
                lectureId: firstLecture.id || "",
                contentType: firstLecture.contentType || "video",
                content: firstLecture.content || null,
            });

            // Load existing quiz submission for first lecture if it's a quiz
            if (firstLecture.contentType === 'quiz' && firstLecture.id && enrollmentProgress?.lectureProgress) {
                const lectureProgressData = enrollmentProgress.lectureProgress.find(
                    lp => lp.lectureId === firstLecture.id
                );

                if (lectureProgressData?.submissionData?.lastSubmission) {
                    setQuizResult(lectureProgressData.submissionData.lastSubmission);

                    const previousAnswers: Record<string, string | number | boolean> = {};
                    lectureProgressData.submissionData.lastSubmission.answers.forEach((ans: any) => {
                        previousAnswers[ans.questionId] = ans.answer;
                    });
                    setQuizAnswers(previousAnswers);
                }
            }
        }
    }, [firstLecture]);

    // Update quiz submission data when enrollmentProgress changes (after quiz submit)
    useEffect(() => {
        if (currentLecture?.lectureId && currentLecture.contentType === 'quiz' && enrollmentProgress?.lectureProgress) {
            const lectureProgressData = enrollmentProgress.lectureProgress.find(
                lp => lp.lectureId === currentLecture.lectureId
            );

            // Update quiz result if submission data exists
            if (lectureProgressData?.submissionData?.lastSubmission) {
                setQuizResult(lectureProgressData.submissionData.lastSubmission);

                const previousAnswers: Record<string, string | number | boolean> = {};
                lectureProgressData.submissionData.lastSubmission.answers.forEach((ans: any) => {
                    previousAnswers[ans.questionId] = ans.answer;
                });
                setQuizAnswers(previousAnswers);
            }
        }
    }, [enrollmentProgress, currentLecture?.lectureId]);

    const handleLectureChange = useCallback(
        async (lecture: any) => {
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
            setTimeout(async () => {
                const lectureVideoUrl = lecture.content && 'videoUrl' in lecture.content
                    ? lecture.content.videoUrl
                    : "";

                setCurVideoUrl(lectureVideoUrl);
                setCurrentLecture({
                    title: lecture.title,
                    videoUrl: lectureVideoUrl,
                    lectureId: lecture.id || "",
                    contentType: lecture.contentType || "video",
                    content: lecture.content || null,
                });

                // Check for existing quiz submission
                if (lecture.contentType === 'quiz' && lecture.id && enrollmentProgress?.lectureProgress) {
                    const lectureProgressData = enrollmentProgress.lectureProgress.find(
                        lp => lp.lectureId === lecture.id
                    );

                    if (lectureProgressData?.submissionData?.lastSubmission) {
                        // Set the previous quiz result
                        setQuizResult(lectureProgressData.submissionData.lastSubmission);

                        // Populate answers from previous submission
                        const previousAnswers: Record<string, string | number | boolean> = {};
                        lectureProgressData.submissionData.lastSubmission.answers.forEach((ans: any) => {
                            previousAnswers[ans.questionId] = ans.answer;
                        });
                        setQuizAnswers(previousAnswers);
                    } else {
                        // Clear quiz state for new attempt
                        setQuizResult(null);
                        setQuizAnswers({});
                    }
                }

                // Fetch captions for the new lecture using server action (only for video lectures)
                if (lecture.id && lecture.contentType === 'video') {
                    const newCaptionUrl = await getLectureCaptions(lecture.id, 'srt');
                    setCaptionUrl(newCaptionUrl);
                } else {
                    setCaptionUrl(null);
                }
            }, 100);
        },
        [loadingTimeout, enrollmentProgress]
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
                    {/* Content Area - Video or Quiz */}
                    <div
                        className={`relative w-full ${currentLecture?.contentType === 'quiz' ? 'bg-gray-50' : 'bg-black'}`}
                        style={{ height: "calc(130vh * 0.5)" }}
                    >
                        {/* Title Overlay */}
                        <Box className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start">
                            <Box className={`${currentLecture?.contentType === 'quiz' ? 'bg-white' : 'bg-black/60'} backdrop-blur-sm rounded-lg px-4 py-2`}>
                                <Typography
                                    variant="h6"
                                    className={`${currentLecture?.contentType === 'quiz' ? 'text-gray-900' : 'text-white'} font-semibold`}
                                >
                                    {currentLecture?.title || "Loading..."}
                                </Typography>
                            </Box>

                            {/* Caption Controls - only for videos */}
                            {currentLecture?.contentType === 'video' && (
                                <Box className="flex gap-2">
                                    {captionUrl && (
                                        <Tooltip title={captionsEnabled ? "Hide Captions" : "Show Captions"}>
                                            <IconButton
                                                onClick={() => setCaptionsEnabled(!captionsEnabled)}
                                                className="bg-black/60 backdrop-blur-sm text-white hover:bg-black/80"
                                                size="small"
                                            >
                                                {captionsEnabled ? <X size={20} /> : <Subtitles size={20} />}
                                            </IconButton>
                                        </Tooltip>
                                    )}

                                    {!captionUrl && (
                                        <Box className="bg-black/60 backdrop-blur-sm rounded px-3 py-1">
                                            <Typography variant="caption" className="text-white opacity-75">
                                                No Captions
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Box>

                        {/* Loading Overlay - only for videos */}
                        {currentLecture?.contentType === 'video' && isVideoLoading && (
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

                        {/* Conditional Rendering: Video or Quiz */}
                        {currentLecture?.contentType === 'quiz' ? (
                            /* Quiz Content - Using QuizDisplay Component */
                            <QuizDisplay
                                title={currentLecture?.title || "Quiz"}
                                quizContent={currentLecture?.content as any}
                                submission={
                                    currentLecture?.lectureId && enrollmentProgress?.lectureProgress
                                        ? enrollmentProgress.lectureProgress.find(
                                            lp => lp.lectureId === currentLecture.lectureId
                                        )?.submissionData?.lastSubmission || null
                                        : null
                                }
                                quizAnswers={quizAnswers}
                                quizResult={quizResult}
                                isSubmitting={isSubmitting}
                                onAnswerSelect={handleAnswerSelect}
                                onSubmit={handleQuizSubmit}
                            />
                        ) : (
                            /* Video Player - Mux with Fallback */
                            isMounted && curVideoUrl ? (
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
                                >
                                    {/* Add caption track if available and enabled */}
                                    {captionsEnabled && captionUrl && (
                                        <track
                                            kind="subtitles"
                                            src={captionUrl}
                                            srcLang="en"
                                            label="English"
                                            default
                                        />
                                    )}
                                </MuxPlayer>
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
                            )
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

                        {activeTab === 1 && course?.id && (
                            <CourseReviews 
                                reviewDistribution={reviewDistribution}
                                reviews={resUserReviews?.data?.result}
                                userReview={userReview}
                                courseId={course.id}
                                onFilterChange={(stars, sortBy) => {
                                    router.push(`?id=${course.id}&rating=${stars}&sort=${sortBy}`, {
                                        scroll: false
                                    });
                                }}
                            />
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
                                key={section.id}
                                expanded={expandedSection === section.id}
                                onChange={() =>
                                    setExpandedSection(
                                        expandedSection === section.id
                                            ? false
                                            : section.id
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
                                            key={lecture?.id}
                                            className={`flex items-center py-3 px-3 rounded-lg transition-all duration-200 group ${
                                                currentLecture?.lectureId ===
                                                lecture?.id
                                                    ? "bg-blue-50 border-l-4 border-blue-500"
                                                    : "hover:bg-gray-100"
                                            }`}
                                        >
                                            {/* Checkbox for lecture completion */}
                                            <Checkbox
                                                checked={isLectureCompleted(lecture?.id || "")}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    if (lecture?.id) {
                                                        handleLectureToggle(lecture.id);
                                                    }
                                                }}
                                                size="small"
                                                className="mr-2"
                                                sx={{
                                                    color: isLectureCompleted(lecture?.id || "")
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
                                                    lecture?.id ? (
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
                                                            lecture?.id
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
                                                        lecture?.id && (
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
                                                    {isLectureCompleted(lecture?.id || "") && (
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
    