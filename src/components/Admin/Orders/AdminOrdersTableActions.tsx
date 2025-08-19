"use client";

import React, { useState } from "react";
import {
    IconButton,
    Box,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Avatar,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import {
    Visibility as ViewIcon,
    Edit as EditIcon,
} from "@mui/icons-material";
import { IOrder, OrderStatus, PaymentMethod } from "../../../../types/entities";
import { updateOrderStatus } from "@/actions/orderActions";
import { useTransition } from "react";

interface AdminOrdersTableActionsProps {
    order: IOrder;
}

const AdminOrdersTableActions: React.FC<AdminOrdersTableActionsProps> = ({ order }) => {
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState<OrderStatus>(order.status);
    const [isPending, startTransition] = useTransition();

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

    const handleViewClick = () => {
        setViewDialogOpen(true);
    };

    const handleStatusUpdateClick = () => {
        setNewStatus(order.status);
        setStatusUpdateDialogOpen(true);
    };

    const handleStatusUpdateConfirm = async () => {
        startTransition(async () => {
            try {
                await updateOrderStatus(order.id, newStatus);
                setStatusUpdateDialogOpen(false);
            } catch (error) {
                console.error("Failed to update order status:", error);
            }
        });
    };

    return (
        <>
            <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip title="View Order Details">
                    <IconButton size="small" onClick={handleViewClick}>
                        <ViewIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Update Status">
                    <IconButton size="small" onClick={handleStatusUpdateClick}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* View Order Details Dialog */}
            <Dialog 
                open={viewDialogOpen} 
                onClose={() => setViewDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6">
                        Order Details - #{order.id.substring(0, 8)}...
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
                                    src={order.user.profile_picture || undefined}
                                    sx={{ width: 48, height: 48 }}
                                >
                                    {order.user.name.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography variant="body1" fontWeight="medium">
                                        {order.user.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {order.user.email}
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
                                        {formatPrice(order.totalPrice)}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Payment Method
                                    </Typography>
                                    <Chip
                                        label={order.paymentMethod}
                                        color={getPaymentMethodColor(order.paymentMethod) as any}
                                        size="small"
                                        variant="outlined"
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Status
                                    </Typography>
                                    <Chip
                                        label={order.status}
                                        color={getStatusColor(order.status) as any}
                                        size="small"
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Order Date
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatDate(order.createdAt)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {order.transactionId && (
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Transaction ID
                                </Typography>
                                <Typography variant="body2" fontFamily="monospace">
                                    {order.transactionId}
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
                            handleStatusUpdateClick();
                        }}
                        variant="contained"
                    >
                        Update Status
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Update Status Dialog */}
            <Dialog open={statusUpdateDialogOpen} onClose={() => setStatusUpdateDialogOpen(false)}>
                <DialogTitle>Update Order Status</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Update status for order: <strong>#{order.id.substring(0, 8)}...</strong>
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={newStatus}
                                label="Status"
                                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                                disabled={isPending}
                            >
                                <MenuItem value={OrderStatus.PENDING}>Pending</MenuItem>
                                <MenuItem value={OrderStatus.COMPLETED}>Completed</MenuItem>
                                <MenuItem value={OrderStatus.FAILED}>Failed</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setStatusUpdateDialogOpen(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleStatusUpdateConfirm} 
                        variant="contained"
                        disabled={isPending}
                    >
                        {isPending ? "Updating..." : "Update Status"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AdminOrdersTableActions;