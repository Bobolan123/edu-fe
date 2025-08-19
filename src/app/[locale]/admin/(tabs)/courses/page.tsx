import React, { Suspense } from "react";
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
} from "@mui/material";
import AdminCoursesTableServer from "@/components/Admin/Courses/AdminCoursesTableServer";
import AdminCourseForm from "@/components/Admin/Courses/AdminCourseForm";

interface AdminCoursesPageProps {
    searchParams: {
        page?: string;
        limit?: string;
        category?: string;
        search?: string;
    };
}

export default function AdminCoursesPage({ searchParams }: AdminCoursesPageProps) {
    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Course Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage all courses on your platform
                    </Typography>
                </Box>
                <AdminCourseForm />
            </Box>

            <Paper sx={{ p: 3 }}>
                <Suspense fallback={
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress />
                    </Box>
                }>
                    <AdminCoursesTableServer searchParams={searchParams} />
                </Suspense>
            </Paper>
        </Box>
    );
}
