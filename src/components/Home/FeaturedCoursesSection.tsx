"use client";

import { useRef, useEffect, useState } from "react";
import { currencyService } from "@/services/currency";
import { useCurrency } from "@/context/CurrencyContext";
import {
    Box,
    Typography,
    IconButton,
    Card,
    CardContent,
    CardMedia,
    Button,
    Container,
    Chip,
    Avatar,
} from "@mui/material";
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Star,
    Person,
    ArrowRight,
} from "@mui/icons-material";
import { ICourse } from "../../../types/entities";
import Link from "next/link";
import { createSlugWithId } from "../../utils/utils";
import { useTranslations } from "next-intl";

interface IFeaturedCoursesSectionProps {
    courses: ICourse[] | undefined;
}

// Component to handle currency formatting for individual course prices
function CoursePrice({ price }: { price: number }) {
    const { currency } = useCurrency();
    const [convertedPrice, setConvertedPrice] = useState(price);

    useEffect(() => {
        if (currency === "USD") {
            currencyService
                .convertPrice(price, "VND", "USD")
                .then(setConvertedPrice)
                .catch(() => setConvertedPrice(price));
        } else {
            setConvertedPrice(price);
        }
    }, [price, currency]);

    return <>{currencyService.formatPrice(convertedPrice, currency)}</>;
}

export default function FeaturedCoursesSection({
    courses,
}: IFeaturedCoursesSectionProps) {
    const t = useTranslations("FeaturedCoursesSection");
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
            <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography
                    variant="h4"
                    component="h2"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                    }}
                >
                    ⭐ {t('title')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {t('description')}
                </Typography>
            </Box>

            <Box sx={{ position: "relative" }}>
                {/* Left Arrow */}
                <IconButton
                    onClick={() => scroll("left")}
                    sx={{
                        position: "absolute",
                        left: -50,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 2,
                        bgcolor: "white",
                        boxShadow: 2,
                        "&:hover": {
                            bgcolor: "grey.100",
                            transform: "translateY(-50%) scale(1.05)",
                        },
                        transition: "all 0.3s ease",
                    }}
                >
                    <ChevronLeftIcon />
                </IconButton>

                {/* Right Arrow */}
                <IconButton
                    onClick={() => scroll("right")}
                    sx={{
                        position: "absolute",
                        right: -50,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 2,
                        bgcolor: "white",
                        boxShadow: 2,
                        "&:hover": {
                            bgcolor: "grey.100",
                            transform: "translateY(-50%) scale(1.05)",
                        },
                        transition: "all 0.3s ease",
                    }}
                >
                    <ChevronRightIcon />
                </IconButton>

                <Box
                    ref={courseRef}
                    sx={{
                        display: "flex",
                        gap: 3,
                        overflowX: "auto",
                        pb: 2,
                        scrollbarWidth: "none",
                        "&::-webkit-scrollbar": { display: "none" },
                    }}
                >
                    {courses?.map((course, index) => (
                        <Card
                            key={course.id}
                            sx={{
                                minWidth: 320,
                                width: 320,
                                height: 460,
                                borderRadius: 3,
                                transition: "all 0.3s ease",
                                cursor: "pointer",
                                border: "1px solid",
                                borderColor: "divider",
                                display: "flex",
                                flexDirection: "column",
                                "&:hover": {
                                    transform: "translateY(-8px)",
                                    boxShadow: 6,
                                    borderColor: "primary.main",
                                },
                            }}
                        >
                                <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 aspect ratio */ }}>
                                    <CardMedia
                                        component="img"
                                        image={
                                            course.thumbnail_url ||
                                            "/img_not_found.png"
                                        }
                                        alt={course.title}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: "cover"
                                        }}
                                    />
                                </Box>

                            <CardContent
                                sx={{
                                    p: 2.5,
                                    display: "flex",
                                    flexDirection: "column",
                                    flexGrow: 1,
                                }}
                            >
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography
                                        variant="h6"
                                        component="h3"
                                        fontWeight="bold"
                                        sx={{
                                            height: "3.6em",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            fontSize: "1.1rem",
                                        }}
                                    >
                                        {course.title}
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            mb: 1.5,
                                            gap: 1,
                                            height: "28px",
                                        }}
                                    >
                                        <Avatar sx={{ width: 28, height: 28 }}>
                                            <Person sx={{ fontSize: 18 }} />
                                        </Avatar>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            fontWeight="medium"
                                            sx={{
                                                fontSize: "0.9rem",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {course.instructor?.name ||
                                                t('instructor')}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            mb: 1.5,
                                            height: "28px",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <Star
                                                sx={{
                                                    fontSize: 18,
                                                    color: "#ffd700",
                                                }}
                                            />
                                            <Typography
                                                variant="body2"
                                                fontWeight="bold"
                                                sx={{ fontSize: "0.9rem" }}
                                            >
                                                4.5
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ fontSize: "0.9rem" }}
                                            >
                                                (100)
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            color="primary"
                                            fontWeight="bold"
                                            sx={{ fontSize: "1.1rem" }}
                                        >
                                            <CoursePrice price={course.price} />
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,
                                            mb: 1.5,
                                            flexWrap: "nowrap",
                                            height: "28px",
                                            alignItems: "center",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {course.categories
                                            ?.slice(0, 2)
                                            .map((category) => (
                                                <Chip
                                                    key={category.id}
                                                    label={category.name}
                                                    size="medium"
                                                    variant="outlined"
                                                    sx={{
                                                        borderRadius: 2,
                                                        fontSize: "0.8rem",
                                                        height: "28px",
                                                        fontWeight: "medium",
                                                        flexShrink: 0,
                                                    }}
                                                />
                                            ))}
                                    </Box>
                                </Box>

                                <Button
                                    component={Link}
                                    href={`/courses/${createSlugWithId(course.title, course.id)}`}
                                    variant="contained"
                                    fullWidth
                                    endIcon={
                                        <ArrowRight sx={{ fontSize: 20 }} />
                                    }
                                    sx={{
                                        borderRadius: 2,
                                        py: 1.5,
                                        textTransform: "none",
                                        fontWeight: "bold",
                                        mt: "auto",
                                        fontSize: "1rem",
                                        height: "44px",
                                    }}
                                >
                                    {t('learn_more')}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
        </Container>
    );
}
