"use client";

import { EnrolledCourse } from "@/app/[locale]/my-learning/page";
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Chip,
    LinearProgress,
    Avatar,
    Box,
    Grid,
    Container,
    Paper,
    Fade,
    Grow,
    IconButton,
    Tooltip,
} from "@mui/material";
import {
    Star,
    Clock,
    Calendar,
    BookOpen,
    PlayCircle,
    TrendingUp,
    Award,
    Users,
} from "lucide-react";
import Link from "next/link";
import { slugify } from "../../../utils/utils";

interface MyLearningProps {
    enrolledCourses: EnrolledCourse[];
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function formatPrice(price: number) {
    if (price === 0) return "Free";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price / 100); // Assuming price is in cents
}

function getProgressStatus(progress: number) {
    if (progress === 0) return { text: "Not Started", color: "bg-gray-500" };
    if (progress < 50) return { text: "In Progress", color: "bg-blue-500" };
    if (progress < 100) return { text: "Almost Done", color: "bg-orange-500" };
    return { text: "Completed", color: "bg-green-500" };
}

export default function MyLearning({ enrolledCourses }: MyLearningProps) {
    const totalCourses = enrolledCourses.length;
    const completedCourses = enrolledCourses.filter(
        (course) => course.progress === 100
    ).length;
    const inProgressCourses = enrolledCourses.filter(
        (course) => course.progress > 0 && course.progress < 100
    ).length;

    return (
        <Box className="min-h-screen bg-gray-50 py-8">
            <Container maxWidth="xl">
                {/* Header */}
                <Box className="mb-8">
                    <Typography
                        variant="h3"
                        className="font-bold text-gray-900 mb-2"
                    >
                        My Learning
                    </Typography>
                    <Typography variant="body1" className="text-gray-600">
                        Continue your learning journey
                    </Typography>
                </Box>

                {/* Stats */}
                <Grid container spacing={2} className="mt-6 mb-8">
                    <Grid item xs={12} sm={4}>
                        <Paper className="p-4 shadow-sm">
                            <Box className="flex items-center">
                                <BookOpen className="h-8 w-8 text-blue-500" />
                                <Box className="ml-3">
                                    <Typography
                                        variant="body2"
                                        className="font-medium text-gray-500"
                                    >
                                        Total Courses
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        className="font-bold text-gray-900"
                                    >
                                        {totalCourses}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper className="p-4 shadow-sm">
                            <Box className="flex items-center">
                                <Clock className="h-8 w-8 text-orange-500" />
                                <Box className="ml-3">
                                    <Typography
                                        variant="body2"
                                        className="font-medium text-gray-500"
                                    >
                                        In Progress
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        className="font-bold text-gray-900"
                                    >
                                        {inProgressCourses}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper className="p-4 shadow-sm">
                            <Box className="flex items-center">
                                <Star className="h-8 w-8 text-green-500" />
                                <Box className="ml-3">
                                    <Typography
                                        variant="body2"
                                        className="font-medium text-gray-500"
                                    >
                                        Completed
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        className="font-bold text-gray-900"
                                    >
                                        {completedCourses}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Course Grid */}
                <Grid container spacing={3}>
                    {enrolledCourses.map((course) => {
                        const progressStatus = getProgressStatus(
                            course.progress
                        );

                        return (
                            <Grid item xs={12} md={6} lg={4} key={course.id}>
                                <Link href={`/my-learning/${slugify(course.title)}?id=${course.id}`}>
                                    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full">
                                        <Box className="relative">
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={
                                                    course.thumbnail_url ||
                                                    `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(
                                                        course.title
                                                    )}`
                                                }
                                                alt={course.title}
                                                className="h-48 object-cover"
                                            />
                                            <Box className="absolute top-3 right-3">
                                                <Chip
                                                    label={progressStatus.text}
                                                    size="small"
                                                    className={`${progressStatus.color} text-white`}
                                                />
                                            </Box>
                                            {course.price > 0 && (
                                                <Box className="absolute top-3 left-3">
                                                    <Chip
                                                        label={formatPrice(
                                                            course.price
                                                        )}
                                                        variant="outlined"
                                                        size="small"
                                                        className="bg-white"
                                                    />
                                                </Box>
                                            )}
                                        </Box>

                                        <CardContent className="flex-1 space-y-4">
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    className="line-clamp-2 mb-2"
                                                >
                                                    {course.title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    className="text-gray-600 line-clamp-2"
                                                >
                                                    {course.description}
                                                </Typography>
                                            </Box>

                                            {/* Progress */}
                                            <Box className="space-y-2">
                                                <Box className="flex justify-between">
                                                    <Typography
                                                        variant="body2"
                                                        className="text-gray-600"
                                                    >
                                                        Progress
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        className="font-medium"
                                                    >
                                                        {course.progress}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={course.progress}
                                                    className="h-2"
                                                />
                                                {course.lectureProgress > 0 && (
                                                    <Typography
                                                        variant="caption"
                                                        className="text-gray-500"
                                                    >
                                                        {course.lectureProgress}{" "}
                                                        lecture
                                                        {course.lectureProgress !==
                                                        1
                                                            ? "s"
                                                            : ""}{" "}
                                                        completed
                                                    </Typography>
                                                )}
                                            </Box>

                                            {/* Instructor */}
                                            {course.instructor && (
                                                <Box className="flex items-center space-x-2">
                                                    <Avatar
                                                        src={
                                                            course.instructor
                                                                .avatar_url ||
                                                            undefined
                                                        }
                                                        className="w-6 h-6"
                                                    >
                                                        {course.instructor.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </Avatar>
                                                    <Typography
                                                        variant="body2"
                                                        className="text-gray-600"
                                                    >
                                                        {course.instructor.name}
                                                    </Typography>
                                                </Box>
                                            )}

                                            {/* Rating */}
                                            {course.average_rating > 0 && (
                                                <Box className="flex items-center space-x-1">
                                                    <Box className="flex items-center">
                                                        {[...Array(5)].map(
                                                            (_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-4 w-4 ${
                                                                        i <
                                                                        Math.floor(
                                                                            course.average_rating
                                                                        )
                                                                            ? "text-yellow-400 fill-current"
                                                                            : "text-gray-300"
                                                                    }`}
                                                                />
                                                            )
                                                        )}
                                                    </Box>
                                                    <Typography
                                                        variant="body2"
                                                        className="text-gray-600"
                                                    >
                                                        {course.average_rating}{" "}
                                                        ({course.total_reviews}{" "}
                                                        review
                                                        {course.total_reviews !==
                                                        1
                                                            ? "s"
                                                            : ""}
                                                        )
                                                    </Typography>
                                                </Box>
                                            )}

                                            {/* Categories */}
                                            {course.categories.length > 0 && (
                                                <Box className="flex flex-wrap gap-1">
                                                    {course.categories.map(
                                                        (category) => (
                                                            <Chip
                                                                key={
                                                                    category.id
                                                                }
                                                                label={
                                                                    category.name
                                                                }
                                                                variant="outlined"
                                                                size="small"
                                                            />
                                                        )
                                                    )}
                                                </Box>
                                            )}

                                            {/* Enrollment Date */}
                                            <Box className="flex items-center">
                                                <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                                                <Typography
                                                    variant="caption"
                                                    className="text-gray-500"
                                                >
                                                    Enrolled on{" "}
                                                    {formatDate(
                                                        course.dateEnrolled.toString()
                                                    )}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Grid>
                        );
                    })}
                </Grid>

                {/* Empty State */}
                {enrolledCourses.length === 0 && (
                    <Box className="text-center py-12">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <Typography
                            variant="h5"
                            className="font-medium text-gray-900 mb-2"
                        >
                            No courses yet
                        </Typography>
                        <Typography variant="body1" className="text-gray-600">
                            Start learning by enrolling in your first course!
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
