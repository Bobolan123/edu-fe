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
    Chip,
    Avatar,
    LinearProgress,
} from "@mui/material";
import {
    Visibility as ViewIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import { IEnrollment } from "../../../../types/entities";

// Mock function - replace with actual API call
const getEnrollments = async (
    page: number = 1,
    limit: number = 10,
    search?: string
) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - replace with actual API response
    return {
        data: {
            result: [
                {
                    id: 1,
                    student: {
                        id: 1,
                        name: "John Doe",
                        email: "john@example.com",
                        profile_picture: null,
                    },
                    course: {
                        id: 1,
                        title: "React Development Fundamentals",
                        instructor: { name: "Jane Smith" },
                    },
                    enrollment_date: new Date("2024-01-15"),
                    completion_status: "in_progress",
                    progress: 65,
                },
                {
                    id: 2,
                    student: {
                        id: 2,
                        name: "Alice Johnson",
                        email: "alice@example.com",
                        profile_picture: null,
                    },
                    course: {
                        id: 2,
                        title: "Advanced JavaScript Concepts",
                        instructor: { name: "Bob Wilson" },
                    },
                    enrollment_date: new Date("2024-02-01"),
                    completion_status: "completed",
                    progress: 100,
                },
                // Add more mock data as needed
            ] as any[],
            meta: {
                itemCount: 50,
                page: 1,
                take: 10,
            },
        },
    };
};

interface EnrollmentWithProgress extends IEnrollment {
    progress?: number;
}

const AdminEnrollmentsTable: React.FC = () => {
    const [enrollments, setEnrollments] = useState<EnrollmentWithProgress[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentWithProgress | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);

    const fetchEnrollments = async () => {
        setLoading(true);
        try {
            const response = await getEnrollments(
                page + 1,
                rowsPerPage,
                searchTerm || undefined
            );
            if (response.data?.result) {
                setEnrollments(response.data.result);
                setTotalCount(response.data.meta.itemCount);
            }
        } catch (error) {
            console.error("Failed to fetch enrollments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrollments();
    }, [page, rowsPerPage, searchTerm]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewClick = (enrollment: EnrollmentWithProgress) => {
        setSelectedEnrollment(enrollment);
        setViewDialogOpen(true);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "success";
            case "in_progress":
                return "primary";
            case "not_started":
                return "default";
            default:
                return "default";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "Completed";
            case "in_progress":
                return "In Progress";
            case "not_started":
                return "Not Started";
            default:
                return status;
        }
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
                    placeholder="Search enrollments..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Student</TableCell>
                            <TableCell>Course</TableCell>
                            <TableCell>Instructor</TableCell>
                            <TableCell>Progress</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Enrolled</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {enrollments.map((enrollment) => (
                            <TableRow key={enrollment.id} hover>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Avatar
                                            src={enrollment.student.profile_picture || undefined}
                                            sx={{ width: 32, height: 32 }}
                                        >
                                            {enrollment.student.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight="medium">
                                                {enrollment.student.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {enrollment.student.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="medium">
                                        {enrollment.course.title}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {enrollment.course.instructor.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 120 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={enrollment.progress || 0}
                                            sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                                        />
                                        <Typography variant="caption" color="text.secondary">
                                            {enrollment.progress || 0}%
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={getStatusLabel(enrollment.completion_status)}
                                        color={getStatusColor(enrollment.completion_status) as any}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {formatDate(enrollment.enrollment_date)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="View Details">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleViewClick(enrollment)}
                                        >
                                            <ViewIcon />
                                        </IconButton>
                                    </Tooltip>
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

            {/* View Enrollment Details Dialog */}
            <Dialog 
                open={viewDialogOpen} 
                onClose={() => setViewDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                {selectedEnrollment && (
                    <>
                        <DialogTitle>
                            <Typography variant="h6">
                                Enrollment Details
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Student Information
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Avatar
                                            src={selectedEnrollment.student.profile_picture || undefined}
                                            sx={{ width: 48, height: 48 }}
                                        >
                                            {selectedEnrollment.student.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body1" fontWeight="medium">
                                                {selectedEnrollment.student.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {selectedEnrollment.student.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Course Information
                                    </Typography>
                                    <Box>
                                        <Typography variant="body1" fontWeight="medium" gutterBottom>
                                            {selectedEnrollment.course.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Instructor: {selectedEnrollment.course.instructor.name}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Progress Information
                                    </Typography>
                                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Completion Status
                                            </Typography>
                                            <Chip
                                                label={getStatusLabel(selectedEnrollment.completion_status)}
                                                color={getStatusColor(selectedEnrollment.completion_status) as any}
                                                size="small"
                                            />
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Progress
                                            </Typography>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={selectedEnrollment.progress || 0}
                                                    sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                                                />
                                                <Typography variant="body2" fontWeight="medium">
                                                    {selectedEnrollment.progress || 0}%
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Enrollment Date
                                            </Typography>
                                            <Typography variant="body1">
                                                {formatDate(selectedEnrollment.enrollment_date)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
};

export default AdminEnrollmentsTable;
