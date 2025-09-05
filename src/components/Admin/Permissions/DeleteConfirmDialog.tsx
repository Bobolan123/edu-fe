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
  Security,
} from '@mui/icons-material';
import { deletePermission } from '../../../actions/permissionsAction';
import { IPermission } from '../../../../types/entities';

interface DeleteConfirmDialogProps {
  open: boolean;
  permission: IPermission | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function DeleteConfirmDialog({
  open,
  permission,
  onClose,
  onSuccess,
  onError,
}: DeleteConfirmDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleAction = () => {
    if (!permission) return;

    startTransition(async () => {
      try {
        await deletePermission(permission.id);
        onSuccess();
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Failed to delete permission');
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
            Delete Permission
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Are you sure you want to delete this permission?
          </Typography>
          
          {permission && (
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'grey.50', 
              borderRadius: 1, 
              mb: 2,
              textAlign: 'left'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Security color="primary" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={600}>
                  {permission.method} {permission.api}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Module: {permission.module}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Description: {permission.description}
              </Typography>
            </Box>
          )}
          
          <Typography variant="body2" color="error.main">
            This action cannot be undone. The permission will be removed from all roles that currently use it.
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
          color="error"
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={20} /> : <Delete />}
          sx={{ minWidth: 140 }}
        >
          {isPending ? 'Deleting...' : 'Delete Permission'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}