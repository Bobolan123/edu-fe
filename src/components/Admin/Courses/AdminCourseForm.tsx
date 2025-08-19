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
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    OutlinedInput,
    FormControlLabel,
    Switch,
    Typography,
    Alert,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ICourse, ICategory } from "../../../../types/entities";
import { createCourse, updateCourse, ICreateCoursePayload } from "@/actions/coursesAction";
import { getAllCategories } from "@/actions/categoriesAction";

const courseSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title is too long"),
    description: z.string().min(1, "Description is required").max(1000, "Description is too long"),
    language: z.string().min(1, "Language is required"),
    price: z.number().min(0, "Price must be positive"),
    preview_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    active: z.boolean(),
    categoryIds: z.array(z.number()).min(1, "At least one category is required"),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface AdminCourseFormProps {
    course?: ICourse;
    onClose?: () => void;
    onSuccess?: () => void;
}

const AdminCourseForm: React.FC<AdminCourseFormProps> = ({
    course,
    onClose,
    onSuccess,
}) => {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = Boolean(course);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: "",
            description: "",
            language: "English",
            price: 0,
            preview_url: "",
            active: true,
            categoryIds: [],
        },
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (course) {
            setValue("title", course.title);
            setValue("description", course.description);
            setValue("language", course.language);
            setValue("price", course.price);
            setValue("preview_url", course.preview_url || "");
            setValue("active", course.active || true);
            setValue("categoryIds", course.categories?.map(cat => cat.id) || []);
            setOpen(true);
        }
    }, [course, setValue]);

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

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

    const onSubmit = async (data: CourseFormData) => {
        setLoading(true);
        setError(null);

        try {
            if (isEditing && course) {
                await updateCourse(course.id.toString(), {
                    ...data,
                    categories: categories.filter(cat => data.categoryIds.includes(cat.id)),
                });
            } else {
                const payload: ICreateCoursePayload = {
                    title: data.title,
                    description: data.description,
                    language: data.language,
                    price: data.price,
                    preview_url: data.preview_url || "",
                    active: data.active,
                    categoryIds: data.categoryIds,
                };
                await createCourse(payload);
            }
            
            handleClose();
            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            setError(error.message || "Failed to save course");
        } finally {
            setLoading(false);
        }
    };

    const languages = [
        "English",
        "Spanish",
        "French",
        "German",
        "Chinese",
        "Japanese",
        "Korean",
        "Portuguese",
        "Italian",
        "Russian",
    ];

    return (
        <>
            {!isEditing && (
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                >
                    Add Course
                </Button>
            )}

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {isEditing ? "Edit Course" : "Create New Course"}
                </DialogTitle>
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Controller
                                    name="title"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Course Title"
                                            error={!!errors.title}
                                            helperText={errors.title?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            multiline
                                            rows={4}
                                            label="Course Description"
                                            error={!!errors.description}
                                            helperText={errors.description?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="language"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!errors.language}>
                                            <InputLabel>Language</InputLabel>
                                            <Select {...field} label="Language">
                                                {languages.map((lang) => (
                                                    <MenuItem key={lang} value={lang}>
                                                        {lang}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="price"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Price ($)"
                                            type="number"
                                            inputProps={{ min: 0, step: 0.01 }}
                                            error={!!errors.price}
                                            helperText={errors.price?.message}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Controller
                                    name="preview_url"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Preview Video URL (Optional)"
                                            error={!!errors.preview_url}
                                            helperText={errors.preview_url?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Controller
                                    name="categoryIds"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!errors.categoryIds}>
                                            <InputLabel>Categories</InputLabel>
                                            <Select
                                                {...field}
                                                multiple
                                                input={<OutlinedInput label="Categories" />}
                                                renderValue={(selected) => (
                                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                        {selected.map((value) => {
                                                            const category = categories.find(cat => cat.id === value);
                                                            return (
                                                                <Chip
                                                                    key={value}
                                                                    label={category?.name || value}
                                                                    size="small"
                                                                />
                                                            );
                                                        })}
                                                    </Box>
                                                )}
                                            >
                                                {categories.map((category) => (
                                                    <MenuItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.categoryIds && (
                                                <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                                                    {errors.categoryIds.message}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Controller
                                    name="active"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={field.value}
                                                    onChange={field.onChange}
                                                />
                                            }
                                            label="Active (visible to students)"
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
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
                            {loading ? "Saving..." : isEditing ? "Update Course" : "Create Course"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default AdminCourseForm;
