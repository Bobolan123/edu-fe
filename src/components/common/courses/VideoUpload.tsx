"use client";

import React, { useState, useEffect } from "react";
import {
    Button,
    CircularProgress,
    Typography,
    Alert,
    Box,
} from "@mui/material";
import {
    CloudUpload as CloudUploadIcon,
    VideoFile as VideoFileIcon,
    CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { uploadLecture } from "@/actions/coursesAction";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

interface VideoUploadProps {
    disabled?: boolean;
    label?: string;
    maxSizeMB?: number;
    existingVideoUrl?: string;
    // Add a way to get the video URL out when needed
    onVideoChange?: (videoUrl: string) => void;
}

export default function VideoUpload({
    disabled = false,
    label = "Upload Video",
    maxSizeMB = 100,
    existingVideoUrl,
    onVideoChange
}: VideoUploadProps) {
    const { data: session } = useSession();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>(existingVideoUrl || "");

    // Check if video is already uploaded
    const hasUploadedVideo = videoUrl || uploadedFile;

    // Initialize videoUrl from existingVideoUrl
    useEffect(() => {
        if (existingVideoUrl && !videoUrl) {
            setVideoUrl(existingVideoUrl);
        }
    }, [existingVideoUrl, videoUrl]);

    const handleFileSelect = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Reset previous state
        setError(null);
        setUploadedFile(null);

        // Validate file type
        if (!file.type.startsWith("video/")) {
            setError("Please select a video file");
            toast.error("Please select a video file");
            return;
        }

        // Validate file size if specified
        if (maxSizeMB > 0) {
            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > maxSizeMB) {
                const errorMsg = `File size must be less than ${maxSizeMB}MB`;
                setError(errorMsg);
                toast.error(errorMsg);
                return;
            }
        }

        await uploadVideo(file);
    };

    const uploadVideo = async (file: File) => {
        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Check if user is authenticated
            if (!session?.user?.access_token) {
                throw new Error("Please log in to upload videos");
            }


            const uploadedVideoUrl = await uploadLecture(
                file
            );

            if (!uploadedVideoUrl) {
                throw new Error("No video URL returned from upload");
            }
            // Update internal state
            setUploadedFile(file.name);
            setVideoUrl(uploadedVideoUrl);
            onVideoChange?.(uploadedVideoUrl);
            
            toast.success("Video uploaded successfully");
        } catch (error) {
            console.error("Video upload error:", error);

            const errorMessage =
                error instanceof Error ? error.message : "Upload failed";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <Box>
            <Button
                variant="outlined"
                component="label"
                startIcon={
                    isUploading ? (
                        <CircularProgress size={20} />
                    ) : hasUploadedVideo ? (
                        <CheckCircleIcon color="success" />
                    ) : (
                        <CloudUploadIcon />
                    )
                }
                disabled={disabled || isUploading}
                fullWidth
                color={hasUploadedVideo ? "success" : "primary"}
            >
                {isUploading
                    ? `Uploading... ${Math.round(uploadProgress)}%`
                    : hasUploadedVideo
                    ? `Video Uploaded: ${uploadedFile || "Existing Video"}`
                    : label}
                <input
                    type="file"
                    hidden
                    accept="video/*"
                    onChange={handleFileSelect}
                    disabled={disabled || isUploading}
                />
            </Button>

            {isUploading && (
                <Box sx={{ mt: 1 }}>
                    <CircularProgress
                        variant="determinate"
                        value={uploadProgress}
                        size={20}
                        sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                        {Math.round(uploadProgress)}% uploaded
                    </Typography>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mt: 1 }}>
                    {error}
                </Alert>
            )}

            {hasUploadedVideo && !error && (
                <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                    <VideoFileIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="success.main">
                        Video uploaded successfully
                    </Typography>
                </Box>
            )}

         
        </Box>
    );
}
