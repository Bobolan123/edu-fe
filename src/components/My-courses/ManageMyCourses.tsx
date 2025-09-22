"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
    BookOpen,
    MoreHorizontal,
    Plus,
    Search,
    Users,
    Star,
    Clock,
    DollarSign,
    RotateCcw,
} from "lucide-react";
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
    InputAdornment,
    Container,
    Box,
    Rating,
    Paper,
    FormControl,
    InputLabel,
    Select,
    Stack,
} from "@mui/material";
import { ICourse } from "../../../types/entities";
import Link from "next/link";
import { slugify } from "../../utils/utils";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

interface IManageMyCoursesProps {
    courses: ICourse[] | undefined;
}

export default function ManageMyCourses({ courses }: IManageMyCoursesProps) {
    const t = useTranslations("ManageMyCourses");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
    const pathname = usePathname();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState("all");
    const [sortBy, setSortBy] = useState("recent");

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

    const totalStudents =
        courses?.reduce(
            (sum, course) => sum + (course.enrollments?.length || 0),
            0
        ) || 0;
    const totalRevenue =
        courses?.reduce(
            (sum, course) =>
                sum +
                Number(course.price || 0) * (course.enrollments?.length || 0),
            0
        ) || 0;
    const averageRating =
        courses && courses.length > 0
            ? courses.reduce(
                  (sum, course) => sum + (course.average_rating || 0),
                  0
              ) / courses.length
            : 0;

    const formatDate = (date: string | Date) =>
        new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(amount);

    const filteredAndSortedCourses = useMemo(() => {
        if (!courses) return [];

        let filtered = courses.filter((course) => {
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
                    case "free":
                        return course.price === 0;
                    case "paid":
                        return course.price > 0;
                    case "high-rated":
                        return course.average_rating >= 4.0;
                    case "popular":
                        return (course.enrollments?.length || 0) >= 10;
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
                case "rating":
                    return (b.average_rating || 0) - (a.average_rating || 0);
                case "students":
                    return (
                        (b.enrollments?.length || 0) -
                        (a.enrollments?.length || 0)
                    );
                case "price":
                    return Number(b.price || 0) - Number(a.price || 0);
                case "recent":
                default:
                    return (
                        new Date(b.date_created || 0).getTime() -
                        new Date(a.date_created || 0).getTime()
                    );
            }
        });
    }, [courses, searchTerm, filterBy, sortBy]);

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
                    <Link href={`${pathname}/create`}>
                        <Button
                            variant="contained"
                            startIcon={<Plus className="w-5 h-5" />}
                            size="large"
                            className="font-semibold px-8 py-3 rounded-full"
                            sx={{
                                backgroundColor: "#3b82f6",
                                "&:hover": {
                                    backgroundColor: "#2563eb",
                                },
                                textTransform: "none",
                            }}
                        >
                            {t("create_new")}
                        </Button>
                    </Link>
                </Box>

                {/* Stats */}
                <Grid container spacing={3} className="mb-6">
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            elevation={0}
                            className="p-4 text-center rounded-xl bg-white border border-gray-200 hover:shadow-sm transition-shadow duration-200"
                        >
                            <Typography
                                variant="h3"
                                className="font-bold text-gray-900 mb-1"
                            >
                                {courses?.length || 0}
                            </Typography>
                            <Typography
                                variant="body2"
                                className="text-gray-600 font-medium"
                            >
                                {t("total_courses")}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            elevation={0}
                            className="p-4 text-center rounded-xl bg-white border border-gray-200 hover:shadow-sm transition-shadow duration-200"
                        >
                            <Typography
                                variant="h3"
                                className="font-bold text-blue-600 mb-1"
                            >
                                {totalStudents}
                            </Typography>
                            <Typography
                                variant="body2"
                                className="text-gray-600 font-medium"
                            >
                                {t("total_students")}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            elevation={0}
                            className="p-4 text-center rounded-xl bg-white border border-gray-200 hover:shadow-sm transition-shadow duration-200"
                        >
                            <Typography
                                variant="h3"
                                className="font-bold text-green-600 mb-1"
                            >
                                {formatCurrency(totalRevenue)}
                            </Typography>
                            <Typography
                                variant="body2"
                                className="text-gray-600 font-medium"
                            >
                                {t("total_revenue")}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            elevation={0}
                            className="p-4 text-center rounded-xl bg-white border border-gray-200 hover:shadow-sm transition-shadow duration-200"
                        >
                            <Typography
                                variant="h3"
                                className="font-bold text-purple-600 mb-1"
                            >
                                {averageRating.toFixed(1)}
                            </Typography>
                            <Typography
                                variant="body2"
                                className="text-gray-600 font-medium"
                            >
                                {t("avg_rating")}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Search and Filters */}
                <Paper
                    elevation={0}
                    className="p-4 mb-6 bg-white rounded-2xl border border-gray-200 shadow-sm"
                >
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
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
                                onChange={(e) => setFilterBy(e.target.value)}
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
                                <MenuItem value="free">
                                    {t("filters.free")}
                                </MenuItem>
                                <MenuItem value="paid">
                                    {t("filters.paid")}
                                </MenuItem>
                                <MenuItem value="high-rated">
                                    {t("filters.high_rated")}
                                </MenuItem>
                                <MenuItem value="popular">
                                    {t("filters.popular")}
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
                                <MenuItem value="rating">
                                    {t("sort_options.rating")}
                                </MenuItem>
                                <MenuItem value="students">
                                    {t("sort_options.students")}
                                </MenuItem>
                                <MenuItem value="price">
                                    {t("sort_options.price")}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </Paper>

                {/* Courses List */}
                <Grid container spacing={3}>
                    {filteredAndSortedCourses?.map((course) => (
                        <Grid item xs={12} sm={6} md={3} key={course.id}>
                            <Card
                                elevation={0}
                                className="hover:shadow-md transition-all duration-200 cursor-pointer h-full rounded-2xl border border-gray-200 bg-white group overflow-hidden hover:border-blue-300"
                            >
                                <Box className="relative">
                                    <Image
                                        src={
                                            course.thumbnail_url ||
                                            "/placeholder.svg"
                                        }
                                        alt={course.title}
                                        width={400}
                                        height={160}
                                        className="h-40 w-full object-cover"
                                    />

                                    <Box className="absolute top-4 right-4">
                                        <IconButton
                                            size="small"
                                            onClick={(e) =>
                                                handleMenuClick(e, course.id)
                                            }
                                            className="bg-white/90 hover:bg-white shadow-md"
                                            sx={{ borderRadius: "12px" }}
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </IconButton>
                                    </Box>
                                    <Box className="absolute top-3 left-3">
                                        <Chip
                                            label={formatCurrency(
                                                Number(course.price)
                                            )}
                                            size="small"
                                            className="text-xs font-medium"
                                            sx={{
                                                backgroundColor: "white",
                                                color: "#374151",
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
                                        <Typography
                                            variant="body2"
                                            className="text-gray-600 line-clamp-2 mb-3"
                                        >
                                            {course.description}
                                        </Typography>
                                    </Box>

                                    {/* Course Stats */}
                                    <Box className="space-y-2">
                                        <Box className="flex justify-between items-center">
                                            <Typography
                                                variant="caption"
                                                className="text-gray-600 font-medium"
                                            >
                                                Students
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                className="font-semibold text-gray-900"
                                            >
                                                {course.enrollments?.length ||
                                                    0}
                                            </Typography>
                                        </Box>
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

                                        <Link
                                            href={`/my-courses/${slugify(
                                                course.title
                                            )}?id=${course.id}`}
                                        >
                                            <Button
                                                size="small"
                                                variant="contained"
                                                className="rounded-full text-xs px-3 py-1"
                                                sx={{
                                                    backgroundColor: "#3b82f6",
                                                    "&:hover": {
                                                        backgroundColor:
                                                            "#2563eb",
                                                    },
                                                    textTransform: "none",
                                                    fontSize: "0.75rem",
                                                }}
                                            >
                                                {t("manage_course")}
                                            </Button>
                                        </Link>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Empty State */}
                {filteredAndSortedCourses.length === 0 &&
                    courses &&
                    courses.length > 0 && (
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

                {(!courses || courses.length === 0) && (
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
                        <Typography
                            variant="h6"
                            className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed"
                        >
                            {t("empty_state.no_courses_subtitle")}
                        </Typography>
                        <Link href={`${pathname}/create`}>
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
                                startIcon={<Plus className="h-6 w-6" />}
                            >
                                {t("buttons.create_first_course")}
                            </Button>
                        </Link>
                    </Box>
                )}

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
                        {t("menu_edit")}
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                        {t("menu_analytics")}
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                        {t("menu_enrollments")}
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                        {t("menu_reviews")}
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                        {t("menu_settings")}
                    </MenuItem>
                    <MenuItem
                        onClick={handleMenuClose}
                        sx={{ color: "error.main" }}
                    >
                        {t("menu_delete")}
                    </MenuItem>
                </Menu>
            </Container>
        </Box>
    );
}
