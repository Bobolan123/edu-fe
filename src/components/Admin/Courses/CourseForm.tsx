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
import { createCourse, updateCourse } from '../../../actions/coursesAction';
import { ICategory, ICourse } from '../../../../types/entities';
import { useCurrency } from '@/context/CurrencyContext';
import { currencyService } from '@/services/currency';

interface CourseFormData {
  title: string;
  description: string;
  price: number;
  language: string;
  isActive: boolean;
  categoryIds: number[];
  instructorId: number;
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
  const { currency } = useCurrency();
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    price: 0,
    language: 'en',
    isActive: true,
    categoryIds: [],
    instructorId: 0,
  });
  const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof CourseFormData, string>>>({});
  const [displayPrice, setDisplayPrice] = useState(0);

  useEffect(() => {
    if (course && mode === 'edit') {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        price: Math.round(course.price || 0),
        language: course.language || 'en',
        isActive: course.isActive ?? true,
        categoryIds: course.categories?.map(c => c.id) || [],
        instructorId: course.instructor?.id || 0,
      });
      setSelectedCategories(course.categories || []);
      setDisplayPrice(Math.round(course.price || 0));
    } else {
      setFormData({
        title: '',
        description: '',
        price: 0,
        language: 'en',
        isActive: true,
        categoryIds: [],
        instructorId: 0,
      });
      setSelectedCategories([]);
      setDisplayPrice(0);
    }
  }, [course, mode, open]);

  // Convert price for display based on selected currency
  useEffect(() => {
    const convertPriceForDisplay = async () => {
      if (formData.price > 0) {
        if (currency === "USD") {
          try {
            const converted = await currencyService.convertPrice(formData.price, "VND", "USD");
            setDisplayPrice(Math.round(converted * 100) / 100); // Round to 2 decimal places for USD
          } catch {
            setDisplayPrice(formData.price);
          }
        } else {
          setDisplayPrice(Math.round(formData.price)); // Round VND to integer
        }
      } else {
        setDisplayPrice(0);
      }
    };

    convertPriceForDisplay();
  }, [formData.price, currency]);

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      language: 'en',
      isActive: true,
      categoryIds: [],
      instructorId: 0,
    });
    setSelectedCategories([]);
    setErrors({});
    setDisplayPrice(0);
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

    if (displayPrice < 0) {
      newErrors.price = 'Price must be positive';
    } else if (displayPrice > (currency === "USD" ? 100 : 100000000)) {
      newErrors.price = `Price must be less than ${currency === "USD" ? "$100" : "₫100,000,000"}`;
    }

    if (formData.categoryIds.length === 0) {
      newErrors.categoryIds = 'At least one category is required';
    }

    if (!formData.instructorId || formData.instructorId <= 0) {
      newErrors.instructorId = 'Instructor ID is required and must be a positive number';
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
          await createCourse({
            title: formData.title,
            description: formData.description,
            language: formData.language,
            price: formData.price,
            isActive: formData.isActive,
            categoryIds: formData.categoryIds,
            instructorId: formData.instructorId,
          });
        } else if (course) {
          await updateCourse(course.id.toString(), {
            title: formData.title,
            description: formData.description,
            language: formData.language,
            price: formData.price,
            isActive: formData.isActive,
            categories: selectedCategories,
          });
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

  const handlePriceChange = async (displayValue: number) => {
    setDisplayPrice(displayValue);
    
    // Convert display price back to VND for storage
    if (currency === "USD" && displayValue > 0) {
      try {
        const vndPrice = await currencyService.convertPrice(displayValue, "USD", "VND");
        // Ensure the price is stored as an integer (round to nearest VND)
        handleInputChange('price', Math.round(vndPrice));
      } catch {
        handleInputChange('price', Math.round(displayValue));
      }
    } else {
      // Ensure VND prices are also integers
      handleInputChange('price', Math.round(displayValue));
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
              <Grid item xs={12} md={4}>
                <TextField
                  label={`Price * (${currency})`}
                  fullWidth
                  type="number"
                  value={displayPrice}
                  onChange={(e) => handlePriceChange(parseFloat(e.target.value) || 0)}
                  inputProps={{
                    min: 0,
                    max: currency === "USD" ? 100 : 100000000,
                    step: currency === "USD" ? 0.01 : 1,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {currency === "USD" ? "$" : "₫"}
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors.price}
                  helperText={errors.price || (currency === "USD" ? "Price will be stored in VND" : "Price in Vietnamese Dong")}
                  disabled={isPending}
                />
              </Grid>

              <Grid item xs={12} md={4}>
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

              <Grid item xs={12} md={4}>
                <TextField
                  label="Instructor ID *"
                  fullWidth
                  type="number"
                  value={formData.instructorId || ''}
                  onChange={(e) => handleInputChange('instructorId', parseInt(e.target.value) || 0)}
                  inputProps={{
                    min: 1,
                  }}
                  error={!!errors.instructorId}
                  helperText={errors.instructorId || "Enter the instructor's user ID"}
                  disabled={isPending}
                />
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
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
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