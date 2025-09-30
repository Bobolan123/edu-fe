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
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Button,
    InputAdornment,
    Stack,
} from "@mui/material";
import {
    Star,
    PlayCircle,
    Search,
    RotateCcw,
    BookOpen,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { slugify } from "../../utils/utils";
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";

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

function formatPrice(price: number, t: any) {
    if (price === 0) return t("price_free");
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price / 100); // Assuming price is in cents
}

function getProgressStatus(progress: number, t: any) {
    if (progress === 0)
        return { text: t("status.not_started"), color: "bg-gray-500" };
    if (progress < 50)
        return { text: t("status.in_progress"), color: "bg-blue-500" };
    if (progress < 100)
        return { text: t("status.almost_done"), color: "bg-orange-500" };
    return { text: t("status.completed"), color: "bg-green-500" };
}

export default function MyLearning({ enrolledCourses }: MyLearningProps) {
    const t = useTranslations("MyLearning");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState("all");
    const [sortBy, setSortBy] = useState("recent");

    const totalCourses = enrolledCourses.length;
    const completedCourses = enrolledCourses.filter(
        (course) => course.progress === 100
    ).length;
    const inProgressCourses = enrolledCourses.filter(
        (course) => course.progress > 0 && course.progress < 100
    ).length;

    const filteredAndSortedCourses = useMemo(() => {
        let filtered = enrolledCourses.filter((course) => {
            const matchesSearch =
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                course.instructor?.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesFilter = (() => {
                switch (filterBy) {
                    case "completed":
                        return course.progress === 100;
                    case "in-progress":
                        return course.progress > 0 && course.progress < 100;
                    case "not-started":
                        return course.progress === 0;
                    default:
                        return true;
                }
            })();

            return matchesSearch && matchesFilter;
        });

        return filtered.sort((a, b) => {
            switch (sortBy) {
                case "alphabetical":
                    return a.title.localeCompare(b.title);
                case "progress":
                    return b.progress - a.progress;
                case "rating":
                    return b.average_rating - a.average_rating;
                case "recent":
                default:
                    return (
                        new Date(b.dateEnrolled).getTime() -
                        new Date(a.dateEnrolled).getTime()
                    );
            }
        });
    }, [enrolledCourses, searchTerm, filterBy, sortBy]);

    return (
        <Box className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-4">
            <Container maxWidth="xl">
                {/* Header */}
                <Box className="mb-6 text-center">
                    <Typography
                        variant="h3"
                        className="font-bold text-gray-900 mb-3"
                    >
                        {t("title")}
                    </Typography>
                    <Typography
                        variant="body1"
                        className="text-gray-600 mb-6 max-w-2xl mx-auto"
                        sx={{ margin: "0 auto" }}
                    >
                        {t("subtitle")}
                    </Typography>

                    {/* Search and Filters */}
                    <Paper
                        elevation={0}
                        className="p-4 mb-6 bg-white rounded-2xl border border-gray-200 shadow-sm"
                    >
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={2}
                        >
                            <TextField
                                placeholder={t("search_placeholder")}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                variant="outlined"
                                size="small"
                                className="flex-1"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "12px",
                                        backgroundColor: "#f9fafb",
                                        border: "1px solid #e5e7eb",
                                        "&:hover": {
                                            backgroundColor: "#f3f4f6",
                                        },
                                        "&.Mui-focused": {
                                            backgroundColor: "white",
                                            borderColor: "#6366f1",
                                        },
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search className="h-4 w-4 text-gray-400" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <FormControl size="small" className="min-w-[140px]">
                                <InputLabel>{t("filter_label")}</InputLabel>
                                <Select
                                    value={filterBy}
                                    onChange={(e) =>
                                        setFilterBy(e.target.value)
                                    }
                                    label={t("filter_label")}
                                    sx={{
                                        borderRadius: "12px",
                                        backgroundColor: "#f9fafb",
                                        "&:hover": {
                                            backgroundColor: "#f3f4f6",
                                        },
                                    }}
                                >
                                    <MenuItem value="all">
                                        {t("filters.all")}
                                    </MenuItem>
                                    <MenuItem value="in-progress">
                                        {t("filters.in_progress")}
                                    </MenuItem>
                                    <MenuItem value="completed">
                                        {t("filters.completed")}
                                    </MenuItem>
                                    <MenuItem value="not-started">
                                        {t("filters.not_started")}
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl size="small" className="min-w-[140px]">
                                <InputLabel>{t("sort_label")}</InputLabel>
                                <Select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    label={t("sort_label")}
                                    sx={{
                                        borderRadius: "12px",
                                        backgroundColor: "#f9fafb",
                                        "&:hover": {
                                            backgroundColor: "#f3f4f6",
                                        },
                                    }}
                                >
                                    <MenuItem value="recent">
                                        {t("sort_options.recent")}
                                    </MenuItem>
                                    <MenuItem value="alphabetical">
                                        {t("sort_options.alphabetical")}
                                    </MenuItem>
                                    <MenuItem value="progress">
                                        {t("sort_options.progress")}
                                    </MenuItem>
                                    <MenuItem value="rating">
                                        {t("sort_options.rating")}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </Paper>
                </Box>

                {/* Stats */}
                <Grid container spacing={3} className="mb-6">
                    <Grid item xs={12} sm={4}>
                        <Paper
                            elevation={0}
                            className="p-4 text-center rounded-xl bg-white border border-gray-200 hover:shadow-sm transition-shadow duration-200"
                        >
                            <Typography
                                variant="h3"
                                className="font-bold text-gray-900 mb-1"
                            >
                                {totalCourses}
                            </Typography>
                            <Typography
                                variant="body2"
                                className="text-gray-600 font-medium"
                            >
                                {t("stats.total_courses")}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper
                            elevation={0}
                            className="p-4 text-center rounded-xl bg-white border border-gray-200 hover:shadow-sm transition-shadow duration-200"
                        >
                            <Typography
                                variant="h3"
                                className="font-bold text-blue-600 mb-1"
                            >
                                {inProgressCourses}
                            </Typography>
                            <Typography
                                variant="body2"
                                className="text-gray-600 font-medium"
                            >
                                {t("stats.in_progress")}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper
                            elevation={0}
                            className="p-4 text-center rounded-xl bg-white border border-gray-200 hover:shadow-sm transition-shadow duration-200"
                        >
                            <Typography
                                variant="h3"
                                className="font-bold text-green-600 mb-1"
                            >
                                {completedCourses}
                            </Typography>
                            <Typography
                                variant="body2"
                                className="text-gray-600 font-medium"
                            >
                                {t("stats.completed")}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Course Grid */}
                <Grid container spacing={3}>
                    {filteredAndSortedCourses.map((course) => {
                        const progressStatus = getProgressStatus(
                            course.progress,
                            t
                        );

                        return (
                            <Grid item xs={12} sm={6} md={4} key={course.id}>
                                <Link
                                    href={`/my-learning/${slugify(
                                        course.title
                                    )}?id=${course.id}`}
                                >
                                    <Card
                                        elevation={0}
                                        className="hover:shadow-md transition-all duration-200 cursor-pointer h-full rounded-2xl border border-gray-200 bg-white group overflow-hidden hover:border-blue-300"
                                    >
                                        <Box className="relative">
                                            <CardMedia
                                                component="img"
                                                height="160"
                                                image={
                                                    course.thumbnail_url ||
                                                    "/img_not_found.png"
                                                }
                                                alt={course.title}
                                                className="h-40 object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    if (target.src !== "/img_not_found.png") {
                                                        target.src = "/img_not_found.png";
                                                    }
                                                }}
                                            />

                                            <Box className="absolute top-3 right-3">
                                                <Chip
                                                    label={progressStatus.text}
                                                    size="small"
                                                    className="text-xs font-medium"
                                                    sx={{
                                                        backgroundColor:
                                                            course.progress ===
                                                            100
                                                                ? "#10b981"
                                                                : course.progress >
                                                                  0
                                                                ? "#3b82f6"
                                                                : "#6b7280",
                                                        color: "white",
                                                        borderRadius: "8px",
                                                        height: "24px",
                                                    }}
                                                />
                                            </Box>
                                        </Box>

                                        <CardContent className="p-4 space-y-3">
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    className="line-clamp-2 mb-2 font-semibold text-gray-900 leading-snug"
                                                >
                                                    {course.title}
                                                </Typography>

                                                {course.instructor && (
                                                    <Typography
                                                        variant="body2"
                                                        className="text-gray-600 mb-3"
                                                    >
                                                        {course.instructor.name}
                                                    </Typography>
                                                )}
                                            </Box>

                                            {/* Progress Bar */}
                                            <Box className="space-y-2">
                                                <Box className="flex justify-between items-center">
                                                    <Typography
                                                        variant="caption"
                                                        className="text-gray-600 font-medium"
                                                    >
                                                        {t("progress_label")}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        className="font-semibold text-gray-900"
                                                    >
                                                        {course.progress}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={course.progress}
                                                    className="h-2 rounded-full"
                                                    sx={{
                                                        backgroundColor:
                                                            "#f3f4f6",
                                                        "& .MuiLinearProgress-bar":
                                                            {
                                                                borderRadius:
                                                                    "4px",
                                                                backgroundColor:
                                                                    course.progress ===
                                                                    100
                                                                        ? "#10b981"
                                                                        : "#3b82f6",
                                                            },
                                                    }}
                                                />
                                            </Box>

                                            {/* Rating and Action Row */}
                                            <Box className="flex items-center justify-between pt-2">
                                                {course.average_rating > 0 ? (
                                                    <Box className="flex items-center space-x-1">
                                                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                        <Typography
                                                            variant="caption"
                                                            className="text-gray-600 font-medium"
                                                        >
                                                            {course.average_rating.toFixed(
                                                                1
                                                            )}
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    <Box />
                                                )}

                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    startIcon={
                                                        <PlayCircle className="h-4 w-4" />
                                                    }
                                                    className="rounded-full text-xs px-3 py-1"
                                                    sx={{
                                                        backgroundColor:
                                                            "#3b82f6",
                                                        "&:hover": {
                                                            backgroundColor:
                                                                "#2563eb",
                                                        },
                                                        textTransform: "none",
                                                        fontSize: "0.75rem",
                                                    }}
                                                >
                                                    {course.progress === 0
                                                        ? t(
                                                              "buttons.start_learning"
                                                          )
                                                        : t("buttons.continue")}
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Grid>
                        );
                    })}
                </Grid>

                {/* Empty State */}
                {filteredAndSortedCourses.length === 0 &&
                    enrolledCourses.length > 0 && (
                        <Box className="text-center py-16">
                            <Box className="p-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                <Search className="h-12 w-12 text-purple-400" />
                            </Box>
                            <Typography
                                variant="h4"
                                className="font-bold text-gray-800 mb-3"
                            >
                                {t("empty_state.no_results_title")}
                            </Typography>
                            <Typography
                                variant="h6"
                                className="text-gray-600 mb-6 max-w-md mx-auto"
                            >
                                {t("empty_state.no_results_subtitle")}
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilterBy("all");
                                    setSortBy("recent");
                                }}
                                className="rounded-full px-8 py-3 font-bold"
                                sx={{
                                    background:
                                        "linear-gradient(45deg, #8b5cf6, #a855f7)",
                                    "&:hover": {
                                        background:
                                            "linear-gradient(45deg, #7c3aed, #9333ea)",
                                    },
                                }}
                                startIcon={<RotateCcw className="h-5 w-5" />}
                            >
                                {t("buttons.clear_filters")}
                            </Button>
                        </Box>
                    )}

                {enrolledCourses.length === 0 && (
                    <Box className="text-center py-16">
                        <Box className="p-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 w-32 h-32 mx-auto mb-8 flex items-center first-letter:justify-center">
                            <BookOpen className="h-16 w-16 text-purple-500" />
                        </Box>
                        <Typography
                            variant="h3"
                            className="font-bold text-gray-800 mb-4"
                        >
                            {t("empty_state.no_courses_title")}
                        </Typography>
                        <Typography
                            variant="h6"
                            className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed"
                        >
                            {t("empty_state.no_courses_subtitle")}
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            className="rounded-full px-10 py-4 font-bold text-lg"
                            sx={{
                                background:
                                    "linear-gradient(45deg, #8b5cf6, #a855f7)",
                                "&:hover": {
                                    background:
                                        "linear-gradient(45deg, #7c3aed, #9333ea)",
                                },
                            }}
                            startIcon={<TrendingUp className="h-6 w-6" />}
                        >
                            {t("buttons.browse_courses")}
                        </Button>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
