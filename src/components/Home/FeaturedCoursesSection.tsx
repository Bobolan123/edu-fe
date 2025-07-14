"use client";

import { useRef } from "react";
import {
    Box,
    Typography,
    IconButton,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Button,
    Container,
    Chip,
} from "@mui/material";
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { ICourse } from "../../../types/entities";
import Link from "next/link";
import { slugify } from "../../../utils/utils";
import { useTranslations } from "next-intl";

interface IFeaturedCoursesSectionProps {
    courses: ICourse[] | undefined;
}

export default function FeaturedCoursesSection({
    courses,
}: IFeaturedCoursesSectionProps) {
    const t = useTranslations('FeaturedCoursesSection');
    const courseRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (courseRef.current) {
            const scrollAmount = direction === "left" ? -300 : 300;
            courseRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <div className="flex justify-between items-center mb-6">
                <Typography variant="h4" component="h2">
                    {t('title')}
                </Typography>
                <div className="flex gap-2">
                    <IconButton onClick={() => scroll("left")}>
                        <ChevronLeftIcon />
                    </IconButton>
                    <IconButton onClick={() => scroll("right")}>
                        <ChevronRightIcon />
                    </IconButton>
                </div>
            </div>

            <Box
                ref={courseRef}
                className="flex overflow-x-hidden scroll-smooth gap-4 pb-4"
                sx={{
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                }}
            >
                {courses?.map((course) => (
                    <Card
                        key={course.id}
                        className="min-w-[280px] flex flex-col justify-between hover:shadow-lg transition-shadow"
                        sx={{
                            height: 360,
                            borderRadius: 2,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        }}
                    >
                        <Link
                            href={`/courses/${slugify(course.title)}/?id=${course.id}`}
                        >
                            <CardMedia
                                component="img"
                                image={
                                    course.thumbnail_url || "/img_not_found.png"
                                }
                                alt={course.title}
                                sx={{
                                    height: 160,
                                    objectFit: "cover",
                                    width: "100%",
                                }}
                            />
                            <CardContent className="flex-1">
                                <Typography variant="h6" component="h3" noWrap>
                                    {course.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {t('by_instructor', { instructor: course.instructor?.name })}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="primary"
                                    className="mt-2"
                                >
                                    ₫{course.price.toLocaleString("vi-VN")}
                                </Typography>

                                {course.categories?.length > 0 && (
                                    <Box className="flex flex-wrap gap-1 mt-2">
                                        {course.categories
                                            .slice(0, 3)
                                            .map((category) => (
                                                <Chip
                                                    key={category.id}
                                                    label={category.name}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor:
                                                            "#f0f0f0",
                                                        fontWeight: 500,
                                                    }}
                                                />
                                            ))}
                                    </Box>
                                )}
                            </CardContent>

                            <CardActions className="px-4 pb-4 pt-0">
                                <Button size="small" color="primary">
                                    {t('learn_more')}
                                </Button>
                            </CardActions>
                        </Link>
                    </Card>
                ))}
            </Box>
        </Container>
    );
}
