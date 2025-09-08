"use client";

import { useState } from 'react';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Typography,
  Box,
  Avatar,
  Rating,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Visibility,
  ThumbUp,
  ThumbDown,
  Star,
} from '@mui/icons-material';
import { IReview } from '../../../../types/entities';
import { format } from 'date-fns';

interface ReviewTableProps {
  reviews: IReview[];
  onView: (review: IReview) => void;
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
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

export function ReviewTable({
  reviews,
  onView,
  totalCount,
  currentPage,
  onPageChange,
}: ReviewTableProps) {
  const [page, setPage] = useState(currentPage);
  const [rowsPerPage] = useState(10);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
    onPageChange(newPage);
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reviewer</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Votes</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No reviews found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your filters or search criteria
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        src={review.user?.avatar_url || undefined}
                        sx={{ width: 32, height: 32 }}
                      >
                        {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {review.user?.name || 'Unknown User'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {review.user?.email || 'No email'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {truncateText(review.course?.title || 'Unknown Course', 40)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        by {review.course?.instructor?.name || 'Unknown Instructor'}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={review.rating || 0} readOnly size="small" />
                      <Typography variant="body2" fontWeight={500}>
                        {review.rating || 0}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {truncateText(review.comment || 'No comment')}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {review.date_reviewed ? format(new Date(review.date_reviewed), 'MMM dd, yyyy') : 'No date'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {review.date_reviewed ? format(new Date(review.date_reviewed), 'HH:mm') : ''}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={getStatusLabel(review.status || 'unknown')}
                      color={getStatusColor(review.status || 'default') as any}
                      size="small"
                      variant="filled"
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ThumbUp sx={{ fontSize: 16, color: 'success.main' }} />
                        <Typography variant="caption">{review.upVotes || 0}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ThumbDown sx={{ fontSize: 16, color: 'error.main' }} />
                        <Typography variant="caption">{review.downVotes || 0}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => onView(review)}
                        color="primary"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10]}
      />
    </Card>
  );
}