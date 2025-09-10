"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    InputAdornment,
    IconButton,
    Alert,
    CircularProgress,
} from "@mui/material";
import {
    Search,
    ShoppingCart,
    CheckCircle,
    Pending,
    AttachMoney,
    FilterList,
    Clear,
    Close,
    GetApp,
} from "@mui/icons-material";
import { OrderTable } from "./OrderTable";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { IOrder, OrderStatus, PaymentMethod } from "../../../../types/entities";
import { useCurrency } from "@/context/CurrencyContext";
import { currencyService } from "@/service/currency";
import {
    exportSingleOrder,
    exportAllOrders,
    exportOrderAsPDF,
} from "@/utils/orderExport";

interface AdminOrdersPageProps {
    orders: IModelPaginate<IOrder>;
    searchParams: {
        page?: string;
        search?: string;
        status?: OrderStatus;
        paymentMethod?: PaymentMethod;
        minPrice?: string;
        maxPrice?: string;
        startDate?: string;
        endDate?: string;
        userName?: string;
        userEmail?: string;
        transactionId?: string;
    };
}

// Component to handle revenue display with proper currency conversion
function RevenueDisplay({ revenue }: { revenue: number }) {
    const { currency } = useCurrency();
    const [formattedRevenue, setFormattedRevenue] = useState<string>(
        currencyService.formatPrice(revenue, "VND")
    );

    useEffect(() => {
        const formatRevenue = async () => {
            try {
                if (currency === "USD") {
                    const convertedRevenue = await currencyService.convertPrice(
                        revenue,
                        "VND",
                        "USD"
                    );
                    setFormattedRevenue(
                        currencyService.formatPrice(convertedRevenue, currency)
                    );
                } else {
                    setFormattedRevenue(
                        currencyService.formatPrice(revenue, "VND")
                    );
                }
            } catch (error) {
                // Fallback to original amount if conversion fails
                setFormattedRevenue(
                    currencyService.formatPrice(revenue, "VND")
                );
            }
        };

        formatRevenue();
    }, [revenue, currency]);

    return <>{formattedRevenue}</>;
}

