import React from "react";
import {
    Box,
    Typography,
    Paper,
} from "@mui/material";
import AdminOrdersTable from "@/components/Admin/Orders/AdminOrdersTable";

export default function AdminOrdersPage() {
    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Order Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage and track all orders on your platform
                </Typography>
            </Box>

            <Paper sx={{ p: 3 }}>
                <AdminOrdersTable />
            </Paper>
        </Box>
    );
}
