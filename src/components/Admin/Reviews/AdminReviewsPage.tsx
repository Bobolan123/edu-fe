"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  Comment,
  CheckCircle,
  Star,
  ThumbUp,
} from '@mui/icons-material';
import { ReviewTable } from './ReviewTable';
import { ReviewDetailsDialog } from './ReviewDetailsDialog';
import { toastService } from '../../../services/toast';
import { updateReview } from '@/actions/reviewsAction';
import { IReview, ReviewStatus } from '../../../../types/entities';


interface AdminReviewsPageProps {
  reviews: IModelPaginate<IReview>;
  searchParams: {
    page?: string;
    search?: string;
    rating?: string;
    status?: ReviewStatus;
    minUpVotes?: string;
    sortBy?: "newest" | "oldest" | "highest_rating" | "lowest_rating";
  };
}

export default function AdminReviewsPage({ reviews, searchParams }: AdminReviewsPageProps) {
  const router = useRouter();
  
  // Form state
  const [searchTerm, setSearchTerm] = useState(searchParams.search || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.status || 'All Status');
  const [selectedRating, setSelectedRating] = useState(searchParams.rating || 'All Ratings');
  const [minUpVotes, setMinUpVotes] = useState(searchParams.minUpVotes || '');
  const [sortBy, setSortBy] = useState(searchParams.sortBy || 'newest');
  
  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update URL parameters
  const updateSearchParams = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    
    // Keep existing params and update with new ones
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && !newParams.hasOwnProperty(key)) {
        params.set(key, value.toString());
      }
    });
    
    // Add new params
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== 'All Status' && value !== 'All Ratings') {
        params.set(key, value);
      }
    });
    
    // Reset to page 1 when filtering
    if (Object.keys(newParams).some(key => key !== 'page')) {
      params.set('page', '1');
    }
    
    router.push(`/admin/reviews?${params.toString()}`);
  };

  // Event handlers
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      updateSearchParams({ search: value || undefined });
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    updateSearchParams({ status: status === 'All Status' ? undefined : status });
  };

  const handleRatingChange = (rating: string) => {
    setSelectedRating(rating);
    updateSearchParams({ rating: rating === 'All Ratings' ? undefined : rating });
  };

  const handleMinUpVotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMinUpVotes(value);
    updateSearchParams({ minUpVotes: value || undefined });
  };

  const handleSortByChange = (sortBy: string) => {
    setSortBy(sortBy as "newest" | "oldest" | "highest_rating" | "lowest_rating");
    updateSearchParams({ sortBy });
  };

  const handleView = (review: IReview) => {
    setSelectedReview(review);
    setDetailsDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: page.toString() });
  };

  const handleUpdateStatus = async (review: IReview, status: ReviewStatus) => {
    setLoading(true);
    setError(null);
    
    try {
      await updateReview(review.id, { status });
      toastService.success('Review status updated successfully');
      router.refresh();
      setDetailsDialogOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update review status';
      setError(errorMessage);
      toastService.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalReviews = reviews.data?.meta?.itemCount || 0;
  const reviewsList = reviews.data?.result || [];
  const publishedReviews = reviewsList.filter((r: IReview) => r.status === ReviewStatus.PUBLISHED).length;
  const hiddenReviews = reviewsList.filter((r: IReview) => r.status === ReviewStatus.HIDDEN).length;
  const averageRating = reviewsList.length > 0 
    ? reviewsList.reduce((sum: number, review: IReview) => sum + review.rating, 0) / reviewsList.length 
    : 0;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          Reviews Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and moderate course reviews and ratings
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Comment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {totalReviews}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Reviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {publishedReviews}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Published Reviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Star sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {hiddenReviews}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hidden Reviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <ThumbUp sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {averageRating.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedStatus}
                  label="Status"
                  onChange={(e) => handleStatusChange(e.target.value as string)}
                >
                  <MenuItem value="All Status">All Status</MenuItem>
                  <MenuItem value={ReviewStatus.PUBLISHED}>Published</MenuItem>
                  <MenuItem value={ReviewStatus.HIDDEN}>Hidden</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Rating</InputLabel>
                <Select
                  value={selectedRating}
                  label="Rating"
                  onChange={(e) => handleRatingChange(e.target.value as string)}
                >
                  <MenuItem value="All Ratings">All Ratings</MenuItem>
                  <MenuItem value="5">5 Stars</MenuItem>
                  <MenuItem value="4">4 Stars</MenuItem>
                  <MenuItem value="3">3 Stars</MenuItem>
                  <MenuItem value="2">2 Stars</MenuItem>
                  <MenuItem value="1">1 Star</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Min Up Votes"
                type="number"
                value={minUpVotes}
                onChange={handleMinUpVotesChange}
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={1}>
              <FormControl fullWidth>
                <InputLabel>Sort</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort"
                  onChange={(e) => handleSortByChange(e.target.value as string)}
                >
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="oldest">Oldest</MenuItem>
                  <MenuItem value="highest_rating">Highest Rating</MenuItem>
                  <MenuItem value="lowest_rating">Lowest Rating</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Reviews Table */}
      {!loading && (
        <ReviewTable
          reviews={reviewsList}
          onView={handleView}
          onUpdateStatus={handleUpdateStatus}
          totalCount={totalReviews}
          currentPage={parseInt(searchParams.page || '1')}
          onPageChange={handlePageChange}
        />
      )}

      {/* Details Dialog */}
      <ReviewDetailsDialog
        open={detailsDialogOpen}
        review={selectedReview}
        onClose={() => setDetailsDialogOpen(false)}
        onUpdateStatus={handleUpdateStatus}
      />
    </Box>
  );
}