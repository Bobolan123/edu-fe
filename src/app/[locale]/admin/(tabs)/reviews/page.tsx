import React from "react";
import {
    Box,
    Typography,
    Paper,
} from "@mui/material";
import AdminReviewsTable from "@/components/Admin/Reviews/AdminReviewsTable";

export default function AdminReviewsPage() {
    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Review Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Moderate and manage course reviews
                </Typography>
            </Box>

            <Paper sx={{ p: 3 }}>
                <AdminReviewsTable />
            </Paper>
        </Box>
    );
}
