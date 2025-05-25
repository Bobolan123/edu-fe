"use client";

import type React from "react";

import {
    BookOpen,
    GraduationCap,
    MoreHorizontal,
    Plus,
    Search,
    Users,
    Star,
    Clock,
    DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

import {
    Card,
    CardContent,
    Button,
    TextField,
    Chip,
    Menu,
    MenuItem,
    IconButton,
    Typography,
    Grid,
    Avatar,
    InputAdornment,
    AppBar,
    Toolbar,
    Container,
    Box,
    Rating,
} from "@mui/material";

interface Course {
    id: number;
    title: string;
    description: string;
    duration: number; // in hours
    date_created: string;
    last_updated: string;
    price: number;
    average_rating: number;
    total_reviews: number;
    thumbnail_url: string;
    enrollments: { id: number }[]; // simplified enrollment data
    categories: { id: number; name: string }[];
    instructor: {
        id: number;
        name: string;
    };
}

export default function ManageMyCourses(params:any) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

    const handleMenuClick = (
        event: React.MouseEvent<HTMLElement>,
        courseId: number
    ) => {
        setAnchorEl(event.currentTarget);
        setSelectedCourse(courseId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedCourse(null);
    };

    // Sample course data based on the TypeORM entity
    const courses: Course[] = [
        {
            id: 1,
            title: "Introduction to Computer Science",
            description:
                "A comprehensive introduction to programming concepts, algorithms, and data structures using Python.",
            duration: 40,
            date_created: "2024-08-15T10:00:00Z",
            last_updated: "2024-12-20T14:30:00Z",
            price: 199.99,
            average_rating: 4.7,
            total_reviews: 156,
            thumbnail_url: "/placeholder.svg?height=200&width=300",
            enrollments: Array.from({ length: 45 }, (_, i) => ({ id: i + 1 })),
            categories: [
                { id: 1, name: "Programming" },
                { id: 2, name: "Computer Science" },
            ],
            instructor: { id: 1, name: "Dr. Sarah Johnson" },
        },
        {
            id: 2,
            title: "Advanced Web Development",
            description:
                "Master modern web development with React, Node.js, and advanced JavaScript concepts.",
            duration: 60,
            date_created: "2024-07-20T09:00:00Z",
            last_updated: "2024-12-19T16:45:00Z",
            price: 299.99,
            average_rating: 4.9,
            total_reviews: 89,
            thumbnail_url: "/placeholder.svg?height=200&width=300",
            enrollments: Array.from({ length: 28 }, (_, i) => ({ id: i + 1 })),
            categories: [
                { id: 3, name: "Web Development" },
                { id: 4, name: "JavaScript" },
            ],
            instructor: { id: 1, name: "Dr. Sarah Johnson" },
        },
        {
            id: 3,
            title: "Database Systems",
            description:
                "Learn database design, SQL, and modern database management systems including NoSQL solutions.",
            duration: 35,
            date_created: "2024-06-10T11:30:00Z",
            last_updated: "2024-12-18T13:20:00Z",
            price: 249.99,
            average_rating: 4.5,
            total_reviews: 67,
            thumbnail_url: "/placeholder.svg?height=200&width=300",
            enrollments: Array.from({ length: 32 }, (_, i) => ({ id: i + 1 })),
            categories: [
                { id: 5, name: "Database" },
                { id: 6, name: "SQL" },
            ],
            instructor: { id: 1, name: "Dr. Sarah Johnson" },
        },
        {
            id: 4,
            title: "Software Engineering",
            description:
                "Comprehensive software engineering principles, design patterns, and project management.",
            duration: 50,
            date_created: "2024-05-05T08:15:00Z",
            last_updated: "2024-12-17T10:10:00Z",
            price: 349.99,
            average_rating: 4.8,
            total_reviews: 124,
            thumbnail_url: "/placeholder.svg?height=200&width=300",
            enrollments: Array.from({ length: 38 }, (_, i) => ({ id: i + 1 })),
            categories: [
                { id: 7, name: "Software Engineering" },
                { id: 8, name: "Project Management" },
            ],
            instructor: { id: 1, name: "Dr. Sarah Johnson" },
        },
        {
            id: 5,
            title: "Data Structures & Algorithms",
            description:
                "Master essential data structures and algorithms for technical interviews and efficient programming.",
            duration: 45,
            date_created: "2024-04-12T12:00:00Z",
            last_updated: "2024-12-16T15:30:00Z",
            price: 279.99,
            average_rating: 4.6,
            total_reviews: 203,
            thumbnail_url: "/placeholder.svg?height=200&width=300",
            enrollments: Array.from({ length: 52 }, (_, i) => ({ id: i + 1 })),
            categories: [
                { id: 9, name: "Algorithms" },
                { id: 10, name: "Data Structures" },
            ],
            instructor: { id: 1, name: "Dr. Sarah Johnson" },
        },
        {
            id: 6,
            title: "Mobile App Development",
            description:
                "Build cross-platform mobile applications using React Native and modern development tools.",
            duration: 55,
            date_created: "2024-03-18T14:45:00Z",
            last_updated: "2024-12-15T11:20:00Z",
            price: 329.99,
            average_rating: 4.4,
            total_reviews: 78,
            thumbnail_url: "/placeholder.svg?height=200&width=300",
            enrollments: Array.from({ length: 24 }, (_, i) => ({ id: i + 1 })),
            categories: [
                { id: 11, name: "Mobile Development" },
                { id: 12, name: "React Native" },
            ],
            instructor: { id: 1, name: "Dr. Sarah Johnson" },
        },
    ];

    const totalStudents = courses.reduce(
        (sum, course) => sum + course.enrollments.length,
        0
    );
    const totalRevenue = courses.reduce(
        (sum, course) => sum + course.price * course.enrollments.length,
        0
    );
    const averageRating =
        courses.reduce((sum, course) => sum + course.average_rating, 0) /
        courses.length;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-gray-50">
            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 lg:p-8">
                <Container maxWidth="xl">
                    {/* Page Header */}
                    <div className="flex flex-col gap-4 mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <Typography
                                    variant="h3"
                                    component="h1"
                                    className="font-bold tracking-tight mb-2"
                                >
                                    My Courses
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    Manage and track your course portfolio
                                </Typography>
                            </div>
                            <Button
                                variant="contained"
                                startIcon={<Plus className="w-4 h-4" />}
                                sx={{ textTransform: "none" }}
                            >
                                Create New Course
                            </Button>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <TextField
                                placeholder="Search courses..."
                                variant="outlined"
                                size="small"
                                className="flex-1 bg-white"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search className="w-4 h-4 text-gray-400" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <div className="flex gap-2">
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ textTransform: "none" }}
                                >
                                    All Categories
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ textTransform: "none" }}
                                >
                                    Sort by Rating
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Course Stats */}
                    <Grid container spacing={3} className="mb-8">
                        <Grid item xs={12} sm={6} md={3}>
                            <Card className="h-full">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            className="font-medium"
                                        >
                                            Total Courses
                                        </Typography>
                                        <BookOpen className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <Typography
                                        variant="h4"
                                        component="div"
                                        className="font-bold mb-1"
                                    >
                                        {courses.length}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Active courses
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card className="h-full">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            className="font-medium"
                                        >
                                            Total Students
                                        </Typography>
                                        <Users className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <Typography
                                        variant="h4"
                                        component="div"
                                        className="font-bold mb-1"
                                    >
                                        {totalStudents}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Enrolled students
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card className="h-full">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            className="font-medium"
                                        >
                                            Total Revenue
                                        </Typography>
                                        <DollarSign className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <Typography
                                        variant="h4"
                                        component="div"
                                        className="font-bold mb-1"
                                    >
                                        {formatCurrency(totalRevenue)}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        From all courses
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card className="h-full">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            className="font-medium"
                                        >
                                            Avg. Rating
                                        </Typography>
                                        <Star className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <Typography
                                        variant="h4"
                                        component="div"
                                        className="font-bold mb-1"
                                    >
                                        {averageRating.toFixed(1)}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Across all courses
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Courses Grid */}
                    <Grid container spacing={3}>
                        {courses.map((course) => (
                            <Grid item xs={12} md={6} lg={4} key={course.id}>
                                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                                    {/* Course Thumbnail */}
                                    <Box className="relative h-48 overflow-hidden">
                                        <Image
                                            src={
                                                course.thumbnail_url ||
                                                "/placeholder.svg"
                                            }
                                            alt={course.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <Box className="absolute top-2 right-2">
                                            <IconButton
                                                size="small"
                                                onClick={(e) =>
                                                    handleMenuClick(
                                                        e,
                                                        course.id
                                                    )
                                                }
                                                sx={{
                                                    backgroundColor:
                                                        "rgba(255,255,255,0.9)",
                                                }}
                                            >
                                                <MoreHorizontal className="w-4 h-4" />
                                            </IconButton>
                                        </Box>
                                        <Box className="absolute bottom-2 left-2">
                                            <Chip
                                                label={formatCurrency(
                                                    course.price
                                                )}
                                                size="small"
                                                sx={{
                                                    backgroundColor:
                                                        "rgba(0,0,0,0.7)",
                                                    color: "white",
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    <CardContent className="p-4">
                                        <div className="space-y-3">
                                            {/* Course Title */}
                                            <Typography
                                                variant="h6"
                                                component="h3"
                                                className="leading-tight font-semibold"
                                            >
                                                {course.title}
                                            </Typography>

                                            {/* Course Description */}
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                className="line-clamp-2"
                                            >
                                                {course.description}
                                            </Typography>

                                            {/* Categories */}
                                            <div className="flex flex-wrap gap-1">
                                                {course.categories
                                                    .slice(0, 2)
                                                    .map((category) => (
                                                        <Chip
                                                            key={category.id}
                                                            label={
                                                                category.name
                                                            }
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{
                                                                fontSize:
                                                                    "0.75rem",
                                                            }}
                                                        />
                                                    ))}
                                            </div>

                                            {/* Course Stats */}
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Rating
                                                        value={
                                                            course.average_rating
                                                        }
                                                        precision={0.1}
                                                        size="small"
                                                        readOnly
                                                    />
                                                    <Typography variant="caption">
                                                        {course.average_rating}{" "}
                                                        ({course.total_reviews})
                                                    </Typography>
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-500">
                                                    <Clock className="w-3 h-3" />
                                                    <Typography variant="caption">
                                                        {course.duration}h
                                                    </Typography>
                                                </div>
                                            </div>

                                            {/* Enrollment Info */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-gray-400" />
                                                    <Typography
                                                        variant="body2"
                                                        className="font-medium"
                                                    >
                                                        {
                                                            course.enrollments
                                                                .length
                                                        }{" "}
                                                        students
                                                    </Typography>
                                                </div>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Updated{" "}
                                                    {formatDate(
                                                        course.last_updated
                                                    )}
                                                </Typography>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    className="flex-1"
                                                    sx={{
                                                        textTransform: "none",
                                                    }}
                                                >
                                                    Manage Course
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        textTransform: "none",
                                                    }}
                                                >
                                                    Analytics
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                    >
                        <MenuItem onClick={handleMenuClose}>
                            Edit Course
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            View Analytics
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            Manage Enrollments
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            View Reviews
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            Course Settings
                        </MenuItem>
                        <MenuItem
                            onClick={handleMenuClose}
                            sx={{ color: "error.main" }}
                        >
                            Delete Course
                        </MenuItem>
                    </Menu>
                </Container>
            </main>
        </div>
    );
}
