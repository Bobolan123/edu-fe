"use client";

import { useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Delete,
} from '@mui/icons-material';
import { ICourse } from '../../../types/entities';
import { deleteCourse } from '../../../actions/coursesAction';

interface DeleteConfirmDialogProps {
  open: boolean;
  course: ICourse | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function DeleteConfirmDialog({
  open,
  course,
  onClose,
  onSuccess,
  onError,
}: DeleteConfirmDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!course) return;

    startTransition(async () => {
      try {
        await deleteCourse(course.id.toString());
        onSuccess();
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Failed to delete course');
      }
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogContent sx={{ p: 4, textAlign: 'center', minWidth: 400 }}>
        <Box sx={{ mb: 2 }}>
          <Delete sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Delete Course
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Are you sure you want to delete "{course?.title}"?
          </Typography>
          <Typography variant="body2" color="error.main">
            This action cannot be undone. All course data, enrollments, and progress will be permanently removed.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'center', gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          disabled={isPending}
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleDelete} 
          variant="contained" 
          color="error"
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={20} /> : <Delete />}
          sx={{ minWidth: 140 }}
        >
          {isPending ? 'Deleting...' : 'Delete Course'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}