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
    Pagination,
    FormControl,
    FormLabel,
    FormGroup,
    Checkbox,
    FormControlLabel,
    Divider,
    Chip,
    Radio,
} from "@mui/material";
import { ICategory, ICourse } from "../../../types/entities";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { slugify } from "../../../utils/utils";

interface ICoursesProps {
    courses: ICourse[] | undefined;
    categories: ICategory[] | undefined;
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

export default function Courses(props: ICoursesProps) {
    const {
        courses = [],
        currentPage,
        totalPages,
        totalItems,
        categories = [],
    } = props;

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [page, setPage] = useState(currentPage || 1);
    const [ratingFilter, setRatingFilter] = useState<number[]>([0, 5]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        const params = new URLSearchParams(searchParams);
        params.set("page", value.toString());
        replace(`${pathname}?${params.toString()}`);
    };

    const handleRatingRadioChange = (r: number) => {
        setRatingFilter([r, 5]);
        setPage(1);
        const params = new URLSearchParams(searchParams);
        params.set("rating", r.toString());
        params.set("page", "1");
        replace(`${pathname}?${params.toString()}`);
    };

    const handleCategoryChange = (categoryName: string) => {
        const newCategories = selectedCategories.includes(categoryName)
            ? selectedCategories.filter((c) => c !== categoryName)
            : [...selectedCategories, categoryName];

        setSelectedCategories(newCategories);
        setPage(1);

        const params = new URLSearchParams(searchParams);

        // Remove existing categoryIds
        params.delete("categoryIds");

        // Append correct category IDs from category names
        newCategories.forEach((catName) => {
            const cat = categories.find((c) => c.name === catName);
            if (cat) {
                params.append("categoryIds", String(cat.id));
            }
        });

        params.set("page", "1");
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Grid container spacing={4}>
                {/* Filters Sidebar */}
                <Grid item xs={12} md={3}>
                    <Box sx={{ position: "sticky", top: 20 }}>
                        <Typography variant="h6" gutterBottom>
                            Filters
                        </Typography>

                        {/* Rating Filter */}
                        <Box sx={{ mb: 4 }}>
                            <Typography gutterBottom>Ratings</Typography>
                            <FormGroup>
                                {[4.5, 4.0, 3.5, 3.0].map((r) => (
                                    <FormControlLabel
                                        key={r}
                                        control={
                                            <Radio
                                                checked={ratingFilter[0] === r}
                                                onChange={() =>
                                                    handleRatingRadioChange(r)
                                                }
                                            />
                                        }
                                        label={`${r} & up`}
                                    />
                                ))}
                            </FormGroup>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Category Filter */}
                        <FormControl
                            component="fieldset"
                            sx={{ width: "100%" }}
                        >
                            <FormLabel component="legend">Categories</FormLabel>
                            <FormGroup>
                                {categories.map((category) => (
                                    <FormControlLabel
                                        key={category.id}
                                        control={
                                            <Checkbox
                                                checked={selectedCategories.includes(
                                                    category.name
                                                )}
                                                onChange={() =>
                                                    handleCategoryChange(
                                                        category.name
                                                    )
                                                }
                                            />
                                        }
                                        label={category.name}
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                    </Box>
                </Grid>

                {/* Course List */}
                <Grid item xs={12} md={9}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            All Courses
                        </Typography>
                        <Typography color="text.secondary">
                            {totalItems} courses found
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {courses.map((course) => (
                            <Grid item key={course.id} xs={12}>
                                <Link
                                    href={`/courses/${slugify(
                                        course.title
                                    )}/?id=${course.id}`}
                                    style={{ textDecoration: "none" }}
                                >
                                    <Card
                                        sx={{
                                            display: "flex",
                                            p: 2,
                                            boxShadow: 1,
                                            borderRadius: 2,
                                            height: "220px",
                                            cursor: "pointer",
                                            transition:
                                                "transform 0.2s ease-in-out",
                                            ":hover": {
                                                transform: "translateY(-3px)",
                                            },
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                width: 200,
                                                height: "100%",
                                                objectFit: "cover",
                                                borderRadius: 2,
                                                mr: 2,
                                            }}
                                            image={
                                                course.thumbnail_url ||
                                                "/img_not_found.png"
                                            }
                                            alt={course.title}
                                        />
                                        <Box
                                            sx={{
                                                flex: 1,
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    fontWeight={700}
                                                    sx={{ mb: 0.5 }}
                                                >
                                                    {course.title}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    noWrap
                                                    sx={{ mb: 1 }}
                                                >
                                                    {course.description}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mb: 1 }}
                                                >
                                                    Instructor Name
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        mb: 1,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight={700}
                                                        color="#b4690e"
                                                        sx={{ mr: 0.5 }}
                                                    >
                                                        {course.average_rating.toFixed(
                                                            1
                                                        )}
                                                    </Typography>
                                                    <Rating
                                                        value={
                                                            course.average_rating ||
                                                            4.7
                                                        }
                                                        precision={0.1}
                                                        readOnly
                                                        size="small"
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ ml: 0.5 }}
                                                    >
                                                        {course.total_reviews}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    fontWeight={700}
                                                >
                                                    $
                                                    {Number(
                                                        course.price
                                                    ).toLocaleString()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>

            {totalPages > 1 && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 6,
                        alignItems: "center",
                    }}
                >
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                    />
                </Box>
            )}
        </Container>
    );
}
