"use client";

import { useState } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Avatar,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  InputAdornment,
  Tooltip,
  Rating,
  Paper,
  Divider,
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Visibility,
  Delete,
  Flag,
  Star,
  ThumbUp,
  Comment,
  School,
  Person,
  Close,
  CheckCircle,
  Block,
} from '@mui/icons-material';

interface Review {
  id: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  courseTitle: string;
  courseId: string;
  rating: number;
  comment: string;
  isVerified: boolean;
  status: 'published' | 'pending' | 'flagged' | 'hidden';
  helpfulVotes: number;
  createdAt: string;
  updatedAt: string;
}

const mockReviews: Review[] = [
  {
    id: '1',
    studentName: 'John Doe',
    studentEmail: 'john.doe@email.com',
    courseTitle: 'React Fundamentals',
    courseId: '1',
    rating: 5,
    comment: 'Excellent course! The instructor explains everything clearly and the hands-on projects really helped me understand React concepts. Highly recommended for beginners.',
    isVerified: true,
    status: 'published',
    helpfulVotes: 24,
    createdAt: '2024-02-20T10:30:00Z',
    updatedAt: '2024-02-20T10:30:00Z',
  },
  {
    id: '2',
    studentName: 'Sarah Wilson',
    studentEmail: 'sarah.wilson@email.com',
    courseTitle: 'Advanced JavaScript',
    courseId: '2',
    rating: 4,
    comment: 'Great course with comprehensive content. The advanced topics were well covered, though I wish there were more practical examples.',
    isVerified: true,
    status: 'published',
    helpfulVotes: 18,
    createdAt: '2024-02-19T15:45:00Z',
    updatedAt: '2024-02-19T15:45:00Z',
  },
  {
    id: '3',
    studentName: 'Mike Johnson',
    studentEmail: 'mike.johnson@email.com',
    courseTitle: 'Python for Data Science',
    courseId: '3',
    rating: 3,
    comment: 'The course content is good but the pace is quite fast. Would benefit from more detailed explanations in some sections.',
    isVerified: false,
    status: 'pending',
    helpfulVotes: 7,
    createdAt: '2024-02-18T09:15:00Z',
    updatedAt: '2024-02-18T09:15:00Z',
  },
  {
    id: '4',
    studentName: 'Emma Brown',
    studentEmail: 'emma.brown@email.com',
    courseTitle: 'UI/UX Design Principles',
    courseId: '4',
    rating: 2,
    comment: 'Not impressed with this course. The content feels outdated and the instructor seems unprepared. Would not recommend.',
    isVerified: true,
    status: 'flagged',
    helpfulVotes: 3,
    createdAt: '2024-02-17T14:20:00Z',
    updatedAt: '2024-02-18T10:00:00Z',
  },
  {
    id: '5',
    studentName: 'David Lee',
    studentEmail: 'david.lee@email.com',
    courseTitle: 'Machine Learning Basics',
    courseId: '5',
    rating: 5,
    comment: 'Outstanding course! Clear explanations, excellent examples, and great support from the instructor. Worth every penny!',
    isVerified: true,
    status: 'published',
    helpfulVotes: 42,
    createdAt: '2024-02-16T11:30:00Z',
    updatedAt: '2024-02-16T11:30:00Z',
  },
  {
    id: '6',
    studentName: 'Lisa Martinez',
    studentEmail: 'lisa.martinez@email.com',
    courseTitle: 'Node.js Development',
    courseId: '6',
    rating: 1,
    comment: 'Terrible course with poor audio quality and confusing explanations. Waste of money.',
    isVerified: false,
    status: 'hidden',
    helpfulVotes: 1,
    createdAt: '2024-02-15T08:45:00Z',
    updatedAt: '2024-02-16T09:00:00Z',
  },
];

const statusColors = {
  published: 'success',
  pending: 'warning',
  flagged: 'error',
  hidden: 'default',
} as const;

