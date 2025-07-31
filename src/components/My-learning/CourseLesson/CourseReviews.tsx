"use client";

import {
    Typography,
    Rating,
    LinearProgress,
    Box,
    Card,
    CardContent,
    Chip,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Stack,
    Avatar,
    Divider,
} from "@mui/material";
import { Star, StarOutline, FilterList } from "@mui/icons-material";
import { IReviewDistribution } from "../../../../types/resData";
import { IReview } from "../../../../types/entities";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from 'date-fns';

interface ICourseReviews {
    reviewDistribution?: IReviewDistribution;
    reviews?: IReview[];
    onFilterChange?: (stars: number | undefined, sortBy: string) => void;
}

type SortOption = 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating';

export default function CourseReviews({ reviewDistribution, reviews = [], onFilterChange }: ICourseReviews) {
    // Get initial values from URL
    const searchParams = new URLSearchParams(window.location.search);
    const initialRating = searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined;
    const initialSort = (searchParams.get('sort') as SortOption) || 'newest';

    const [selectedRating, setSelectedRating] = useState<number | undefined>(initialRating);
    const [sortBy, setSortBy] = useState<SortOption>(initialSort);

    const handleRatingFilter = (rating: number) => {
        const newRating = selectedRating === rating ? undefined : rating;
        setSelectedRating(newRating);
        onFilterChange?.(newRating, sortBy);
    };

    const handleSortChange = (newSortBy: SortOption) => {
        setSortBy(newSortBy);
        onFilterChange?.(selectedRating, newSortBy);
    };

    // Sync with URL parameters
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const urlRating = searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined;
        const urlSort = searchParams.get('sort') as SortOption;

        if (urlSort && urlSort !== sortBy) {
            setSortBy(urlSort);
        }
        
        if (urlRating !== selectedRating) {
            setSelectedRating(urlRating);
        }
    }, [window.location.search]);

    return (
        <Box className="space-y-6">
            {/* Header - Modern gradient paper similar to Overview */}
            <Paper
                elevation={0} 
                sx={{ 
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    borderRadius: 3,
                    p: 4,
                    color: 'white'
                }}
            >
                <Box className="flex items-center justify-between mb-4">
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            lineHeight: 1.2
                        }}
                    >
                        Student Reviews
                    </Typography>
                    <Chip
                        label={`${reviewDistribution?.total_reviews ?? 0} reviews`}
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                            }
                        }}
                    />
                </Box>

                {/* Filter Controls */}
            </Paper>

            {/* Rating Summary and Distribution */}
            <Card 
                elevation={2}
                sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    }
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <Box className="flex items-start gap-8">
                        {/* Overall Rating */}
                        <Box className="text-center flex-shrink-0">
                            <Typography
                                variant="h1"
                                sx={{ 
                                    fontSize: "4rem",
                                    fontWeight: 700,
                                    color: '#1976d2',
                                    mb: 2
                                }}
                            >
                                {reviewDistribution?.average_rating?.toFixed(1) ?? "N/A"}
                            </Typography>
                            <Rating
                                value={reviewDistribution?.average_rating ?? 0}
                                readOnly
                                precision={0.1}
                                size="large"
                                sx={{
                                    mb: 2,
                                    "& .MuiRating-iconFilled": {
                                        color: "#1976d2",
                                    }
                                }}
                            />
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.secondary',
                                    fontWeight: 500,
                                    textTransform: 'uppercase',
                                    letterSpacing: 1
                                }}
                            >
                                Course Rating
                            </Typography>
                        </Box>

                        {/* Rating Breakdown */}
                        <Box className="flex-1 space-y-4">
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: 'text.primary',
                                    mb: 3
                                }}
                            >
                                Rating Distribution
                            </Typography>
                            {reviewDistribution?.distribution?.map(
                                ({ stars, percentage, count }) => (
                                    <Box
                                        key={stars}
                                        className="flex items-center gap-4"
                                        sx={{ mb: 2 }}
                                    >
                                        <Box className="flex items-center gap-1 w-20">
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 500,
                                                    color: 'text.primary'
                                                }}
                                            >
                                                {stars}
                                            </Typography>
                                            <Star
                                                fontSize="small"
                                                sx={{ color: '#1976d2' }}
                                            />
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={percentage}
                                            sx={{
                                                flex: 1,
                                                height: 8,
                                                borderRadius: 2,
                                                backgroundColor: 'rgba(0,0,0,0.05)',
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: stars >= 4 
                                                        ? '#1976d2' 
                                                        : stars >= 3
                                                        ? '#42a5f5'
                                                        : stars >= 2
                                                        ? '#90caf9'
                                                        : '#e3f2fd',
                                                    borderRadius: 2,
                                                }
                                            }}
                                        />
                                        <Box className="flex items-center gap-2 w-24 justify-end">
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: 'text.primary'
                                                }}
                                            >
                                                {percentage}%
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{ color: 'text.secondary' }}
                                            >
                                                ({count})
                                            </Typography>
                                        </Box>
                                    </Box>
                                )
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Filter Controls */}
            <Card
                elevation={0}
                sx={{
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    borderRadius: 3,
                    mb: 4,
                    position: 'relative',
                    overflow: 'visible',
                    '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: 'linear-gradient(90deg, rgba(25,118,210,0.2) 0%, rgba(25,118,210,0.1) 50%, rgba(25,118,210,0) 100%)'
                    }
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <Box>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 600,
                                    color: 'text.primary',
                                    mb: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <FilterList sx={{ fontSize: 20, color: '#1976d2' }} />
                                Filter Reviews
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {selectedRating 
                                    ? `Showing ${selectedRating} star reviews` 
                                    : 'Showing all reviews'}
                            </Typography>
                        </Box>

                        <Box className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <FormControl 
                                size="small" 
                                sx={{ 
                                    minWidth: { xs: '100%', sm: 180 },
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: 'white',
                                            boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                                        }
                                    }
                                }}
                            >
                                <InputLabel id="rating-filter-label">Filter by Rating</InputLabel>
                                <Select
                                    labelId="rating-filter-label"
                                    value={selectedRating || ''}
                                    label="Filter by Rating"
                                    onChange={(e) => {
                                        const newRating = e.target.value ? Number(e.target.value) : undefined;
                                        setSelectedRating(newRating);
                                        onFilterChange?.(newRating, sortBy);
                                    }}
                                    renderValue={(selected) => (
                                        <Box className="flex items-center gap-1">
                                            <span>{selected}</span>
                                            <Star sx={{ fontSize: 14 }} />
                                        </Box>
                                    )}
                                >
                                    <MenuItem value="">
                                        <Box className="flex items-center gap-1">
                                            <Typography variant="body2" color="text.secondary">
                                                All Ratings
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                    {[5, 4, 3, 2, 1].map((star) => (
                                        <MenuItem key={star} value={star}>
                                            <Box className="flex items-center gap-1">
                                                <Rating 
                                                    value={star} 
                                                    readOnly 
                                                    size="small"
                                                    sx={{
                                                        color: '#1976d2',
                                                    }}
                                                />
                                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                    ({star} stars)
                                                </Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl 
                                size="small" 
                                sx={{ 
                                    minWidth: { xs: '100%', sm: 180 },
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'white',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: 'white',
                                            boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                                        }
                                    }
                                }}
                            >
                                <InputLabel id="sort-select-label">Sort by</InputLabel>
                                <Select
                                    labelId="sort-select-label"
                                    value={sortBy}
                                    label="Sort by"
                                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                                >
                                    <MenuItem value="newest">
                                        <Box className="flex items-center gap-2">
                                            <Typography>Newest First</Typography>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="oldest">
                                        <Box className="flex items-center gap-2">
                                            <Typography>Oldest First</Typography>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="highest_rating">
                                        <Box className="flex items-center gap-2">
                                            <Typography>Highest Rating</Typography>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="lowest_rating">
                                        <Box className="flex items-center gap-2">
                                            <Typography>Lowest Rating</Typography>
                                        </Box>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* User Reviews */}
            {reviews.length > 0 ? (
                <Stack spacing={2}>
                    {reviews.map((review) => (
                        <Card
                            key={review.id}
                            elevation={1}
                            sx={{
                                borderRadius: 2,
                                transition: 'all 0.2s ease',
                                border: '1px solid rgba(0,0,0,0.08)',
                                boxShadow: 'none',
                                '&:hover': {
                                    borderColor: 'rgba(0,0,0,0.12)',
                                    backgroundColor: 'rgba(0,0,0,0.01)'
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box className="flex flex-col gap-4">
                                    <Box className="flex items-center gap-3">
                                        <Avatar
                                            src={review.user.avatar_url || undefined}
                                            alt={review.user.name}
                                            sx={{ 
                                                width: 40, 
                                                height: 40,
                                                bgcolor: '#1976d2',
                                                fontSize: '1.2rem',
                                                fontWeight: 600
                                            }}
                                        >
                                            {review.user.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box className="flex-1">
                                            <Typography 
                                                variant="subtitle1" 
                                                sx={{
                                                    fontWeight: 600,
                                                    color: 'text.primary',
                                                    fontSize: '1rem',
                                                    lineHeight: 1.2
                                                }}
                                            >
                                                {review.user.name}
                                            </Typography>
                                            <Box className="flex items-center gap-2">
                                                <Rating
                                                    value={review.rating}
                                                    readOnly
                                                    size="small"
                                                    sx={{
                                                        fontSize: '1rem',
                                                        color: '#f59e0b',
                                                        '& .MuiRating-iconFilled': {
                                                            color: '#f59e0b'
                                                        }
                                                    }}
                                                />
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{
                                                        color: 'text.secondary',
                                                        fontSize: '0.85rem'
                                                    }}
                                                >
                                                    {formatDistanceToNow(new Date(review.date_reviewed), { addSuffix: true })}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Typography 
                                        variant="body1" 
                                        sx={{
                                            color: 'text.primary',
                                            lineHeight: 1.6,
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        {review.comment}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            ) : (
                <Card 
                    elevation={2}
                    sx={{
                        borderRadius: 3,
                        border: '2px dashed rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            borderColor: 'rgba(0,0,0,0.2)',
                            transform: 'translateY(-2px)',
                        }
                    }}
                >
                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                        <StarOutline 
                            sx={{ 
                                fontSize: 80,
                                color: 'action.disabled',
                                mb: 2
                            }} 
                        />
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 600,
                                color: 'text.primary',
                                mb: 1
                            }}
                        >
                            No reviews yet
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ color: 'text.secondary' }}
                        >
                            Be the first to leave a review for this course
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}