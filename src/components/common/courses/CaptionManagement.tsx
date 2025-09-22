"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    Tooltip,
    Typography,
    Stack,
} from "@mui/material";
import {
    Subtitles,
    Download,
    RefreshCw,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";

interface CaptionManagementProps {
    lectureId: string;
    lectureTitle?: string;
    size?: "small" | "medium";
    showTitle?: boolean;
}

interface CaptionStatus {
    available: boolean;
    srtUrl?: string;
    vttUrl?: string;
    transcriptUrl?: string;
    createdAt?: string;
}

export default function CaptionManagement({
    lectureId,
    lectureTitle,
    size = "medium",
    showTitle = true
}: CaptionManagementProps) {
    const [captionStatus, setCaptionStatus] = useState<CaptionStatus>({ available: false });
    const [loading, setLoading] = useState(false);

    // Fetch caption status
    const fetchCaptionStatus = async () => {
        if (!lectureId) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/courses/lecture/${lectureId}/captions/status`);
            if (response.ok) {
                const data = await response.json();
                setCaptionStatus(data);
            } else {
                setCaptionStatus({ available: false });
            }
        } catch (error) {
            console.error('Failed to fetch caption status:', error);
            setCaptionStatus({ available: false });
        } finally {
            setLoading(false);
        }
    };

    // Download caption file
    const downloadCaptions = async (format: 'srt' | 'vtt' | 'transcript') => {
        try {
            const response = await fetch(`/api/courses/lecture/${lectureId}/captions?format=${format}`);
            if (response.ok) {
                const data = await response.json();
                const url = data.captionUrl;

                // Create download link
                const link = document.createElement('a');
                link.href = url;
                link.download = `${lectureTitle || 'lecture'}-captions.${format}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                toast.success(`${format.toUpperCase()} captions downloaded!`);
            } else {
                toast.error(`Failed to download ${format} captions`);
            }
        } catch (error) {
            console.error(`Failed to download ${format} captions:`, error);
            toast.error(`Failed to download ${format} captions`);
        }
    };

    useEffect(() => {
        fetchCaptionStatus();
    }, [lectureId]);

    const getStatusIcon = () => {
        return captionStatus.available
            ? <CheckCircle size={16} className="text-green-600" />
            : <AlertCircle size={16} className="text-gray-600" />;
    };

    const getStatusColor = () => {
        return captionStatus.available ? 'success' : 'default';
    };

    const getStatusText = () => {
        return captionStatus.available ? 'Captions Available' : 'No Captions';
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="caption">Checking captions...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            {showTitle && (
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Caption Management
                </Typography>
            )}

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                {/* Status Chip */}
                <Chip
                    icon={getStatusIcon()}
                    label={getStatusText()}
                    color={getStatusColor() as any}
                    size={size}
                    variant="outlined"
                />

                {/* Download Options */}
                {captionStatus.available && (
                    <>
                        <Tooltip title="Download SRT captions">
                            <IconButton
                                size={size}
                                onClick={() => downloadCaptions('srt')}
                                sx={{
                                    color: 'success.main',
                                    '&:hover': { backgroundColor: 'success.50' }
                                }}
                            >
                                <Download size={16} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Download VTT captions">
                            <IconButton
                                size={size}
                                onClick={() => downloadCaptions('vtt')}
                                sx={{
                                    color: 'info.main',
                                    '&:hover': { backgroundColor: 'info.50' }
                                }}
                            >
                                <Subtitles size={16} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Refresh caption status">
                            <IconButton
                                size={size}
                                onClick={fetchCaptionStatus}
                                sx={{
                                    color: 'text.secondary',
                                    '&:hover': { backgroundColor: 'grey.100' }
                                }}
                            >
                                <RefreshCw size={16} />
                            </IconButton>
                        </Tooltip>
                    </>
                )}

                {!captionStatus.available && (
                    <Typography variant="caption" color="text.secondary">
                        Captions auto-generated with video upload
                    </Typography>
                )}
            </Stack>

            {/* Additional Info */}
            {captionStatus.available && captionStatus.createdAt && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    Generated: {new Date(captionStatus.createdAt).toLocaleDateString()}
                </Typography>
            )}
        </Box>
    );
}