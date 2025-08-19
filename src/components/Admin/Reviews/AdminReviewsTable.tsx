"use client";

import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Box,
    TextField,
    InputAdornment,
    TablePagination,
    Tooltip,
    CircularProgress,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Rating,
    Avatar,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Visibility as ViewIcon,
} from "@mui/icons-material";
import { getAllReviews, deleteReview, updateReview } from "@/actions/reviewsAction";
import { IReview } from "../../../../types/entities";

const AdminReviewsTable: React.FC = () => {
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [ratingFilter, setRatingFilter] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState<IReview | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<IReview | null>(null);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            // Note: You may need to adjust the getAllReviews function to accept general parameters
            const response = await getAllReviews({
                page: page + 1,
                take: rowsPerPage,
                search: searchTerm || undefined,
                rating: ratingFilter ? parseInt(ratingFilter) : undefined,
            });
            if (response.data?.result) {
                setReviews(response.data.result);
                setTotalCount(response.data.meta.itemCount);
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [page, rowsPerPage, searchTerm, ratingFilter]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleRatingFilterChange = (event: any) => {
        setRatingFilter(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteClick = (review: IReview) => {
        setReviewToDelete(review);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!reviewToDelete) return;
        
        try {
            await deleteReview(reviewToDelete.id, reviewToDelete.course.id);
            setDeleteDialogOpen(false);
            setReviewToDelete(null);
            fetchReviews();
        } catch (error) {
            console.error("Failed to delete review:", error);
        }
    };

    const handleViewClick = (review: IReview) => {
        setSelectedReview(review);
        setViewDialogOpen(true);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
                <TextField
                    placeholder="Search reviews..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ flexGrow: 1 }}
                />
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Rating</InputLabel>
                    <Select
                        value={ratingFilter}
                        label="Rating"
                        onChange={handleRatingFilterChange}
                    >
                        <MenuItem value="">All Ratings</MenuItem>
                        <MenuItem value="5">5 Stars</MenuItem>
                        <MenuItem value="4">4 Stars</MenuItem>
                        <MenuItem value="3">3 Stars</MenuItem>
                        <MenuItem value="2">2 Stars</MenuItem>
                        <MenuItem value="1">1 Star</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Course</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Comment</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reviews.map((review) => (
                            <TableRow key={review.id} hover>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Avatar
                                            src={review.user.profile_picture || undefined}
                                            sx={{ width: 32, height: 32 }}
                                        >
                                            {review.user.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Typography variant="body2">
                                            {review.user.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="medium">
                                        {review.course.title}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Rating value={review.rating} readOnly size="small" />
                                        <Typography variant="body2">
                                            ({review.rating})
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" sx={{ maxWidth: 200 }}>
                                        {review.comment.length > 100
                                            ? `${review.comment.substring(0, 100)}...`
                                            : review.comment
                                        }
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {formatDate(review.date_reviewed)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <Tooltip title="View Full Review">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleViewClick(review)}
                                            >
                                                <ViewIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Review">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteClick(review)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Review</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this review by {reviewToDelete?.user.name}?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Review Dialog */}
            <Dialog 
                open={viewDialogOpen} 
                onClose={() => setViewDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                {selectedReview && (
                    <>
                        <DialogTitle>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar
                                    src={selectedReview.user.profile_picture || undefined}
                                    sx={{ width: 48, height: 48 }}
                                >
                                    {selectedReview.user.name.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">
                                        Review by {selectedReview.user.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedReview.course.title}
                                    </Typography>
                                </Box>
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Rating
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Rating value={selectedReview.rating} readOnly />
                                    <Typography variant="body1">
                                        {selectedReview.rating} out of 5
                                    </Typography>
                                </Box>
                            </Box>
                            
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Review Date
                                </Typography>
                                <Typography variant="body1">
                                    {formatDate(selectedReview.date_reviewed)}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Comment
                                </Typography>
                                <Typography variant="body1">
                                    {selectedReview.comment}
                                </Typography>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
                            <Button 
                                onClick={() => {
                                    setViewDialogOpen(false);
                                    handleDeleteClick(selectedReview);
                                }}
                                color="error"
                            >
                                Delete Review
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
};

export default AdminReviewsTable;
