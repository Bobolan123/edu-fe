"use client";

import { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Tabs,
    Tab,
    Chip,
    LinearProgress,
    Grid,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Button,
} from "@mui/material";
import {
    People,
    Star,
    MonetizationOn,
    AccessTime,
    Event,
    BarChart,
    TrendingUp,
    PlayArrow,
} from "@mui/icons-material";
import { ICourse, ICourseContent } from "../../../../types/entities";
import CourseContentTab from "./CourseContentTab";

interface ManageDetailCourseProps {
    course: ICourse;
    courseContent: ICourseContent | undefined;
}
const student = {
    name: "Student 1",
    email: "student1@example.com",
    completionPercentage: 64,
    enrolledDaysAgo: 9,
};

const review = {
    studentName: "Student 1",
    rating: 4,
    comment:
        "Excellent course! The instructor explains complex concepts clearly...",
    daysAgo: 9,
};

export default function ManageDetailCourse({
    course,
    courseContent,
}: ManageDetailCourseProps) {
    const [activeTab, setActiveTab] = useState(0);

    const totalDurationHours = Math.floor(course.duration / 60);
    const totalDurationMinutes = course.duration % 60;
    const totalLectures = courseContent?.sections.reduce(
        (acc, section) => acc + section.totalLectures,
        0
    );

    const handleTabChange = (_: any, newValue: number) =>
        setActiveTab(newValue);

    return (
        <Box className="bg-gray-50 min-h-screen p-6">
            <Box className="max-w-7xl mx-auto space-y-6">
                <Card>
                    <CardContent>
                        <Box className="flex flex-col md:flex-row justify-between gap-6">
                            <Box className="flex gap-4">
                                <img
                                    src={
                                        course.thumbnail_url ||
                                        "/placeholder.svg"
                                    }
                                    alt={course.title}
                                    className="w-32 h-24 object-cover rounded border"
                                />
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        {course.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {course.description}
                                    </Typography>
                                    <Box className="flex gap-2 mt-2 text-sm text-gray-500">
                                        <Event fontSize="small" />{" "}
                                        {new Date(
                                            course.date_created
                                        ).toLocaleDateString()}
                                        <AccessTime fontSize="small" />{" "}
                                        {totalDurationHours}h{" "}
                                        {totalDurationMinutes}m
                                        <BarChart fontSize="small" />{" "}
                                        {totalLectures} lectures
                                    </Box>
                                    <Box className="flex gap-2 mt-2">
                                        {course.categories.map((cat) => (
                                            <Chip
                                                key={cat.id}
                                                label={cat.name}
                                                size="small"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                            <Box className="text-right space-y-2">
                                <Typography variant="h6" color="green">
                                    ${course.price}
                                </Typography>
                                <Box className="flex items-center gap-1">
                                    <Star
                                        fontSize="small"
                                        sx={{ color: "gold" }}
                                    />
                                    <Typography>
                                        {course.average_rating}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        ({course.total_reviews} reviews)
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <Card className="h-full">
                            <CardHeader
                                title="Total Students"
                                avatar={<People />}
                            />
                            <CardContent>
                                <Typography variant="h6">
                                    {course.enrollments?.length.toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Card className="h-full">
                            <CardHeader
                                title="Revenue"
                                avatar={<MonetizationOn />}
                            />
                            <CardContent>
                                <Typography variant="h6">
                                    $
                                    {(
                                        course.enrollments?.length *
                                            course.price || 0
                                    ).toLocaleString()}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    <TrendingUp
                                        fontSize="small"
                                        className="inline mr-1"
                                    />
                                    +8% from last month
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Card className="h-full">
                            <CardHeader
                                title="Completion Rate"
                                avatar={<BarChart />}
                            />
                            <CardContent>
                                <Typography variant="h6">78%</Typography>
                                <LinearProgress
                                    value={78}
                                    variant="determinate"
                                    className="mt-2"
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Card className="h-full">
                            <CardHeader title="Avg. Rating" avatar={<Star />} />
                            <CardContent>
                                <Typography variant="h6">
                                    {course.average_rating}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    From {course.total_reviews} reviews
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                >
                    <Tab label="Overview" value={0} />
                    <Tab label="Content" value={1} />
                    <Tab label="Students" value={2} />
                    <Tab label="Reviews" value={3} />
                    <Tab label="Settings" value={4} />
                </Tabs>

                {activeTab === 0 && (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Course Information
                            </Typography>

                            {/* Instructor Info */}
                            <Box className="flex items-center gap-3 mb-4">
                                <Avatar
                                    src={
                                        course.instructor?.avatar_url ||
                                        "/placeholder.svg"
                                    }
                                />
                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                    >
                                        Instructor
                                    </Typography>
                                    <Typography>
                                        {course.instructor?.name}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Duration */}
                            <Box className="mb-3">
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Duration
                                </Typography>
                                <Typography>
                                    {Math.floor(course.duration / 60)}h{" "}
                                    {course.duration % 60}m
                                </Typography>
                            </Box>

                            {/* Last Updated */}
                            <Box className="mb-3">
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Last Updated
                                </Typography>
                                <Typography>
                                    {new Date(
                                        course.last_updated
                                    ).toLocaleDateString()}
                                </Typography>
                            </Box>

                            {/* Price */}
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Price
                                </Typography>
                                <Typography
                                    sx={{ color: "green", fontWeight: "bold" }}
                                >
                                    ${course?.price}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 1 && courseContent ? (
                    <CourseContentTab
                        sections={courseContent.sections}
                        courseId={course.id}
                    />
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        Course content is not available or failed to load.
                    </Typography>
                )}

                {activeTab === 2 && (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Enrolled Students
                            </Typography>

                            <Box className="flex justify-between items-center p-4 border rounded mb-2 bg-white">
                                <Box className="flex items-center gap-4">
                                    <Avatar />
                                    <Box>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                        >
                                            {student.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {student.email}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box className="text-right">
                                    <Typography
                                        variant="body2"
                                        fontWeight="bold"
                                    >
                                        {student.completionPercentage}% Complete
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Enrolled {student.enrolledDaysAgo} days
                                        ago
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 3 && (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Student Reviews ({course.reviews.length})
                            </Typography>

                            <Box className="flex gap-4 py-4 border-b">
                                <Avatar />
                                <Box>
                                    <Box className="flex items-center gap-2">
                                        <Typography fontWeight="bold">
                                            {review.studentName}
                                        </Typography>
                                        <Box className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i}>
                                                    {i < review.rating
                                                        ? "⭐"
                                                        : "☆"}
                                                </span>
                                            ))}
                                        </Box>
                                    </Box>
                                    <Typography className="mt-1">
                                        {review.comment}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        className="mt-1 block"
                                    >
                                        {review.daysAgo} days ago
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 4 && (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Course Settings
                            </Typography>

                            {/* Thumbnail Section */}
                            <Box className="flex items-center gap-4 mb-6">
                                <Avatar
                                    src={
                                        course.thumbnail_url ||
                                        "/img_not_found.png"
                                    }
                                    variant="square"
                                    sx={{ width: 80, height: 80 }}
                                />
                                <button className="border px-4 py-1 rounded hover:bg-gray-100">
                                    Change Thumbnail
                                </button>
                            </Box>

                            {/* Visibility Settings
                            <Divider />
                            <Box mt={4}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Visibility Settings
                                </Typography>
                                <Box className="flex justify-between items-center mb-2">
                                    <Typography>Course is published</Typography>
                                    <Chip
                                        label={
                                            course.isPublished
                                                ? "Published"
                                                : "Unpublished"
                                        }
                                        color="default"
                                    />
                                </Box>
                                <Box className="flex justify-between items-center">
                                    <Typography>
                                        Allow new enrollments
                                    </Typography>
                                    <Chip
                                        label={
                                            course.allowEnrollments
                                                ? "Enabled"
                                                : "Disabled"
                                        }
                                        color="default"
                                    />
                                </Box>
                            </Box> */}

                            {/* Danger Zone */}
                            <Divider sx={{ my: 4 }} />
                            <Typography
                                variant="subtitle1"
                                color="error"
                                gutterBottom
                            >
                                Danger Zone
                            </Typography>
                            <Box className="bg-red-50 p-4 rounded border border-red-200">
                                <Typography
                                    variant="body2"
                                    color="error"
                                    gutterBottom
                                >
                                    Deleting this course will permanently remove
                                    all content, student progress, and cannot be
                                    undone.
                                </Typography>
                                <button
                                    className="bg-red-600 text-white px-4 py-2 mt-2 rounded hover:bg-red-700"
                                    onClick={() =>
                                        console.log("Delete course logic")
                                    }
                                >
                                    Delete Course
                                </button>
                            </Box>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </Box>
    );
}
