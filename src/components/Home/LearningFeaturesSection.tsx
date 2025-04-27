'use client';

import { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Container } from '@mui/material';
import { Build as BuildIcon, School as SchoolIcon, Assessment as AssessmentIcon, Settings as SettingsIcon } from '@mui/icons-material';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const learningFeatures = [
    {
        id: 1,
        title: "Hands-on training",
        description: "Upskill effectively with AI-powered coding exercises, practice tests, and quizzes.",
        icon: <BuildIcon sx={{ fontSize: 40 }} />,
        image: "/images/hands-on-training.png",
    },
    {
        id: 2,
        title: "Certification prep",
        description: "Prep for industry-recognized certifications by solving real-world challenges and earn badges along the way.",
        icon: <SchoolIcon sx={{ fontSize: 40 }} />,
        image: "/images/certification-prep.png",
    },
    {
        id: 3,
        title: "Insights and analytics",
        description: "Fast-track goals with advanced insights plus a dedicated customer success team to help drive effective learning.",
        icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
        badge: "Enterprise Plan",
        image: "/images/insights-analytics.png",
    },
    {
        id: 4,
        title: "Customizable content",
        description: "Create tailored learning paths for team and organization goals and even host your own content and resources.",
        icon: <SettingsIcon sx={{ fontSize: 40 }} />,
        badge: "Enterprise Plan",
        image: "/images/customizable-content.png",
    },
];

export default function LearningFeaturesSection() {
    const [selectedFeature, setSelectedFeature] = useState(learningFeatures[0]);
    const t = useTranslations('Home');

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom>
                {t('learning_focused_title')}
            </Typography>

            <Grid container spacing={4}>
                {/* Left side - Feature list */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {learningFeatures.map((feature) => (
                            <Card
                                key={feature.id}
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    transform: selectedFeature.id === feature.id ? 'scale(1.02)' : 'scale(1)',
                                    borderLeft: selectedFeature.id === feature.id ? 6 : 1,
                                    borderLeftColor: selectedFeature.id === feature.id ? 'primary.main' : 'divider',
                                }}
                                onClick={() => setSelectedFeature(feature)}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                        <Box sx={{ 
                                            color: selectedFeature.id === feature.id ? 'primary.main' : 'text.secondary',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            {feature.icon}
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                <Typography variant="h6" component="h3">
                                                    {feature.title}
                                                </Typography>
                                                {feature.badge && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            bgcolor: 'primary.main',
                                                            color: 'white',
                                                            px: 1,
                                                            py: 0.5,
                                                            borderRadius: 1,
                                                            fontSize: '0.75rem',
                                                        }}
                                                    >
                                                        {feature.badge}
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {feature.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Grid>

                {/* Right side - Feature image */}
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            height: '100%',
                            minHeight: 400,
                            position: 'relative',
                            bgcolor: 'grey.50',
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        <Image
                            src={selectedFeature.image}
                            alt={selectedFeature.title}
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
} 