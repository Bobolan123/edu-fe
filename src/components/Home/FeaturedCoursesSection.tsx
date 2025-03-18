'use client';

import { useRef } from 'react';
import { Box, Typography, IconButton, Card, CardContent, CardMedia, CardActions, Button, Container } from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';

// Sample data - replace with actual data from your backend
const sampleCourses = [
    {
        id: 1,
        title: "Complete Web Development Bootcamp",
        instructor: "John Doe",
        price: 89.99,
        image: "/sample/web-dev.jpg"
    },
    {
        id: 2,
        title: "Data Science and Machine Learning",
        instructor: "Jane Smith",
        price: 99.99,
        image: "/sample/data-science.jpg"
    },
    {
        id: 3,
        title: "Mobile App Development with React Native",
        instructor: "Mike Johnson",
        price: 79.99,
        image: "/sample/mobile-dev.jpg"
    },
    {
        id: 4,
        title: "UI/UX Design Masterclass",
        instructor: "Sarah Wilson",
        price: 69.99,
        image: "/sample/design.jpg"
    }
];

export default function FeaturedCoursesSection() {
    const courseRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (courseRef.current) {
            const scrollAmount = direction === "left" ? -300 : 300;
            courseRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <div className="flex justify-between items-center mb-6">
                <Typography variant="h4" component="h2">
                    Featured Courses
                </Typography>
                <div className="flex gap-2">
                    <IconButton onClick={() => scroll("left")}>
                        <ChevronLeftIcon />
                    </IconButton>
                    <IconButton onClick={() => scroll("right")}>
                        <ChevronRightIcon />
                    </IconButton>
                </div>
            </div>

            <Box
                ref={courseRef}
                className="flex overflow-x-hidden scroll-smooth gap-4 pb-4"
                sx={{
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                }}
            >
                {sampleCourses.map((course) => (
                    <Card
                        key={course.id}
                        className="min-w-[280px] cursor-pointer hover:shadow-lg transition-shadow"
                    >
                        <CardMedia
                            component="div"
                            className="h-40 bg-gray-200"
                            title={course.title}
                        />
                        <CardContent>
                            <Typography variant="h6" component="h3" noWrap>
                                {course.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                by {course.instructor}
                            </Typography>
                            <Typography variant="h6" color="primary" className="mt-2">
                                ${course.price.toFixed(2)}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary">
                                Learn More
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </Box>
        </Container>
    );
} 