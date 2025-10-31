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
    IconButton,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
} from "@mui/material";
import { Star, StarOutline, FilterList, Edit, Delete, Add, Save, Cancel, ThumbUp, ThumbDown } from "@mui/icons-material";
import { IReviewDistribution } from "../../../../types/resData";
import { IReview } from "../../../../types/entities";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from 'date-fns';
import { createReview, updateReview, deleteReview, voteUp, voteDown, getUserVote, IUserVote } from "@/actions/reviewsAction";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface ICourseReviews {
    reviewDistribution?: IReviewDistribution;
    reviews?: IReview[];
    userReview?: IReview;
    courseId: number;
    onFilterChange?: (stars: number | undefined, sortBy: string) => void;
}

type SortOption = 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating';

export default function CourseReviews({ reviewDistribution, reviews = [], userReview, courseId, onFilterChange }: ICourseReviews) {
    // Get initial values from URL
    const searchParams = new URLSearchParams(window.location.search);
    const initialRating = searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined;
    const initialSort = (searchParams.get('sort') as SortOption) || 'newest';

    const [selectedRating, setSelectedRating] = useState<number | undefined>(initialRating);
    const [sortBy, setSortBy] = useState<SortOption>(initialSort);
    
    // State for review editing/creating
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editRating, setEditRating] = useState<number>(userReview?.rating || 5);
    const [editComment, setEditComment] = useState<string>(userReview?.comment || "");
    
    const router = useRouter();

    // Filter out user's review from the main reviews list
    const filteredReviews = reviews.filter(review => 
        !userReview || review.id !== userReview.id
    );

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

    // Reset form when user review changes
    useEffect(() => {
        setEditRating(userReview?.rating || 5);
        setEditComment(userReview?.comment || "");
    }, [userReview]);

    const handleCreateOrUpdateReview = async () => {
        setIsLoading(true);
        try {
            if (userReview) {
                // Update existing review
                await updateReview(userReview.id, {
                    rating: editRating,
                    comment: editComment
                });
                toast.success("Review updated successfully!");
            } else {
                // Create new review
                await createReview({
                    courseId: courseId,
                    rating: editRating,
                    comment: editComment
                });
                toast.success("Review created successfully!");
            }
            setIsEditDialogOpen(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to save review");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteReview = async () => {
        if (!userReview) return;
        
        setIsLoading(true);
        try {
            await deleteReview(userReview.id, courseId);
            toast.success("Review deleted successfully!");
            setIsDeleteDialogOpen(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete review");
        } finally {
            setIsLoading(false);
        }
    };

    const openEditDialog = () => {
        setEditRating(userReview?.rating || 5);
        setEditComment(userReview?.comment || "");
        setIsEditDialogOpen(true);
    };

    // Component to render a single review
    const ReviewCard = ({ review, isUserReview = false }: { review: IReview; isUserReview?: boolean }) => {
        const [userVote, setUserVote] = useState<IUserVote['voteType'] | null>(null);
        const [voteCount, setVoteCount] = useState({
            upVotes: review.upVotes || 0,
            downVotes: review.downVotes || 0,
        });
        const [isVoting, setIsVoting] = useState(false);

        // Load user's vote when component mounts
        useEffect(() => {
            const loadUserVote = async () => {
                try {
                    const response = await getUserVote(review.id);
                    if (response.data) {
                        setUserVote(response.data.voteType);
                    }
                } catch (error) {
                    // User hasn't voted yet, which is fine
                }
            };
            loadUserVote();
        }, [review.id]);

        const handleVote = async (type: 'UP' | 'DOWN') => {
            if (isVoting) return;

            setIsVoting(true);
            try {
                // If clicking the same vote type, it's an unvote (toggle)
                if (userVote === type) {
                    setIsVoting(false);
                    return;
                }

                // Call the appropriate vote endpoint
                if (type === 'UP') {
                    await voteUp(review.id);
                    // Update local state
                    setVoteCount(prev => ({
                        upVotes: userVote === 'DOWN' ? prev.upVotes + 1 : prev.upVotes + 1,
                        downVotes: userVote === 'DOWN' ? prev.downVotes - 1 : prev.downVotes,
                    }));
                    setUserVote('UP');
                } else {
                    await voteDown(review.id);
                    // Update local state
                    setVoteCount(prev => ({
                        upVotes: userVote === 'UP' ? prev.upVotes - 1 : prev.upVotes,
                        downVotes: userVote === 'UP' ? prev.downVotes + 1 : prev.downVotes + 1,
                    }));
                    setUserVote('DOWN');
                }
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to vote");
            } finally {
                setIsVoting(false);
            }
        };

        return (
        <Card
            key={review.id}
            elevation={isUserReview ? 2 : 1}
            sx={{
                borderRadius: 2,
                transition: 'all 0.2s ease',
                border: isUserReview 
                    ? '2px solid #1976d2' 
                    : '1px solid rgba(0,0,0,0.08)',
                boxShadow: isUserReview 
                    ? '0 4px 12px rgba(25, 118, 210, 0.15)' 
                    : 'none',
                backgroundColor: isUserReview 
                    ? 'rgba(25, 118, 210, 0.02)' 
                    : 'white',
                '&:hover': {
                    borderColor: isUserReview 
                        ? '#1976d2' 
                        : 'rgba(0,0,0,0.12)',
                    backgroundColor: isUserReview 
                        ? 'rgba(25, 118, 210, 0.04)' 
                        : 'rgba(0,0,0,0.01)'
                }
            }}
        >
            {isUserReview && (
                <Box 
                    sx={{ 
                        backgroundColor: '#1976d2',
                        color: 'white',
                        px: 2,
                        py: 1,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 1
                    }}
                >
                    Your Review
                </Box>
            )}
            <CardContent sx={{ p: 3 }}>
                <Box className="flex flex-col gap-4">
                    <Box className="flex items-center gap-3">
                        <Avatar
                            src={review.user?.avatar_url || undefined}
                            alt={review.user?.name || 'User'}
                            sx={{ 
                                width: 40, 
                                height: 40,
                                bgcolor: isUserReview ? '#1976d2' : '#1976d2',
                                fontSize: '1.2rem',
                                fontWeight: 600
                            }}
                        >
                            {review.user?.name?.charAt(0).toUpperCase() || 'U'}
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
                                {review.user?.name || 'Anonymous User'}
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
                        {/* Edit and Delete buttons for user's review */}
                        {isUserReview && (
                            <Box className="flex gap-1">
                                <IconButton
                                    size="small"
                                    onClick={openEditDialog}
                                    sx={{
                                        color: '#1976d2',
                                        '&:hover': {
                                            backgroundColor: 'rgba(25, 118, 210, 0.1)'
                                        }
                                    }}
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                    sx={{
                                        color: '#d32f2f',
                                        '&:hover': {
                                            backgroundColor: 'rgba(211, 47, 47, 0.1)'
                                        }
                                    }}
                                >
                                    <Delete fontSize="small" />
                                </IconButton>
                            </Box>
                        )}
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

                    {/* Voting Buttons - Don't show on user's own review */}
                    {!isUserReview && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', mr: 1 }}>
                                Was this helpful?
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Button
                                    size="small"
                                    variant={userVote === 'UP' ? 'contained' : 'outlined'}
                                    color={userVote === 'UP' ? 'primary' : 'inherit'}
                                    startIcon={<ThumbUp fontSize="small" />}
                                    onClick={() => handleVote('UP')}
                                    disabled={isVoting}
                                    sx={{
                                        minWidth: 'auto',
                                        px: 1.5,
                                        py: 0.5,
                                        fontSize: '0.75rem',
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: userVote === 'UP'
                                                ? 'primary.dark'
                                                : 'rgba(25, 118, 210, 0.08)',
                                        }
                                    }}
                                >
                                    {voteCount.upVotes}
                                </Button>
                                <Button
                                    size="small"
                                    variant={userVote === 'DOWN' ? 'contained' : 'outlined'}
                                    color={userVote === 'DOWN' ? 'error' : 'inherit'}
                                    startIcon={<ThumbDown fontSize="small" />}
                                    onClick={() => handleVote('DOWN')}
                                    disabled={isVoting}
                                    sx={{
                                        minWidth: 'auto',
                                        px: 1.5,
                                        py: 0.5,
                                        fontSize: '0.75rem',
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: userVote === 'DOWN'
                                                ? 'error.dark'
                                                : 'rgba(211, 47, 47, 0.08)',
                                        }
                                    }}
                                >
                                    {voteCount.downVotes}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
        );
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

            {/* Add Review Button - Show only if user hasn't reviewed */}
            {!userReview && (
                <Card 
                    elevation={1}
                    sx={{
                        borderRadius: 3,
                        border: '2px dashed #1976d2',
                        backgroundColor: 'rgba(25, 118, 210, 0.02)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.04)',
                            borderColor: '#1565c0',
                            transform: 'translateY(-1px)',
                        }
                    }}
                >
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setIsEditDialogOpen(true)}
                            sx={{
                                borderRadius: 2,
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                                }
                            }}
                        >
                            Write a Review
                        </Button>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: 'text.secondary', 
                                mt: 2,
                                fontSize: '0.9rem'
                            }}
                        >
                            Share your experience with this course
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* User Reviews */}
            {userReview || filteredReviews.length > 0 ? (
                <Stack spacing={3}>
                    {/* User's Review - Always displayed at the top if it exists */}
                    {userReview && (
                        <Box>
                            <ReviewCard review={userReview} isUserReview={true} />
                            {filteredReviews.length > 0 && (
                                <Divider sx={{ my: 3 }}>
                                    <Chip label="Other Reviews" sx={{ px: 2 }} />
                                </Divider>
                            )}
                        </Box>
                    )}
                    
                    {/* Other Reviews */}
                    {filteredReviews.length > 0 && (
                        <Stack spacing={2}>
                            {filteredReviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </Stack>
                    )}
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

            {/* Edit/Create Review Dialog */}
            <Dialog 
                open={isEditDialogOpen} 
                onClose={() => setIsEditDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1, fontWeight: 600, color: '#1976d2' }}>
                    {userReview ? 'Edit Review' : 'Write Review'}
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, fontWeight: 400 }}>
                        Share your honest experience with this course
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                    fontWeight: 600, 
                                    mb: 2,
                                    color: 'text.primary'
                                }}
                            >
                                Rating *
                            </Typography>
                            <Rating
                                value={editRating}
                                onChange={(_, value) => setEditRating(value || 1)}
                                size="large"
                                sx={{
                                    color: '#f59e0b',
                                    '& .MuiRating-iconFilled': {
                                        color: '#f59e0b'
                                    },
                                    '& .MuiRating-iconHover': {
                                        color: '#fbbf24'
                                    }
                                }}
                            />
                        </Box>
                        <TextField
                            label="Your Review"
                            placeholder="Tell others about your experience with this course..."
                            multiline
                            rows={4}
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            variant="outlined"
                            fullWidth
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#1976d2',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#1976d2',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#1976d2',
                                }
                            }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button 
                        onClick={() => setIsEditDialogOpen(false)}
                        sx={{ 
                            borderRadius: 2,
                            px: 3,
                            color: 'text.secondary'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateOrUpdateReview}
                        variant="contained"
                        disabled={isLoading || !editComment.trim()}
                        startIcon={isLoading ? <CircularProgress size={16} /> : <Save />}
                        sx={{
                            borderRadius: 2,
                            px: 4,
                            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                            },
                            '&:disabled': {
                                background: '#e0e0e0',
                                color: '#9e9e9e'
                            }
                        }}
                    >
                        {isLoading ? 'Saving...' : (userReview ? 'Update Review' : 'Submit Review')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ pb: 2, fontWeight: 600, color: '#d32f2f' }}>
                    Delete Review
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        Are you sure you want to delete your review? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button 
                        onClick={() => setIsDeleteDialogOpen(false)}
                        sx={{ 
                            borderRadius: 2,
                            px: 3,
                            color: 'text.secondary'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteReview}
                        variant="contained"
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={16} /> : <Delete />}
                        sx={{
                            borderRadius: 2,
                            px: 4,
                            backgroundColor: '#d32f2f',
                            '&:hover': {
                                backgroundColor: '#c62828',
                            },
                            '&:disabled': {
                                background: '#e0e0e0',
                                color: '#9e9e9e'
                            }
                        }}
                    >
                        {isLoading ? 'Deleting...' : 'Delete Review'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}