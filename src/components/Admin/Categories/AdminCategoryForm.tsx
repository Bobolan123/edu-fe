"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Alert,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ICategory } from "../../../../types/entities";
import { createCategory, updateCategory, ICreateCategoryPayload } from "@/actions/categoriesAction";

const categorySchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    description: z.string().max(500, "Description is too long").optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface AdminCategoryFormProps {
    category?: ICategory;
    onClose?: () => void;
    onSuccess?: () => void;
}

const AdminCategoryForm: React.FC<AdminCategoryFormProps> = ({
    category,
    onClose,
    onSuccess,
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = Boolean(category);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        if (category) {
            setValue("name", category.name);
            setValue("description", category.description || "");
            setOpen(true);
        }
    }, [category, setValue]);

    const handleOpen = () => {
        if (!isEditing) {
            reset();
        }
        setOpen(true);
        setError(null);
    };

    const handleClose = () => {
        setOpen(false);
        setError(null);
        if (onClose) {
            onClose();
        }
    };

    const onSubmit = async (data: CategoryFormData) => {
        setLoading(true);
        setError(null);

        try {
            if (isEditing && category) {
                await updateCategory(category.id, {
                    name: data.name,
                    description: data.description || null,
                });
            } else {
                const payload: ICreateCategoryPayload = {
                    name: data.name,
                    description: data.description || undefined,
                };
                await createCategory(payload);
            }
            
            handleClose();
            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            setError(error.message || "Failed to save category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!isEditing && (
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                >
                    Add Category
                </Button>
            )}

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {isEditing ? "Edit Category" : "Create New Category"}
                </DialogTitle>
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Category Name"
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                        placeholder="e.g., Web Development, Data Science"
                                    />
                                )}
                            />

                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Description (Optional)"
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                        placeholder="Describe what this category includes..."
                                    />
                                )}
                            />
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : isEditing ? "Update Category" : "Create Category"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default AdminCategoryForm;
