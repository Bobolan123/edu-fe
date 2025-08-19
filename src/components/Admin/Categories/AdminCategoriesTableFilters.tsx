"use client";

import React, { useState, useTransition, useCallback, useRef } from "react";
import {
    Box,
    TextField,
    InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";

interface AdminCategoriesTableFiltersProps {
    initialSearch: string;
}

const AdminCategoriesTableFilters: React.FC<AdminCategoriesTableFiltersProps> = ({
    initialSearch,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const updateSearchParams = useCallback((search: string) => {
        const params = new URLSearchParams(searchParams);
        
        if (search) {
            params.set("search", search);
        } else {
            params.delete("search");
        }
        
        params.set("page", "1");
        
        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    }, [router, searchParams, startTransition]);

    const debouncedUpdateSearchParams = useCallback((search: string) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            updateSearchParams(search);
        }, 500);
    }, [updateSearchParams]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedUpdateSearchParams(value);
    };

    return (
        <Box sx={{ mb: 3 }}>
            <TextField
                placeholder="Search categories..."
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
                sx={{ width: 300 }}
            />
        </Box>
    );
};

export default AdminCategoriesTableFilters;