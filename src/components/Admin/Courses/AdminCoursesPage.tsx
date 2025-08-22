"use client";

import { useState } from 'react';
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
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  School,
  People,
  Star,
  AttachMoney,
} from '@mui/icons-material';
import { CourseTable } from './CourseTable';
import { CourseForm } from './CourseForm';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { ICategory, ICourse } from '../../../../types/entities';

interface AdminCoursesPageProps {
  initialCourses: IModelPaginate<ICourse>;
  categories: ICategory[];
  searchParams: {
    page?: string;
    search?: string;
    category?: string;
    status?: string;
  };
}

export default function AdminCoursesPage({ 
  initialCourses, 
  categories, 
  searchParams 
}: AdminCoursesPageProps) {
  const router = useRouter();
  const [courses, setCourses] = useState<IModelPaginate<ICourse>>(initialCourses);
  const [searchTerm, setSearchTerm] = useState(searchParams.search || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category || 'all');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.status || 'all');
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateURL = (params: Record<string, string | undefined>) => {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== 'all') {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    router.push(url.pathname + url.search);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    updateURL({ search: value, category: selectedCategory, status: selectedStatus, page: '1' });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateURL({ search: searchTerm, category, status: selectedStatus, page: '1' });
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    updateURL({ search: searchTerm, category: selectedCategory, status, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    updateURL({ 
      search: searchTerm, 
      category: selectedCategory, 
      status: selectedStatus, 
      page: (newPage + 1).toString() 
    });
  };

  const handleEdit = (course: ICourse) => {
    setSelectedCourse(course);
    setEditDialogOpen(true);
  };

  const handleDelete = (course: ICourse) => {
    setSelectedCourse(course);
    setDeleteDialogOpen(true);
  };

  const handleView = (course: ICourse) => {
    router.push(`/admin/courses/${course.id}`);
  };

  const handleCreateSuccess = () => {
    setCreateDialogOpen(false);
    setError(null);
    // Force a router refresh to get updated data from server component
    router.refresh();
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    setSelectedCourse(null);
    setError(null);
    // Force a router refresh to get updated data from server component
    router.refresh();
  };

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    setSelectedCourse(null);
    setError(null);
    // Force a router refresh to get updated data from server component
    router.refresh();
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setLoading(false);
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
            <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
              Course Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and monitor all courses on the platform
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            size="large"
            onClick={() => setCreateDialogOpen(true)}
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
                ${courses.data?.result?.reduce((sum, course) => sum + (course.price * course.total_students), 0)?.toLocaleString() || '0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
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
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => handleCategoryChange(e.target.value as string)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
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
            
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                fullWidth
                sx={{ height: 56 }}
              >
                Filters
              </Button>
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