"use client";

import { useEffect, useState } from "react";
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
    Radio,
    RadioGroup,
    Skeleton,
    TextField,
    Slider,
    Button,
    Select,
    MenuItem,
    InputLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
} from "@mui/material";
import { ICategory, ICourse } from "../../../types/entities";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createSlugWithId } from "../../utils/utils";
import { useCurrency } from "@/context/CurrencyContext";
import { currencyService } from "@/services/currency";
import { useTranslations } from "next-intl";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";

interface ICoursesProps {
    courses: ICourse[] | undefined;
    categories: ICategory[] | undefined;
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

export default function Courses(props: ICoursesProps) {
    const t = useTranslations("Courses");
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
    const [ratingFilter, setRatingFilter] = useState<number | null>(() => {
        const rating =
            searchParams.get("rating") || searchParams.get("minRating");
        return rating ? parseInt(rating, 10) : null;
    });
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([
        0, 100000000,
    ]);
    const [sortBy, setSortBy] = useState<string>("id");
    const [sortOrder, setSortOrder] = useState<string>("DESC");

    // Pending filters (not yet applied to URL)
    const [pendingRatingFilter, setPendingRatingFilter] = useState<number | null>(null);
    const [pendingSelectedCategories, setPendingSelectedCategories] = useState<string[]>([]);
    const [pendingPriceRange, setPendingPriceRange] = useState<[number, number]>([0, 100000000]);

    const { currency } = useCurrency();
    const [convertedPrices, setConvertedPrices] = useState<
        Record<number, number>
    >({});

    useEffect(() => {
        if (!courses.length) return;

        let isMounted = true;

        async function convert() {
            const map: Record<number, number> = {};
            for (const c of courses) {
                map[c.id] = await currencyService.convertPrice(
                    c.price || 0,
                    "VND",
                    currency
                );
            }
            if (isMounted) setConvertedPrices(map);
        }

        convert();
        return () => {
            isMounted = false;
        };
    }, [courses, currency]);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        const params = new URLSearchParams(searchParams);
        params.set("page", value.toString());
        replace(`${pathname}?${params.toString()}`);
    };

    const handleRatingRadioChange = (r: number) => {
        const newRating = ratingFilter === r ? null : r;
        setRatingFilter(newRating);
        updateFilters({ minRating: newRating });
    };

    const updateFilters = (newFilters: Record<string, any>) => {
        setPage(1);
        const params = new URLSearchParams(searchParams);

        Object.entries(newFilters).forEach(([key, value]) => {
            if (value === null || value === undefined || value === "") {
                params.delete(key);
            } else {
                params.set(key, value.toString());
            }
        });

        params.set("page", "1");
        replace(`${pathname}?${params.toString()}`);
    };

    const handlePriceRangeChange = (
        event: Event,
        newValue: number | number[]
    ) => {
        const range = newValue as [number, number];
        setPriceRange(range);
        updateFilters({ minPrice: range[0], maxPrice: range[1] });
    };

    const handleSortChange = (field: string, order: string) => {
        setSortBy(field);
        setSortOrder(order);
        updateFilters({ orderBy: field, order });
    };

    const applyFilters = () => {
        setPage(1);
        const params = new URLSearchParams();

        // Apply rating filter
        if (pendingRatingFilter !== null) {
            params.set("minRating", pendingRatingFilter.toString());
        }

        // Apply category filters
        pendingSelectedCategories.forEach((catName) => {
            const cat = categories.find((c) => c.name === catName);
            if (cat) params.append("categoryIds", String(cat.id));
        });

        // Apply price range
        if (pendingPriceRange[0] > 0) {
            params.set("minPrice", pendingPriceRange[0].toString());
        }
        if (pendingPriceRange[1] < 100000000) {
            params.set("maxPrice", pendingPriceRange[1].toString());
        }

        // Keep current sort settings
        params.set("orderBy", sortBy);
        params.set("order", sortOrder);
        params.set("page", "1");

        replace(`${pathname}?${params.toString()}`);

        // Update the current filter states to match pending
        setRatingFilter(pendingRatingFilter);
        setSelectedCategories(pendingSelectedCategories);
        setPriceRange(pendingPriceRange);
    };

    const clearAllFilters = () => {
        setRatingFilter(null);
        setSelectedCategories([]);
        setPriceRange([0, 100000000]);
        setPendingRatingFilter(null);
        setPendingSelectedCategories([]);
        setPendingPriceRange([0, 100000000]);

        setSortBy("id");
        setSortOrder("DESC");
        setPage(1);
        replace(pathname);
    };

