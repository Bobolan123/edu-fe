"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Grid,
  Paper,
  Avatar,
  Rating,
  Chip,
  Stack,
  Divider,
  Button,
} from '@mui/material';
import {
  Close,
  Person,
  School,
  ThumbUp,
  CheckCircle,
  Block,
} from '@mui/icons-material';
import { IReview, ReviewStatus } from '@/../types/entities';

interface ReviewDetailsDialogProps {
  open: boolean;
  review: IReview | null;
  onClose: () => void;
  onUpdateStatus?: (review: IReview, status: ReviewStatus) => void;
}

const statusColors = {
  [ReviewStatus.PUBLISHED]: 'success',
  [ReviewStatus.HIDDEN]: 'default',
} as const;

export function ReviewDetailsDialog({
  open,
  review,
  onClose,
  onUpdateStatus,
}: ReviewDetailsDialogProps) {
  if (!review) return null;

  const handlePublish = () => {
    if (onUpdateStatus) {
      onUpdateStatus(review, ReviewStatus.PUBLISHED);
    }
  };

  const handleHide = () => {
    if (onUpdateStatus) {
      onUpdateStatus(review, ReviewStatus.HIDDEN);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            Review Details
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={3}>
          {/* Student Info */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }} variant="outlined">
              <Typography variant="h6" gutterBottom>
                Student Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar 
                  src={review.user?.avatar_url || undefined}
                  sx={{ backgroundColor: 'primary.main' }}
                >
                  <Person />
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {review.user?.name || 'Unknown User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {review.user?.email || 'No email'}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Course Info */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }} variant="outlined">
              <Typography variant="h6" gutterBottom>
                Course Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ backgroundColor: 'secondary.main' }}>
                  <School />
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {review.course?.title || 'Unknown Course'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Course ID: {review.course?.id || 'N/A'}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating value={review.rating} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">
                  {review.rating} out of 5 stars
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Review Content */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }} variant="outlined">
              <Typography variant="h6" gutterBottom>
                Review Content
              </Typography>
              <Typography variant="body1" paragraph>
                {review.comment}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Stack direction="row" spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ThumbUp sx={{ fontSize: 16, color: 'primary.main' }} />
                  <Typography variant="body2">
                    {(review.upVotes || 0) - (review.downVotes || 0)} net votes
                    ({review.upVotes || 0} up, {review.downVotes || 0} down)
                  </Typography>
                </Box>
                
                <Chip
                  label={review.status}
                  size="small"
                  color={statusColors[review.status]}
                  variant="filled"
                />
              </Stack>
            </Paper>
          </Grid>

          {/* Timeline */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }} variant="outlined">
              <Typography variant="h6" gutterBottom>
                Review Timeline
              </Typography>
              <Stack spacing={1}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Review Submitted
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(review.date_reviewed).toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
        <Button onClick={onClose}>
          Close
        </Button>
        {review.status === ReviewStatus.HIDDEN && onUpdateStatus && (
          <Button variant="contained" color="success" onClick={handlePublish}>
            Publish
          </Button>
        )}
        {review.status === ReviewStatus.PUBLISHED && onUpdateStatus && (
          <Button variant="outlined" color="error" onClick={handleHide}>
            Hide Review
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}