"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Card,
  IconButton,
  Chip,
  Avatar,
  Box,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  Rating,
} from '@mui/material';
import {
  MoreVert,
  Visibility,
  Flag,
  Block,
  CheckCircle,
  Person,
  School,
  ThumbUp,
} from '@mui/icons-material';
import { useState } from 'react';
import { IReview, ReviewStatus } from '@/../types/entities';

interface ReviewTableProps {
  reviews: IReview[];
  onView: (review: IReview) => void;
  onUpdateStatus: (review: IReview, status: ReviewStatus) => void;
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const statusColors = {
  [ReviewStatus.PUBLISHED]: 'success',
  [ReviewStatus.HIDDEN]: 'default',
} as const;

const statusIcons = {
  [ReviewStatus.PUBLISHED]: CheckCircle,
  [ReviewStatus.HIDDEN]: Block,
};

export function ReviewTable({
  reviews,
  onView,
  onUpdateStatus,
  totalCount,
  currentPage,
  onPageChange,
}: ReviewTableProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, review: IReview) => {
    setMenuAnchor(event.currentTarget);
    setSelectedReview(review);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedReview(null);
  };

  const handleView = () => {
    if (selectedReview) {
      onView(selectedReview);
    }
    handleMenuClose();
  };

  const handlePublish = () => {
    if (selectedReview) {
      onUpdateStatus(selectedReview, ReviewStatus.PUBLISHED);
    }
    handleMenuClose();
  };

  const handleHide = () => {
    if (selectedReview) {
      onUpdateStatus(selectedReview, ReviewStatus.HIDDEN);
    }
    handleMenuClose();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage + 1); // Convert from 0-based to 1-based
  };

  return (
    <>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Course</TableCell>
                <TableCell align="center">Rating</TableCell>
                <TableCell>Review</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Votes</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((review) => {
                const StatusIcon = statusIcons[review.status];
                return (
                  <TableRow key={review.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={review.user?.avatar_url || undefined}
                          sx={{ width: 40, height: 40, backgroundColor: 'primary.main' }}
                        >
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={500}>
                            {review.user?.name || 'Unknown User'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {review.user?.email || 'No email'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <School sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {review.course?.title || 'Unknown Course'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {review.course?.id || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Rating value={review.rating} readOnly size="small" />
                    </TableCell>
                    
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {review.comment}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <StatusIcon sx={{ fontSize: 16, color: `${statusColors[review.status]}.main` }} />
                        <Chip
                          label={review.status}
                          size="small"
                          color={statusColors[review.status]}
                          variant="filled"
                        />
                      </Box>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <ThumbUp sx={{ fontSize: 16, color: 'primary.main' }} />
                        <Typography variant="body2">
                          {(review.upVotes || 0) - (review.downVotes || 0)}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">
                        {new Date(review.date_reviewed).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Tooltip title="More actions">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, review)}
                          size="small"
                        >
                          <MoreVert />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={totalCount}
          rowsPerPage={10}
          page={currentPage - 1} // Convert to 0-based for MUI
          onPageChange={handleChangePage}
        />
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: '12px', minWidth: 160 },
        }}
      >
        <MenuItem onClick={handleView}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Visibility fontSize="small" />
            View Details
          </Box>
        </MenuItem>
        
        {selectedReview?.status === ReviewStatus.HIDDEN && (
          <MenuItem onClick={handlePublish} sx={{ color: 'success.main' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CheckCircle fontSize="small" />
              Publish
            </Box>
          </MenuItem>
        )}
        
        {selectedReview?.status === ReviewStatus.PUBLISHED && (
          <MenuItem onClick={handleHide} sx={{ color: 'error.main' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Block fontSize="small" />
              Hide Review
            </Box>
          </MenuItem>
        )}
      </Menu>
    </>
  );
}