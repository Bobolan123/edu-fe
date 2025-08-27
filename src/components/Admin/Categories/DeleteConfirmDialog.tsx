"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { IResFindAllCategories } from '../../../../types/resData';
import { deleteCategory } from '@/actions/categoriesAction';
import { toastService } from '@/services/toast';
import { useRouter } from 'next/navigation';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  category: IResFindAllCategories | null;
}

export const DeleteConfirmDialog = ({ open, onClose, category }: DeleteConfirmDialogProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const confirmDelete = async () => {
    if (!category) return;
    
    setLoading(true);
    try {
      await deleteCategory(category.id);
      toastService.success('Category deleted successfully!');
      onClose();
      router.refresh();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to delete category';
      toastService.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent sx={{ p: 3, textAlign: 'center' }}>
        <Box sx={{ mb: 2 }}>
          <Delete sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Delete Category
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{category?.name}"? This action cannot be undone.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'center', gap: 1 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={confirmDelete} 
          variant="contained" 
          color="error" 
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ mr: 1 }} />
          ) : null}
          Delete Category
        </Button>
      </DialogActions>
    </Dialog>
  );
};