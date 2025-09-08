"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  Star,
  RateReview,
  ThumbUp,
  Visibility,
} from '@mui/icons-material';
import { ReviewTable } from './ReviewTable';
import { ReviewDetailsDialog } from './ReviewDetailsDialog';
import { toastService } from '../../../services/toast';
import { ICourse, IUser } from '../../../../types/entities';
export interface IReview {
    id: number;
    user: IUser;
    course: ICourse;
    rating: number;
    comment: string;
    date_reviewed: Date;
    status: ReviewStatus;
    upVotes: number;
    downVotes: number;
}
export enum ReviewStatus {
    PUBLISHED = 'published',
    HIDDEN = 'hidden',
  }
interface AdminReviewsPageProps {
  reviews: IModelPaginate<IReview>;
  searchParams: {
    page?: string;
    search?: string;
    rating?: string;
    minRating?: string;
    maxRating?: string;
    status?: ReviewStatus;
    minUpVotes?: string;
    sortBy?: "NEWEST" | "OLDEST" | "HIGHEST_RATING" | "LOWEST_RATING";
  };
}

export default function AdminReviewsPage({ 
  reviews, 
  searchParams 
}: AdminReviewsPageProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(searchParams.search || '');
  const [selectedRating, setSelectedRating] = useState(searchParams.rating || 'all');
  const [minRating, setMinRating] = useState(searchParams.minRating || '');
  const [maxRating, setMaxRating] = useState(searchParams.maxRating || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.status || 'all');
  const [minUpVotes, setMinUpVotes] = useState(searchParams.minUpVotes || '');
  const [sortBy, setSortBy] = useState(searchParams.sortBy || 'NEWEST');
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateURL = (params: Record<string, string | undefined>) => {
    const urlSearchParams = new URLSearchParams();
    
    if (params.search && params.search !== '') {
      urlSearchParams.set('search', params.search);
    }
    
    if (params.rating && params.rating !== 'all') {
      urlSearchParams.set('rating', params.rating);
    }
    
    if (params.minRating && params.minRating !== '') {
      urlSearchParams.set('minRating', params.minRating);
    }

    if (params.maxRating && params.maxRating !== '') {
      urlSearchParams.set('maxRating', params.maxRating);
    }
    
    if (params.status && params.status !== 'all') {
      urlSearchParams.set('status', params.status);
    }
    
    if (params.minUpVotes && params.minUpVotes !== '') {
      urlSearchParams.set('minUpVotes', params.minUpVotes);
    }
    
    if (params.sortBy && params.sortBy !== 'NEWEST') {
      urlSearchParams.set('sortBy', params.sortBy);
    }
    
    if (params.page) {
      urlSearchParams.set('page', params.page);
    }
    
    const queryString = urlSearchParams.toString();
    const newUrl = window.location.pathname + (queryString ? '?' + queryString : '');
    router.push(newUrl, { scroll: false });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const handleRatingChange = (rating: string) => {
    setSelectedRating(rating);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleMinRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMinRating(value);
  };

  const handleMaxRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMaxRating(value);
  };

  const handleMinUpVotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMinUpVotes(value);
  };

  const handleSortByChange = (sortValue: string) => {
    setSortBy(sortValue as typeof sortBy);
  };

  const handlePageChange = (newPage: number) => {
    updateURL({ 
      search: searchTerm,
      rating: selectedRating,
      minRating: minRating,
      maxRating: maxRating,
      status: selectedStatus,
      minUpVotes: minUpVotes,
      sortBy: sortBy,
      page: (newPage + 1).toString() 
    });
  };

  const handleApplyFilters = () => {
    updateURL({ 
      search: searchTerm, 
      rating: selectedRating !== 'all' ? selectedRating : undefined,
      minRating: minRating !== '' ? minRating : undefined,
      maxRating: maxRating !== '' ? maxRating : undefined,
      status: selectedStatus !== 'all' ? selectedStatus : undefined,
      minUpVotes: minUpVotes !== '' ? minUpVotes : undefined,
      sortBy: sortBy !== 'NEWEST' ? sortBy : undefined,
      page: '1'
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setMinRating('');
    setMaxRating('');
    setSelectedStatus('all');
    setMinUpVotes('');
    setSortBy('NEWEST');
    updateURL({
      search: undefined,
      minRating: undefined,
      maxRating: undefined,
      status: undefined,
      minUpVotes: undefined,
      sortBy: undefined,
      page: '1'
    });
  };

  const handleView = (review: IReview) => {
    setSelectedReview(review);
    setDetailsDialogOpen(true);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setLoading(false);
    toastService.error(errorMessage);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const currentReviews = reviews.data?.result || [];
  const totalReviews = reviews.data?.meta?.itemCount || 0;
  const averageRating = currentReviews.reduce((sum, review) => sum + review.rating, 0) / currentReviews.length || 0;
  const publishedReviews = currentReviews.filter(r => r.status === ReviewStatus.PUBLISHED).length;
  const hiddenReviews = currentReviews.filter(r => r.status === ReviewStatus.HIDDEN).length;

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
              Review Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor and manage all course reviews on the platform
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <RateReview sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
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
              <Star sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {averageRating.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Visibility sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
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
              <ThumbUp sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {hiddenReviews}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hidden Reviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            {/* First Row - 3 filters */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={handleSearch}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Min Rating (1-5)"
                type="number"
                value={minRating}
                onChange={handleMinRatingChange}
                placeholder="1"
                size="small"
                inputProps={{ min: 1, max: 5, step: 1 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Max Rating (1-5)"
                type="number"
                value={maxRating}
                onChange={handleMaxRatingChange}
                placeholder="5"
                size="small"
                inputProps={{ min: 1, max: 5, step: 1 }}
              />
            </Grid>

            {/* Second Row - 3 filters */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedStatus}
                  label="Status"
                  onChange={(e) => handleStatusChange(e.target.value as string)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value={ReviewStatus.PUBLISHED}>Published</MenuItem>
                  <MenuItem value={ReviewStatus.HIDDEN}>Hidden</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => handleSortByChange(e.target.value as string)}
                >
                  <MenuItem value="NEWEST">Newest First</MenuItem>
                  <MenuItem value="OLDEST">Oldest First</MenuItem>
                  <MenuItem value="HIGHEST_RATING">Highest Rating</MenuItem>
                  <MenuItem value="LOWEST_RATING">Lowest Rating</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Min Up Votes"
                type="number"
                value={minUpVotes}
                onChange={handleMinUpVotesChange}
                placeholder="0"
                size="small"
                inputProps={{ min: 0 }}
              />
            </Grid>

            {/* Action Buttons Row */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={handleClearFilters}
                  size="small"
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  startIcon={<FilterList />}
                  onClick={handleApplyFilters}
                  size="small"
                >
                  Apply
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <ReviewTable
        reviews={currentReviews}
        onView={handleView}
        totalCount={totalReviews}
        currentPage={parseInt(searchParams.page || '1') - 1}
        onPageChange={handlePageChange}
      />

      {/* Review Details Dialog */}
      <ReviewDetailsDialog
        open={detailsDialogOpen}
        review={selectedReview}
        onClose={() => {
          setDetailsDialogOpen(false);
          setSelectedReview(null);
        }}
        onError={handleError}
      />
    </Box>
  );
}