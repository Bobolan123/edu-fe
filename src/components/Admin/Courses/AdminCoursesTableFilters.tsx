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

interface AdminCoursesTableFiltersProps {
    initialSearch: string;
    initialCategory: string;
}

const AdminCoursesTableFilters: React.FC<AdminCoursesTableFiltersProps> = ({
    initialSearch,
    initialCategory,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [categoryFilter, setCategoryFilter] = useState(initialCategory);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const updateSearchParams = useCallback((search: string, category: string) => {
        const params = new URLSearchParams(searchParams);
        
        if (search) {
            params.set("search", search);
        } else {
            params.delete("search");
        }
        
        if (category) {
            params.set("category", category);
        } else {
            params.delete("category");
        }
        
        params.set("page", "1"); // Reset to first page when filtering
        
        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    }, [router, searchParams, startTransition]);

    const debouncedUpdateSearchParams = useCallback((search: string, category: string) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            updateSearchParams(search, category);
        }, 500);
    }, [updateSearchParams]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedUpdateSearchParams(value, categoryFilter);
    };

    const handleCategoryFilterChange = (event: any) => {
        const value = event.target.value;
        setCategoryFilter(value);
        updateSearchParams(searchTerm, value);
    };

    return (
        <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
            <TextField
                placeholder="Search courses..."
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
                <InputLabel>Category</InputLabel>
                <Select
                    value={categoryFilter}
                    label="Category"
                    onChange={handleCategoryFilterChange}
                    disabled={isPending}
                >
                    <MenuItem value="">All Categories</MenuItem>
                    <MenuItem value="programming">Programming</MenuItem>
                    <MenuItem value="design">Design</MenuItem>
                    <MenuItem value="business">Business</MenuItem>
                    <MenuItem value="marketing">Marketing</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default AdminCoursesTableFilters;