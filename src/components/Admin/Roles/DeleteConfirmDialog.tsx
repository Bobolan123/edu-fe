"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  Alert,
} from '@mui/material';
import { Close, Warning } from '@mui/icons-material';
import { IRole } from '../../../../types/entities';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  role: IRole | null;
  loading?: boolean;
}

export default function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  role,
  loading = false,
}: DeleteConfirmDialogProps) {
  const hasUsers = role?.users && role.users.length > 0;
  const hasPermissions = role?.permissions && role.permissions.length > 0;

  return (
    <Dialog
      open={open}
      onClose={!loading ? onClose : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="error" />
            <Typography variant="h6" fontWeight={600}>
              Delete Role
            </Typography>
          </Box>
          {!loading && (
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Are you sure you want to delete the role <strong>"{role?.name}"</strong>?
        </DialogContentText>

        {role && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Role Information:
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
              <Chip
                label={`${role.users?.length || 0} users`}
                size="small"
                color={hasUsers ? "warning" : "default"}
                variant="outlined"
              />
              <Chip
                label={`${role.permissions?.length || 0} permissions`}
                size="small"
                color={hasPermissions ? "info" : "default"}
                variant="outlined"
              />
            </Box>
          </Box>
        )}

        {hasUsers && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Warning:</strong> This role is currently assigned to {role.users?.length} user(s). 
              Deleting this role will remove it from all assigned users.
            </Typography>
          </Alert>
        )}

        <Alert severity="error">
          <Typography variant="body2">
            <strong>This action cannot be undone.</strong> The role and all its associated data will be permanently deleted.
          </Typography>
        </Alert>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete Role'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}