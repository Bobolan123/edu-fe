"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IUser } from '../../../../types/entities';
import { updateUser } from '@/actions/userActions';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  bio: z.string().optional(),
  isActive: z.boolean(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  user?: IUser | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export function UserForm({
  open,
  mode,
  user,
  onClose,
  onSuccess,
  onError,
}: UserFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      bio: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (open && user && mode === 'edit') {
      reset({
        name: user.name,
        email: user.email,
        bio: user.bio || '',
        isActive: user.isActive ?? true,
      });
    } else if (open && mode === 'create') {
      reset({
        name: '',
        email: '',
        bio: '',
        isActive: true,
      });
    }
  }, [open, user, mode, reset]);

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    setError(null);

    try {
      if (mode === 'edit' && user) {
        await updateUser(user.id, data);
        onSuccess();
      } else {
        // For create mode, you would typically call a createUser action
        // Since it's not implemented in userActions, we'll show an error
        throw new Error('Create user functionality is not implemented yet');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      reset();
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
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
          <Typography variant="h6" component="div" fontWeight={600}>
            {mode === 'create' ? 'Create New User' : 'Edit User'}
          </Typography>
          <IconButton onClick={handleClose} disabled={loading}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Full Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Address"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="bio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Bio"
                    multiline
                    rows={3}
                    error={!!errors.bio}
                    helperText={errors.bio?.message}
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                        disabled={loading}
                      />
                    }
                    label="Active User"
                  />
                )}
              />
            </Grid>
          </Grid>
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
            type="submit"
            variant="contained"
            disabled={loading || !isValid}
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
                }}
              />
            )}
            {loading ? '' : mode === 'create' ? 'Create User' : 'Update User'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}