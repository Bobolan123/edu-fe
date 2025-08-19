import React, { Suspense } from "react";
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
} from "@mui/material";
import AdminUsersTableServer from "@/components/Admin/Users/AdminUsersTableServer";

interface AdminUsersPageProps {
    searchParams: {
        page?: string;
        limit?: string;
        role?: string;
        search?: string;
    };
}

export default function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    User Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage all users on your platform
                </Typography>
            </Box>

            <Paper sx={{ p: 3 }}>
                <Suspense fallback={
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress />
                    </Box>
                }>
                    <AdminUsersTableServer searchParams={searchParams} />
                </Suspense>
            </Paper>
        </Box>
    );
}
