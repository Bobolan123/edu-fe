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
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
} from "@mui/material";
import {
    AccessTime as AccessTimeIcon,
    Language as LanguageIcon,
    Check as CheckIcon,
    ExpandMore as ExpandMoreIcon,
    PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { ICourse } from "../../../types/entities";

interface ICourseDetailProps {
    course: ICourse;
    similarCourses: ICourse[];
}

interface ICourseSection {
    title: string;
    duration: string;
    lectures: number;
    subsections?: { title: string; duration: string }[];
}

const courseSections: ICourseSection[] = [
    {
        title: "Welcome",
        duration: "05:00",
        lectures: 2,
        subsections: [
            { title: "Welcome to the Course", duration: "02:00" },
            { title: "Course PDF Guide", duration: "03:00" },
        ],
    },
    {
        title: "Installing and Exploring Node.js",
        duration: "45:00",
        lectures: 5,
    },
    {
        title: "Node.js Module System (Notes App)",
        duration: "1:30:00",
        lectures: 8,
    },
];

const learningPoints = [
    "Completely refreshed for 3rd edition",
    "Create Express web server and APIs",
    "Use cutting-edge ES6/ES7 JavaScript",
    "Create real-time web apps with Express",
    "Store data with MongoDB and Mongoose",
    "Deploy your Node apps to production",
];

export default function CourseDetail({
    course,
    similarCourses,
}: ICourseDetailProps) {
    const [currentTab, setCurrentTab] = useState(0);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

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
                            {course.categories.map((category) => (
                                <>
                                    <Chip label={`${category?.name}`} />
                                </>
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
                                {learningPoints.map((point, index) => (
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
                            <Box sx={{ mb: 2 }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    15 sections • 177 lectures • 20h 20m total
                                    length
                                </Typography>
                            </Box>
                            {courseSections.map((section, index) => (
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
                                            <Typography>
                                                {section.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {section.lectures} lectures •{" "}
                                                {section.duration}
                                            </Typography>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <List dense>
                                            {section.subsections?.map(
                                                (sub, idx) => (
                                                    <ListItem key={idx}>
                                                        <ListItemIcon>
                                                            <PlayArrowIcon />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={sub.title}
                                                            secondary={
                                                                sub.duration
                                                            }
                                                        />
                                                    </ListItem>
                                                )
                                            )}
                                        </List>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>
                    </Grid>

                    {/* Right Column - Sticky Card */}
                    <Grid item xs={12} md={4}>
                        <Box
                            sx={{
                                position: "sticky",
                                top: 80,
                                zIndex: 1,
                            }}
                        >
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
                                            ₫{Number(originalPrice).toLocaleString("vi-VN")}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                textDecoration: "line-through",
                                            }}
                                        >
                                            ₫{Number(originalPrice * 1.5).toLocaleString("vi-VN")}
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

                {/* Similar Courses */}
                {similarCourses.length > 0 && (
                    <Box sx={{ mt: 8 }}>
                        <Typography variant="h5" gutterBottom>
                            Similar Courses
                        </Typography>
                        <Grid container spacing={3}>
                            {similarCourses.map((item) => (
                                <Grid item key={item.id} xs={12} sm={6} md={4}>
                                    <Card>
                                        <CardMedia
                                            sx={{
                                                height: 140,
                                                backgroundImage: `url(${item.thumbnail_url})`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                            }}
                                        />
                                        <CardContent>
                                            <Typography variant="h6" noWrap>
                                                {item.title}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    mb: 1,
                                                }}
                                            >
                                                <Rating
                                                    value={item.average_rating}
                                                    precision={0.1}
                                                    readOnly
                                                    size="small"
                                                />
                                                <Typography
                                                    variant="body2"
                                                    sx={{ ml: 1 }}
                                                >
                                                    ({item.average_rating})
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="h6"
                                                color="primary"
                                            >
                                                ₫{Number(item.price).toLocaleString("vi-VN")}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Container>
        </div>
    );
}
