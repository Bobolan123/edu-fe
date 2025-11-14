"use client";

import * as React from "react";
import {
    alpha,
    Autocomplete,
    Avatar,
    Box,
    CircularProgress,
    InputBase,
    Paper,
    styled,
    Typography,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { ICourse } from "../../../types/entities";
import { sendRequest } from "@/utils/api";
import { useState, useEffect, useCallback } from "react";
import { createSlugWithId } from "@/utils/utils";
import { useCurrency } from "@/context/CurrencyContext";
import { currencyService } from "@/services/currency";


const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: 25,
    backgroundColor: alpha(theme.palette.grey[100], 0.8),
    border: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
    "&:hover": {
        backgroundColor: alpha(theme.palette.grey[200], 0.8),
        borderColor: alpha(theme.palette.primary.main, 0.3),
    },
    "&:focus-within": {
        backgroundColor: "white",
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    maxWidth: 350,
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: theme.palette.text.primary,
    width: "100%",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1.2, 2, 1.2, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        width: "100%",
        fontSize: "0.95rem",
        fontWeight: 400,
        "&::placeholder": {
            color: theme.palette.text.secondary,
            opacity: 0.8,
        },
        [theme.breakpoints.up("md")]: {
            width: "250px",
        },
    },
}));

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

// Component to handle currency formatting for course prices
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

export default function SearchAutocomplete() {
    const t = useTranslations("Navbar");
    const router = useRouter();
    const [searchText, setSearchText] = useState("");
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    // Debounce the search text by 300ms
    const debouncedSearch = useDebounce(searchText, 300);

    // Fetch courses based on debounced search text
    useEffect(() => {
        const fetchCourses = async () => {
            if (debouncedSearch.length >= 2) {
                setLoading(true);
                try {
                    const response = await sendRequest<IModelPaginate<ICourse>>({
                        method: "GET",
                        url: `${process.env.NEXT_PUBLIC_SERVER}/courses`,
                        queryParams: {
                            search: debouncedSearch,
                            take: 5, // Limit to 5 autocomplete suggestions
                        },
                    });

                    if (response?.data?.result) {
                        setCourses(response.data.result);
                        setOpen(true);
                    } else {
                        setCourses([]);
                        setOpen(false);
                    }
                } catch (error) {
                    console.error("Error fetching courses:", error);
                    setCourses([]);
                    setOpen(false);
                } finally {
                    setLoading(false);
                }
            } else {
                setCourses([]);
                setOpen(false);
            }
        };

        fetchCourses();
    }, [debouncedSearch]);

    const handleCourseSelect = (course: ICourse | null) => {
        if (course) {
            // Clear the input and close dropdown before navigation
            setSearchText("");
            setCourses([]);
            setOpen(false);

            // Navigate to course detail page
            const slug = createSlugWithId(course.title, course.id);
            router.push(`/courses/${slug}`);
        }
    };

    const handleInputChange = (event: React.SyntheticEvent, value: string) => {
        setSearchText(value);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" && searchText.trim().length >= 2) {
            // Navigate to courses page with search query
            router.push(`/courses?search=${encodeURIComponent(searchText.trim())}`);
            setSearchText("");
            setCourses([]);
            setOpen(false);
        }
    };

    return (
        <Autocomplete
            freeSolo
            open={open}
            onOpen={() => {
                if (courses.length > 0) {
                    setOpen(true);
                }
            }}
            onClose={() => setOpen(false)}
            options={courses}
            loading={loading}
            getOptionLabel={(option) =>
                typeof option === "string" ? option : option.title
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterOptions={(options, state) => {
                // Return all options as-is since filtering is done server-side
                return options;
            }}
            inputValue={searchText}
            onInputChange={handleInputChange}
            onChange={(_, value) => {
                if (typeof value === "string") {
                    // Handle free solo input
                    if (value.trim().length >= 2) {
                        router.push(`/courses?search=${encodeURIComponent(value.trim())}`);
                    }
                } else {
                    handleCourseSelect(value);
                }
            }}
            renderInput={(params) => (
                <Box
                    ref={params.InputProps.ref}
                    sx={{ position: "relative" }}
                >
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon sx={{ color: "text.secondary" }} />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder={t("search")}
                            inputProps={params.inputProps}
                            onKeyDown={handleKeyDown}
                            endAdornment={
                                loading ? (
                                    <CircularProgress color="inherit" size={20} sx={{ mr: 2 }} />
                                ) : null
                            }
                        />
                    </Search>
                </Box>
            )}
            renderOption={(props, option) => (
                <li {...props} key={option.id}>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center", width: "100%" }}>
                        {/* Course Thumbnail */}
                        <Avatar
                            src={option.thumbnail_url || undefined}
                            variant="rounded"
                            sx={{ width: 60, height: 40 }}
                        >
                            <SearchIcon />
                        </Avatar>

                        {/* Course Info */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                variant="body2"
                                fontWeight={500}
                                noWrap
                                sx={{ color: "text.primary" }}
                            >
                                {option.title}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                noWrap
                            >
                                {option.instructor.name}
                            </Typography>
                        </Box>

                        {/* Price */}
                        <Typography
                            variant="body2"
                            fontWeight={600}
                            color="primary"
                            sx={{ whiteSpace: "nowrap" }}
                        >
                            <CoursePrice price={option.price} />
                        </Typography>
                    </Box>
                </li>
            )}
            PaperComponent={({ children }) => (
                <Paper
                    elevation={8}
                    sx={{
                        mt: 1,
                        borderRadius: 2,
                        border: `1px solid ${alpha("#000", 0.1)}`,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        maxWidth: 500,
                        "& .MuiAutocomplete-listbox": {
                            maxHeight: "400px",
                            "& .MuiAutocomplete-option": {
                                px: 2,
                                py: 1.5,
                                borderBottom: `1px solid ${alpha("#000", 0.05)}`,
                                "&:last-child": {
                                    borderBottom: "none",
                                },
                                "&:hover": {
                                    backgroundColor: alpha("#1976d2", 0.08),
                                },
                            },
                        },
                    }}
                >
                    {children}
                </Paper>
            )}
            noOptionsText={
                searchText.length < 2 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                        {t("search_min_chars") || "Type at least 2 characters to search"}
                    </Typography>
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                        {t("no_results") || "No courses found"}
                    </Typography>
                )
            }
            loadingText={
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    {t("searching") || "Searching..."}
                </Typography>
            }
        />
    );
}
