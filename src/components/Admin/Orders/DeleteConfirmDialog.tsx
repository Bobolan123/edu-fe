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
import { IOrder } from '../../../../types/entities';
import { deleteOrder } from '@/actions/orderActions';
import { toastService } from '@/services/toast';
import { useRouter } from 'next/navigation';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  order: IOrder | null;
}

export const DeleteConfirmDialog = ({ open, onClose, order }: DeleteConfirmDialogProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const confirmDelete = async () => {
    if (!order) return;
    
    setLoading(true);
    try {
      await deleteOrder(order.id.toString());
      toastService.success('Order deleted successfully!');
      onClose();
      router.refresh();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to delete order';
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
            Delete Order
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete order "#{order?.id}"? This action cannot be undone.
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
          Delete Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};