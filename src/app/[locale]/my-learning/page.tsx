"use client";

import { useState } from "react";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Box,
    LinearProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SelectChangeEvent,
    Chip,
} from "@mui/material";
import { AccessTime, Category } from "@mui/icons-material";
import Link from "next/link";
import { useLocale } from "next-intl";
import { slugify } from "../../../../utils/utils";

// Sample data - replace with actual data from your backend
const myCourses = [
    {
        id: 1,
        title: "Web Development Bootcamp",
        progress: 75,
        lastAccessed: "2024-02-20T10:00:00Z",
        category: "Web Development",
        thumbnail: "/sample/web-dev.jpg",
    },
    {
        id: 2,
        title: "Data Science Fundamentals",
        progress: 30,
        lastAccessed: "2024-02-19T15:30:00Z",
        category: "Data Science",
        thumbnail: "/logo.png",
    },
    {
        id: 3,
        title: "Mobile App Development",
        progress: 50,
        lastAccessed: "2024-02-18T09:15:00Z",
        category: "Mobile Development",
        thumbnail: "/sample/mobile-dev.jpg",
    },
];

type SortOption = "recent" | "progress" | "name";

export default function MyLearningPage() {
    const locale = useLocale();
    const [sortBy, setSortBy] = useState<SortOption>("recent");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    const handleSortChange = (event: SelectChangeEvent) => {
        setSortBy(event.target.value as SortOption);
    };

    const handleCategoryChange = (event: SelectChangeEvent) => {
        setCategoryFilter(event.target.value);
    };

    const categories = Array.from(
        new Set(myCourses.map((course) => course.category))
    );

    const sortCourses = (courses: typeof myCourses) => {
        switch (sortBy) {
            case "recent":
                return [...courses].sort(
                    (a, b) =>
                        new Date(b.lastAccessed).getTime() -
                        new Date(a.lastAccessed).getTime()
                );
            case "progress":
                return [...courses].sort((a, b) => b.progress - a.progress);
            case "name":
                return [...courses].sort((a, b) =>
                    a.title.localeCompare(b.title)
                );
            default:
                return courses;
        }
    };

    const filteredAndSortedCourses = sortCourses(
        categoryFilter === "all"
            ? myCourses
            : myCourses.filter((course) => course.category === categoryFilter)
    );

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                My Learning
            </Typography>

            <Box sx={{ mb: 4, display: "flex", gap: 2 }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        value={sortBy}
                        label="Sort By"
                        onChange={handleSortChange}
                    >
                        <MenuItem value="recent">Most Recent</MenuItem>
                        <MenuItem value="progress">Progress</MenuItem>
                        <MenuItem value="name">Course Name</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={categoryFilter}
                        label="Category"
                        onChange={handleCategoryChange}
                    >
                        <MenuItem value="all">All Categories</MenuItem>
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={3}>
                {filteredAndSortedCourses.map((course) => (
                    <Grid item key={course.id} xs={12} sm={6} md={4}>
                        <Card
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Link
                                href={`my-learning/${slugify(
                                    course.title
                                )}id?=${course.id}`}
                            >
                                <CardMedia
                                    component="div"
                                    sx={{
                                        height: 200,
                                        backgroundColor: "grey.200",
                                    }}
                                    title={course.title}
                                    image={course.thumbnail}
                                />
                            </Link>

                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ mb: 2 }}>
                                    <Chip
                                        label={course.category}
                                        size="small"
                                        icon={
                                            <Category sx={{ fontSize: 16 }} />
                                        }
                                    />
                                </Box>
                                <Typography variant="h6" gutterBottom>
                                    <Link
                                        href={`classroom/course/${course.title}`}
                                    >
                                        {course.title}
                                    </Link>
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        Progress
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={course.progress}
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        align="right"
                                    >
                                        {course.progress}%
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <AccessTime
                                        sx={{
                                            fontSize: 16,
                                            color: "text.secondary",
                                        }}
                                    />
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        Last accessed:{" "}
                                        {new Date(
                                            course.lastAccessed
                                        ).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
