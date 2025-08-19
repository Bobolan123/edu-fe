import React, { Suspense } from "react";
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
} from "@mui/material";
import AdminCategoriesTableServer from "@/components/Admin/Categories/AdminCategoriesTableServer";

interface AdminCategoriesPageProps {
    searchParams: {
        page?: string;
        limit?: string;
        search?: string;
    };
}

export default function AdminCategoriesPage({ searchParams }: AdminCategoriesPageProps) {
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
                <Suspense fallback={
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress />
                    </Box>
                }>
                    <AdminCategoriesTableServer searchParams={searchParams} />
                </Suspense>
            </Paper>
        </Box>
    );
}
