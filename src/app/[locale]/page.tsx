'use client'

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button, Typography, Container, Card, CardContent, CardMedia, CardActions, IconButton, Box } from "@mui/material";
import Image from "next/image";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useRef } from 'react';

// Sample data - replace with actual data from your backend
const sampleCategories = [
    { id: 1, name: "Web Development", description: "Learn web technologies" },
    { id: 2, name: "Data Science", description: "Master data analysis" },
    { id: 3, name: "Mobile Development", description: "Build mobile apps" },
    { id: 4, name: "UI/UX Design", description: "Design user interfaces" },
    { id: 5, name: "Machine Learning", description: "AI and ML fundamentals" },
    { id: 6, name: "Cloud Computing", description: "Cloud technologies" },
];

const sampleCourses = [
    {
        id: 1,
        title: "Complete Web Development Bootcamp",
        instructor: "John Doe",
        price: 99.99,
        thumbnail: "/sample/web-dev.jpg"
    },
    {
        id: 2,
        title: "Data Science Fundamentals",
        instructor: "Jane Smith",
        price: 89.99,
        thumbnail: "/sample/data-science.jpg"
    },
    {
        id: 3,
        title: "Mobile App Development with React Native",
        instructor: "Mike Johnson",
        price: 79.99,
        thumbnail: "/sample/mobile-dev.jpg"
    },
    {
        id: 4,
        title: "UI/UX Design Principles",
        instructor: "Sarah Wilson",
        price: 69.99,
        thumbnail: "/sample/ui-ux.jpg"
    },
    {
        id: 5,
        title: "Advanced JavaScript Course",
        instructor: "Alex Brown",
        price: 89.99,
        thumbnail: "/sample/js.jpg"
    },
    {
        id: 6,
        title: "Python Programming Masterclass",
        instructor: "Emily Davis",
        price: 94.99,
        thumbnail: "/sample/python.jpg"
    }
];

export default function HomePage() {
    const t = useTranslations("Home");
    const categoryRef = useRef<HTMLDivElement>(null);
    const courseRef = useRef<HTMLDivElement>(null);

    const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
        if (ref.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div>
            <div className="flex items-center h-[500px] relative">
                <section>
                    <video
                        className="absolute top-0 left-0 w-full h-full object-fill"
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src="/video.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </section>

                <div className="w-1/3 z-10 text-white mx-60">
                    <Typography variant="h2" className="text-white italic">
                        Studying Online is now much easier
                    </Typography>
                    <Typography variant="inherit">
                        Mindful Maze is an interesting platform that will teach
                        you in a more interactive way
                    </Typography>
                </div>
            </div>

            {/* Categories Section */}
            <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h2">
                    Browse Categories
                </Typography>
                <Box display="flex" gap={1}>
                    <IconButton onClick={() => scroll(categoryRef, "left")}>
                        <ChevronLeftIcon />
                    </IconButton>
                    <IconButton onClick={() => scroll(categoryRef, "right")}>
                        <ChevronRightIcon />
                    </IconButton>
                </Box>
            </Box>
            
            <Box
                ref={categoryRef}
                sx={{
                    display: "flex",
                    overflowX: "auto",
                    gap: 2,
                    pb: 2,
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" }
                }}
            >
                {sampleCategories.map((category) => (
                    <Card key={category.id} sx={{ backgroundColor:"#f4f4f4" ,minWidth: 200, cursor: "pointer", transition: "box-shadow 0.3s", "&:hover": { boxShadow: 6 } }}>
                        <CardContent>
                            <Typography variant="h6" component="h3">
                                {category.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {category.description}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Container>

            {/* Courses Section */}
            <Container maxWidth="lg" className="py-12">
                <div className="flex justify-between items-center mb-6">
                    <Typography variant="h4" component="h2">
                        Featured Courses
                    </Typography>
                    <div className="flex gap-2">
                        <IconButton onClick={() => scroll(courseRef, 'left')}>
                            <ChevronLeftIcon />
                        </IconButton>
                        <IconButton onClick={() => scroll(courseRef, 'right')}>
                            <ChevronRightIcon />
                        </IconButton>
                    </div>
                </div>

                <Box
                    ref={courseRef}
                    className="flex overflow-x-hidden scroll-smooth gap-4 pb-4"
                    sx={{
                        '&::-webkit-scrollbar': { display: 'none' },
                        scrollbarWidth: 'none',
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
        </div>
    );
}
