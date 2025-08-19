import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Typography,
    IconButton,
    Tooltip,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import { getCategories } from "@/actions/categoriesAction";
import { ICategory } from "../../../../types/entities";
import AdminCategoriesTableActions from "./AdminCategoriesTableActions";
import AdminCategoriesTablePagination from "./AdminCategoriesTablePagination";
import AdminCategoriesTableFilters from "./AdminCategoriesTableFilters";

interface AdminCategoriesTableServerProps {
    searchParams: {
        page?: string;
        limit?: string;
        search?: string;
    };
}

const AdminCategoriesTableServer: React.FC<AdminCategoriesTableServerProps> = async ({ searchParams }) => {
    const page = parseInt(searchParams.page || "1", 10);
    const limit = parseInt(searchParams.limit || "10", 10);
    const search = searchParams.search;

    let categories: ICategory[] = [];
    let totalCount = 0;
    let error: string | null = null;

    try {
        const response = await getCategories(page, limit, search);
        categories = response.data?.result || [];
        totalCount = response.data?.meta?.itemCount || 0;
    } catch (err) {
        error = err instanceof Error ? err.message : "Failed to fetch categories";
        console.error("Failed to fetch categories:", err);
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography color="error" variant="body1">
                    Error: {error}
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <AdminCategoriesTableFilters initialSearch={search || ""} />

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Courses</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id} hover>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="medium">
                                        {category.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {category.description || "No description"}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {category.courses?.length || 0}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <AdminCategoriesTableActions category={category} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <AdminCategoriesTablePagination
                totalCount={totalCount}
                currentPage={page}
                rowsPerPage={limit}
            />
        </>
    );
};

export default AdminCategoriesTableServer;