const statusIcons = {
  published: CheckCircle,
  pending: Star,
  flagged: Flag,
  hidden: Block,
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(mockReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedRating, setSelectedRating] = useState('All Ratings');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterReviews(value, selectedStatus, selectedRating);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    filterReviews(searchTerm, status, selectedRating);
  };

  const handleRatingChange = (rating: string) => {
    setSelectedRating(rating);
    filterReviews(searchTerm, selectedStatus, rating);
  };

  const filterReviews = (search: string, status: string, rating: string) => {
    let filtered = reviews;

    if (search) {
      filtered = filtered.filter(review =>
        review.studentName.toLowerCase().includes(search.toLowerCase()) ||
        review.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
        review.comment.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== 'All Status') {
      filtered = filtered.filter(review => review.status === status);
    }

    if (rating !== 'All Ratings') {
      const ratingNum = parseInt(rating);
      filtered = filtered.filter(review => review.rating === ratingNum);
    }

    setFilteredReviews(filtered);
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, review: Review) => {
    setMenuAnchor(event.currentTarget);
    setSelectedReview(review);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedReview(null);
  };

  const handleViewDetails = () => {
    setDetailsDialogOpen(true);
    handleMenuClose();
  };

  const handleApprove = () => {
    if (selectedReview) {
      const updatedReviews = reviews.map(r => 
        r.id === selectedReview.id 
          ? { ...r, status: 'published' as const, updatedAt: new Date().toISOString() }
          : r
      );
      setReviews(updatedReviews);
      setFilteredReviews(updatedReviews);
    }
    handleMenuClose();
  };

  const handleFlag = () => {
    if (selectedReview) {
      const updatedReviews = reviews.map(r => 
        r.id === selectedReview.id 
          ? { ...r, status: 'flagged' as const, updatedAt: new Date().toISOString() }
          : r
      );
      setReviews(updatedReviews);
      setFilteredReviews(updatedReviews);
    }
    handleMenuClose();
  };

  const handleHide = () => {
    if (selectedReview) {
      const updatedReviews = reviews.map(r => 
        r.id === selectedReview.id 
          ? { ...r, status: 'hidden' as const, updatedAt: new Date().toISOString() }
          : r
      );
      setReviews(updatedReviews);
      setFilteredReviews(updatedReviews);
    }
    handleMenuClose();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const ReviewDetailsDialog = () => (
    <Dialog 
      open={detailsDialogOpen} 
      onClose={() => setDetailsDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            Review Details
          </Typography>
          <IconButton onClick={() => setDetailsDialogOpen(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      {selectedReview && (
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            {/* Student Info */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }} variant="outlined">
                <Typography variant="h6" gutterBottom>
                  Student Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ backgroundColor: 'primary.main' }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      {selectedReview.studentName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedReview.studentEmail}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {selectedReview.isVerified ? (
                    <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                  ) : (
                    <Block sx={{ fontSize: 16, color: 'error.main' }} />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {selectedReview.isVerified ? 'Verified Purchase' : 'Unverified'}
                  </Typography>
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
                      {selectedReview.courseTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Course ID: {selectedReview.courseId}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={selectedReview.rating} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {selectedReview.rating} out of 5 stars
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
                  {selectedReview.comment}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Stack direction="row" spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ThumbUp sx={{ fontSize: 16, color: 'primary.main' }} />
                    <Typography variant="body2">
                      {selectedReview.helpfulVotes} helpful votes
                    </Typography>
                  </Box>
                  
                  <Chip
                    label={selectedReview.status}
                    size="small"
                    color={statusColors[selectedReview.status]}
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
                      {new Date(selectedReview.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  
                  {selectedReview.updatedAt !== selectedReview.createdAt && (
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Last Updated
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(selectedReview.updatedAt).toLocaleString()}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
      )}
      
      <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
        <Button onClick={() => setDetailsDialogOpen(false)}>
          Close
        </Button>
        {selectedReview?.status === 'pending' && (
          <Button variant="contained" color="success" onClick={handleApprove}>
            Approve
          </Button>
        )}
        <Button variant="outlined" color="warning" onClick={handleFlag}>
          Flag Review
        </Button>
        <Button variant="outlined" color="error" onClick={handleHide}>
          Hide Review
        </Button>
      </DialogActions>
    </Dialog>
  );

  const totalReviews = reviews.length;
  const publishedReviews = reviews.filter(r => r.status === 'published').length;
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
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
                {pendingReviews}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Reviews
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
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="flagged">Flagged</MenuItem>
                  <MenuItem value="hidden">Hidden</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
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
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                fullWidth
                sx={{ height: 56 }}
              >
                Export
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Reviews Table */}
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
                <TableCell align="center">Helpful</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReviews
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((review) => {
                  const StatusIcon = statusIcons[review.status];
                  return (
                    <TableRow key={review.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ width: 40, height: 40, backgroundColor: 'primary.main' }}>
                            <Person />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={500}>
                              {review.studentName}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {review.isVerified && (
                                <CheckCircle sx={{ fontSize: 12, color: 'success.main' }} />
                              )}
                              <Typography variant="caption" color="text.secondary">
                                {review.isVerified ? 'Verified' : 'Unverified'}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {review.courseTitle}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {review.courseId}
                          </Typography>
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
                            {review.helpfulVotes}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {new Date(review.createdAt).toLocaleDateString()}
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
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredReviews.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
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
        <MenuItem onClick={handleViewDetails}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Visibility fontSize="small" />
            View Details
          </Box>
        </MenuItem>
        
        {selectedReview?.status === 'pending' && (
          <MenuItem onClick={handleApprove} sx={{ color: 'success.main' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CheckCircle fontSize="small" />
              Approve
            </Box>
          </MenuItem>
        )}
        
        <MenuItem onClick={handleFlag} sx={{ color: 'warning.main' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Flag fontSize="small" />
            Flag Review
          </Box>
        </MenuItem>
        
        <MenuItem onClick={handleHide} sx={{ color: 'error.main' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Block fontSize="small" />
            Hide Review
          </Box>
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      <ReviewDetailsDialog />
    </Box>
  );
}