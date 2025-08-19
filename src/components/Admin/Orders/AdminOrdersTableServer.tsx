import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Typography,
    Chip,
    Avatar,
} from "@mui/material";
import { getOrders } from "@/actions/orderActions";
import { IOrder, OrderStatus, PaymentMethod } from "../../../../types/entities";
import AdminOrdersTableActions from "./AdminOrdersTableActions";
import AdminOrdersTablePagination from "./AdminOrdersTablePagination";
import AdminOrdersTableFilters from "./AdminOrdersTableFilters";

interface AdminOrdersTableServerProps {
    searchParams: {
        page?: string;
        limit?: string;
        status?: OrderStatus;
        search?: string;
    };
}

const AdminOrdersTableServer: React.FC<AdminOrdersTableServerProps> = async ({ searchParams }) => {
    const page = parseInt(searchParams.page || "1", 10);
    const limit = parseInt(searchParams.limit || "10", 10);
    const status = searchParams.status;
    const search = searchParams.search;

    let orders: IOrder[] = [];
    let totalCount = 0;
    let error: string | null = null;

    try {
        const response = await getOrders(page, limit, status, search);
        orders = response.data?.result || [];
        totalCount = response.data?.meta?.itemCount || 0;
    } catch (err) {
        error = err instanceof Error ? err.message : "Failed to fetch orders";
        console.error("Failed to fetch orders:", err);
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString();
    };

    const formatPrice = (price: number) => {
        return `$${price.toFixed(2)}`;
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.COMPLETED:
                return "success";
            case OrderStatus.PENDING:
                return "warning";
            case OrderStatus.FAILED:
                return "error";
            default:
                return "default";
        }
    };

    const getPaymentMethodColor = (method: PaymentMethod) => {
        switch (method) {
            case PaymentMethod.VNPAY:
                return "primary";
            case PaymentMethod.PAYPAL:
                return "info";
            case PaymentMethod.CREDIT_CARD:
                return "secondary";
            default:
                return "default";
        }
    };

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography color="error" variant="body1">
                    Error: {error}
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <AdminOrdersTableFilters 
                initialSearch={search || ""} 
                initialStatus={status || ""} 
            />

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Payment Method</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} hover>
                                <TableCell>
                                    <Typography variant="body2" fontFamily="monospace">
                                        #{order.id.substring(0, 8)}...
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Avatar
                                            src={order.user.profile_picture || undefined}
                                            sx={{ width: 32, height: 32 }}
                                        >
                                            {order.user.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight="medium">
                                                {order.user.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {order.user.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="medium">
                                        {formatPrice(order.totalPrice)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={order.paymentMethod}
                                        color={getPaymentMethodColor(order.paymentMethod) as any}
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={order.status}
                                        color={getStatusColor(order.status) as any}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {formatDate(order.createdAt)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <AdminOrdersTableActions order={order} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <AdminOrdersTablePagination
                totalCount={totalCount}
                currentPage={page}
                rowsPerPage={limit}
            />
        </>
    );
};

export default AdminOrdersTableServer;