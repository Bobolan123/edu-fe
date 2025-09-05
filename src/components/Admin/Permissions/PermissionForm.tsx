"use client";

import { useState, useTransition, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  Stack,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  Security,
} from '@mui/icons-material';
import { createPermission, updatePermission } from '../../../actions/permissionsAction';
import { IPermission } from '../../../../types/entities';

interface PermissionFormData {
  api: string;
  description: string;
  method: string;
  module: string;
}

interface PermissionFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  permission?: IPermission | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const httpMethods = ['GET', 'POST', 'PUT', 'DELETE'];

const commonModules = [
  'User',
  'Course',
  'Permission',
  'Role',
  'Category',
  'Order',
  'Review',
  'Enrollment',
  'Subscription',
];

export function PermissionForm({
  open,
  mode,
  permission,
  onClose,
  onSuccess,
  onError,
}: PermissionFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<PermissionFormData>({
    api: '',
    description: '',
    method: 'GET',
    module: '',
  });

  // Initialize form data when permission changes
  useEffect(() => {
    if (mode === 'edit' && permission) {
      setFormData({
        api: permission.api || '',
        description: permission.description || '',
        method: permission.method || 'GET',
        module: permission.module || '',
      });
    } else if (mode === 'create') {
      setFormData({
        api: '',
        description: '',
        method: 'GET',
        module: '',
      });
    }
  }, [mode, permission]);

  const handleInputChange = (field: keyof PermissionFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: string } }
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.api?.trim() || !formData.description?.trim() || !formData.module?.trim()) {
      onError('Please fill in all required fields');
      return;
    }

    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createPermission({
            api: formData.api.trim(),
            description: formData.description.trim(),
            method: formData.method,
            module: formData.module.trim(),
          });
        } else if (mode === 'edit' && permission) {
          await updatePermission(permission.id, {
            api: formData.api.trim(),
            description: formData.description.trim(),
            method: formData.method,
            module: formData.module.trim(),
          });
        }
        onSuccess();
      } catch (error) {
        onError(error instanceof Error ? error.message : `Failed to ${mode} permission`);
      }
    });
  };

  const handleClose = () => {
    if (!isPending) {
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
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security color="primary" />
            <Typography variant="h6" fontWeight={600}>
              {mode === 'create' ? 'Create New Permission' : 'Edit Permission'}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} disabled={isPending}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', gap: 2 }} >
            <Box sx={{ flex: 2, mt:1 }} >
              <TextField
                fullWidth
                label="API Endpoint"
                value={formData.api}
                onChange={handleInputChange('api')}
                placeholder="/api/users"
                helperText="The API endpoint path this permission controls"
                required
                disabled={isPending}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 120, mt:1 }}>
              <FormControl fullWidth required disabled={isPending}>
                <InputLabel>Method</InputLabel>
                <Select
                  value={formData.method}
                  label="Method"
                  onChange={handleInputChange('method')}
                >
                  {httpMethods.map((method) => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box> 
          </Box>

          <FormControl fullWidth required disabled={isPending}>
            <InputLabel>Module</InputLabel>
            <Select
              value={formData.module}
              label="Module"
              onChange={handleInputChange('module')}
            >
              {commonModules.map((module) => (
                <MenuItem key={module} value={module}>
                  {module}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={handleInputChange('description')}
            multiline
            rows={3}
            placeholder="Describe what this permission allows users to do"
            helperText="Provide a clear description of the permission's purpose"
            required
            disabled={isPending}
          />

          {mode === 'edit' && permission && (
            <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Permission Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created: {new Date(permission.created).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last Updated: {new Date(permission.updated).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Used in {permission.roles?.length || 0} role(s)
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={handleClose} 
          disabled={isPending}
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={isPending || !formData.api?.trim() || !formData.description?.trim() || !formData.module?.trim()}
          startIcon={isPending ? <CircularProgress size={20} /> : <Security />}
          sx={{ minWidth: 140 }}
        >
          {isPending 
            ? (mode === 'create' ? 'Creating...' : 'Updating...') 
            : (mode === 'create' ? 'Create Permission' : 'Update Permission')
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
}