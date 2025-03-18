'use client';

import { useEffect, useRef, useState } from 'react';
import AgoraRTC, { 
    IAgoraRTCClient, 
    IAgoraRTCRemoteUser, 
    ICameraVideoTrack, 
    IMicrophoneAudioTrack 
} from 'agora-rtc-sdk-ng';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material';

interface LiveStreamProps {
    channelName: string;
    isHost: boolean;
    onError?: (error: Error) => void;
}

export default function LiveStream({ channelName, isHost, onError }: LiveStreamProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    
    const clientRef = useRef<IAgoraRTCClient>(null);
    const localTracksRef = useRef<{
        videoTrack?: ICameraVideoTrack;
        audioTrack?: IMicrophoneAudioTrack;
    }>({});

    useEffect(() => {
        const init = async () => {
            try {
                // Initialize Agora client
                clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

                // Get your Agora App ID and token from environment variables or backend
                const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID!;
                const token = await fetchToken(); // Implement this function to get token from your backend

                // Join the channel
                await clientRef.current.join(appId, channelName, token, null);

                if (isHost) {
                    // Create local tracks if user is host
                    const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
                    localTracksRef.current.audioTrack = audioTrack;
                    localTracksRef.current.videoTrack = videoTrack;

                    // Publish tracks
                    await clientRef.current.publish([audioTrack, videoTrack]);
                }

                // Handle remote user joining
                clientRef.current.on('user-published', async (user, mediaType) => {
                    await clientRef.current?.subscribe(user, mediaType);
                    
                    if (mediaType === 'video') {
                        const remoteVideoTrack = user.videoTrack;
                        remoteVideoTrack?.play(`remote-stream-${user.uid}`);
                    }
                    if (mediaType === 'audio') {
                        const remoteAudioTrack = user.audioTrack;
                        remoteAudioTrack?.play();
                    }
                });

                setIsLoading(false);
            } catch (error) {
                console.error('Error initializing stream:', error);
                onError?.(error as Error);
            }
        };

        init();

        return () => {
            // Cleanup
            Object.values(localTracksRef.current).forEach(track => track?.close());
            clientRef.current?.leave();
        };
    }, [channelName, isHost]);

    const toggleAudio = async () => {
        if (localTracksRef.current.audioTrack) {
            if (isAudioEnabled) {
                await localTracksRef.current.audioTrack.setEnabled(false);
            } else {
                await localTracksRef.current.audioTrack.setEnabled(true);
            }
            setIsAudioEnabled(!isAudioEnabled);
        }
    };

    const toggleVideo = async () => {
        if (localTracksRef.current.videoTrack) {
            if (isVideoEnabled) {
                await localTracksRef.current.videoTrack.setEnabled(false);
            } else {
                await localTracksRef.current.videoTrack.setEnabled(true);
            }
            setIsVideoEnabled(!isVideoEnabled);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* Local Stream (for host) */}
            {isHost && (
                <Box sx={{ position: 'absolute', right: 16, bottom: 16, width: 200, height: 150, zIndex: 1 }}>
                    <div id="local-stream" style={{ width: '100%', height: '100%' }} />
                </Box>
            )}

            {/* Remote Stream */}
            <Box sx={{ width: '100%', height: '100%', bgcolor: 'black' }}>
                <div id="remote-stream" style={{ width: '100%', height: '100%' }} />
            </Box>

            {/* Controls (for host) */}
            {isHost && (
                <Box sx={{ 
                    position: 'absolute', 
                    bottom: 16, 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 2,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    padding: 2,
                    borderRadius: 2
                }}>
                    <Button
                        variant="contained"
                        color={isAudioEnabled ? 'primary' : 'error'}
                        onClick={toggleAudio}
                        startIcon={isAudioEnabled ? <Mic /> : <MicOff />}
                    >
                        {isAudioEnabled ? 'Mute' : 'Unmute'}
                    </Button>
                    <Button
                        variant="contained"
                        color={isVideoEnabled ? 'primary' : 'error'}
                        onClick={toggleVideo}
                        startIcon={isVideoEnabled ? <Videocam /> : <VideocamOff />}
                    >
                        {isVideoEnabled ? 'Stop Video' : 'Start Video'}
                    </Button>
                </Box>
            )}
        </Box>
    );
}

// Helper function to fetch token from backend
async function fetchToken() {
    // Implement token fetching from your backend
    // This is required for security
    return 'your-token-here';
} 