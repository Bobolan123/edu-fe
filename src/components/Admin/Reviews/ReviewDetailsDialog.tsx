"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Rating,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Close,
  Person,
  School,
  CalendarToday,
  ThumbUp,
  ThumbDown,
  Star,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { updateReview } from '@/actions/reviewsAction';
import { useRouter } from 'next/navigation';
import { toastService } from '@/services/toast';
import { IReview, ReviewStatus } from './AdminReviewsPage';

interface ReviewDetailsDialogProps {
  open: boolean;
  review: IReview | null;
  onClose: () => void;
  onError: (error: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'success';
    case 'pending':
      return 'warning';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'approved':
      return 'Approved';
    case 'pending':
      return 'Pending';
    case 'rejected':
      return 'Rejected';
    default:
      return status;
  }
};

export function ReviewDetailsDialog({
  open,
  review,
  onClose,
  onError,
}: ReviewDetailsDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: ReviewStatus) => {
    if (!review) return;
    
    setLoading(true);
    try {
      await updateReview(review.id, { status: newStatus });
      toastService.success(`Review ${newStatus} successfully!`);
      router.refresh();
      onClose();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to update review status');
    } finally {
      setLoading(false);
    }
  };

  if (!review) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            Review Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Grid container spacing={3}>
          {/* Reviewer Information */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Person sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight={600}>
                    Reviewer
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    src={review.user?.avatar_url || undefined}
                    sx={{ width: 48, height: 48 }}
                  >
                    {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      {review.user?.name || 'Unknown User'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {review.user?.email || 'No email'}
                    </Typography>
                    {review.user?.role && (
                      <Chip
                        label={review.user.role.name}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Course Information */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <School sx={{ color: 'secondary.main' }} />
                  <Typography variant="h6" fontWeight={600}>
                    Course
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {review.course?.title || 'Unknown Course'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    by {review.course?.instructor?.name || 'Unknown Instructor'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${review.course?.price || 0}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Review Details */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Star sx={{ color: 'warning.main' }} />
                    <Typography variant="h6" fontWeight={600}>
                      Review
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Rating value={review.rating || 0} readOnly />
                    <Typography variant="h6" fontWeight={600}>
                      {review.rating || 0} / 5
                    </Typography>
                  </Box>

                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {review.comment || 'No comment provided'}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <CalendarToday sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {review.date_reviewed 
                        ? `Reviewed on ${format(new Date(review.date_reviewed), 'MMMM dd, yyyy \'at\' HH:mm')}`
                        : 'Review date not available'
                      }
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography variant="body2" fontWeight={500}>
                      Status:
                    </Typography>
                    <Chip
                      label={getStatusLabel(review.status || 'unknown')}
                      color={getStatusColor(review.status || 'default') as any}
                      size="small"
                      variant="filled"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ThumbUp sx={{ fontSize: 20, color: 'success.main' }} />
                      <Typography variant="body2" fontWeight={500}>
                        {review.upVotes || 0} upvotes
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ThumbDown sx={{ fontSize: 20, color: 'error.main' }} />
                      <Typography variant="body2" fontWeight={500}>
                        {review.downVotes || 0} downvotes
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        {review.status === ReviewStatus.HIDDEN && (
          <Button
            onClick={() => handleStatusChange(ReviewStatus.PUBLISHED)}
            color="success"
            variant="contained"
            disabled={loading}
          >
            Publish Review
          </Button>
        )}
        {review.status === ReviewStatus.PUBLISHED && (
          <Button
            onClick={() => handleStatusChange(ReviewStatus.HIDDEN)}
            color="error"
            variant="outlined"
            disabled={loading}
          >
            Hide Review
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}