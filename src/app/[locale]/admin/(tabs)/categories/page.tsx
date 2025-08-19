import React from "react";
import {
    Box,
    Typography,
    Paper,
} from "@mui/material";
import AdminCategoriesTable from "@/components/Admin/Categories/AdminCategoriesTable";

export default function AdminCategoriesPage() {
    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Category Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage course categories on your platform
                </Typography>
            </Box>

            <Paper sx={{ p: 3 }}>
                <AdminCategoriesTable />
            </Paper>
        </Box>
    );
}
