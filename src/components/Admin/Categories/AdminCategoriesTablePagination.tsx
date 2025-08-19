"use client";

import React, { useTransition } from "react";
import { TablePagination } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

interface AdminCategoriesTablePaginationProps {
    totalCount: number;
    currentPage: number;
    rowsPerPage: number;
}

const AdminCategoriesTablePagination: React.FC<AdminCategoriesTablePaginationProps> = ({
    totalCount,
    currentPage,
    rowsPerPage,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handleChangePage = (event: unknown, newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", (newPage + 1).toString());
        
        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams);
        params.set("limit", event.target.value);
        params.set("page", "1");
        
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
            page={currentPage - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            disabled={isPending}
        />
    );
};

export default AdminCategoriesTablePagination;