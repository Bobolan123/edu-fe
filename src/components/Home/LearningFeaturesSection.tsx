'use client';

import { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Container } from '@mui/material';
import { Build as BuildIcon, School as SchoolIcon, Assessment as AssessmentIcon, Settings as SettingsIcon } from '@mui/icons-material';
import Image from 'next/image';
import { useTranslations } from 'next-intl';


export default function LearningFeaturesSection() {
    const t = useTranslations('Home');
    const tFeatures = useTranslations('LearningFeaturesSection');
    
    const learningFeatures = [
        {
            id: 1,
            title: tFeatures('features.interactive.title'),
            description: tFeatures('features.interactive.description'),
            icon: <BuildIcon sx={{ fontSize: 40 }} />,
            image: "/home/Hands-on training.png",
        },
        {
            id: 2,
            title: tFeatures('features.flexible.title'),
            description: tFeatures('features.flexible.description'),
            icon: <SchoolIcon sx={{ fontSize: 40 }} />,
            image: "/home/Certification-prep.png",
        },
        {
            id: 3,
            title: tFeatures('features.expert.title'),
            description: tFeatures('features.expert.description'),
            icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
            image: "/home/Insights-analytics.png",
        },
        {
            id: 4,
            title: tFeatures('features.community.title'),
            description: tFeatures('features.community.description'),
            icon: <SettingsIcon sx={{ fontSize: 40 }} />,
            image: "/home/Customizable-content.png",
        },
    ];
    
    const [selectedFeature, setSelectedFeature] = useState(learningFeatures[0]);

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
                                                        Enterprise Plan
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