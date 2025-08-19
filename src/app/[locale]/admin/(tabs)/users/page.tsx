import React from "react";
import {
    Box,
    Typography,
    Paper,
} from "@mui/material";
import AdminUsersTable from "@/components/Admin/Users/AdminUsersTable";

export default function AdminUsersPage() {
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
                <AdminUsersTable />
            </Paper>
        </Box>
    );
}
