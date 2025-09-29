"use client";

import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Avatar,
    Grid,
    LinearProgress,
    Divider,
    Paper,
    Stack,
    Rating,
} from "@mui/material";
import {
    Star,
    People,
    AccessTime,
    CalendarMonth,
    Language,
    School,
    PlayCircleOutline,
    TrendingUp,
} from "@mui/icons-material";
import { ICourse } from "../../../../types/entities";

const formatLectureCount = (course?: ICourse) => {
    if (!course?.sections) return "0 lectures";
    const totalLectures = course.sections.reduce((total, section) => total + section.lectures.length, 0);
    return `${totalLectures} lecture${totalLectures !== 1 ? "s" : ""}`;
};

const formatDate = (date?: Date | string) => {
    if (!date) return "N/A";
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
};

interface ICourseOverview {
    course?: ICourse;
}

export default function CourseOverview({ course }: ICourseOverview) {
    return (
        <Box
            className="h-96 overflow-y-auto pr-2"
            sx={{ 
                scrollbarWidth: "thin",
                '&::-webkit-scrollbar': {
                    width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#888',
                    borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: '#555',
                },
                '& > div': {
                    animation: 'fadeInUp 0.6s ease-out',
                },
                '@keyframes fadeInUp': {
                    from: {
                        opacity: 0,
                        transform: 'translateY(30px)',
                    },
                    to: {
                        opacity: 1,
                        transform: 'translateY(0)',
                    },
                },
            }}
        >
            <Box className="p-6 space-y-6">
                {/* Header */}
                <Paper 
                    elevation={0} 
                    sx={{ 
                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                        borderRadius: 3,
                        p: 4,
                        color: 'white'
                    }}
                >
                    <Box className="space-y-4">
                        <Box className="flex flex-wrap gap-2">
                            {course?.categories?.map((cat) => (
                                <Chip
                                    key={cat?.id}
                                    label={cat?.name ?? "Unknown"}
                                    size="small"
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        color: 'white',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                        }
                                    }}
                                />
                            ))}
                        </Box>

                        <Typography 
                            variant="h4" 
                            fontWeight={700}
                            sx={{
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                lineHeight: 1.2
                            }}
                        >
                            {course?.title ?? "Untitled Course"}
                        </Typography>

                        <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ mt: 3 }}>
                            <Box className="flex items-center gap-2">
                                <Rating 
                                    value={course?.average_rating ?? 0} 
                                    readOnly 
                                    size="small"
                                    sx={{ color: '#FFD700' }}
                                />
                                <Typography
                                    variant="body1"
                                    fontWeight={600}
                                    sx={{ color: '#FFD700' }}
                                >
                                    {course?.average_rating ?? "N/A"}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    ({course?.total_reviews?.toLocaleString?.() ?? 0} reviews)
                                </Typography>
                            </Box>
                            <Box className="flex items-center gap-2">
                                <People fontSize="small" sx={{ opacity: 0.8 }} />
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    {course?.total_students?.toLocaleString?.() ?? 0} students
                                </Typography>
                            </Box>
                            <Box className="flex items-center gap-2">
                                <AccessTime fontSize="small" sx={{ opacity: 0.8 }} />
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    {formatLectureCount(course)}
                                </Typography>
                            </Box>
                        </Stack>

                        <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ mt: 2, opacity: 0.8 }}>
                            <Box className="flex items-center gap-2">
                                <CalendarMonth fontSize="small" />
                                <Typography variant="body2">
                                    Updated {formatDate(course?.last_updated)}
                                </Typography>
                            </Box>
                            <Box className="flex items-center gap-2">
                                <Language fontSize="small" />
                                <Typography variant="body2">
                                    {course?.language ?? "N/A"}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Paper>

                {/* Body */}
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        {/* Instructor */}
                        <Card 
                            elevation={2}
                            sx={{
                                borderRadius: 3,
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                }
                            }}
                        >
                            <Box 
                                sx={{
                                    background: 'linear-gradient(45deg, #f8f9fa, #e9ecef)',
                                    p: 1
                                }}
                            >
                                <CardContent sx={{ pb: '16px !important' }}>
                                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                                        <School color="primary" />
                                        <Typography variant="h6" fontWeight={600} color="primary">
                                            Meet Your Instructor
                                        </Typography>
                                    </Box>
                                    <Box display="flex" gap={3} alignItems="center">
                                        <Avatar
                                            src={course?.instructor?.avatar_url || ""}
                                            sx={{ 
                                                width: 80, 
                                                height: 80,
                                                border: '3px solid #fff',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                fontSize: '1.5rem',
                                                fontWeight: 600
                                            }}
                                        >
                                            {course?.instructor?.name
                                                ?.split(" ")
                                                ?.map((n) => n[0])
                                                ?.join("") ?? "NA"}
                                        </Avatar>
                                        <Box flex={1}>
                                            <Typography 
                                                variant="h6" 
                                                fontWeight={600}
                                                color="text.primary"
                                                gutterBottom
                                            >
                                                {course?.instructor?.name ?? "Unknown"}
                                            </Typography>
                                            {course?.instructor?.bio && (
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ 
                                                        lineHeight: 1.6,
                                                        maxHeight: '3.2em',
                                                        overflow: 'hidden',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                    }}
                                                >
                                                    {course.instructor.bio}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Box>
                        </Card>

                        {/* Stats */}
                        <Card 
                            className="mt-4"
                            elevation={2}
                            sx={{
                                borderRadius: 3,
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                }
                            }}
                        >
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={1} mb={3}>
                                    <TrendingUp color="primary" />
                                    <Typography variant="h6" fontWeight={600} color="primary">
                                        Course Statistics
                                    </Typography>
                                </Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={2}>
                                            <Box>
                                                <Typography 
                                                    variant="caption" 
                                                    color="text.secondary"
                                                    sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
                                                >
                                                    Price
                                                </Typography>
                                                <Typography variant="h6" fontWeight={600} color="primary">
                                                    ${course?.price ?? 0}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography 
                                                    variant="caption" 
                                                    color="text.secondary"
                                                    sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
                                                >
                                                    Students Enrolled
                                                </Typography>
                                                <Typography variant="h6" fontWeight={600} color="primary">
                                                    {course?.total_students?.toLocaleString?.() ?? 0}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography 
                                                    variant="caption" 
                                                    color="text.secondary"
                                                    sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
                                                >
                                                    Language
                                                </Typography>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Language fontSize="small" color="action" />
                                                    <Typography variant="body1" fontWeight={500}>
                                                        {course?.language ?? "N/A"}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={2}>
                                            <Box>
                                                <Typography 
                                                    variant="caption" 
                                                    color="text.secondary"
                                                    sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
                                                >
                                                    Total Sections
                                                </Typography>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <PlayCircleOutline fontSize="small" color="action" />
                                                    <Typography variant="h6" fontWeight={600} color="primary">
                                                        {course?.sections?.length ?? 0}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box>
                                                <Typography 
                                                    variant="caption" 
                                                    color="text.secondary"
                                                    sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
                                                >
                                                    Total Lectures
                                                </Typography>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <AccessTime fontSize="small" color="action" />
                                                    <Typography variant="body1" fontWeight={500}>
                                                        {formatLectureCount(course)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box>
                                                <Typography 
                                                    variant="caption" 
                                                    color="text.secondary"
                                                    sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
                                                >
                                                    Created Date
                                                </Typography>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {formatDate(course?.date_created)}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <Card 
                            className="mt-4"
                            elevation={2}
                            sx={{
                                borderRadius: 3,
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                }
                            }}
                        >
                            <CardContent>
                                <Typography 
                                    variant="h6" 
                                    fontWeight={600} 
                                    color="primary"
                                    gutterBottom
                                    sx={{ mb: 3 }}
                                >
                                    About This Course
                                </Typography>
                                <Divider sx={{ mb: 3 }} />
                                {course?.description ? (
                                    <Typography 
                                        variant="body1"
                                        sx={{
                                            lineHeight: 1.8,
                                            color: 'text.primary',
                                            fontSize: '1rem',
                                            '& p': {
                                                mb: 2,
                                            }
                                        }}
                                        component="div"
                                        dangerouslySetInnerHTML={{
                                            __html: course.description.replace(/\n/g, '<br />')
                                        }}
                                    />
                                ) : (
                                    <Box 
                                        sx={{
                                            textAlign: 'center',
                                            py: 4,
                                            color: 'text.secondary',
                                            fontStyle: 'italic'
                                        }}
                                    >
                                        <Typography variant="body1">
                                            No description available for this course.
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
