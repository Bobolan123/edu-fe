"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Close, Warning } from '@mui/icons-material';
import { IUser } from '../../../../types/entities';
import { deleteUser } from '@/actions/userActions';

interface DeleteConfirmDialogProps {
  open: boolean;
  user: IUser | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export function DeleteConfirmDialog({
  open,
  user,
  onClose,
  onSuccess,
  onError,
}: DeleteConfirmDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      await deleteUser(user.id);
      onSuccess();
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to delete user';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          p: 1,
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="error" />
            <Typography variant="h6" component="div" fontWeight={600} color="error.main">
              Delete User
            </Typography>
          </Box>
          <IconButton onClick={handleClose} disabled={loading}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to delete this user?
        </Typography>

        {user && (
          <Box
            sx={{
              p: 2,
              backgroundColor: 'grey.50',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Role: {user.role?.name || 'No Role'}
            </Typography>
          </Box>
        )}

        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Warning:</strong> This action cannot be undone. All user data,
            including course enrollments and progress, will be permanently deleted.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{ borderRadius: '12px' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={loading}
          sx={{
            borderRadius: '12px',
            minWidth: 120,
            position: 'relative',
          }}
        >
          {loading && (
            <CircularProgress
              size={20}
              sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                marginLeft: '-10px',
                marginTop: '-10px',
                color: 'white',
              }}
            />
          )}
          {loading ? '' : 'Delete User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}