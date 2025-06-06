"use client";

import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Avatar,
    Grid,
} from "@mui/material";
import {
    Star,
    People,
    AccessTime,
    CalendarMonth,
    Language,
} from "@mui/icons-material";
import { ICourse } from "../../../../types/entities";

const formatDuration = (minutes?: number) => {
    if (!minutes) return "N/A";
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    return remaining > 0
        ? `${hours}h ${remaining}m`
        : `${hours} hour${hours > 1 ? "s" : ""}`;
};

const formatDate = (date?: Date) =>
    date
        ? new Date(date).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
          })
        : "N/A";

interface ICourseOverview {
    course?: ICourse;
}

export default function CourseOverview({ course }: ICourseOverview) {
    return (
        <Box
            className="h-96 overflow-y-auto pr-2"
            sx={{ scrollbarWidth: "thin" }}
        >
            <Box className="p-6 space-y-8">
                {/* Header */}
                <Box className="space-y-4">
                    <Box className="flex flex-wrap gap-2">
                        {course?.categories?.map((cat) => (
                            <Chip
                                key={cat?.id}
                                label={cat?.name ?? "Unknown"}
                                variant="outlined"
                                size="small"
                            />
                        ))}
                    </Box>

                    <Typography variant="h4" fontWeight={700}>
                        {course?.title ?? "Untitled Course"}
                    </Typography>

                    <Box className="flex flex-wrap items-center gap-6 text-gray-600">
                        <Box className="flex items-center gap-1">
                            <Typography
                                variant="body1"
                                fontWeight={600}
                                color="orange"
                            >
                                {course?.average_rating ?? "N/A"}
                            </Typography>
                            <Star fontSize="small" color="warning" />
                            <Typography variant="body2">
                                {course?.total_reviews?.toLocaleString?.() ?? 0}{" "}
                                ratings
                            </Typography>
                        </Box>
                        <Box className="flex items-center gap-1">
                            <People fontSize="small" />
                            <Typography variant="body2">
                                {course?.total_students?.toLocaleString?.() ??
                                    0}{" "}
                                students
                            </Typography>
                        </Box>
                        <Box className="flex items-center gap-1">
                            <AccessTime fontSize="small" />
                            <Typography variant="body2">
                                {formatDuration(course?.duration)}
                            </Typography>
                        </Box>
                    </Box>

                    <Box className="flex flex-wrap gap-6 text-sm text-gray-600">
                        <Box className="flex items-center gap-1">
                            <CalendarMonth fontSize="small" />
                            <span>
                                Last updated {formatDate(course?.last_updated)}
                            </span>
                        </Box>
                        <Box className="flex items-center gap-1">
                            <Language fontSize="small" />
                            <span>{course?.language ?? "N/A"}</span>
                        </Box>
                    </Box>
                </Box>

                {/* Body */}
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        {/* Instructor */}
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Instructor
                                </Typography>
                                <Box display="flex" gap={2} alignItems="center">
                                    <Avatar
                                        src={
                                            course?.instructor?.avatar_url ??
                                            course?.instructor
                                                ?.profile_picture ??
                                            ""
                                        }
                                        sx={{ width: 64, height: 64 }}
                                    >
                                        {course?.instructor?.name
                                            ?.split(" ")
                                            ?.map((n) => n[0])
                                            ?.join("") ?? "NA"}
                                    </Avatar>
                                    <Box>
                                        <Typography fontWeight={600}>
                                            {course?.instructor?.name ??
                                                "Unknown"}
                                        </Typography>
                                        {course?.instructor?.bio && (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {course.instructor.bio}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Stats */}
                        <Card className="mt-4">
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    By the numbers
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2">
                                            <strong>Skill level:</strong>{" "}
                                            Beginner Level
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Students:</strong>{" "}
                                            {course?.total_students?.toLocaleString?.() ??
                                                0}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Languages:</strong>{" "}
                                            {course?.language ?? "N/A"}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2">
                                            <strong>Lectures:</strong>{" "}
                                            {course?.sections?.length ?? 0}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Video:</strong>{" "}
                                            {formatDuration(course?.duration)}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Captions:</strong> Yes
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <Card className="mt-4">
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Description
                                </Typography>
                                {course?.description ?? (
                                    <Typography>No description</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
