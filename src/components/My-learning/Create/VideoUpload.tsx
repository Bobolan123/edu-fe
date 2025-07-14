"use client";

import React, { useState } from "react";
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

interface VideoUploadProps {
    onUploadComplete: (videoUrl: string) => void;
    onUploadStart?: () => void;
    onUploadError?: (error: string) => void;
    disabled?: boolean;
    label?: string;
    maxSizeMB?: number;
}

export default function VideoUpload({
    onUploadComplete,
    onUploadStart,
    onUploadError,
    disabled = false,
    label = "Upload Video",
    maxSizeMB = 100,
}: VideoUploadProps) {
    const { data: session } = useSession()
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Reset previous state
        setError(null);
        setUploadedFile(null);

        // Validate file type
        if (!file.type.startsWith("video/")) {
            setError("Please select a video file");
            onUploadError?.("Please select a video file");
            return;
        }

        // Validate file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
            setError(`File size must be less than ${maxSizeMB}MB`);
            onUploadError?.(`File size must be less than ${maxSizeMB}MB`);
            return;
        }

        await uploadVideo(file);
    };

    const uploadVideo = async (file: File) => {
        setIsUploading(true);
        setUploadProgress(0);
        onUploadStart?.();

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append("video", file);

            // uploadLecture(session?.user?.access_token,)
            
            // setUploadedFile(file.name);
            // onUploadComplete(videoUrl);
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Upload failed";
            setError(errorMessage);
            onUploadError?.(errorMessage);
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
                    ) : uploadedFile ? (
                        <CheckCircleIcon color="success" />
                    ) : (
                        <CloudUploadIcon />
                    )
                }
                disabled={disabled || isUploading}
                fullWidth
            >
                {isUploading
                    ? `Uploading... ${uploadProgress}%`
                    : uploadedFile
                    ? `Uploaded: ${uploadedFile}`
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
                        {uploadProgress}% uploaded
                    </Typography>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mt: 1 }}>
                    {error}
                </Alert>
            )}

            {uploadedFile && (
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