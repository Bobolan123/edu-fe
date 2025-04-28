'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Typography, Container, Grid, IconButton } from '@mui/material';
import { FormatQuote, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const testimonials = [
    {
        id: 1,
        name: "Kati Frantz",
        role: "Senior Developer at Google",
        quote: "MindfulMaze has transformed the way I approach learning. The interactive exercises and real-world projects have helped me master new technologies faster than ever.",
        image: "/home/Testimonial1.png"
    },
    {
        id: 2,
        name: "Sarah Johnson",
        role: "Product Manager at Microsoft",
        quote: "The quality of content and the learning experience on MindfulMaze is unmatched. It's helped our entire team stay up-to-date with the latest technologies.",
        image: "/home/Testimonial2.png"
    },
    {
        id: 3,
        name: "James Wilson",
        role: "Tech Lead at Amazon",
        quote: "What sets MindfulMaze apart is their focus on practical, hands-on learning. The platform has been instrumental in our team's professional development.",
        image: "/home/Testimonial3.png"
    }
];

export default function TestimonialsSection() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const testimonialInterval = useRef<NodeJS.Timeout | null>(null);
    const t = useTranslations('Home.testimonials');

    useEffect(() => {
        // Auto-advance testimonials every 5 seconds
        testimonialInterval.current = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => {
            if (testimonialInterval.current) {
                clearInterval(testimonialInterval.current);
            }
        };
    }, []);

    const handleTestimonialChange = (index: number) => {
        setCurrentTestimonial(index);
        // Reset interval when manually changing testimonial
        if (testimonialInterval.current) {
            clearInterval(testimonialInterval.current);
            testimonialInterval.current = setInterval(() => {
                setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
            }, 5000);
        }
    };

    return (
        <Box sx={{ bgcolor: '#333b3c', py: 10, mt: 8, height: '85vh' }}>
            <Container maxWidth="lg">
                <Typography variant="h3" component="h2" gutterBottom sx={{ color: 'white', textAlign: 'center', mb: 6 }}>
                    {t('title')}
                </Typography>
                <Grid container spacing={4} alignItems="center">
                    {/* Testimonial Content */}
                    <Grid item xs={12} md={8} sx={{ position: 'relative' }}>
                        <Box sx={{ position: 'relative', minHeight: 300 }}>
                            <FormatQuote 
                                sx={{ 
                                    fontSize: 60, 
                                    color: 'white', 
                                    opacity: 0.3,
                                    position: 'absolute',
                                    top: -50,
                                    left: -10,
                                    transform: 'rotate(180deg)'
                                }} 
                            />
                            <Typography 
                                variant="h4" 
                                component="div" 
                                sx={{ 
                                    color: 'white',
                                    fontWeight: 300,
                                    lineHeight: 1.4,
                                    mb: 4
                                }}
                            >
                                {testimonials[currentTestimonial].quote}
                            </Typography>
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" sx={{ color: 'white' }}>
                                    {testimonials[currentTestimonial].name}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ color: 'white', opacity: 0.8 }}>
                                    {testimonials[currentTestimonial].role}
                                </Typography>
                            </Box>
                        </Box>
                        {/* Navigation Dots */}
                        <Box sx={{ display: 'flex', gap: 1, mt: 4 }}>
                            {testimonials.map((_, index) => (
                                <Box
                                    key={index}
                                    onClick={() => handleTestimonialChange(index)}
                                    sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        bgcolor: currentTestimonial === index ? 'white' : 'rgba(255,255,255,0.3)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            ))}
                        </Box>
                    </Grid>

                    {/* Testimonial Image */}
                    <Grid item xs={12} md={4}>
                        <Box
                            sx={{
                                position: 'relative',
                                width: '280px',
                                height: '280px',
                                margin: '0 auto',
                                overflow: 'hidden',
                                border: '4px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            <Image
                                src={testimonials[currentTestimonial].image}
                                alt={testimonials[currentTestimonial].name}
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </Box>
                    </Grid>

                    {/* Navigation Arrows */}
                    <Box 
                        sx={{ 
                            position: 'absolute', 
                            left: 0, 
                            right: 0,
                            display: 'flex',
                            justifyContent: 'space-between',
                            px: 2
                        }}
                    >
                        <IconButton 
                            onClick={() => handleTestimonialChange(
                                currentTestimonial === 0 
                                    ? testimonials.length - 1 
                                    : currentTestimonial - 1
                            )}
                            sx={{ color: 'white' }}
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                        <IconButton 
                            onClick={() => handleTestimonialChange(
                                (currentTestimonial + 1) % testimonials.length
                            )}
                            sx={{ color: 'white' }}
                        >
                            <ChevronRightIcon />
                        </IconButton>
                    </Box>
                </Grid>
            </Container>
        </Box>
    );
} 