"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Alert,
  CircularProgress,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  School,
  People,
  Star,
  AttachMoney,
  Clear,
  Visibility,
  VisibilityOff,
  Delete,
} from '@mui/icons-material';
import { CourseTable } from './CourseTable';
import { CourseForm } from './CourseForm';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { ICategory, ICourse } from '../../../../types/entities';
import { toastService } from '../../../services/toast';
import { useCurrency } from '@/context/CurrencyContext';
import { currencyService } from '@/service/currency';

interface AdminCoursesPageProps {
  courses: IModelPaginate<ICourse>;
  categories: ICategory[];
  searchParams: {
    page?: string;
    search?: string;
    categoryIds?: string | string[];
    status?: string;
    includeDeleted?: string;
  };
}

// Component to handle currency formatting for revenue
function RevenueDisplay({ revenue }: { revenue: number }) {
  const { currency } = useCurrency();
  const [convertedRevenue, setConvertedRevenue] = useState(revenue);

  useEffect(() => {
    if (currency === "USD") {
      currencyService
        .convertPrice(revenue, "VND", "USD")
        .then(setConvertedRevenue)
        .catch(() => setConvertedRevenue(revenue));
    } else {
      setConvertedRevenue(revenue);
    }
  }, [revenue, currency]);

  return <>{currencyService.formatPrice(convertedRevenue, currency)}</>;
}

