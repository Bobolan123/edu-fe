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
    Slider,
    Divider,
    Chip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { ICategory, ICourse } from "../../../types/entities";
import { usePathname, useSearchParams, useRouter } from "next/navigation";



interface ICoursesProps {
    courses: ICourse[] | undefined;
    categories: ICategory[] | undefined;
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

export default function Courses(props: ICoursesProps) {
    const { courses = [], currentPage, totalPages, totalItems, categories } = props;

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [page, setPage] = useState(currentPage || 1);
    const [ratingFilter, setRatingFilter] = useState<number[]>([0, 5]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const handlePageChange = (
        event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setPage(value);
        const params = new URLSearchParams(searchParams);
        params.set('page', value.toString());
        replace(`${pathname}?${params.toString()}`);
    };

    const handleRatingChange = (event: Event, newValue: number | number[]) => {
        setRatingFilter(newValue as number[]);
        setPage(1);
        const params = new URLSearchParams(searchParams);
        params.set('rating', newValue.toString());
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
    };

    const handleCategoryChange = (category: string) => {
        const newCategories = selectedCategories.includes(category)
            ? selectedCategories.filter((c) => c !== category)
            : [...selectedCategories, category];
            
        setSelectedCategories(newCategories);
        setPage(1);
        
        const params = new URLSearchParams(searchParams);
        params.set('categories', newCategories.join(','));
        params.set('page', '1');
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
                            <Typography gutterBottom>Rating</Typography>
                            <Slider
                                value={ratingFilter}
                                onChange={handleRatingChange}
                                valueLabelDisplay="auto"
                                min={0}
                                max={5}
                                step={0.5}
                                marks={[
                                    { value: 0, label: "0" },
                                    { value: 5, label: "5" },
                                ]}
                            />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Category Filter */}
                        <FormControl
                            component="fieldset"
                            sx={{ width: "100%" }}
                        >
                            <FormLabel component="legend">Categories</FormLabel>
                            <FormGroup>
                                {categories?.map((category) => (
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
                            <Grid item key={course.id} xs={12} sm={6} lg={4}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        transition:
                                            "transform 0.2s, box-shadow 0.2s",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <CardMedia
                                        component="div"
                                        sx={{
                                            height: 160,
                                            backgroundColor: "grey.200",
                                            backgroundImage: course.thumbnail_url ? `url(${course.thumbnail_url})` : 'none',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                        title={course.title}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        {course.categories && course.categories.map((category) => (
                                            <Chip
                                                key={category.id}
                                                label={category.name}
                                                size="small"
                                                sx={{ mb: 1, mr: 1 }}
                                            />
                                        ))}
                                        <Typography
                                            variant="h6"
                                            component="h3"
                                            gutterBottom
                                            noWrap
                                        >
                                            {course.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            gutterBottom
                                            noWrap
                                        >
                                            {course.description}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                mb: 1,
                                            }}
                                        >
                                            <Rating
                                                value={course.average_rating}
                                                precision={0.1}
                                                readOnly
                                                size="small"
                                            />
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ ml: 1 }}
                                            >
                                                ({course.average_rating})
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            color="primary"
                                        >
                                            ${Number(course.price).toFixed(2)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 6,
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
                </Grid>
            </Grid>
        </Container>
    );
}
