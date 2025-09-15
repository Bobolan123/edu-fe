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
  Typography,
  IconButton,
  CircularProgress,
  Stack,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IResFindAllCategories } from '../../../../types/resData';
import { createCategory, updateCategory } from '@/actions/categoriesAction';
import { toastService } from '@/services/toast';
import { useRouter } from 'next/navigation';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Name is too long'),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  category?: IResFindAllCategories | null;
  mode: 'create' | 'edit';
}

export const CategoryForm = ({ open, onClose, category, mode }: CategoryFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (open && category && mode === 'edit') {
      reset({
        name: category.name,
        description: category.description || '',
      });
    } else if (open && mode === 'create') {
      reset({
        name: '',
        description: '',
      });
    }
  }, [open, category, mode, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    
    try {
      if (mode === 'create') {
        await createCategory({
          name: data.name,
          description: data.description || undefined,
        });
        toastService.success('Category created successfully!');
      } else if (category) {
        await updateCategory(category.id, {
          name: data.name,
          description: data.description || undefined,
        });
        toastService.success('Category updated successfully!');
      }
      
      handleClose();
      router.refresh();
    } catch (error: any) {
      const errorMessage = error?.message || `Failed to ${mode} category`;
      toastService.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            {mode === 'create' ? 'Create New Category' : 'Edit Category'}
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 2 }}>
          
          <Stack spacing={3}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Category Name"
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  placeholder="Enter category name"
                  disabled={loading}
                />
              )}
            />
            
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  placeholder="Describe this category"
                  disabled={loading}
                />
              )}
            />
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="contained" 
            disabled={loading || !isDirty}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ mr: 1 }} />
            ) : null}
            {mode === 'create' ? 'Create Category' : 'Update Category'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};