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
    Visibility as ViewIcon,
} from "@mui/icons-material";
import { ICourse } from "../../../../types/entities";
import { deleteCourse } from "@/actions/coursesAction";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

interface AdminCoursesTableActionsProps {
    course: ICourse;
}

const AdminCoursesTableActions: React.FC<AdminCoursesTableActionsProps> = ({ course }) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const locale = useLocale();

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        startTransition(async () => {
            try {
                await deleteCourse(course.id.toString());
                setDeleteDialogOpen(false);
            } catch (error) {
                console.error("Failed to delete course:", error);
            }
        });
    };

    const handleViewClick = () => {
        router.push(`/${locale}/courses/${course.id}`);
    };

    const handleEditClick = () => {
        router.push(`/${locale}/admin/courses/edit/${course.id}`);
    };

    return (
        <>
            <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip title="View Course">
                    <IconButton size="small" onClick={handleViewClick}>
                        <ViewIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Edit Course">
                    <IconButton size="small" onClick={handleEditClick}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete Course">
                    <IconButton
                        size="small"
                        color="error"
                        onClick={handleDeleteClick}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Course</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the course "{course.title}"?
                        This action cannot be undone and will remove all course data and student enrollments.
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

export default AdminCoursesTableActions;