export default function AdminOrdersPage({
    orders,
    searchParams,
}: AdminOrdersPageProps) {
    const router = useRouter();
    const { currency } = useCurrency();
    const [searchTerm, setSearchTerm] = useState(searchParams.search || "");
    const [selectedStatus, setSelectedStatus] = useState(
        searchParams.status || ""
    );
    const [selectedPayment, setSelectedPayment] = useState(
        searchParams.paymentMethod || ""
    );
    const [minPrice, setMinPrice] = useState(searchParams.minPrice || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.maxPrice || "");
    const [startDate, setStartDate] = useState(searchParams.startDate || "");
    const [endDate, setEndDate] = useState(searchParams.endDate || "");
    const [userName, setUserName] = useState(searchParams.userName || "");
    const [userEmail, setUserEmail] = useState(searchParams.userEmail || "");
    const [transactionId, setTransactionId] = useState(searchParams.transactionId || "");
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateURL = (params: Record<string, string | undefined>) => {
        const searchParams = new URLSearchParams();

        if (params.search && params.search !== "") {
            searchParams.set("search", params.search);
        }

        if (params.page) {
            searchParams.set("page", params.page);
        }

        if (params.status && params.status !== "") {
            searchParams.set("status", params.status);
        }

        if (params.paymentMethod && params.paymentMethod !== "") {
            searchParams.set("paymentMethod", params.paymentMethod);
        }

        if (params.minPrice && params.minPrice !== "") {
            searchParams.set("minPrice", params.minPrice);
        }

        if (params.maxPrice && params.maxPrice !== "") {
            searchParams.set("maxPrice", params.maxPrice);
        }

        if (params.startDate && params.startDate !== "") {
            searchParams.set("startDate", params.startDate);
        }

        if (params.endDate && params.endDate !== "") {
            searchParams.set("endDate", params.endDate);
        }

        if (params.userName && params.userName !== "") {
            searchParams.set("userName", params.userName);
        }

        if (params.userEmail && params.userEmail !== "") {
            searchParams.set("userEmail", params.userEmail);
        }

        if (params.transactionId && params.transactionId !== "") {
            searchParams.set("transactionId", params.transactionId);
        }

        const queryString = searchParams.toString();
        const newUrl =
            window.location.pathname + (queryString ? "?" + queryString : "");
        router.push(newUrl, { scroll: false });
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
    };

    const handleSearchSubmit = () => {
        updateURL({
            search: searchTerm || undefined,
            status: selectedStatus || undefined,
            paymentMethod: selectedPayment || undefined,
            page: "1",
        });
    };

    const handleSearchKeyPress = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "Enter") {
            handleApplyFilters();
        }
    };

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
        updateURL({
            search: searchTerm || undefined,
            status: status || undefined,
            paymentMethod: selectedPayment || undefined,
            page: "1",
        });
    };

    const handlePaymentChange = (payment: string) => {
        setSelectedPayment(payment);
        updateURL({
            search: searchTerm || undefined,
            status: selectedStatus || undefined,
            paymentMethod: payment || undefined,
            page: "1",
        });
    };

    const handlePageChange = (newPage: number) => {
        updateURL({
            search: searchTerm || undefined,
            status: selectedStatus || undefined,
            paymentMethod: selectedPayment || undefined,
            page: newPage.toString(),
        });
    };

    const handleViewOrder = (order: IOrder) => {
        // Navigate to order detail page or open detail modal
        console.log("View order:", order);
    };

    const handleDeleteOrder = (order: IOrder) => {
        setSelectedOrder(order);
        setDeleteDialogOpen(true);
    };

    const handleExportOrder = (order: IOrder) => {
        exportSingleOrder(order, currency);
    };

    const handleBulkExport = () => {
        exportAllOrders(currentOrders, currency);
    };

    const handleExportOrderAsPDF = (order: IOrder) => {
        exportOrderAsPDF(order, currency);
    };

    const handleCloseDelete = () => {
        setDeleteDialogOpen(false);
        setSelectedOrder(null);
    };

    const handleApplyFilters = () => {
        updateURL({
            search: searchTerm,
            status: selectedStatus || undefined,
            paymentMethod: selectedPayment || undefined,
            minPrice: minPrice || undefined,
            maxPrice: maxPrice || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            userName: userName || undefined,
            userEmail: userEmail || undefined,
            transactionId: transactionId || undefined,
            page: "1",
        });
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedStatus("");
        setSelectedPayment("");
        setMinPrice("");
        setMaxPrice("");
        setStartDate("");
        setEndDate("");
        setUserName("");
        setUserEmail("");
        setTransactionId("");
        updateURL({
            search: undefined,
            status: undefined,
            paymentMethod: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            startDate: undefined,
            endDate: undefined,
            userName: undefined,
            userEmail: undefined,
            transactionId: undefined,
            page: "1",
        });
    };

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="400px"
            >
                <CircularProgress />
            </Box>
        );
    }

    const currentOrders = orders.data?.result || [];
    const totalOrders = orders.data?.meta?.itemCount || 0;
    const completedOrders = currentOrders.filter(
        (o) => o.status === "COMPLETED"
    ).length;
    const pendingOrders = currentOrders.filter(
        (o) => o.status === "PENDING"
    ).length;
    const totalRevenue = currentOrders
        .filter((o) => o.status === "COMPLETED")
        .reduce((sum, order) => sum + order.totalPrice, 0);

    return (
        <Box>
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}

            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    fontWeight={700}
                    gutterBottom
                >
                    Orders Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Track and manage all customer orders and payments
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: "center", p: 2 }}>
                            <ShoppingCart
                                sx={{
                                    fontSize: 40,
                                    color: "primary.main",
                                    mb: 1,
                                }}
                            />
                            <Typography variant="h6" fontWeight={600}>
                                {totalOrders}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Orders
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: "center", p: 2 }}>
                            <CheckCircle
                                sx={{
                                    fontSize: 40,
                                    color: "success.main",
                                    mb: 1,
                                }}
                            />
                            <Typography variant="h6" fontWeight={600}>
                                {completedOrders}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Completed Orders
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: "center", p: 2 }}>
                            <Pending
                                sx={{
                                    fontSize: 40,
                                    color: "warning.main",
                                    mb: 1,
                                }}
                            />
                            <Typography variant="h6" fontWeight={600}>
                                {pendingOrders}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Pending Orders
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: "center", p: 2 }}>
                            <AttachMoney
                                sx={{ fontSize: 40, color: "info.main", mb: 1 }}
                            />
                            <Typography variant="h6" fontWeight={600}>
                                <RevenueDisplay revenue={totalRevenue} />
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Revenue
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filters and Search */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                            Search & Filter
                        </Typography>
                    </Box>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={handleSearch}
                                onKeyPress={handleSearchKeyPress}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Transaction ID"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="User Name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="User Email"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={selectedStatus}
                                    label="Status"
                                    onChange={(e) =>
                                        handleStatusChange(
                                            e.target.value as string
                                        )
                                    }
                                >
                                    <MenuItem value="">All Status</MenuItem>
                                    <MenuItem value="PENDING">Pending</MenuItem>
                                    <MenuItem value="COMPLETED">
                                        Completed
                                    </MenuItem>
                                    <MenuItem value="FAILED">Failed</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Payment Method</InputLabel>
                                <Select
                                    value={selectedPayment}
                                    label="Payment Method"
                                    onChange={(e) =>
                                        handlePaymentChange(
                                            e.target.value as string
                                        )
                                    }
                                >
                                    <MenuItem value="">All Methods</MenuItem>
                                    <MenuItem value="VNPAY">VNPay</MenuItem>
                                    <MenuItem value="PAYPAL">PayPal</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                placeholder="Min Price"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                placeholder="Max Price"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <TextField
                                fullWidth
                                size="small"
                                type="date"
                                label="From Date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <TextField
                                fullWidth
                                size="small"
                                type="date"
                                label="To Date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Box sx={{ display: "flex", gap: 1, height: 40 }}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<Search />}
                                    onClick={handleApplyFilters}
                                    sx={{ flex: 1, minWidth: 0 }}
                                >
                                    Apply
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<Close />}
                                    onClick={handleClearFilters}
                                    sx={{ flex: 1, minWidth: 0 }}
                                >
                                    Clear
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<GetApp />}
                                    onClick={handleBulkExport}
                                    sx={{ minWidth: "auto", px: 2 }}
                                    title="Export All Orders"
                                >
                                    Export
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <OrderTable
                orders={currentOrders}
                totalOrders={totalOrders}
                currentPage={parseInt(searchParams.page || "1")}
                onPageChange={handlePageChange}
                onView={handleViewOrder}
                onDelete={handleDeleteOrder}
                onExport={handleExportOrder}
            />

            {/* Dialogs */}
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onClose={handleCloseDelete}
                order={selectedOrder}
            />
        </Box>
    );
}
