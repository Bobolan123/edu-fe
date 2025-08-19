"use client";

import React, { useState, useTransition } from "react";
import {
    IconButton,
    Box,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import { ICategory } from "../../../../types/entities";
import { deleteCategory } from "@/actions/categoriesAction";

interface AdminCategoriesTableActionsProps {
    category: ICategory;
}

const AdminCategoriesTableActions: React.FC<AdminCategoriesTableActionsProps> = ({ category }) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        startTransition(async () => {
            try {
                await deleteCategory(category.id);
                setDeleteDialogOpen(false);
            } catch (error) {
                console.error("Failed to delete category:", error);
            }
        });
    };

    return (
        <>
            <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip title="Edit Category">
                    <IconButton size="small">
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete Category">
                    <IconButton
                        size="small"
                        color="error"
                        onClick={handleDeleteClick}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Category</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the category "{category.name}"?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
                        color="error" 
                        variant="contained"
                        disabled={isPending}
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AdminCategoriesTableActions;