'use client';

import { useState } from 'react';
import { Box, Container, Grid, Typography, Card, CardContent, Button, Chip } from '@mui/material';
import LiveStream from '@/components/LiveStream/LiveStream';

// This would come from your backend
const sampleSession = {
    id: 1,
    title: "Advanced Web Development Concepts",
    instructor: "John Doe",
    status: "live", // or "scheduled" or "ended"
    startTime: new Date().toISOString(),
    channelName: "web-dev-101",
};

// This would also come from your backend
const upcomingSessions = [
    {
        id: 2,
        title: "React Hooks Deep Dive",
        instructor: "Jane Smith",
        startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        status: "scheduled"
    },
    {
        id: 3,
        title: "Building Scalable APIs",
        instructor: "Mike Johnson",
        startTime: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
        status: "scheduled"
    }
];

export default function LiveSessionsPage() {
    const [isHost] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Grid container spacing={4}>
                {/* Live Stream Section */}
                <Grid item xs={12} md={8}>
                    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden' }}>
                        {sampleSession.status === 'live' ? (
                            <>
                                <Box sx={{ height: '600px', position: 'relative' }}>
                                    <LiveStream
                                        channelName={sampleSession.channelName}
                                        isHost={isHost}
                                        onError={(err) => setError(err.message)}
                                    />
                                </Box>
                                {error && (
                                    <Box sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
                                        {error}
                                    </Box>
                                )}
                                <Box sx={{ p: 3 }}>
                                    <Typography variant="h5" gutterBottom>
                                        {sampleSession.title}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        Instructor: {sampleSession.instructor}
                                    </Typography>
                                    <Chip 
                                        label="LIVE" 
                                        color="error" 
                                        size="small" 
                                        sx={{ mt: 1 }} 
                                    />
                                </Box>
                            </>
                        ) : (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="h6" color="text.secondary">
                                    No live session is currently active
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Grid>

                {/* Upcoming Sessions Section */}
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom>
                        Upcoming Sessions
                    </Typography>
                    <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                        {upcomingSessions.map((session) => (
                            <Card key={session.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {session.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Instructor: {session.instructor}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Starts at: {formatDate(session.startTime)}
                                    </Typography>
                                    <Button 
                                        variant="outlined" 
                                        size="small" 
                                        sx={{ mt: 2 }}
                                        onClick={() => {
                                            // Add to calendar or set reminder
                                            console.log('Reminder set for:', session.title);
                                        }}
                                    >
                                        Set Reminder
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
} 