export default function AdminCoursesPage({ 
  courses, 
  categories, 
  searchParams 
}: AdminCoursesPageProps) {
  const router = useRouter();
  const { currency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState(searchParams.search || '');
  const [selectedCategories, setSelectedCategories] = useState<number[]>(() => {
    if (searchParams.categoryIds) {
      if (Array.isArray(searchParams.categoryIds)) {
        return searchParams.categoryIds.map(Number).filter(Boolean);
      } else {
        return [Number(searchParams.categoryIds)].filter(Boolean);
      }
    }
    return [];
  });
  const [selectedStatus, setSelectedStatus] = useState(searchParams.status || 'all');
  const [includeDeleted, setIncludeDeleted] = useState(searchParams.includeDeleted === 'true');
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAction, setDeleteAction] = useState<'delete' | 'restore' | 'force-delete'>('delete');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateURL = (params: Record<string, string | undefined>) => {
    const searchParams = new URLSearchParams();
    
    // Add search parameter
    if (params.search && params.search !== '') {
      searchParams.set('search', params.search);
    }
    
    // Add category parameters - each category ID as separate parameter
    if (params.category && params.category !== '') {
      const categoryIds = params.category.split(',');
      categoryIds.forEach(id => {
        searchParams.append('categoryIds', id);
      });
    }
    
    // Add status parameter
    if (params.status && params.status !== 'all') {
      searchParams.set('status', params.status);
    }
    
    // Add includeDeleted parameter
    if (params.includeDeleted === 'true') {
      searchParams.set('includeDeleted', params.includeDeleted);
    }
    
    // Add page parameter
    if (params.page) {
      searchParams.set('page', params.page);
    }
    
    const queryString = searchParams.toString();
    const newUrl = window.location.pathname + (queryString ? '?' + queryString : '');
    router.push(newUrl, { scroll: false });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    // Only update state, don't trigger URL change
  };

  const handleCategoryChange = (categoryIds: number[]) => {
    setSelectedCategories(categoryIds);
    // Only update state, don't trigger URL change
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    // Only update state, don't trigger URL change
  };

  const handlePageChange = (newPage: number) => {
    updateURL({ 
      search: searchTerm, 
      category: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined, 
      status: selectedStatus, 
      includeDeleted: includeDeleted ? 'true' : undefined,
      page: (newPage + 1).toString() 
    });
  };

  const handleToggleDeleted = (showDeleted: boolean) => {
    setIncludeDeleted(showDeleted);
    updateURL({
      search: searchTerm,
      category: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
      status: selectedStatus !== 'all' ? selectedStatus : undefined,
      includeDeleted: showDeleted ? 'true' : undefined,
      page: '1'
    });
  };

  const handleApplyFilters = () => {
    updateURL({ 
      search: searchTerm, 
      category: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined, 
      status: selectedStatus !== 'all' ? selectedStatus : undefined,
      includeDeleted: includeDeleted ? 'true' : undefined,
      page: '1'  // Reset to first page when applying filters
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedStatus('all');
    setIncludeDeleted(false);
    updateURL({
      search: undefined,
      category: undefined,
      status: undefined,
      includeDeleted: undefined,
      page: '1'
    });
  };

  const handleEdit = (course: ICourse) => {
    setSelectedCourse(course);
    setEditDialogOpen(true);
  };

  const handleDelete = (course: ICourse, action: 'delete' | 'restore' | 'force-delete' = 'delete') => {
    setSelectedCourse(course);
    setDeleteAction(action);
    setDeleteDialogOpen(true);
  };

  const handleView = (course: ICourse) => {
    router.push(`/admin/courses/${course.id}`);
  };

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    setError(null);
    toastService.success('Course created successfully!');
    // Force a router refresh to get updated data from server component
    router.refresh();
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    setSelectedCourse(null);
    setError(null);
    toastService.success('Course updated successfully!');
    // Force a router refresh to get updated data from server component
    router.refresh();
  };

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    setSelectedCourse(null);
    setError(null);
    const messages = {
      'delete': 'Course deleted successfully!',
      'restore': 'Course restored successfully!',
      'force-delete': 'Course permanently deleted successfully!'
    };
    toastService.success(messages[deleteAction]);
    // Force a router refresh to get updated data from server component
    router.refresh();
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setLoading(false);
    toastService.error(errorMessage);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
                Course Management
              </Typography>
              {includeDeleted && (
                <Chip 
                  label="Viewing Deleted Courses" 
                  color="error" 
                  variant="filled"
                  size="small"
                  sx={{ mb: 1 }}
                />
              )}
            </Box>
            <Typography variant="body1" color="text.secondary">
              {includeDeleted 
                ? "View and manage deleted courses - restore or permanently delete them"
                : "Manage and monitor all active courses on the platform"
              }
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            size="large"
            onClick={() => setCreateDialogOpen(true)}
            disabled={includeDeleted}
            sx={{ height: 48 }}
          >
            Create Course
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <School sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {courses.data?.meta.itemCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Courses
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <People sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {courses.data?.result?.reduce((sum, course) => sum + course.total_students, 0)?.toLocaleString() || '0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Enrollments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Star sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {courses.data?.result && courses.data.result.length > 0 
                  ? (courses.data.result.reduce((sum, course) => sum + course.average_rating, 0) / courses.data.result.length).toFixed(1)
                  : '0.0'
                }
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <AttachMoney sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                <RevenueDisplay revenue={courses.data?.result?.reduce((sum, course) => sum + (course.price * course.total_students), 0) || 0} />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data View Toggle */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                Choose Data to Display
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Switch between active courses and deleted courses (trash bin)
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              bgcolor: 'background.default', 
              borderRadius: '12px',
              border: '1px solid',
              borderColor: 'divider',
              p: 0.5
            }}>
              <Button
                variant={!includeDeleted ? 'contained' : 'text'}
                color={!includeDeleted ? 'success' : 'inherit'}
                startIcon={<School />}
                onClick={() => handleToggleDeleted(false)}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 160,
                  px: 2
                }}
              >
                Active Courses
              </Button>
              <Button
                variant={includeDeleted ? 'contained' : 'text'}
                color={includeDeleted ? 'warning' : 'inherit'}
                startIcon={<Delete />}
                onClick={() => handleToggleDeleted(true)}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 160,
                  px: 2
                }}
              >
                Trash Bin
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Search & Filter
            </Typography>
          </Box>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search courses..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Categories</InputLabel>
                <Select
                  multiple
                  value={selectedCategories}
                  label="Categories"
                  onChange={(e: SelectChangeEvent<number[]>) => {
                    const value = e.target.value;
                    handleCategoryChange(typeof value === 'string' ? [] : value as number[]);
                  }}
                  input={<OutlinedInput label="Categories" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as number[]).map((value) => {
                        const category = categories.find(c => c.id === value);
                        return (
                          <Chip key={value} label={category?.name} size="small" />
                        );
                      })}
                    </Box>
                  )}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedStatus}
                  label="Status"
                  onChange={(e) => handleStatusChange(e.target.value as string)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1, height: 56 }}>
                <Button
                  variant="contained"
                  startIcon={<FilterList />}
                  onClick={handleApplyFilters}
                  sx={{ flex: 1, minWidth: 0 }}
                >
                  Apply
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={handleClearFilters}
                  sx={{ flex: 1, minWidth: 0 }}
                >
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <CourseTable
        courses={courses.data?.result || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        totalCount={courses.data?.meta.itemCount || 0}
        currentPage={parseInt(searchParams.page || '1') - 1}
        onPageChange={handlePageChange}
        includeDeleted={includeDeleted}
      />

      {/* Dialogs */}
      <CourseForm
        open={createDialogOpen}
        mode="create"
        categories={categories}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
        onError={handleError}
      />
      
      <CourseForm
        open={editDialogOpen}
        mode="edit"
        course={selectedCourse}
        categories={categories}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedCourse(null);
        }}
        onSuccess={handleEditSuccess}
        onError={handleError}
      />
      
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        course={selectedCourse}
        action={deleteAction}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedCourse(null);
        }}
        onSuccess={handleDeleteSuccess}
        onError={handleError}
      />
    </Box>
  );
}