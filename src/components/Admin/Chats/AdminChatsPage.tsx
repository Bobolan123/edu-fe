"use client";

import { useState } from "react";
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
    CircularProgress,
} from "@mui/material";
import {
    Search,
    Chat,
    CheckCircle,
    Pending,
    HourglassEmpty,
    FilterList,
    Clear,
} from "@mui/icons-material";
import { ChatTable } from "./ChatTable";
import { ISupportTicket } from "../../../../types/entities";

interface AdminChatsPageProps {
    tickets: IModelPaginate<ISupportTicket>;
    searchParams: {
        page?: string;
        search?: string;
        status?: string;
    };
}

export default function AdminChatsPage({
    tickets,
    searchParams,
}: AdminChatsPageProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(searchParams.search || "");
    const [selectedStatus, setSelectedStatus] = useState(
        searchParams.status || ""
    );
    const [loading, setLoading] = useState(false);

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

        const queryString = searchParams.toString();
        const newUrl =
            window.location.pathname + (queryString ? "?" + queryString : "");
        router.push(newUrl, { scroll: false });
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
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
            page: "1",
        });
    };

    const handlePageChange = (newPage: number) => {
        updateURL({
            search: searchTerm || undefined,
            status: selectedStatus || undefined,
            page: newPage.toString(),
        });
    };

    const handleApplyFilters = () => {
        updateURL({
            search: searchTerm,
            status: selectedStatus || undefined,
            page: "1",
        });
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedStatus("");
        updateURL({
            search: undefined,
            status: undefined,
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

    const currentTickets = tickets.data?.result || [];
    const totalTickets = tickets.data?.meta?.itemCount || 0;
    const resolvedTickets = currentTickets.filter(
        (t) => t.status === "resolved"
    ).length;
    const waitingTeacher = currentTickets.filter(
        (t) => t.status === "waiting_teacher"
    ).length;
    const openTickets = currentTickets.filter(
        (t) => t.status === "open"
    ).length;

    return (
        <Box>
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: "center", p: 2 }}>
                            <Chat
                                sx={{
                                    fontSize: 40,
                                    color: "primary.main",
                                    mb: 1,
                                }}
                            />
                            <Typography variant="h6" fontWeight={600}>
                                {totalTickets}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Tickets
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: "center", p: 2 }}>
                            <HourglassEmpty
                                sx={{
                                    fontSize: 40,
                                    color: "info.main",
                                    mb: 1,
                                }}
                            />
                            <Typography variant="h6" fontWeight={600}>
                                {openTickets}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Open Tickets
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
                                {waitingTeacher}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Waiting Teacher
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
                                {resolvedTickets}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Resolved Tickets
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
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search tickets by subject, student, teacher, course..."
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

                        <Grid item xs={12} md={3}>
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
                                    <MenuItem value="open">Open</MenuItem>
                                    <MenuItem value="waiting_teacher">
                                        Waiting Teacher
                                    </MenuItem>
                                    <MenuItem value="waiting_student">
                                        Waiting Student
                                    </MenuItem>
                                    <MenuItem value="resolved">Resolved</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Box sx={{ display: "flex", gap: 1, height: 40 }}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<FilterList />}
                                    onClick={handleApplyFilters}
                                    sx={{ flex: 1, minWidth: 0 }}
                                >
                                    Apply
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<Clear />}
                                    onClick={handleClearFilters}
                                    sx={{ flex: 1, minWidth: 0 }}
                                >
                                    Clear
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Results Count */}
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Showing {totalTickets} results
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Chats Table */}
            <ChatTable
                tickets={currentTickets}
                totalTickets={totalTickets}
                currentPage={parseInt(searchParams.page || "1")}
                onPageChange={handlePageChange}
            />
        </Box>
    );
}
