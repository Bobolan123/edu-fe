"use client";

import { useState, useRef, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    IconButton,
    Box,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import MuxPlayer from "@mux/mux-player-react";
import { getVideoType, getYouTubeEmbedUrl, isSrtFile, convertSrtUrlToVttBlob } from "../../utils/utils";

interface VideoPreviewModalProps {
    open: boolean;
    onClose: () => void;
    videoUrl: string | null | undefined;
    title?: string;
    captionUrl?: string | null;
}

export default function VideoPreviewModal({
    open,
    onClose,
    videoUrl,
    title,
    captionUrl,
}: VideoPreviewModalProps) {
    const videoType = getVideoType(videoUrl);
    const muxPlayerRef = useRef<any>(null);
    const [vttCaptionUrl, setVttCaptionUrl] = useState<string | null>(null);

    // Convert SRT to VTT if needed
    useEffect(() => {
        let blobUrl: string | null = null;

        const convertCaption = async () => {
            if (!captionUrl) {
                setVttCaptionUrl(null);
                return;
            }

            // If it's an SRT file, convert it to VTT
            if (isSrtFile(captionUrl)) {
                const convertedUrl = await convertSrtUrlToVttBlob(captionUrl);
                if (convertedUrl) {
                    blobUrl = convertedUrl;
                    setVttCaptionUrl(convertedUrl);
                } else {
                    // Conversion failed, try using original URL anyway
                    setVttCaptionUrl(captionUrl);
                }
            } else {
                // Already VTT or other format, use as-is
                setVttCaptionUrl(captionUrl);
            }
        };

        convertCaption();

        // Cleanup blob URL when component unmounts or captionUrl changes
        return () => {
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [captionUrl]);

    // Enable captions by default when available
    useEffect(() => {
        const enableCaptions = () => {
            if (muxPlayerRef.current && vttCaptionUrl) {
                const video = muxPlayerRef.current.media || muxPlayerRef.current;
                if (video?.textTracks && video.textTracks.length > 0) {
                    for (let i = 0; i < video.textTracks.length; i++) {
                        const track = video.textTracks[i];
                        if (track.kind === 'subtitles') {
                            track.mode = 'showing';
                        }
                    }
                }
            }
        };

        enableCaptions();
        const timer = setTimeout(enableCaptions, 1000);

        return () => clearTimeout(timer);
    }, [vttCaptionUrl, videoUrl]);
    
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
                        ref={muxPlayerRef}
                        src={videoUrl}
                        style={{
                            width: '100%',
                            height: '100%',
                            minHeight: '500px',
                        }}
                        autoPlay
                        muted
                        crossOrigin="anonymous"
                    >
                        {vttCaptionUrl && (
                            <track
                                kind="subtitles"
                                src={vttCaptionUrl}
                                srcLang="en"
                                label="English"
                            />
                        )}
                    </MuxPlayer>
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