"use client";

import { useState } from "react";
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Rating,
    Box,
    Button,
    Chip,
} from "@mui/material";
import {
    AccessTime as AccessTimeIcon,
    Language as LanguageIcon,
    Check as CheckIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { ICourse, ICourseContent } from "../../../types/entities";
import {
    PlayArrow as PlayIcon,
    AccessTime as ClockIcon,
    MenuBook as BookIcon,
} from "@mui/icons-material";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Play } from "lucide-react";

interface ICourseDetailProps {
    course: ICourse;
    courseContent: ICourseContent;
}

export default function CourseDetail({
    course,
    courseContent,
}: ICourseDetailProps) {

    const originalPrice = course?.price ?? 100;

    return (
        <div className="my-8">
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Left Column */}
                    <Grid item xs={12} md={8}>
                        <Typography variant="h3" gutterBottom>
                            {course?.title}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            gutterBottom
                        >
                            {course?.description}
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                mb: 2,
                            }}
                        >
                            <Rating
                                value={course?.average_rating}
                                precision={0.1}
                                readOnly
                            />
                            <Typography>({course?.average_rating})</Typography>
                            <Typography color="text.secondary">
                                {course?.total_students} students
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 3,
                                mb: 2,
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <AccessTimeIcon sx={{ mr: 1 }} />
                                <Typography>
                                    {Math.round(course?.duration / 60)} hours
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <LanguageIcon sx={{ mr: 1 }} />
                                <Typography>English</Typography>
                            </Box>
                            <Typography>
                                Last updated:{" "}
                                {format(
                                    new Date(course?.last_updated),
                                    "MMM dd, yyyy"
                                )}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            {course.categories.map((category, i) => (
                                <Chip label={category?.name} key={i} />
                            ))}
                        </Box>

                        {/* What you'll learn */}
                        <Box
                            sx={{
                                mt: 6,
                                p: 3,
                                border: 1,
                                borderColor: "divider",
                                borderRadius: 1,
                            }}
                        >
                            <Typography variant="h5" gutterBottom>
                                What you'll learn
                            </Typography>
                            <Grid container spacing={2}>
                                {courseContent?.whatYoullLearn?.map((point, index) => (
                                    <Grid item xs={12} md={6} key={index}>
                                        <Box sx={{ display: "flex", gap: 2 }}>
                                            <CheckIcon color="primary" />
                                            <Typography>{point}</Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        {/* Course Content */}
                        <Box sx={{ mt: 6 }}>
                            <Typography variant="h5" gutterBottom>
                                Course Content
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 4,
                                    mb: 2,
                                    color: "gray",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <BookIcon fontSize="small" />
                                    <Typography>
                                        {courseContent?.sections?.length} sections
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <PlayIcon fontSize="small" />
                                    <Typography>
                                        {courseContent?.totalLectures} lectures
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <ClockIcon fontSize="small" />
                                    <Typography>
                                        {courseContent?.totalLength} total length
                                    </Typography>
                                </Box>
                            </Box>

                            {courseContent?.sections?.map((section, index) => (
                                <Accordion key={index}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                width: "100%",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 2,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        bgcolor:
                                                            "primary.light",
                                                        borderRadius: "50%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        fontWeight: 600,
                                                        color: "primary.main",
                                                    }}
                                                >
                                                    {index + 1}
                                                </Box>
                                                <Typography fontWeight={600}>
                                                    {section.title}
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                className="flex items-center gap-1"
                                            >
                                                <Play className="w-4 h-4" />
                                                {section.totalLectures} lectures
                                            </Typography>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {section.lectures?.map((sub, idx) => (
                                            <Box
                                                key={idx}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                    px: 2,
                                                    py: 1,
                                                    "&:hover": {
                                                        bgcolor: "action.hover",
                                                    },
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1,
                                                    }}
                                                >
                                                    <PlayIcon fontSize="small" />
                                                    <Typography>
                                                        {sub.title}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1,
                                                    }}
                                                >
                                                    <ClockIcon fontSize="small" />
                                                    <Typography variant="body2">
                                                        {sub.totalDuration}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>
                    </Grid>

                    {/* Right Column - Sticky Card */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ position: "sticky", top: 80, zIndex: 1 }}>
                            <Card
                                sx={{
                                    boxShadow: 6,
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    transition: "transform 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                    },
                                }}
                            >
                                <CardMedia
                                    component="div"
                                    sx={{
                                        height: 220,
                                        backgroundImage: `url(${course?.thumbnail_url})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                />
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "baseline",
                                            gap: 1,
                                            mb: 2,
                                        }}
                                    >
                                        <Typography
                                            variant="h4"
                                            fontWeight={600}
                                        >
                                            ₫
                                            {Number(
                                                originalPrice
                                            ).toLocaleString("vi-VN")}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                textDecoration: "line-through",
                                            }}
                                        >
                                            ₫
                                            {Number(
                                                originalPrice * 1.5
                                            ).toLocaleString("vi-VN")}
                                        </Typography>
                                    </Box>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{
                                            mb: 1.5,
                                            py: 1.3,
                                            fontWeight: 600,
                                        }}
                                    >
                                        Add to cart
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        fullWidth
                                        sx={{ py: 1.3, fontWeight: 600 }}
                                    >
                                        Buy now
                                    </Button>
                                    <Typography
                                        variant="caption"
                                        display="block"
                                        sx={{ mt: 1 }}
                                        color="text.secondary"
                                    >
                                        30-Day Money-Back Guarantee
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}
