"use client";

import React, { useTransition } from "react";
import { TablePagination } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

interface AdminCoursesTablePaginationProps {
    totalCount: number;
    currentPage: number;
    rowsPerPage: number;
}

const AdminCoursesTablePagination: React.FC<AdminCoursesTablePaginationProps> = ({
    totalCount,
    currentPage,
    rowsPerPage,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handleChangePage = (event: unknown, newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", (newPage + 1).toString()); // Convert to 1-based
        
        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams);
        params.set("limit", event.target.value);
        params.set("page", "1"); // Reset to first page when changing rows per page
        
        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    };

    return (
        <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={currentPage - 1} // Convert to 0-based for MUI
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            disabled={isPending}
        />
    );
};

export default AdminCoursesTablePagination;