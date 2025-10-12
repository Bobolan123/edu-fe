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
  CircularProgress,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
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
  ExpandMore,
} from '@mui/icons-material';
import { CourseTable } from './CourseTable';
import { CourseForm } from './CourseForm';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import CourseViewModal from './CourseViewModal';
import CourseContentEditModal from './CourseContentEditModal';
import { ICategory, ICourse } from '../../../../types/entities';
import { toastService } from '../../../services/toast';
import { useCurrency } from '@/context/CurrencyContext';
import { currencyService } from '@/services/currency';

interface AdminCoursesPageProps {
  courses: IModelPaginate<ICourse>;
  categories: ICategory[];
  searchParams: {
    page?: string;
    search?: string;
    categoryIds?: string | string[];
    status?: string;
    includeDeleted?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    maxRating?: string;
    orderBy?: string;
    order?: string;
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
  const [includeDeleted, setIncludeDeleted] = useState(searchParams.includeDeleted === 'true' ? true : searchParams.includeDeleted === 'false' ? false : false);
  
  // New filter states
  const [minPrice, setMinPrice] = useState(searchParams.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.maxPrice || '');
  const [minRating, setMinRating] = useState(searchParams.minRating || '');
  const [maxRating, setMaxRating] = useState(searchParams.maxRating || '');
  const [sortBy, setSortBy] = useState(() => {
    const orderBy = searchParams.orderBy || 'last_updated';
    const order = searchParams.order || 'DESC';
    return `${orderBy}-${order}`;
  });
  
  // Accordion state for advanced filters
  const [expandedFilters, setExpandedFilters] = useState(false);
  
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [contentEditModalOpen, setContentEditModalOpen] = useState(false);
  const [deleteAction, setDeleteAction] = useState<'delete' | 'restore' | 'force-delete'>('delete');
  const [loading, setLoading] = useState(false);

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
    if (params.includeDeleted === 'true' || params.includeDeleted === 'false') {
      searchParams.set('includeDeleted', params.includeDeleted);
    }
    
    // Add price range parameters
    if (params.minPrice && params.minPrice !== '') {
      searchParams.set('minPrice', params.minPrice);
    }
    if (params.maxPrice && params.maxPrice !== '') {
      searchParams.set('maxPrice', params.maxPrice);
    }
    
    // Add rating range parameters
    if (params.minRating && params.minRating !== '') {
      searchParams.set('minRating', params.minRating);
    }
    if (params.maxRating && params.maxRating !== '') {
      searchParams.set('maxRating', params.maxRating);
    }
    
    // Add sorting parameters
    if (params.orderBy) {
      searchParams.set('orderBy', params.orderBy);
    }
    if (params.order) {
      searchParams.set('order', params.order);
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
    const [orderBy, order] = sortBy.split('-') as [string, 'ASC' | 'DESC'];
    updateURL({
      search: searchTerm,
      category: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
      status: selectedStatus !== 'all' ? selectedStatus : undefined,
      includeDeleted: includeDeleted ? 'true' : 'false',
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      minRating: minRating || undefined,
      maxRating: maxRating || undefined,
      orderBy: orderBy,
      order: order,
      page: (newPage + 1).toString()
    });
  };

  const handleToggleDeleted = (showDeleted: boolean) => {
    setIncludeDeleted(showDeleted);
    const [orderBy, order] = sortBy.split('-') as [string, 'ASC' | 'DESC'];
    updateURL({
      search: searchTerm,
      category: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
      status: selectedStatus !== 'all' ? selectedStatus : undefined,
      includeDeleted: showDeleted ? 'true' : 'false',
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      minRating: minRating || undefined,
      maxRating: maxRating || undefined,
      orderBy: orderBy,
      order: order,
      page: '1'
    });
  };

  const handleApplyFilters = () => {
    // Parse sortBy into orderBy and order
    const [orderBy, order] = sortBy.split('-') as [string, 'ASC' | 'DESC'];

    updateURL({
      search: searchTerm,
      category: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
      status: selectedStatus !== 'all' ? selectedStatus : undefined,
      includeDeleted: includeDeleted ? 'true' : 'false',
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      minRating: minRating || undefined,
      maxRating: maxRating || undefined,
      orderBy: orderBy,
      order: order,
      page: '1'  // Reset to first page when applying filters
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedStatus('all');
    setIncludeDeleted(false);
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setMaxRating('');
    setSortBy('last_updated-DESC');
    updateURL({
      search: undefined,
      category: undefined,
      status: undefined,
      includeDeleted: 'false',
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      maxRating: undefined,
      orderBy: undefined,
      order: undefined,
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
    setSelectedCourse(course);
    setViewModalOpen(true);
  };

  const handleEditContent = (course: ICourse) => {
    setSelectedCourse(course);
    setContentEditModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    toastService.success('Course created successfully!');
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    setSelectedCourse(null);
    toastService.success('Course updated successfully!');
  };

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    setSelectedCourse(null);
    const messages = {
      'delete': 'Course deleted successfully!',
      'restore': 'Course restored successfully!',
      'force-delete': 'Course permanently deleted successfully!'
    };
    toastService.success(messages[deleteAction]);
  };

  const handleError = (errorMessage: string) => {
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
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterList />
            Filters & Search
          </Typography>
          
          {/* Always Visible: Search, Sort, Categories and Status */}
          <Grid container spacing={3}>
            {/* Search and Sort Row */}
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search courses by name, instructor, category..."
                    value={searchTerm}
                    onChange={handleSearch}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      label="Sort By"
                      onChange={(e) => setSortBy(e.target.value as string)}
                    >
                      <MenuItem value="last_updated-DESC">Recently Updated</MenuItem>
                      <MenuItem value="last_updated-ASC">Oldest Updated</MenuItem>
                      <MenuItem value="date_created-DESC">Newest Created</MenuItem>
                      <MenuItem value="date_created-ASC">Oldest Created</MenuItem>
                      <MenuItem value="title-ASC">Title (A-Z)</MenuItem>
                      <MenuItem value="title-DESC">Title (Z-A)</MenuItem>
                      <MenuItem value="price-ASC">Price (Low to High)</MenuItem>
                      <MenuItem value="price-DESC">Price (High to Low)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small">
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
              </Grid>
            </Grid>

            {/* Categories Row - Always Visible */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom color="text.secondary">
                Filter by Categories
              </Typography>
              <FormControl fullWidth size="small">
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
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Collapsible Advanced Filters */}
          <Accordion 
            expanded={expandedFilters} 
            onChange={(e, isExpanded) => setExpandedFilters(isExpanded)}
            elevation={0}
            sx={{ 
              '&:before': { display: 'none' },
              boxShadow: 'none',
              bgcolor: 'transparent'
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{ 
                px: 0,
                minHeight: 'auto',
                '& .MuiAccordionSummary-content': { 
                  margin: '8px 0' 
                }
              }}
            >
              <Typography variant="subtitle1" color="text.secondary">
                Advanced Filters (Price & Rating)
              </Typography>
            </AccordionSummary>
            
            <AccordionDetails sx={{ px: 0 }}>
              <Grid container spacing={3}>
                {/* Price Range Row */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom color="text.secondary">
                    Price Range
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        label="Min Price"
                        size="small"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₫</InputAdornment>
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        label="Max Price"
                        size="small"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₫</InputAdornment>
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Rating Range Row */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom color="text.secondary">
                    Rating Range
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="number"
                        placeholder="Min Rating (0-5)"
                        value={minRating}
                        onChange={(e) => setMinRating(e.target.value)}
                        label="Min Rating"
                        size="small"
                        inputProps={{ min: 0, max: 5, step: 0.1 }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">⭐</InputAdornment>
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="number"
                        placeholder="Max Rating (0-5)"
                        value={maxRating}
                        onChange={(e) => setMaxRating(e.target.value)}
                        label="Max Rating"
                        size="small"
                        inputProps={{ min: 0, max: 5, step: 0.1 }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">⭐</InputAdornment>
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Action Buttons Row - Always Visible */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={handleClearFilters}
              color="secondary"
            >
              Clear All
            </Button>
            <Button
              variant="contained"
              startIcon={<FilterList />}
              onClick={handleApplyFilters}
              color="primary"
            >
              Apply 
            </Button>
          </Box>

          {/* Results Count */}
          <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {courses.data?.meta.itemCount || 0} results
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <CourseTable
        courses={courses.data?.result || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onEditContent={handleEditContent}
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

      <CourseViewModal
        open={viewModalOpen}
        course={selectedCourse}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedCourse(null);
        }}
      />

      <CourseContentEditModal
        open={contentEditModalOpen}
        course={selectedCourse}
        onClose={() => {
          setContentEditModalOpen(false);
          setSelectedCourse(null);
        }}
        onSuccess={() => {
          setContentEditModalOpen(false);
          setSelectedCourse(null);
          toastService.success('Course content updated successfully!');
        }}
      />
    </Box>
  );
}