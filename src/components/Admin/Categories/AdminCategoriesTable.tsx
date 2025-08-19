"use client";

import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Box,
    TextField,
    InputAdornment,
    TablePagination,
    Tooltip,
    CircularProgress,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import { getCategories, deleteCategory } from "@/actions/categoriesAction";
import { ICategory } from "../../../../types/entities";
import AdminCategoryForm from "./AdminCategoryForm";

const AdminCategoriesTable: React.FC = () => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(null);
    const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await getCategories(
                page + 1,
                rowsPerPage,
                searchTerm || undefined
            );
            if (response.data?.result) {
                setCategories(response.data.result);
                setTotalCount(response.data.meta.itemCount);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [page, rowsPerPage, searchTerm]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteClick = (category: ICategory) => {
        setCategoryToDelete(category);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!categoryToDelete) return;
        
        try {
            await deleteCategory(categoryToDelete.id);
            setDeleteDialogOpen(false);
            setCategoryToDelete(null);
            fetchCategories();
        } catch (error) {
            console.error("Failed to delete category:", error);
        }
    };

    const handleEditClick = (category: ICategory) => {
        setEditingCategory(category);
    };

    const handleFormSuccess = () => {
        setEditingCategory(null);
        fetchCategories();
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <TextField
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ flexGrow: 1, mr: 2 }}
                />
                <AdminCategoryForm onSuccess={handleFormSuccess} />
            </Box>

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
                                        {category.courses?.length || 0} courses
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <Tooltip title="Edit Category">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditClick(category)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Category">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteClick(category)}
                                                disabled={(category.courses?.length || 0) > 0}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Category</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the category "{categoryToDelete?.name}"?
                        {(categoryToDelete?.courses?.length || 0) > 0 && (
                            <Box component="span" color="error.main" sx={{ display: "block", mt: 1 }}>
                                This category has {categoryToDelete?.courses?.length} courses assigned to it.
                                Please reassign or remove courses before deleting.
                            </Box>
                        )}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
                        color="error" 
                        variant="contained"
                        disabled={(categoryToDelete?.courses?.length || 0) > 0}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Category Dialog */}
            {editingCategory && (
                <AdminCategoryForm
                    category={editingCategory}
                    onClose={() => setEditingCategory(null)}
                    onSuccess={handleFormSuccess}
                />
            )}
        </>
    );
};

export default AdminCategoriesTable;
