"use client";

import React, { useState } from "react";
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
                            My Courses ✨
                        </Typography>
                    </Box>
                    <Typography
                        variant="h6"
                        className="text-gray-600 mb-6 font-medium"
                    >
                        🎓 Manage and track your created courses
                    </Typography>
                    <Link href={`${pathname}/create`}>
                        <Button
                            variant="contained"
                            startIcon={<Plus className="w-5 h-5" />}
                            size="large"
                            className="font-semibold px-8 py-3"
                            sx={{
                                background:
                                    "linear-gradient(45deg, #2563eb, #3b82f6)",
                                borderRadius: "16px",
                                textTransform: "none",
                                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                                "&:hover": {
                                    background:
                                        "linear-gradient(45deg, #1d4ed8, #2563eb)",
                                    boxShadow:
                                        "0 6px 16px rgba(37, 99, 235, 0.4)",
                                },
                            }}
                        >
                            🚀 Create New Course
                        </Button>
                    </Link>
                </Box>

                {/* Search and Filters */}
                <Box className="p-6 mb-6 bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl">
                    <Box className="flex flex-col sm:flex-row gap-4 mb-4">
                        <TextField
                            placeholder="🔍 Search your courses..."
                            variant="outlined"
                            size="medium"
                            className="flex-1"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "20px",
                                    backgroundColor: "rgba(255,255,255,0.8)",
                                    "&:hover": {
                                        backgroundColor:
                                            "rgba(255,255,255,0.9)",
                                    },
                                    "&.Mui-focused": {
                                        backgroundColor: "white",
                                    },
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search className="h-5 w-5 text-purple-400" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <div className="flex gap-3">
                            <Button
                                variant="outlined"
                                size="medium"
                                className="rounded-full px-6"
                                sx={{
                                    borderColor: "#d1d5db",
                                    color: "#6b7280",
                                    textTransform: "none",
                                    "&:hover": {
                                        borderColor: "#9ca3af",
                                        backgroundColor: "#f9fafb",
                                    },
                                }}
                            >
                                📚 All Categories
                            </Button>
                            <Button
                                variant="outlined"
                                size="medium"
                                className="rounded-full px-6"
                                sx={{
                                    borderColor: "#d1d5db",
                                    color: "#6b7280",
                                    textTransform: "none",
                                    "&:hover": {
                                        borderColor: "#9ca3af",
                                        backgroundColor: "#f9fafb",
                                    },
                                }}
                            >
                                ⭐ Sort by Rating
                            </Button>
                        </div>
                    </Box>
                </Box>

                {/* Stats */}
                <Grid container spacing={3} className="mb-8">
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            elevation={0}
                            className="p-4 hover:shadow-lg transition-shadow duration-200 rounded-2xl bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-50 border border-emerald-100/50"
                        >
                            <Box className="text-center">
                                <Box className="inline-flex p-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 shadow-md mb-2">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </Box>
                                <Typography
                                    variant="body2"
                                    className="font-bold text-emerald-800 mb-1 tracking-wide text-sm"
                                >
                                    📚 Total Courses
                                </Typography>
                                <Typography
                                    variant="h4"
                                    className="font-black text-emerald-900 mb-1"
                                >
                                    {courses?.length || 0}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    className="text-emerald-600 font-medium"
                                >
                                    Keep creating! 🎯
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            elevation={0}
                            className="p-4 hover:shadow-lg transition-shadow duration-200 rounded-2xl bg-gradient-to-br from-amber-100 via-amber-50 to-orange-50 border border-amber-100/50"
                        >
                            <Box className="text-center">
                                <Box className="inline-flex p-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 shadow-md mb-2">
                                    <Users className="h-6 w-6 text-white" />
                                </Box>
                                <Typography
                                    variant="body2"
                                    className="font-bold text-amber-800 mb-1 tracking-wide text-sm"
                                >
                                    👥 Total Students
                                </Typography>
                                <Typography
                                    variant="h4"
                                    className="font-black text-amber-900 mb-1"
                                >
                                    {totalStudents}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    className="text-amber-600 font-medium"
                                >
                                    Growing audience! 🚀
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            elevation={0}
                            className="p-4 hover:shadow-lg transition-shadow duration-200 rounded-2xl bg-gradient-to-br from-violet-100 via-violet-50 to-purple-50 border border-violet-100/50"
                        >
                            <Box className="text-center">
                                <Box className="inline-flex p-2 rounded-full bg-gradient-to-r from-violet-400 to-purple-400 shadow-md mb-2">
                                    <DollarSign className="h-6 w-6 text-white" />
                                </Box>
                                <Typography
                                    variant="body2"
                                    className="font-bold text-violet-800 mb-1 tracking-wide text-sm"
                                >
                                    💰 Revenue
                                </Typography>
                                <Typography
                                    variant="h4"
                                    className="font-black text-violet-900 mb-1"
                                >
                                    {formatCurrency(totalRevenue)}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    className="text-violet-600 font-medium"
                                >
                                    Keep earning! 💎
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            elevation={0}
                            className="p-4 hover:shadow-lg transition-shadow duration-200 rounded-2xl bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-50 border border-blue-100/50"
                        >
                            <Box className="text-center">
                                <Box className="inline-flex p-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 shadow-md mb-2">
                                    <Star className="h-6 w-6 text-white" />
                                </Box>
                                <Typography
                                    variant="body2"
                                    className="font-bold text-blue-800 mb-1 tracking-wide text-sm"
                                >
                                    ⭐ Avg Rating
                                </Typography>
                                <Typography
                                    variant="h4"
                                    className="font-black text-blue-900 mb-1"
                                >
                                    {averageRating.toFixed(1)}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    className="text-blue-600 font-medium"
                                >
                                    Excellence! ✨
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Courses List */}
                <Grid container spacing={3}>
                    {courses?.map((course) => (
                        <Grid item xs={12} sm={6} lg={4} key={course.id}>
                            <Card
                                elevation={0}
                                className="hover:shadow-xl transition-shadow duration-200 cursor-pointer h-full rounded-[24px] border border-gray-200/60 bg-white backdrop-blur-sm group overflow-hidden"
                            >
                                <Box className="relative">
                                    <Image
                                        src={
                                            course.thumbnail_url ||
                                            "/placeholder.svg"
                                        }
                                        alt={course.title}
                                        width={400}
                                        height={200}
                                        className="h-48 w-full object-cover"
                                        style={{
                                            borderRadius: "24px 24px 0 0",
                                        }}
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
                                    <Box className="absolute top-4 left-4">
                                        <Chip
                                            label={formatCurrency(
                                                Number(course.price)
                                            )}
                                            variant="filled"
                                            size="small"
                                            className="bg-white/95 text-gray-800 font-bold shadow-md"
                                            sx={{ borderRadius: "12px" }}
                                        />
                                    </Box>
                                </Box>

                                <CardContent className="flex-1 space-y-5 p-6">
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

                                        {/* Action Buttons */}
                                        <Box className="flex gap-2 mb-5">
                                            <Link
                                                href={`/my-courses/${slugify(
                                                    course.title
                                                )}?id=${course.id}`}
                                                passHref
                                            >
                                                <Button
                                                    variant="contained"
                                                    size="medium"
                                                    className="font-semibold px-6 py-2 flex-1"
                                                    sx={{
                                                        background:
                                                            "linear-gradient(45deg, #2563eb, #3b82f6)",
                                                        borderRadius: "16px",
                                                        textTransform: "none",
                                                        boxShadow:
                                                            "0 4px 12px rgba(37, 99, 235, 0.3)",
                                                        "&:hover": {
                                                            background:
                                                                "linear-gradient(45deg, #1d4ed8, #2563eb)",
                                                            boxShadow:
                                                                "0 6px 16px rgba(37, 99, 235, 0.4)",
                                                        },
                                                    }}
                                                >
                                                    🎓 Manage Course
                                                </Button>
                                            </Link>
                                        </Box>
                                    </Box>

                                    {/* Course Stats */}
                                    <Box className="space-y-3 p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-100/50">
                                        <Box className="flex gap-3">
                                            <Typography
                                                variant="body2"
                                                className="text-gray-700 font-medium flex items-center gap-1"
                                            >
                                                👥 Students
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                className="font-bold text-blue-700"
                                            >
                                                {course.enrollments?.length ||
                                                    0}
                                            </Typography>
                                        </Box>
                                        <Box className="flex items-center justify-between">
                                            <Box className="flex items-center gap-1">
                                                <Rating
                                                    value={
                                                        course.average_rating
                                                    }
                                                    precision={0.1}
                                                    size="small"
                                                    readOnly
                                                />
                                                <Typography
                                                    variant="caption"
                                                    className="text-gray-600 font-medium ml-1"
                                                >
                                                    {course.average_rating} (
                                                    {course.total_reviews})
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Categories */}
                                    {course.categories &&
                                        course.categories.length > 0 && (
                                            <Box className="flex flex-wrap gap-2">
                                                {course.categories
                                                    .slice(0, 2)
                                                    .map((category) => (
                                                        <Chip
                                                            key={category.id}
                                                            label={`🏷️ ${category.name}`}
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{
                                                                borderRadius:
                                                                    "12px",
                                                                backgroundColor:
                                                                    "#faf5ff",
                                                                borderColor:
                                                                    "#d8b4fe",
                                                                color: "#7c3aed",
                                                                fontWeight:
                                                                    "medium",
                                                            }}
                                                        />
                                                    ))}
                                                {course.categories.length >
                                                    2 && (
                                                    <Chip
                                                        label={`+${
                                                            course.categories
                                                                .length - 2
                                                        } more`}
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{
                                                            borderRadius:
                                                                "12px",
                                                            backgroundColor:
                                                                "#f9fafb",
                                                            borderColor:
                                                                "#d1d5db",
                                                            color: "#6b7280",
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        )}

                                    {/* Last Updated */}
                                    <Box className="flex items-center pt-2 border-t border-gray-100">
                                        <Clock className="h-4 w-4 mr-2 text-purple-400" />
                                        <Typography
                                            variant="caption"
                                            className="text-gray-600 font-medium"
                                        >
                                            📅 Updated{" "}
                                            {formatDate(course.last_updated)}
                                        </Typography>
                                    </Box>
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
