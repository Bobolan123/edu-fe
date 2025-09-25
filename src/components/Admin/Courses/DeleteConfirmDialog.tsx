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
import { deleteCourse, restoreCourse, forceDeleteCourse } from '../../../actions/coursesAction';
import { ICourse } from '../../../../types/entities';

interface DeleteConfirmDialogProps {
  open: boolean;
  course: ICourse | null;
  action: 'delete' | 'restore' | 'force-delete';
  onClose: () => void;
  onSuccess: (message?: string) => void;
  onError: (error: string) => void;
}

export function DeleteConfirmDialog({
  open,
  course,
  action,
  onClose,
  onSuccess,
  onError,
}: DeleteConfirmDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleAction = () => {
    if (!course) return;

    startTransition(async () => {
      try {
        let response;
        switch (action) {
          case 'delete':
            response = await deleteCourse(course.id.toString());
            break;
          case 'restore':
            response = await restoreCourse(course.id.toString());
            break;
          case 'force-delete':
            response = await forceDeleteCourse(course.id.toString());
            break;
        }
        onSuccess(response?.message);
      } catch (error) {
        onError(error instanceof Error ? error.message : `Failed to ${action.replace('-', ' ')} course`);
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
            {action === 'delete' ? 'Delete Course' : action === 'restore' ? 'Restore Course' : 'Permanently Delete Course'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {action === 'delete' && `Are you sure you want to delete "${course?.title}"?`}
            {action === 'restore' && `Are you sure you want to restore "${course?.title}"?`}
            {action === 'force-delete' && `Are you sure you want to permanently delete "${course?.title}"?`}
          </Typography>
          <Typography variant="body2" color={action === 'restore' ? 'info.main' : 'error.main'}>
            {action === 'delete' && 'The course will be soft deleted and can be restored later.'}
            {action === 'restore' && 'The course will be restored and become active again.'}
            {action === 'force-delete' && 'This action cannot be undone. All course data, enrollments, and progress will be permanently removed.'}
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
          onClick={handleAction} 
          variant="contained" 
          color={action === 'restore' ? 'success' : 'error'}
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={20} /> : <Delete />}
          sx={{ minWidth: 140 }}
        >
          {isPending ? (action === 'delete' ? 'Deleting...' : action === 'restore' ? 'Restoring...' : 'Permanently Deleting...') : (action === 'delete' ? 'Delete Course' : action === 'restore' ? 'Restore Course' : 'Permanently Delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}