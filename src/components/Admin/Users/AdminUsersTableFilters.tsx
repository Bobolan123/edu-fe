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

interface AdminUsersTableFiltersProps {
    initialSearch: string;
    initialRole: string;
}

const AdminUsersTableFilters: React.FC<AdminUsersTableFiltersProps> = ({
    initialSearch,
    initialRole,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [roleFilter, setRoleFilter] = useState(initialRole);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const updateSearchParams = useCallback((search: string, role: string) => {
        const params = new URLSearchParams(searchParams);
        
        if (search) {
            params.set("search", search);
        } else {
            params.delete("search");
        }
        
        if (role) {
            params.set("role", role);
        } else {
            params.delete("role");
        }
        
        params.set("page", "1"); // Reset to first page when filtering
        
        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    }, [router, searchParams, startTransition]);

    const debouncedUpdateSearchParams = useCallback((search: string, role: string) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            updateSearchParams(search, role);
        }, 500);
    }, [updateSearchParams]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedUpdateSearchParams(value, roleFilter);
    };

    const handleRoleFilterChange = (event: any) => {
        const value = event.target.value;
        setRoleFilter(value);
        updateSearchParams(searchTerm, value);
    };

    return (
        <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
            <TextField
                placeholder="Search users..."
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
                <InputLabel>Role</InputLabel>
                <Select
                    value={roleFilter}
                    label="Role"
                    onChange={handleRoleFilterChange}
                    disabled={isPending}
                >
                    <MenuItem value="">All Roles</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="instructor">Instructor</MenuItem>
                    <MenuItem value="student">Student</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default AdminUsersTableFilters;