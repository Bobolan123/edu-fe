"use client";

import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Grid,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { ICourse } from "../../../../types/entities";
import { sendRequest } from "../../../../ultils/api";
import { toast } from "react-toastify";
import Image from "next/image";

interface Props {
    courses: ICourse[];
}

export default function CoursesClient({ courses: initialCourses }: Props) {
    const [courses, setCourses] = useState<ICourse[]>(initialCourses);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
        null
    );

    const handleOpenConfirm = (id: number) => {
        setSelectedCourseId(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCourseId(null);
    };

    const handleConfirmDelete = async () => {
        if (selectedCourseId === null) return;

        try {
            await sendRequest({
                url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${selectedCourseId}`,
                method: "DELETE",
            });

            setCourses((prev) => prev.filter((c) => c.id !== selectedCourseId));
            toast.success("Course deleted successfully");
        } catch (error) {
            toast.error("Failed to delete course");
        } finally {
            handleCloseDialog();
        }
    };

    return (
        <Box className="p-6">
            <Typography variant="h4" gutterBottom>
                My Courses
            </Typography>
            <Grid container spacing={4}>
                {courses.map((course) => (
                    <Grid item xs={12} sm={6} md={4} key={course.id}>
                        <Card>
                            {course.thumbnail_url && (
                                <Image
                                    height={150}
                                    width={200}
                                    src={course.thumbnail_url}
                                    alt={course.title}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6">
                                    {course.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    className="line-clamp-2"
                                >
                                    {course.description}
                                </Typography>
                                <Box className="mt-4 flex gap-2">
                                    <Link href={`manage-courses/${course.id}`}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                        >
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="error"
                                        onClick={() =>
                                            handleOpenConfirm(course.id)
                                        }
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this course? This action
                        cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>No</Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                    >
                        Yes, Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
