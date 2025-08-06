"use client";

import { useRef } from "react";
import {
    Box,
    Typography,
    IconButton,
    Card,
    CardContent,
    Container,
    Grid,
    Paper,
    Fade,
    Grow,
    Chip,
    Stack,
} from "@mui/material";
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Category as CategoryIcon,
    TrendingUp,
    School,
    Code,
    Business,
    Palette,
    Psychology,
} from "@mui/icons-material";
import { ICategory } from "../../../types/entities";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface ICategoriesSectionProps {
    categories: ICategory[] | undefined;
}

const categoryIcons = [
    CategoryIcon,
    School,
    Code,
    Business,
    Palette,
    Psychology,
    TrendingUp,
];

export default function CategoriesSection({
    categories,
}: ICategoriesSectionProps) {
    const t = useTranslations("CategoriesSection");
    const categoryRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (categoryRef.current) {
            const scrollAmount = direction === "left" ? -320 : 320;
            categoryRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <Box className="py-16 bg-gradient-to-br from-blue-50 to-slate-50">
            <Container maxWidth="lg">
                <Fade in timeout={1000}>
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ textAlign: "center", mb: 3 }}>
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
                                🏷️ {t('title')}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {t('description')}
                            </Typography>
                        </Box>
                    </Box>
                </Fade>

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
                        ref={categoryRef}
                        sx={{
                            display: "flex",
                            gap: 3,
                            overflowX: "auto",
                            pb: 2,
                            scrollbarWidth: "none",
                            "&::-webkit-scrollbar": { display: "none" },
                        }}
                    >
                        {categories?.slice(0, 4).map((category, index) => {
                            const IconComponent =
                                categoryIcons[index % categoryIcons.length];
                            return (
                                <Grow
                                    in
                                    timeout={800 + index * 100}
                                    key={category.id}
                                >
                                    <Card
                                        component={Link}
                                        href={`/courses?category=${category.id}`}
                                        sx={{
                                            minWidth: 280,
                                            textDecoration: "none",
                                            borderRadius: 3,
                                            transition: "all 0.3s ease",
                                            cursor: "pointer",
                                            border: "1px solid",
                                            borderColor: "divider",
                                            "&:hover": {
                                                transform: "translateY(-8px)",
                                                boxShadow: 6,
                                                borderColor: "primary.main",
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Stack spacing={2}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "space-between",
                                                    }}
                                                >
                                                    <Paper
                                                        elevation={0}
                                                        sx={{
                                                            p: 1.5,
                                                            borderRadius: 2,
                                                            bgcolor:
                                                                "primary.50",
                                                            display:
                                                                "inline-flex",
                                                        }}
                                                    >
                                                        <IconComponent
                                                            sx={{
                                                                fontSize: 32,
                                                                color: "primary.main",
                                                            }}
                                                        />
                                                    </Paper>
                                                    <Chip
                                                        size="small"
                                                        label={t('trending')}
                                                        sx={{
                                                            bgcolor:
                                                                "success.100",
                                                            color: "success.800",
                                                            fontWeight: "bold",
                                                        }}
                                                    />
                                                </Box>

                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography
                                                        variant="h6"
                                                        component="h3"
                                                        fontWeight="bold"
                                                        sx={{
                                                            mb: 1,
                                                            color: "text.primary",
                                                            transition:
                                                                "color 0.3s ease",
                                                        }}
                                                    >
                                                        {category.name}
                                                    </Typography>
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        justifyContent: 'space-between',
                                                        alignItems: 'flex-end',
                                                        gap: 2
                                                    }}>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                flexGrow: 1,
                                                                lineHeight: 1.6,
                                                                display:
                                                                    "-webkit-box",
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient:
                                                                    "vertical",
                                                                overflow: "hidden",
                                                            }}
                                                        >
                                                            {category.description ||
                                                                t('default_description', { categoryName: category.name })}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            color="primary.main"
                                                            fontWeight="bold"
                                                            sx={{
                                                                textTransform:
                                                                    "uppercase",
                                                                letterSpacing: 0.5,
                                                                whiteSpace: 'nowrap',
                                                                alignSelf: 'flex-end'
                                                            }}
                                                        >
                                                            {t('explore')}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grow>
                            );
                        })}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
