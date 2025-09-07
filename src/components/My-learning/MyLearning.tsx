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
    Clock,
    Calendar,
    BookOpen,
    PlayCircle,
    TrendingUp,
    Award,
    Users,
    Search,
    Filter,
    SortAsc,
    ArrowRight,
    RotateCcw,
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
    if (progress === 0) return { text: t("status.not_started"), color: "bg-gray-500" };
    if (progress < 50) return { text: t("status.in_progress"), color: "bg-blue-500" };
    if (progress < 100) return { text: t("status.almost_done"), color: "bg-orange-500" };
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
            const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.instructor?.name.toLowerCase().includes(searchTerm.toLowerCase());

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
                    return new Date(b.dateEnrolled).getTime() - new Date(a.dateEnrolled).getTime();
            }
        });
    }, [enrolledCourses, searchTerm, filterBy, sortBy]);

    return (
        <Box className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-4">
            <Container maxWidth="xl">
                {/* Header */}
                <Box className="mb-8 text-center">
                    <Box className="inline-flex items-center gap-3 mb-4">
                        <Box className="p-3 rounded-full bg-gradient-to-r from-pink-600 to-pink-600 shadow-lg">
                            <BookOpen className="h-8 w-8 text-white" />
                        </Box>  
                        <Typography
                            variant="h2"
                            className="bg-gradient-to-r from-pink-600 to-pink-600 bg-clip-text text-transparent"
                        >
                            {t("title")}
                        </Typography>
                    </Box>
                    <Typography variant="h6" className="text-gray-600 mb-6 font-medium">
                        {t("subtitle")}
                    </Typography>

                    {/* Search and Filters */}
                    <Paper 
                        elevation={0}
                        className="p-6 mb-6 bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl"
                    >
                        <Stack 
                            direction={{ xs: "column", md: "row" }} 
                            spacing={3} 
                            className="mb-4"
                        >
                            <TextField
                                placeholder={t("search_placeholder")}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                variant="outlined"
                                size="medium"
                                className="flex-1"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '20px',
                                        backgroundColor: 'rgba(255,255,255,0.8)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: 'white',
                                        }
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search className="h-5 w-5 text-purple-400" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            
                            <FormControl size="medium" className="min-w-[160px]">
                                <InputLabel className="text-purple-600">{t("filter_label")}</InputLabel>
                                <Select
                                    value={filterBy}
                                    onChange={(e) => setFilterBy(e.target.value)}
                                    label={t("filter_label")}
                                    sx={{
                                        borderRadius: '20px',
                                        backgroundColor: 'rgba(255,255,255,0.8)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                        }
                                    }}
                                >
                                    <MenuItem value="all">{t("filters.all")}</MenuItem>
                                    <MenuItem value="in-progress">{t("filters.in_progress")}</MenuItem>
                                    <MenuItem value="completed">{t("filters.completed")}</MenuItem>
                                    <MenuItem value="not-started">{t("filters.not_started")}</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl size="medium" className="min-w-[160px]">
                                <InputLabel className="text-pink-600">{t("sort_label")}</InputLabel>
                                <Select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    label={t("sort_label")}
                                    sx={{
                                        borderRadius: '20px',
                                        backgroundColor: 'rgba(255,255,255,0.8)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                        }
                                    }}
                                >
                                    <MenuItem value="recent">{t("sort_options.recent")}</MenuItem>
                                    <MenuItem value="alphabetical">{t("sort_options.alphabetical")}</MenuItem>
                                    <MenuItem value="progress">{t("sort_options.progress")}</MenuItem>
                                    <MenuItem value="rating">{t("sort_options.rating")}</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>

                        {/* Results count */}
                        <Box className="text-center">
                            <Chip 
                                label={t("showing_results", { filtered: filteredAndSortedCourses.length, total: totalCourses })}
                                className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-medium"
                                variant="filled"
                            />
                        </Box>
                    </Paper>
                </Box>

                {/* Stats */}
                <Grid container spacing={3} className="mb-8">
                    <Grid item xs={12} sm={4}>
                        <Paper 
                            elevation={0}
                            className="p-4 hover:shadow-lg transition-shadow duration-200 rounded-2xl bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-50 border border-emerald-100/50 "
                        >
                            <Box className="text-center">
                                <Box className="inline-flex p-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 shadow-md mb-2">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </Box>
                                <Typography
                                    variant="body2"
                                    className="font-bold text-emerald-800 mb-1 tracking-wide text-sm"
                                >
                                    {t("stats.total_courses")}
                                </Typography>
                                <Typography
                                    variant="h4"
                                    className="font-black text-emerald-900 mb-1"
                                >
                                    {totalCourses}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    className="text-emerald-600 font-medium"
                                >
                                    {t("stats.total_subtitle")}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper 
                            elevation={0}
                            className="p-4 hover:shadow-lg transition-shadow duration-200 rounded-2xl bg-gradient-to-br from-amber-100 via-amber-50 to-orange-50 border border-amber-100/50"
                        >
                            <Box className="text-center">
                                <Box className="inline-flex p-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 shadow-md mb-2">
                                    <Clock className="h-6 w-6 text-white" />
                                </Box>
                                <Typography
                                    variant="body2"
                                    className="font-bold text-amber-800 mb-1 tracking-wide text-sm"
                                >
                                    {t("stats.in_progress")}
                                </Typography>
                                <Typography
                                    variant="h4"
                                    className="font-black text-amber-900 mb-1"
                                >
                                    {inProgressCourses}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    className="text-amber-600 font-medium"
                                >
                                    {t("stats.in_progress_subtitle")}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper 
                            elevation={0}
                            className="p-4 hover:shadow-lg transition-shadow duration-200 rounded-2xl bg-gradient-to-br from-violet-100 via-violet-50 to-purple-50 border border-violet-100/50"
                        >
                            <Box className="text-center">
                                <Box className="inline-flex p-2 rounded-full bg-gradient-to-r from-violet-400 to-purple-400 shadow-md mb-2">
                                    <Award className="h-6 w-6 text-white" />
                                </Box>
                                <Typography
                                    variant="body2"
                                    className="font-bold text-violet-800 mb-1 tracking-wide text-sm"
                                >
                                    {t("stats.completed")}
                                </Typography>
                                <Typography
                                    variant="h4"
                                    className="font-black text-violet-900 mb-1"
                                >
                                    {completedCourses}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    className="text-violet-600 font-medium"
                                >
                                    {completedCourses > 0 ? t("stats.completed_subtitle") : t("stats.completed_subtitle_empty")}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Course Grid */}
                <Grid container spacing={3}>
                    {filteredAndSortedCourses.map((course) => {
                        const progressStatus = getProgressStatus(
                            course.progress, t
                        );

                        return (
                            <Grid item xs={12} sm={6} lg={4} key={course.id}>
                                <Grow in={true} timeout={300}>
                                    <Link href={`/my-learning/${slugify(course.title)}?id=${course.id}`}>
                                        <Card 
                                            elevation={0}
                                            className="hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full rounded-3xl border-2 border-white/60 bg-white/95 backdrop-blur-sm group overflow-hidden "
                                        >
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
                                            
                                            <Box className="absolute top-4 right-4">
                                                <Chip
                                                    label={progressStatus.text}
                                                    size="small"
                                                    className="font-semibold shadow-md"
                                                    sx={{
                                                        backgroundColor: progressStatus.text === "Completed" ? '#10b981' : 
                                                                          progressStatus.text === "In Progress" ? '#f59e0b' : 
                                                                          progressStatus.text === "Almost Done" ? '#f97316' : '#6b7280',
                                                        color: 'white',
                                                        borderRadius: '12px'
                                                    }}
                                                />
                                            </Box>
                                            {course.price > 0 && (
                                                <Box className="absolute top-4 left-4 ">
                                                    <Chip
                                                        label={formatPrice(course.price, t)}
                                                        variant="filled"
                                                        size="small"
                                                        className="bg-white/95 text-gray-800 font-bold shadow-md"
                                                        sx={{ borderRadius: '12px' }}
                                                    />
                                                </Box>
                                            )}
                                        </Box>

                                        <CardContent className="flex-1 space-y-4 p-6 ">
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    className="line-clamp-2 mb-3 font-bold text-gray-800"
                                                >
                                                    {course.title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    className="text-gray-600 line-clamp-2 mb-4 leading-relaxed"
                                                >
                                                    {course.description}
                                                </Typography>
                                                
                                                {/* Quick Action Buttons */}
                                                <Stack direction="row" spacing={2} className="mb-4">
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        startIcon={<PlayCircle className="h-4 w-4" />}
                                                        className="rounded-full font-semibold px-4"
                                                        sx={{
                                                            background: 'linear-gradient(45deg, #2563eb, #3b82f6)',
                                                            '&:hover': {
                                                                background: 'linear-gradient(45deg, #1d4ed8, #2563eb)',
                                                            }
                                                        }}
                                                    >
                                                        {course.progress === 0 ? t("buttons.start_learning") : t("buttons.continue")}
                                                    </Button>
                                                </Stack>
                                            </Box>

                                            {/* Progress */}
                                            <Box className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                                                <Box className="flex justify-between items-center">
                                                    <Typography
                                                        variant="body2"
                                                        className="text-gray-700 font-medium flex items-center gap-1"
                                                    >
                                                        {t("progress_label")}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        className="font-bold text-blue-700"
                                                    >
                                                        {course.progress}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={course.progress}
                                                    className="h-3 rounded-full"
                                                    sx={{
                                                        backgroundColor: '#e5e7eb',
                                                        '& .MuiLinearProgress-bar': {
                                                            borderRadius: '6px',
                                                            background: course.progress === 100 ? 
                                                                'linear-gradient(45deg, #10b981, #059669)' :
                                                                'linear-gradient(45deg, #2563eb, #3b82f6)'
                                                        }
                                                    }}
                                                />
                                                {course.lectureProgress > 0 && (
                                                    <Typography
                                                        variant="caption"
                                                        className="text-gray-600 font-medium flex items-center gap-1"
                                                    >
                                                        {course.lectureProgress === 1 ? t("lectures_completed", { count: course.lectureProgress }) : t("lectures_completed_plural", { count: course.lectureProgress })}
                                                    </Typography>
                                                )}
                                            </Box>

                                            {/* Instructor & Rating Row */}
                                            <Box className="flex items-center justify-between">
                                                {course.instructor && (
                                                    <Box className="flex items-center space-x-2">
                                                        <Avatar
                                                            src={course.instructor.avatar_url || undefined}
                                                            className="w-8 h-8 border-2 border-white shadow-sm"
                                                            sx={{ 
                                                                background: 'linear-gradient(45deg, #8b5cf6, #a855f7)',
                                                                color: 'white',
                                                                fontSize: '0.875rem',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            {course.instructor.name.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                        <Typography
                                                            variant="body2"
                                                            className="text-gray-700 font-medium"
                                                        >
                                                            {t("instructor_prefix")} {course.instructor.name}
                                                        </Typography>
                                                    </Box>
                                                )}

                                                {course.average_rating > 0 && (
                                                    <Box className="flex items-center space-x-1">
                                                        <Box className="flex items-center">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-4 w-4 ${
                                                                        i < Math.floor(course.average_rating)
                                                                            ? "text-yellow-500 fill-current"
                                                                            : "text-gray-300"
                                                                    }`}
                                                                />
                                                            ))}
                                                        </Box>
                                                        <Typography
                                                            variant="caption"
                                                            className="text-gray-600 font-medium ml-1"
                                                        >
                                                            {course.average_rating} ({course.total_reviews})
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>

                                            {/* Categories */}
                                            {course.categories.length > 0 && (
                                                <Box className="flex flex-wrap gap-2">
                                                    {course.categories.slice(0, 2).map((category) => (
                                                        <Chip
                                                            key={category.id}
                                                            label={`${t("category_prefix")} ${category.name}`}
                                                            variant="outlined"
                                                            size="small"
                                                            className="rounded-full border-purple-200 text-purple-700 bg-purple-50 font-medium"
                                                        />
                                                    ))}
                                                    {course.categories.length > 2 && (
                                                        <Chip
                                                            label={`+${course.categories.length - 2} more`}
                                                            variant="outlined"
                                                            size="small"
                                                            className="rounded-full border-gray-200 text-gray-600 bg-gray-50"
                                                        />
                                                    )}
                                                </Box>
                                            )}

                                            {/* Enrollment Date */}
                                            <Box className="flex items-center pt-2 border-t border-gray-100">
                                                <Calendar className="h-4 w-4 mr-2 text-purple-400" />
                                                <Typography
                                                    variant="caption"
                                                    className="text-gray-600 font-medium"
                                                >
                                                    {t("enrolled_on", { date: formatDate(course.dateEnrolled.toString()) })}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                        </Card>
                                    </Link>
                                </Grow>
                            </Grid>
                        );
                    })}
                </Grid>

                {/* Empty State */}
                {filteredAndSortedCourses.length === 0 && enrolledCourses.length > 0 && (
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
                        <Typography variant="h6" className="text-gray-600 mb-6 max-w-md mx-auto">
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
                                background: 'linear-gradient(45deg, #8b5cf6, #a855f7)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #7c3aed, #9333ea)',
                                }
                            }}
                            startIcon={<RotateCcw className="h-5 w-5" />}
                        >
                            {t("buttons.clear_filters")}
                        </Button>
                    </Box>
                )}

                {enrolledCourses.length === 0 && (
                    <Box className="text-center py-16">
                        <Box className="p-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                            <BookOpen className="h-16 w-16 text-purple-500" />
                        </Box>
                        <Typography
                            variant="h3"
                            className="font-bold text-gray-800 mb-4"
                        >
                            {t("empty_state.no_courses_title")}
                        </Typography>
                        <Typography variant="h6" className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                            {t("empty_state.no_courses_subtitle")}
                        </Typography>
                        <Button 
                            variant="contained" 
                            size="large"
                            className="rounded-full px-10 py-4 font-bold text-lg"
                            sx={{
                                background: 'linear-gradient(45deg, #8b5cf6, #a855f7)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #7c3aed, #9333ea)',
                                }
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
