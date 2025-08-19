"use client";

import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Box,
    TextField,
    InputAdornment,
    TablePagination,
    Tooltip,
    CircularProgress,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
} from "@mui/material";
import {
    Visibility as ViewIcon,
    Edit as EditIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import { getOrders, updateOrderStatus } from "@/actions/orderActions";
import { IOrder, OrderStatus, PaymentMethod } from "../../../../types/entities";

const AdminOrdersTable: React.FC = () => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
    const [orderToUpdate, setOrderToUpdate] = useState<IOrder | null>(null);
    const [newStatus, setNewStatus] = useState<OrderStatus>(OrderStatus.PENDING);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await getOrders(
                page + 1,
                rowsPerPage,
                statusFilter as OrderStatus || undefined,
                searchTerm || undefined
            );
            if (response.data?.result) {
                setOrders(response.data.result);
                setTotalCount(response.data.meta.itemCount);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, rowsPerPage, searchTerm, statusFilter]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleStatusFilterChange = (event: any) => {
        setStatusFilter(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewClick = (order: IOrder) => {
        setSelectedOrder(order);
        setViewDialogOpen(true);
    };

    const handleStatusUpdateClick = (order: IOrder) => {
        setOrderToUpdate(order);
        setNewStatus(order.status);
        setStatusUpdateDialogOpen(true);
    };

    const handleStatusUpdateConfirm = async () => {
        if (!orderToUpdate) return;
        
        try {
            await updateOrderStatus(orderToUpdate.id, newStatus);
            setStatusUpdateDialogOpen(false);
            setOrderToUpdate(null);
            fetchOrders();
        } catch (error) {
            console.error("Failed to update order status:", error);
        }
    };

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

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
                <TextField
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ flexGrow: 1 }}
                />
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Status"
                        onChange={handleStatusFilterChange}
                    >
                        <MenuItem value="">All Status</MenuItem>
                        <MenuItem value={OrderStatus.PENDING}>Pending</MenuItem>
                        <MenuItem value={OrderStatus.COMPLETED}>Completed</MenuItem>
                        <MenuItem value={OrderStatus.FAILED}>Failed</MenuItem>
                    </Select>
                </FormControl>
            </Box>

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
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <Tooltip title="View Order Details">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleViewClick(order)}
                                            >
                                                <ViewIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Update Status">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleStatusUpdateClick(order)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* View Order Details Dialog */}
            <Dialog 
                open={viewDialogOpen} 
                onClose={() => setViewDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                {selectedOrder && (
                    <>
                        <DialogTitle>
                            <Typography variant="h6">
                                Order Details - #{selectedOrder.id.substring(0, 8)}...
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Customer Information
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Avatar
                                            src={selectedOrder.user.profile_picture || undefined}
                                            sx={{ width: 48, height: 48 }}
                                        >
                                            {selectedOrder.user.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body1" fontWeight="medium">
                                                {selectedOrder.user.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {selectedOrder.user.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Order Information
                                    </Typography>
                                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Total Amount
                                            </Typography>
                                            <Typography variant="h6" color="primary">
                                                {formatPrice(selectedOrder.totalPrice)}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Payment Method
                                            </Typography>
                                            <Chip
                                                label={selectedOrder.paymentMethod}
                                                color={getPaymentMethodColor(selectedOrder.paymentMethod) as any}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Status
                                            </Typography>
                                            <Chip
                                                label={selectedOrder.status}
                                                color={getStatusColor(selectedOrder.status) as any}
                                                size="small"
                                            />
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Order Date
                                            </Typography>
                                            <Typography variant="body1">
                                                {formatDate(selectedOrder.createdAt)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {selectedOrder.transactionId && (
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Transaction ID
                                        </Typography>
                                        <Typography variant="body2" fontFamily="monospace">
                                            {selectedOrder.transactionId}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
                            <Button 
                                onClick={() => {
                                    setViewDialogOpen(false);
                                    handleStatusUpdateClick(selectedOrder);
                                }}
                                variant="contained"
                            >
                                Update Status
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Update Status Dialog */}
            <Dialog open={statusUpdateDialogOpen} onClose={() => setStatusUpdateDialogOpen(false)}>
                <DialogTitle>Update Order Status</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Update status for order: <strong>#{orderToUpdate?.id.substring(0, 8)}...</strong>
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={newStatus}
                                label="Status"
                                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                            >
                                <MenuItem value={OrderStatus.PENDING}>Pending</MenuItem>
                                <MenuItem value={OrderStatus.COMPLETED}>Completed</MenuItem>
                                <MenuItem value={OrderStatus.FAILED}>Failed</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setStatusUpdateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleStatusUpdateConfirm} variant="contained">
                        Update Status
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AdminOrdersTable;