    const handleCategoryChange = (categoryName: string) => {
        const newCategories = selectedCategories.includes(categoryName)
            ? selectedCategories.filter((c) => c !== categoryName)
            : [...selectedCategories, categoryName];

        setSelectedCategories(newCategories);
        setPage(1);

        const params = new URLSearchParams(searchParams);

        // Reset categoryIds and append the current selection
        params.delete("categoryIds");
        newCategories.forEach((catName) => {
            const cat = categories.find((c) => c.name === catName);
            if (cat) params.append("categoryIds", String(cat.id));
        });

        params.set("page", "1");
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={3}>
                    <Box sx={{ position: "sticky", top: 20 }}>
                        <Typography variant="h6" gutterBottom>
                            {t("filters")}
                        </Typography>

                          {/* Sort Options */}
                          <Box sx={{ mb: 4 }}>
                            <Typography gutterBottom>{t("sort_by")}</Typography>
                            <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                                <Select
                                    value={`${sortBy}-${sortOrder}`}
                                    onChange={(e) => {
                                        const [field, order] =
                                            e.target.value.split("-");
                                        handleSortChange(field, order);
                                    }}
                                >
                                    <MenuItem value="id-DESC">
                                        {t("newest_first")}
                                    </MenuItem>
                                    <MenuItem value="id-ASC">
                                        {t("oldest_first")}
                                    </MenuItem>
                                    <MenuItem value="price-ASC">
                                        {t("price_low_high")}
                                    </MenuItem>
                                    <MenuItem value="price-DESC">
                                        {t("price_high_low")}
                                    </MenuItem>
                                    <MenuItem value="average_rating-DESC">
                                        {t("highest_rated")}
                                    </MenuItem>
                                    <MenuItem value="average_rating-ASC">
                                        {t("lowest_rated")}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Rating */}
                        <Box sx={{ mb: 4 }}>
                            <Typography gutterBottom>{t("ratings")}</Typography>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    value={pendingRatingFilter?.toString() || ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setPendingRatingFilter(value ? parseInt(value, 10) : null);
                                    }}
                                >
                                    <FormControlLabel
                                        value=""
                                        control={<Radio />}
                                        label={t("all_ratings")}
                                    />
                                    {[4, 3, 2, 1].map((r) => (
                                        <FormControlLabel
                                            key={r}
                                            value={r.toString()}
                                            control={<Radio />}
                                            label={`${r} & up`}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Price Range */}
                        <Box sx={{ mb: 4 }}>
                            <Typography gutterBottom>
                                {t("price_range")}
                            </Typography>
                            <Slider
                                value={pendingPriceRange}
                                onChange={(event, newValue) => {
                                    const range = newValue as [number, number];
                                    setPendingPriceRange(range);
                                }}
                                valueLabelDisplay="auto"
                                min={0}
                                max={100000000}
                                step={100000}
                                valueLabelFormat={(value) =>
                                    currencyService.formatPrice(value, currency)
                                }
                                sx={{ mt: 2 }}
                            />
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mt: 1,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {currencyService.formatPrice(
                                        pendingPriceRange[0],
                                        currency
                                    )}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {currencyService.formatPrice(
                                        pendingPriceRange[1],
                                        currency
                                    )}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                      

                        {/* Categories */}
                        <FormControl
                            component="fieldset"
                            sx={{ width: "100%" }}
                        >
                            <FormLabel component="legend">
                                {t("categories")}
                            </FormLabel>
                            <FormGroup>
                                {categories.map((category) => (
                                    <FormControlLabel
                                        key={category.id}
                                        control={
                                            <Checkbox
                                                checked={pendingSelectedCategories.includes(
                                                    category.name
                                                )}
                                                onChange={() => {
                                                    const newCategories = pendingSelectedCategories.includes(category.name)
                                                        ? pendingSelectedCategories.filter((c) => c !== category.name)
                                                        : [...pendingSelectedCategories, category.name];
                                                    setPendingSelectedCategories(newCategories);
                                                }}
                                            />
                                        }
                                        label={category.name}
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>

                        <Divider sx={{ my: 2 }} />

                        {/* Apply and Clear Filters */}
                        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexDirection: 'column' }}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<FilterListIcon />}
                                onClick={applyFilters}
                                color="primary"
                            >
                                {t("apply_filters")}
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<ClearIcon />}
                                onClick={clearAllFilters}
                                color="primary"
                            >
                                {t("clear_all_filters")}
                            </Button>
                        </Box>

                    </Box>
                </Grid>

                <Grid item xs={12} md={9}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            {t("all_courses")}
                        </Typography>
                        <Typography color="text.secondary">
                            {t("courses_found", { count: totalItems })}
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {courses.map(
                            (course) =>
                                !course.isPurchased && (
                                    <Grid item key={course.id} xs={12}>
                                        <Link
                                            href={`/courses/${createSlugWithId(course.title, course.id)}`}
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
                                                        transform:
                                                            "translateY(-3px)",
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

                                                {/* content */}
                                                <Box
                                                    sx={{
                                                        flex: 1,
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        justifyContent:
                                                            "space-between",
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
                                                            {t(
                                                                "instructor_placeholder"
                                                            )}
                                                        </Typography>

                                                        {/* rating */}
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
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
                                                                {
                                                                    course.total_reviews
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    {/* price */}
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        {convertedPrices[
                                                            course.id
                                                        ] === undefined ? (
                                                            <Skeleton
                                                                width={80}
                                                            />
                                                        ) : (
                                                            <Typography
                                                                variant="h6"
                                                                fontWeight={700}
                                                            >
                                                                {currencyService.formatPrice(
                                                                    convertedPrices[
                                                                        course
                                                                            .id
                                                                    ],
                                                                    currency
                                                                )}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Card>
                                        </Link>
                                    </Grid>
                                )
                        )}
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
