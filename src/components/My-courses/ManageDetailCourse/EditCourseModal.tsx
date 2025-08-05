"use client";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    IconButton,
    Stack,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { ICourse } from "../../../../types/entities";
import { useState, useEffect } from "react";
import { updateCourse } from "@/actions/coursesAction";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface EditCourseModalProps {
    open: boolean;
    onClose: () => void;
    course: ICourse;
}

export default function EditCourseModal({
    open,
    onClose,
    course,
}: EditCourseModalProps) {
    const router = useRouter();
    const [editedCourse, setEditedCourse] = useState<Partial<ICourse>>({
        id:course.id,
        title: course.title,
        description: course.description,
        price: course.price,
        language: course.language,
        preview_url: course.preview_url,
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (open) {
            setEditedCourse({
                title: course.title,
                description: course.description,
                price: course.price,
                language: course.language,
                preview_url: course.preview_url,
            });
        }
    }, [open, course]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateCourse(course.id.toString(), editedCourse);
            toast.success('Course updated successfully!');
            onClose();
            router.refresh();
        } catch (error) {
            console.error('Failed to update course:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to update course';
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedCourse({
            title: course.title,
            description: course.description,
            price: course.price,
            language: course.language,
            preview_url: course.preview_url,
        });
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, #faf5ff 0%, #f0f9ff 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 20px 60px rgba(139, 92, 246, 0.15)',
                    backdropFilter: 'blur(10px)',
                }
            }}
        >
            <DialogTitle
                sx={{
                    background: 'linear-gradient(45deg, #2563eb, #3b82f6)',
                    color: 'white',
                    borderRadius: '24px 24px 0 0',
                    position: 'relative',
                    textAlign: 'center',
                    py: 3,
                    mb: 2,
                }}
            >
                <Typography component="span" className="font-bold text-xl">
                    🎨 Edit Course Details
                </Typography>
                <IconButton
                    onClick={handleCancel}
                    sx={{
                        position: 'absolute',
                        right: 16,
                        top: 16,
                        color: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
                <Box className="space-y-6">
                    <TextField
                        fullWidth
                        label="Course Title"
                        value={editedCourse.title || ''}
                        onChange={(e) => setEditedCourse(prev => ({ ...prev, title: e.target.value }))}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '16px',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            }
                        }}
                    />
                    
                    <TextField
                        fullWidth
                        label="Course Description"
                        value={editedCourse.description || ''}
                        onChange={(e) => setEditedCourse(prev => ({ ...prev, description: e.target.value }))}
                        variant="outlined"
                        multiline
                        rows={4}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '16px',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            }
                        }}
                    />
                    
                    <TextField
                        fullWidth
                        label="Price (VND)"
                        type="number"
                        value={editedCourse.price || 0}
                        onChange={(e) => setEditedCourse(prev => ({ ...prev, price: Number(e.target.value) }))}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '16px',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            }
                        }}
                    />
                    
                    <FormControl
                        fullWidth
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '16px',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            }
                        }}
                    >
                        <InputLabel>Language</InputLabel>
                        <Select
                            value={editedCourse.language || ''}
                            onChange={(e) => setEditedCourse(prev => ({ ...prev, language: e.target.value }))}
                            label="Language"
                        >
                            <MenuItem value="English">🇺🇸 English</MenuItem>
                            <MenuItem value="Vietnamese">🇻🇳 Tiếng Việt</MenuItem>
                        </Select>
                    </FormControl>
                    
                    <TextField
                        fullWidth
                        label="Preview URL (Optional)"
                        value={editedCourse.preview_url || ''}
                        onChange={(e) => setEditedCourse(prev => ({ ...prev, preview_url: e.target.value }))}
                        variant="outlined"
                        placeholder="https://example.com/preview-video"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '16px',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            }
                        }}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 4, pt: 2 }}>
                <Stack direction="row" spacing={2} width="100%" justifyContent="center">
                    <Button
                        variant="outlined"
                        onClick={handleCancel}
                        disabled={isSaving}
                        sx={{
                            borderRadius: '16px',
                            textTransform: 'none',
                            px: 4,
                            py: 1.5,
                            fontWeight: 'bold',
                            borderColor: '#d1d5db',
                            color: '#6b7280',
                            minWidth: 120,
                        }}
                    >
                        ❌ Cancel
                    </Button>
                    
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={isSaving}
                        sx={{
                            background: 'linear-gradient(45deg, #10b981, #059669)',
                            borderRadius: '16px',
                            textTransform: 'none',
                            px: 4,
                            py: 1.5,
                            fontWeight: 'bold',
                            minWidth: 120,
                            '&:hover': {
                                background: 'linear-gradient(45deg, #059669, #047857)',
                            }
                        }}
                    >
                        {isSaving ? 'Saving...' : '💾 Save Changes'}
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
}