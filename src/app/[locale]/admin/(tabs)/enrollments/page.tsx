import React from "react";
import {
    Box,
    Typography,
    Paper,
} from "@mui/material";
import AdminEnrollmentsTable from "@/components/Admin/Enrollments/AdminEnrollmentsTable";

export default function AdminEnrollmentsPage() {
    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Enrollment Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Track student progress and manage course enrollments
                </Typography>
            </Box>

            <Paper sx={{ p: 3 }}>
                <AdminEnrollmentsTable />
            </Paper>
        </Box>
    );
}
