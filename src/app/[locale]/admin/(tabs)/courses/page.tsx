import React from "react";
import {
    Box,
    Typography,
    Button,
    Paper,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import AdminCoursesTable from "@/components/Admin/Courses/AdminCoursesTable";
import AdminCourseForm from "@/components/Admin/Courses/AdminCourseForm";

export default function AdminCoursesPage() {
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
                <AdminCoursesTable />
            </Paper>
        </Box>
    );
}
