"use client";

import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Avatar,
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
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Visibility as ViewIcon,
} from "@mui/icons-material";
import { getCourses, deleteCourse } from "@/actions/coursesAction";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import AdminCourseForm from "./AdminCourseForm";
import { ICourse } from "../../../../types/entities";

const AdminCoursesTable: React.FC = () => {
    const [courses, setCourses] = useState<ICourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState<ICourse | null>(null);
    const [editingCourse, setEditingCourse] = useState<ICourse | null>(null);
    
    const router = useRouter();
    const locale = useLocale();

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await getCourses({
                page: page + 1,
                take: rowsPerPage,
                search: searchTerm || undefined,
            });
            setCourses(Array.isArray(response) ? response : []);
            // Note: You may need to adjust this based on your actual API response structure
            setTotalCount(Array.isArray(response) ? response.length : 0); // This should come from your API
        } catch (error) {
            console.error("Failed to fetch courses:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [page, rowsPerPage, searchTerm]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setPage(0); // Reset to first page when searching
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteClick = (course: ICourse) => {
        setCourseToDelete(course);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!courseToDelete) return;
        
        try {
            await deleteCourse(courseToDelete.id.toString());
            setDeleteDialogOpen(false);
            setCourseToDelete(null);
            fetchCourses(); // Refresh the list
        } catch (error) {
            console.error("Failed to delete course:", error);
        }
    };

    const handleEditClick = (course: ICourse) => {
        setEditingCourse(course);
    };

    const handleViewClick = (course: ICourse) => {
        router.push(`/${locale}/courses/${encodeURIComponent(course.title)}`);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    };

    const formatPrice = (price: number) => {
        return `$${price.toFixed(2)}`;
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
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search courses by title, instructor, or description..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    variant="outlined"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            backgroundColor: "grey.50",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                backgroundColor: "background.paper",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                            },
                            "&.Mui-focused": {
                                backgroundColor: "background.paper",
                                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
                                borderColor: "primary.main"
                            }
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "text.secondary" }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <TableContainer 
                sx={{ 
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "grey.200",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow 
                            sx={{ 
                                backgroundColor: "grey.50",
                                "& .MuiTableCell-head": {
                                    fontWeight: 600,
                                    color: "text.primary",
                                    borderBottom: "2px solid",
                                    borderColor: "grey.200",
                                    py: 2
                                }
                            }}
                        >
                            <TableCell>Course</TableCell>
                            <TableCell>Instructor</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Students</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(courses || []).map((course, index) => (
                            <TableRow 
                                key={course.id} 
                                hover
                                sx={{
                                    "&:hover": {
                                        backgroundColor: "action.hover",
                                        transform: "scale(1.001)",
                                        transition: "all 0.2s ease"
                                    },
                                    "& .MuiTableCell-root": {
                                        borderBottom: "1px solid",
                                        borderColor: "grey.100",
                                        py: 2
                                    }
                                }}
                            >
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Avatar
                                            src={course.thumbnail_url || undefined}
                                            sx={{ 
                                                width: 56, 
                                                height: 56,
                                                borderRadius: 2,
                                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                                            }}
                                        >
                                            {course.title.charAt(0)}
                                        </Avatar>
                                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                            <Typography 
                                                variant="subtitle2" 
                                                fontWeight="600"
                                                sx={{ 
                                                    mb: 0.5,
                                                    color: "text.primary",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap"
                                                }}
                                            >
                                                {course.title}
                                            </Typography>
                                            <Typography 
                                                variant="caption" 
                                                color="text.secondary"
                                                sx={{
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    lineHeight: 1.3
                                                }}
                                            >
                                                {course.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Avatar sx={{ width: 32, height: 32, fontSize: "0.875rem" }}>
                                            {course.instructor.name.charAt(0)}
                                        </Avatar>
                                        <Typography variant="body2" fontWeight="medium">
                                            {course.instructor.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: 2,
                                            backgroundColor: "success.light",
                                            color: "success.dark"
                                        }}
                                    >
                                        <Typography variant="body2" fontWeight="bold">
                                            {formatPrice(course.price)}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Typography variant="body2" fontWeight="medium">
                                            {course.total_students}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            students
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: 2,
                                                backgroundColor: "warning.light",
                                                color: "warning.dark"
                                            }}
                                        >
                                            <Typography variant="body2" fontWeight="bold">
                                                ⭐ {course.average_rating.toFixed(1)}
                                            </Typography>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            ({course.total_reviews} reviews)
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={course.active ? "Active" : "Inactive"}
                                        color={course.active ? "success" : "error"}
                                        size="small"
                                        sx={{
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            textTransform: "uppercase",
                                            fontSize: "0.75rem"
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {formatDate(course.date_created)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                                        <Tooltip title="View Course" arrow>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleViewClick(course)}
                                                sx={{
                                                    backgroundColor: "primary.light",
                                                    color: "primary.main",
                                                    "&:hover": {
                                                        backgroundColor: "primary.main",
                                                        color: "primary.contrastText",
                                                        transform: "scale(1.1)"
                                                    },
                                                    transition: "all 0.2s ease"
                                                }}
                                            >
                                                <ViewIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit Course" arrow>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditClick(course)}
                                                sx={{
                                                    backgroundColor: "warning.light",
                                                    color: "warning.main",
                                                    "&:hover": {
                                                        backgroundColor: "warning.main",
                                                        color: "warning.contrastText",
                                                        transform: "scale(1.1)"
                                                    },
                                                    transition: "all 0.2s ease"
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Course" arrow>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteClick(course)}
                                                sx={{
                                                    backgroundColor: "error.light",
                                                    color: "error.main",
                                                    "&:hover": {
                                                        backgroundColor: "error.main",
                                                        color: "error.contrastText",
                                                        transform: "scale(1.1)"
                                                    },
                                                    transition: "all 0.2s ease"
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box 
                sx={{ 
                    borderTop: "1px solid",
                    borderColor: "grey.200",
                    backgroundColor: "grey.50"
                }}
            >
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        "& .MuiTablePagination-toolbar": {
                            px: 2
                        },
                        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                            fontWeight: 500
                        }
                    }}
                />
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Course</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the course "{courseToDelete?.title}"?
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

            {/* Edit Course Dialog */}
            {editingCourse && (
                <AdminCourseForm
                    course={editingCourse}
                    onClose={() => setEditingCourse(null)}
                    onSuccess={() => {
                        setEditingCourse(null);
                        fetchCourses();
                    }}
                />
            )}
        </>
    );
};

export default AdminCoursesTable;
