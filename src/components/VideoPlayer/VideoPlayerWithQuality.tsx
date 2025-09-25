"use client";

import { useState, useEffect, useRef } from "react";
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Chip,
    CircularProgress,
} from "@mui/material";
import {
    Settings as SettingsIcon,
    Subtitles as SubtitlesIcon,
    SubtitlesOff as SubtitlesOffIcon,
} from "@mui/icons-material";
import { ICourseLecture, IVideoQuality } from "../../../types/entities";

interface VideoPlayerWithQualityProps {
    lecture: ICourseLecture;
    courseId: number;
    enrollmentId?: string;
    onProgressUpdate?: (watchTime: number) => void;
    onVideoEnd?: () => void;
    className?: string;
    captionUrl?: string | null;
    captionsAvailable?: boolean;
}

const VideoPlayerWithQuality = ({
    lecture,
    courseId,
    enrollmentId,
    onProgressUpdate,
    onVideoEnd,
    className = "",
    captionUrl = null,
    captionsAvailable = false,
}: VideoPlayerWithQualityProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [selectedQuality, setSelectedQuality] = useState<IVideoQuality | null>(null);
    const [qualityMenuAnchor, setQualityMenuAnchor] = useState<null | HTMLElement>(null);
    const [captionsEnabled, setCaptionsEnabled] = useState(false);

    // Initialize with highest quality video
    useEffect(() => {
        if (lecture?.content && 'quality' in lecture.content && lecture.content.quality && lecture.content.quality.length > 0) {
            const sortedQualities = [...lecture.content.quality].sort((a, b) => {
                const aRes = parseInt(a.resolution);
                const bRes = parseInt(b.resolution);
                return bRes - aRes; // Highest first
            });
            setSelectedQuality(sortedQualities[0]);
        }
    }, [lecture]);


    const handleQualityChange = (quality: IVideoQuality) => {
        const video = videoRef.current;
        if (!video) return;

        const currentTime = video.currentTime;
        const wasPlaying = !video.paused;

        setSelectedQuality(quality);
        setQualityMenuAnchor(null);

        // Restore video state after quality change
        setTimeout(() => {
            if (video) {
                video.currentTime = currentTime;
                if (wasPlaying) {
                    video.play();
                }
            }
        }, 100);
    };

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video || !onProgressUpdate) return;

        onProgressUpdate(video.currentTime);
    };

    const handleVideoEnd = () => {
        if (onVideoEnd) {
            onVideoEnd();
        }
    };

    const toggleCaptions = () => {
        setCaptionsEnabled(!captionsEnabled);
        const video = videoRef.current;
        if (video) {
            const track = video.querySelector('track[kind="subtitles"]') as HTMLTrackElement;
            if (track) {
                track.track.mode = captionsEnabled ? 'hidden' : 'showing';
            }
        }
    };

    if (!selectedQuality) {
        return (
            <Box
                className={`flex items-center justify-center bg-gray-900 rounded-lg ${className}`}
                sx={{ height: 400 }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className={`relative ${className}`}>
            <video
                ref={videoRef}
                src={selectedQuality.url}
                controls
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnd}
                className="w-full h-auto rounded-lg"
                style={{ maxHeight: '70vh' }}
            >
                {captionsAvailable && captionUrl && (
                    <track
                        kind="subtitles"
                        src={captionUrl}
                        srcLang="en"
                        label="English"
                        default={captionsEnabled}
                    />
                )}
                Your browser does not support the video tag.
            </video>

            {/* Quality and Caption Controls */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    display: 'flex',
                    gap: 1,
                }}
            >
                {/* Quality Selector */}
                {lecture?.content && 'quality' in lecture.content && lecture.content.quality && lecture.content.quality.length > 1 && (
                    <>
                        <Chip
                            label={selectedQuality.resolution}
                            onClick={(e) => setQualityMenuAnchor(e.currentTarget)}
                            sx={{
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                },
                            }}
                        />
                        <Menu
                            anchorEl={qualityMenuAnchor}
                            open={Boolean(qualityMenuAnchor)}
                            onClose={() => setQualityMenuAnchor(null)}
                        >
                            {lecture.content && 'quality' in lecture.content && lecture.content.quality.map((quality: IVideoQuality) => (
                                <MenuItem
                                    key={quality.resolution}
                                    onClick={() => handleQualityChange(quality)}
                                    selected={selectedQuality.resolution === quality.resolution}
                                >
                                    {quality.resolution}
                                </MenuItem>
                            ))}
                        </Menu>
                    </>
                )}

                {/* Caption Toggle */}
                {captionsAvailable ? (
                    <IconButton
                        onClick={toggleCaptions}
                        sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            width: 32,
                            height: 32,
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            },
                        }}
                    >
                        {captionsEnabled ? (
                            <SubtitlesIcon fontSize="small" />
                        ) : (
                            <SubtitlesOffIcon fontSize="small" />
                        )}
                    </IconButton>
                ) : null}
            </Box>

            {/* Video Info */}
            <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                    {lecture.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Duration: {lecture.durationSeconds ? Math.floor(lecture.durationSeconds / 60) : 0}:
                    {lecture.durationSeconds ? String(lecture.durationSeconds % 60).padStart(2, '0') : '00'}
                </Typography>
            </Box>
        </Box>
    );
};

export default VideoPlayerWithQuality;