"use client";

import React, { useState, useEffect } from "react";
import {
    Button,
    CircularProgress,
    Typography,
    Box,
} from "@mui/material";
import {
    CloudUpload as CloudUploadIcon,
    VideoFile as VideoFileIcon,
    CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
interface VideoUploadProps {
    disabled?: boolean;
    label?: string;
    maxSizeMB?: number;
    existingVideoUrl?: string;
    onVideoChange?: (videoUrl: string) => void;
    onVideoFileChange?: (videoFile: File | null) => void;
}

export default function VideoUpload({
    disabled = false,
    label = "Upload Video",
    maxSizeMB = 100,
    existingVideoUrl,
    onVideoChange,
    onVideoFileChange
}: VideoUploadProps) {
    const { data: session } = useSession();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>(existingVideoUrl || "");

    // Check if video is selected or already uploaded
    const hasSelectedVideo = selectedFile || videoUrl;

    useEffect(() => {
        if (existingVideoUrl && !videoUrl) {
            setVideoUrl(existingVideoUrl);
        }
    }, [existingVideoUrl, videoUrl]);

    const handleFileSelect = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) {
            setSelectedFile(null);
            onVideoFileChange?.(null);
            return;
        }

        // Validate file type
        if (!file.type.startsWith("video/")) {
            toast.error("Please select a video file");
            return;
        }

        // Validate file size if specified
        if (maxSizeMB > 0) {
            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > maxSizeMB) {
                const errorMsg = `File size must be less than ${maxSizeMB}MB`;
                toast.error(errorMsg);
                return;
            }
        }

        // Store the file for later upload
        setSelectedFile(file);
        onVideoFileChange?.(file);
        toast.success("Video file selected successfully");
    };


    return (
        <Box>
            <Button
                variant="outlined"
                component="label"
                startIcon={
                    hasSelectedVideo ? (
                        <CheckCircleIcon color="success" />
                    ) : (
                        <CloudUploadIcon />
                    )
                }
                disabled={disabled}
                fullWidth
                color={hasSelectedVideo ? "success" : "primary"}
            >
                {hasSelectedVideo
                    ? `Video Selected: ${selectedFile?.name || "Existing Video"}`
                    : label}
                <input
                    type="file"
                    hidden
                    accept="video/*"
                    onChange={handleFileSelect}
                    disabled={disabled}
                />
            </Button>

            {hasSelectedVideo && (
                <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                    <VideoFileIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="success.main">
                        {selectedFile ? "Video file ready for upload" : "Video already uploaded"}
                    </Typography>
                </Box>
            )}

         
        </Box>
    );
}
