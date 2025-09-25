"use client";

import { useState, useEffect, useRef } from "react";
import { Box, LinearProgress, Typography, Chip } from "@mui/material";
import { ICourseLecture } from "../../../types/entities";
import { useProgressTracking } from "@/hooks/useProgressTracking";
import { useCaptions } from "@/hooks/useCaptions";
import VideoPlayerWithQuality from "./VideoPlayerWithQuality";

interface VideoPlayerWithProgressProps {
    lecture: ICourseLecture;
    courseId: number;
    enrollmentId: string;
    initialProgress?: number; // in seconds
    onLectureComplete?: (lectureId: string) => void;
    onProgressChange?: (progress: number) => void;
    className?: string;
}

const VideoPlayerWithProgress = ({
    lecture,
    courseId,
    enrollmentId,
    initialProgress = 0,
    onLectureComplete,
    onProgressChange,
    className = "",
}: VideoPlayerWithProgressProps) => {
    const [watchTime, setWatchTime] = useState(initialProgress);
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [hasCompletedLecture, setHasCompletedLecture] = useState(false);
    const completionThreshold = 0.9; // Consider lecture complete at 90%

    const { trackProgress, markAsCompleted, forceUpdate } = useProgressTracking({
        enrollmentId,
        onProgressUpdate: (lectureId, progress) => {
            if (onProgressChange) {
                onProgressChange(progress);
            }
        },
    });

    // Calculate progress percentage
    useEffect(() => {
        if (lecture.durationSeconds > 0) {
            const percentage = Math.min((watchTime / lecture.durationSeconds) * 100, 100);
            setProgressPercentage(percentage);
        }
    }, [watchTime, lecture.durationSeconds]);

    // Check if lecture should be marked as completed
    useEffect(() => {
        const completionPercent = progressPercentage / 100;
        if (
            completionPercent >= completionThreshold &&
            !hasCompletedLecture &&
            watchTime > 0
        ) {
            setHasCompletedLecture(true);
            markAsCompleted(lecture.id, watchTime);

            if (onLectureComplete) {
                onLectureComplete(lecture.id);
            }
        }
    }, [
        progressPercentage,
        hasCompletedLecture,
        watchTime,
        lecture.id,
        markAsCompleted,
        onLectureComplete,
    ]);

    const handleProgressUpdate = (currentTime: number) => {
        setWatchTime(currentTime);
        trackProgress(lecture.id, currentTime, lecture.durationSeconds);
    };

    const handleVideoEnd = () => {
        // Mark as completed when video ends, regardless of threshold
        if (!hasCompletedLecture) {
            setHasCompletedLecture(true);
            markAsCompleted(lecture.id, lecture.durationSeconds);

            if (onLectureComplete) {
                onLectureComplete(lecture.id);
            }
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getProgressColor = () => {
        if (progressPercentage >= 100) return 'success';
        if (progressPercentage >= completionThreshold * 100) return 'warning';
        return 'primary';
    };

    return (
        <Box className={className}>
            {/* Video Player */}
            <VideoPlayerWithQuality
                lecture={lecture}
                courseId={courseId}
                enrollmentId={enrollmentId}
                onProgressUpdate={handleProgressUpdate}
                onVideoEnd={handleVideoEnd}
            />

            {/* Progress Information */}
            <Box sx={{ mt: 2 }}>
                {/* Progress Bar */}
                <Box sx={{ mb: 1 }}>
                    <LinearProgress
                        variant="determinate"
                        value={progressPercentage}
                        color={getProgressColor()}
                        sx={{ height: 8, borderRadius: 4 }}
                    />
                </Box>

                {/* Progress Details */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        {formatTime(watchTime)} / {formatTime(lecture.durationSeconds)}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip
                            label={`${Math.round(progressPercentage)}%`}
                            size="small"
                            color={getProgressColor()}
                            variant={progressPercentage >= completionThreshold * 100 ? 'filled' : 'outlined'}
                        />

                        {hasCompletedLecture && (
                            <Chip
                                label="Completed"
                                size="small"
                                color="success"
                                variant="filled"
                            />
                        )}
                    </Box>
                </Box>

                {/* Completion Status */}
                {progressPercentage >= completionThreshold * 100 && !hasCompletedLecture && (
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 'medium' }}>
                        Great! You're almost done with this lecture.
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default VideoPlayerWithProgress;