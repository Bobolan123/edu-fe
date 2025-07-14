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
} from "@mui/material";
import { ICourse } from "../../../types/entities";
import Link from "next/link";
import { slugify } from "../../../utils/utils";
import { useTranslations } from "next-intl";

interface IManageMyCoursesProps {
    courses: ICourse[] | undefined;
}

export default function ManageMyCourses({ courses }: IManageMyCoursesProps) {
    const t = useTranslations("ManageMyCourses");
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
        <div className="flex flex-col w-full min-h-screen bg-gray-50">
            <main className="flex-1 p-4 md:p-6 lg:p-8">
                <Container maxWidth="xl">
                    <div className="flex flex-col gap-4 mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <Typography
                                    variant="h3"
                                    component="h1"
                                    className="font-bold tracking-tight mb-2"
                                >
                                    {t("title")}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                >
                                    {t("subtitle")}
                                </Typography>
                            </div>
                            <Button
                                variant="contained"
                                startIcon={<Plus className="w-4 h-4" />}
                                sx={{ textTransform: "none" }}
                            >
                                {t("create_new")}
                            </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <TextField
                                placeholder={t("search_placeholder")}
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
                                    {t("all_categories")}
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ textTransform: "none" }}
                                >
                                    {t("sort_by_rating")}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Course Stats */}
                    <Grid container spacing={3} className="mb-8">
                        {[
                            {
                                label: t("total_courses"),
                                value: courses?.length || 0,
                                icon: (
                                    <BookOpen className="h-4 w-4 text-gray-400" />
                                ),
                            },
                            {
                                label: t("total_students"),
                                value: totalStudents,
                                icon: (
                                    <Users className="h-4 w-4 text-gray-400" />
                                ),
                            },
                            {
                                label: t("total_revenue"),
                                value: formatCurrency(totalRevenue),
                                icon: (
                                    <DollarSign className="h-4 w-4 text-gray-400" />
                                ),
                            },
                            {
                                label: t("avg_rating"),
                                value: averageRating.toFixed(1),
                                icon: (
                                    <Star className="h-4 w-4 text-gray-400" />
                                ),
                            },
                        ].map((stat, idx) => (
                            <Grid item xs={12} sm={6} md={3} key={idx}>
                                <Card className="h-full">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                className="font-medium"
                                            >
                                                {stat.label}
                                            </Typography>
                                            {stat.icon}
                                        </div>
                                        <Typography
                                            variant="h4"
                                            component="div"
                                            className="font-bold mb-1"
                                        >
                                            {stat.value}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {stat.label === t("avg_rating")
                                                ? t("across_all_courses")
                                                : t("for_stat", { stat: stat.label.toLowerCase() })}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Courses List */}
                    <Grid container spacing={3}>
                        {courses?.map((course) => (
                            <Grid item xs={12} md={6} lg={4} key={course.id}>
                                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
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
                                                    Number(course.price)
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
                                        <Typography
                                            variant="h6"
                                            component="h3"
                                            className="font-semibold line-clamp-2"
                                        >
                                            {course.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            className="line-clamp-2"
                                        >
                                            {course.description}
                                        </Typography>
                                        <Box className="flex flex-wrap gap-1 pt-2">
                                            {course.categories
                                                ?.slice(0, 2)
                                                .map((category) => (
                                                    <Chip
                                                        key={category.id}
                                                        label={category.name}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{
                                                            fontSize: "0.75rem",
                                                        }}
                                                    />
                                                ))}
                                        </Box>
                                        <Box className="flex items-center justify-between text-sm pt-2">
                                            <Box className="flex items-center gap-1">
                                                <Rating
                                                    value={
                                                        course.average_rating
                                                    }
                                                    precision={0.1}
                                                    size="small"
                                                    readOnly
                                                />
                                                <Typography variant="caption">
                                                    {course.average_rating} (
                                                    {course.total_reviews})
                                                </Typography>
                                            </Box>
                                            <Box className="flex items-center gap-1 text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                <Typography variant="caption">
                                                    {course.duration}h
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box className="flex items-center justify-between pt-1">
                                            <Box className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                <Typography
                                                    variant="body2"
                                                    className="font-medium"
                                                >
                                                    {course.enrollments
                                                        ?.length || 0}{" "}
                                                    {t("students")}
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {t("updated")}{" "}
                                                {formatDate(
                                                    course.last_updated
                                                )}
                                            </Typography>
                                        </Box>
                                        <Box className="flex gap-2 pt-3">
                                            <Link
                                                href={`/my-courses/${slugify(
                                                    course.title
                                                )}?id=${course.id}`}
                                                passHref
                                            >
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    className="flex-1"
                                                    sx={{
                                                        textTransform: "none",
                                                    }}
                                                >
                                                    {t("manage_course")}
                                                </Button>
                                            </Link>

                                            <Button
                                                variant="outlined"
                                                size="small"
                                                sx={{ textTransform: "none" }}
                                            >
                                                {t("analytics")}
                                            </Button>
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
            </main>
        </div>
    );
}
