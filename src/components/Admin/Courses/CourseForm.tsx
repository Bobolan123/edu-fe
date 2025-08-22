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
  InputAdornment,
  IconButton,
  Chip,
  Autocomplete,
  Switch,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  AttachMoney,
} from '@mui/icons-material';
import { adminCreateCourse, adminUpdateCourse } from '../../../actions/coursesAction';
import { ICategory, ICourse } from '../../../../types/entities';

interface CourseFormData {
  title: string;
  description: string;
  price: number;
  language: string;
  active: boolean;
  categoryIds: number[];
}

interface CourseFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  course?: ICourse | null;
  categories: ICategory[];
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const languages = [
  { value: 'en', label: 'English' },
  { value: 'vi', label: 'Vietnamese' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
];

export function CourseForm({
  open,
  mode,
  course,
  categories,
  onClose,
  onSuccess,
  onError,
}: CourseFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    price: 0,
    language: 'en',
    active: true,
    categoryIds: [],
  });
  const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof CourseFormData, string>>>({});

  useEffect(() => {
    if (course && mode === 'edit') {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        price: course.price || 0,
        language: course.language || 'en',
        active: course.active ?? true,
        categoryIds: course.categories?.map(c => c.id) || [],
      });
      setSelectedCategories(course.categories || []);
    } else {
      setFormData({
        title: '',
        description: '',
        price: 0,
        language: 'en',
        active: true,
        categoryIds: [],
      });
      setSelectedCategories([]);
    }
  }, [course, mode, open]);

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      language: 'en',
      active: true,
      categoryIds: [],
    });
    setSelectedCategories([]);
    setErrors({});
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CourseFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title too long';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 2000) {
      newErrors.description = 'Description too long';
    }

    if (formData.price < 0) {
      newErrors.price = 'Price must be positive';
    } else if (formData.price > 9999) {
      newErrors.price = 'Price too high';
    }

    if (formData.categoryIds.length === 0) {
      newErrors.categoryIds = 'At least one category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    startTransition(async () => {
      try {
        if (mode === 'create') {
          await adminCreateCourse(formData);
        } else if (course) {
          await adminUpdateCourse(course.id.toString(), formData);
        }
        onSuccess();
        handleClose();
      } catch (error) {
        onError(error instanceof Error ? error.message : 'An error occurred');
      }
    });
  };

  const handleInputChange = (field: keyof CourseFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleCategoryChange = (event: any, newValue: ICategory[]) => {
    setSelectedCategories(newValue);
    handleInputChange('categoryIds', newValue.map(c => c.id));
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight={600}>
              {mode === 'create' ? 'Create New Course' : 'Edit Course'}
            </Typography>
            <IconButton onClick={handleClose} disabled={isPending}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3}>
            <TextField
              label="Course Title *"
              fullWidth
              variant="outlined"
              placeholder="Enter course title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              disabled={isPending}
            />
            
            <TextField
              label="Course Description *"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Describe what students will learn..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              disabled={isPending}
            />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Price *"
                  fullWidth
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  inputProps={{
                    min: 0,
                    max: 9999,
                    step: 0.01,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney />
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors.price}
                  helperText={errors.price}
                  disabled={isPending}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Language *</InputLabel>
                  <Select
                    value={formData.language}
                    label="Language *"
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    disabled={isPending}
                  >
                    {languages.map((lang) => (
                      <MenuItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Autocomplete
              multiple
              options={categories}
              getOptionLabel={(option) => option.name}
              value={selectedCategories}
              onChange={handleCategoryChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Categories *"
                  placeholder="Select categories"
                  error={!!errors.categoryIds}
                  helperText={errors.categoryIds}
                  disabled={isPending}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...chipProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      label={option.name}
                      {...chipProps}
                      disabled={isPending}
                    />
                  );
                })
              }
              disabled={isPending}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={(e) => handleInputChange('active', e.target.checked)}
                  disabled={isPending}
                />
              }
              label="Active Course"
            />
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={handleClose} 
            disabled={isPending}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="contained" 
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={20} /> : null}
          >
            {isPending 
              ? (mode === 'create' ? 'Creating...' : 'Updating...')
              : (mode === 'create' ? 'Create Course' : 'Update Course')
            }
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}