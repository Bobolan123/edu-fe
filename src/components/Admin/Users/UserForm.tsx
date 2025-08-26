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
import { IUser, IRole } from '../../../../types/entities';
import { updateUser, createAdminUser, updateUserAvatar } from '@/actions/userActions';
import toastService from '@/services/toast';

const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  roleId: z.string().min(1, 'Role is required'),
  bio: z.string().optional(),
  isActive: z.boolean(),
  avatar: z.any().optional(),
});

const editUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().optional(),
  roleId: z.string().min(1, 'Role is required'),
  bio: z.string().optional(),
  isActive: z.boolean(),
  avatar: z.any().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;
type EditUserFormData = z.infer<typeof editUserSchema>;
type UserFormData = CreateUserFormData;

interface UserFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  user?: IUser | null;
  roles: IRole[];
  onClose: () => void;
  onSuccess: (response?: any) => void;
  onError: (message: string) => void;
}

export function UserForm({
  open,
  mode,
  user,
  roles,
  onClose,
  onSuccess,
  onError,
}: UserFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<UserFormData>({
    resolver: zodResolver(mode === 'create' ? createUserSchema : editUserSchema),
    defaultValues: {
      name: '',
      email: '',
      bio: '',
      isActive: true,
      password: '',
      roleId: '',
      avatar: undefined,
    },
  });

  useEffect(() => {
    if (open && user && mode === 'edit') {
      reset({
        name: user.name,
        email: user.email,
        roleId: user.role?.id?.toString() || '',
        bio: user.bio || '',
        isActive: user.isActive ?? true,
        password: '',
        avatar: undefined,
      });
      setSelectedAvatar(null);
      setPreviewUrl(null);
    } else if (open && mode === 'create') {
      reset({
        name: '',
        email: '',
        password: '',
        roleId: '',
        bio: '',
        isActive: true,
        avatar: undefined,
      });
      setSelectedAvatar(null);
      setPreviewUrl(null);
    }
  }, [open, user, mode, reset]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedAvatar(file);
      setValue('avatar', file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      if (mode === 'edit' && user) {
        const editData = {
          name: data.name,
          email: data.email,
          roleId: parseInt(data.roleId || ''),
          bio: data.bio,
          isActive: data.isActive
        };
        
        // Update password if provided
        if (data.password && data.password.trim()) {
          (editData as any).password = data.password;
        }
        
        response = await updateUser(user.id, editData);
        
        // Update avatar if provided
        if (selectedAvatar) {
          await updateUserAvatar(user.id, selectedAvatar);
        }
        
        onSuccess(response);
      } else {
        // Create admin user with FormData for file upload
        const formData = new FormData();
        
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password || '');
        formData.append('roleId', data.roleId || '');
        formData.append('isActive', data.isActive.toString());
        
        if (data.bio) {
          formData.append('bio', data.bio);
        }
        
        if (selectedAvatar) {
          formData.append('avatar', selectedAvatar);
        }
        
        response = await createAdminUser(formData);
        onSuccess(response);
      }
    } catch (error: any) {
      // Try to get message from API response first
      const errorMessage = error.message || error.error || 'An error occurred';
      setError(errorMessage);
      toastService.error(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      setSelectedAvatar(null);
      setPreviewUrl(null);
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

            {mode === 'create' && (
              <Grid item xs={12} md={6}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Password"
                      type="password"
                      error={!!(errors as any).password}
                      helperText={(errors as any).password?.message}
                      disabled={loading}
                    />
                  )}
                />
              </Grid>
            )}

            {mode === 'edit' && (
              <Grid item xs={12} md={6}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="New Password (Optional)"
                      type="password"
                      placeholder="Leave blank to keep current password"
                      error={!!(errors as any).password}
                      helperText={(errors as any).password?.message}
                      disabled={loading}
                    />
                  )}
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <Controller
                name="roleId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!(errors as any).roleId}>
                    <InputLabel>Role</InputLabel>
                    <Select
                      {...field}
                      label="Role"
                      disabled={loading}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id.toString()}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {(errors as any).roleId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {(errors as any).roleId.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Avatar {mode === 'edit' ? '(Change Avatar)' : '(Optional)'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {mode === 'edit' && user?.avatar_url && (
                    <Box sx={{ mr: 2 }}>
                      
                      <img
                        src={user.avatar_url}
                        alt="Current Avatar"
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #ddd'
                        }}
                      />
                    </Box>
                  )}
                  <Box>
                    <Button
                      variant="outlined"
                      component="label"
                      disabled={loading}
                      sx={{ borderRadius: '8px' }}
                    >
                      {mode === 'edit' ? 'Change Avatar' : 'Choose File'}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </Button>
                    {selectedAvatar && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {selectedAvatar.name}
                      </Typography>
                    )}
                  </Box>
                </Box>
                {previewUrl && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      New Avatar Preview:
                    </Typography>
                    <img
                      src={previewUrl}
                      alt="Avatar Preview"
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}
                    />
                  </Box>
                )}
              </Box>
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