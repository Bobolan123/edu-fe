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
import { useState } from "react";
import { formatDistanceToNow } from 'date-fns';

interface ICourseReviews {
    reviewDistribution?: IReviewDistribution;
    reviews?: IReview[];
    onFilterChange?: (stars: number[], sortBy: string) => void;
}

type SortOption = 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating';

export default function CourseReviews({ reviewDistribution, reviews = [], onFilterChange }: ICourseReviews) {
    const [selectedStars, setSelectedStars] = useState<number[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>('newest');

    const handleStarFilter = (stars: number) => {
        const newStars = selectedStars.includes(stars)
            ? selectedStars.filter(s => s !== stars)
            : [...selectedStars, stars];
        setSelectedStars(newStars);
        onFilterChange?.(newStars, sortBy);
    };

    const handleSortChange = (newSortBy: SortOption) => {
        setSortBy(newSortBy);
        onFilterChange?.(selectedStars, newSortBy);
    };

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
                                {selectedStars.length > 0 
                                    ? `Showing ${selectedStars.join(', ')} star reviews` 
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
                                    multiple
                                    value={selectedStars}
                                    label="Filter by Rating"
                                    onChange={(e) => {
                                        const newStars = e.target.value as number[];
                                        setSelectedStars(newStars);
                                        onFilterChange?.(newStars, sortBy);
                                    }}
                                    renderValue={(selected) => (
                                        <Box className="flex flex-wrap gap-1">
                                            {(selected as number[]).map((star) => (
                                                <Chip
                                                    key={star}
                                                    size="small"
                                                    label={
                                                        <Box className="flex items-center">
                                                            <span>{star}</span>
                                                            <Star sx={{ fontSize: 14, ml: 0.5 }} />
                                                        </Box>
                                                    }
                                                    sx={{
                                                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                                        borderRadius: 1,
                                                        height: 24
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                >
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
                                borderRadius: 3,
                                transition: 'all 0.3s ease',
                                border: '1px solid rgba(0,0,0,0.06)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
                                    borderColor: 'rgba(25,118,210,0.1)',
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box className="flex items-start gap-4">
                                    <Avatar
                                        src={review.user.avatar_url || undefined}
                                        alt={review.user.name}
                                        sx={{ 
                                            width: 48, 
                                            height: 48,
                                            border: '2px solid white',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                    <Box className="flex-1">
                                        <Box className="flex items-start sm:items-center flex-col sm:flex-row sm:justify-between gap-2 mb-3">
                                            <Box>
                                                <Typography 
                                                    variant="subtitle1" 
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: 'text.primary',
                                                        mb: 0.5
                                                    }}
                                                >
                                                    {review.user.name}
                                                </Typography>
                                                <Box className="flex items-center gap-2">
                                                    <Typography 
                                                        variant="caption" 
                                                        sx={{
                                                            color: 'text.secondary',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.5
                                                        }}
                                                    >
                                                        {formatDistanceToNow(new Date(review.date_reviewed), { addSuffix: true })}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box className="flex items-center gap-2">
                                                <Rating
                                                    value={review.rating}
                                                    readOnly
                                                    size="small"
                                                    sx={{
                                                        "& .MuiRating-iconFilled": {
                                                            color: "#1976d2",
                                                        }
                                                    }}
                                                />
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        color: 'text.secondary',
                                                        backgroundColor: 'rgba(25,118,210,0.08)',
                                                        px: 1,
                                                        py: 0.5,
                                                        borderRadius: 1,
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    {review.rating}.0
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography 
                                            variant="body2" 
                                            sx={{
                                                color: 'text.primary',
                                                lineHeight: 1.6,
                                                letterSpacing: 0.2
                                            }}
                                        >
                                            {review.comment}
                                        </Typography>
                                    </Box>
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