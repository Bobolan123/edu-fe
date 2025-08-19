import React, { Suspense } from "react";
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
} from "@mui/material";
import AdminOrdersTableServer from "@/components/Admin/Orders/AdminOrdersTableServer";
import { OrderStatus } from "../../../../../types/entities";

interface AdminOrdersPageProps {
    searchParams: {
        page?: string;
        limit?: string;
        status?: OrderStatus;
        search?: string;
    };
}

export default function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
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
                <Suspense fallback={
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress />
                    </Box>
                }>
                    <AdminOrdersTableServer searchParams={searchParams} />
                </Suspense>
            </Paper>
        </Box>
    );
}
