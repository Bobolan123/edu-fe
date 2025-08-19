import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Typography,
    Chip,
    Avatar,
} from "@mui/material";
import { getCoursesForAdmin } from "@/actions/coursesAction";
import { ICourse } from "../../../../types/entities";
import AdminCoursesTableActions from "./AdminCoursesTableActions";
import AdminCoursesTablePagination from "./AdminCoursesTablePagination";
import AdminCoursesTableFilters from "./AdminCoursesTableFilters";

interface AdminCoursesTableServerProps {
    searchParams: {
        page?: string;
        limit?: string;
        category?: string;
        search?: string;
    };
}

const AdminCoursesTableServer: React.FC<AdminCoursesTableServerProps> = async ({ searchParams }) => {
    const page = parseInt(searchParams.page || "1", 10);
    const limit = parseInt(searchParams.limit || "10", 10);
    const category = searchParams.category;
    const search = searchParams.search;

    let courses: ICourse[] = [];
    let totalCount = 0;
    let error: string | null = null;

    try {
        const response = await getCoursesForAdmin(page, limit, search, category);
        courses = response.data?.result || [];
        totalCount = response.data?.meta?.itemCount || 0;
    } catch (err) {
        error = err instanceof Error ? err.message : "Failed to fetch courses";
        console.error("Failed to fetch courses:", err);
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    };

    const formatPrice = (price: number) => {
        return `$${price.toFixed(2)}`;
    };

    const getStatusColor = (active?: boolean) => {
        return active ? "success" : "error";
    };

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography color="error" variant="body1">
                    Error: {error}
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <AdminCoursesTableFilters 
                initialSearch={search || ""} 
                initialCategory={category || ""} 
            />

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Course</TableCell>
                            <TableCell>Instructor</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Students</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {courses.map((course) => (
                            <TableRow key={course.id} hover>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Avatar
                                            src={course.thumbnail_url || undefined}
                                            sx={{ width: 48, height: 48 }}
                                            variant="rounded"
                                        >
                                            {course.title.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight="medium">
                                                {course.title}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {course.description.substring(0, 50)}...
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Avatar
                                            src={course.instructor?.profile_picture || undefined}
                                            sx={{ width: 32, height: 32 }}
                                        >
                                            {course.instructor?.name?.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Typography variant="body2">
                                            {course.instructor?.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="medium">
                                        {formatPrice(course.price)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {course.total_students || 0}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Typography variant="body2">
                                            {course.average_rating?.toFixed(1) || "0.0"}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            ({course.total_reviews || 0})
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={course.active ? "Active" : "Inactive"}
                                        color={getStatusColor(course.active) as any}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {formatDate(course.date_created)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <AdminCoursesTableActions course={course} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <AdminCoursesTablePagination
                totalCount={totalCount}
                currentPage={page}
                rowsPerPage={limit}
            />
        </>
    );
};

export default AdminCoursesTableServer;