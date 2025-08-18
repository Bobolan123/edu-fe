"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    IconButton,
    Box,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import MuxPlayer from "@mux/mux-player-react";
import { getVideoType, getYouTubeEmbedUrl } from "../../../utils/utils";

interface VideoPreviewModalProps {
    open: boolean;
    onClose: () => void;
    videoUrl: string | null | undefined;
    title?: string;
}

export default function VideoPreviewModal({
    open,
    onClose,
    videoUrl,
    title,
}: VideoPreviewModalProps) {
    const videoType = getVideoType(videoUrl);
    
    const renderVideo = () => {
        if (!videoUrl) return null;
        
        switch (videoType) {
            case 'youtube':
                const embedUrl = getYouTubeEmbedUrl(videoUrl);
                if (!embedUrl) return null;
                
                return (
                    <iframe
                        src={embedUrl}
                        style={{
                            width: '100%',
                            height: '100%',
                            minHeight: '500px',
                            border: 'none',
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={title || 'Course Preview'}
                    />
                );
                
            case 'cloudinary':
                return (
                    <MuxPlayer
                        src={videoUrl}
                        style={{
                            width: '100%',
                            height: '100%',
                            minHeight: '500px',
                        }}
                        autoPlay
                        muted
                    />
                );
                
            default:
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '400px',
                            color: 'text.secondary',
                        }}
                    >
                        Video format not supported
                    </Box>
                );
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    overflow: 'hidden',
                },
            }}
        >
            <Box sx={{ position: 'relative' }}>
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        zIndex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>
                
                <DialogContent sx={{ p: 0 }}>
                    {renderVideo()}
                </DialogContent>
            </Box>
        </Dialog>
    );
}