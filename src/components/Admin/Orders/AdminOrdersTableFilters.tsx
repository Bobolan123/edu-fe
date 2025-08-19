"use client";

import React, { useState, useTransition, useCallback, useRef } from "react";
import {
    Box,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderStatus } from "../../../../types/entities";

interface AdminOrdersTableFiltersProps {
    initialSearch: string;
    initialStatus: string;
}

const AdminOrdersTableFilters: React.FC<AdminOrdersTableFiltersProps> = ({
    initialSearch,
    initialStatus,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [statusFilter, setStatusFilter] = useState(initialStatus);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const updateSearchParams = useCallback((search: string, status: string) => {
        const params = new URLSearchParams(searchParams);
        
        if (search) {
            params.set("search", search);
        } else {
            params.delete("search");
        }
        
        if (status) {
            params.set("status", status);
        } else {
            params.delete("status");
        }
        
        params.set("page", "1"); // Reset to first page when filtering
        
        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    }, [router, searchParams, startTransition]);

    const debouncedUpdateSearchParams = useCallback((search: string, status: string) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            updateSearchParams(search, status);
        }, 500);
    }, [updateSearchParams]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedUpdateSearchParams(value, statusFilter);
    };

    const handleStatusFilterChange = (event: any) => {
        const value = event.target.value;
        setStatusFilter(value);
        updateSearchParams(searchTerm, value);
    };

    return (
        <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
            <TextField
                placeholder="Search orders..."
                value={searchTerm}
                onChange={handleSearchChange}
                disabled={isPending}
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
                    disabled={isPending}
                >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value={OrderStatus.PENDING}>Pending</MenuItem>
                    <MenuItem value={OrderStatus.COMPLETED}>Completed</MenuItem>
                    <MenuItem value={OrderStatus.FAILED}>Failed</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default AdminOrdersTableFilters;