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
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Search,
  Category,
  School,
  Visibility,
  ColorLens,
  FilterList,
  Clear,
  Close,
} from '@mui/icons-material';
import { CategoryTable } from './CategoryTable';
import { CategoryForm } from './CategoryForm';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { IResFindAllCategories } from '../../../../types/resData';


interface AdminCategoriesPageProps {
  categories: IModelPaginate<IResFindAllCategories>;
  searchParams: {
    page?: string;
    search?: string;
  };
}


export default function AdminCategoriesPage({ 
  categories, 
  searchParams 
}: AdminCategoriesPageProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(searchParams.search || '');
  const [selectedCategory, setSelectedCategory] = useState<IResFindAllCategories | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateURL = (params: Record<string, string | undefined>) => {
    const searchParams = new URLSearchParams();
    
    if (params.search && params.search !== '') {
      searchParams.set('search', params.search);
    }
    
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
  };

  const handleSearchSubmit = () => {
    updateURL({ 
      search: searchTerm || undefined, 
      page: '1'
    });
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleApplyFilters();
    }
  };

  const handlePageChange = (newPage: number) => {
    updateURL({ 
      search: searchTerm, 
      page: newPage.toString() 
    });
  };

  const handleCreateCategory = () => {
    setFormMode('create');
    setSelectedCategory(null);
    setFormDialogOpen(true);
  };

  const handleEditCategory = (category: IResFindAllCategories) => {
    setFormMode('edit');
    setSelectedCategory(category);
    setFormDialogOpen(true);
  };

  const handleDeleteCategory = (category: IResFindAllCategories) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleCloseForm = () => {
    setFormDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleApplyFilters = () => {
    updateURL({ 
      search: searchTerm, 
      page: '1'
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    updateURL({
      search: undefined,
      page: '1'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const currentCategories = categories.data?.result || [];
  const totalCategories = categories.data?.meta?.itemCount || 0;
  const totalCourses = currentCategories.reduce((sum, cat) => sum + (cat.courseCount || 0), 0);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
              Categories Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Organize courses into categories for better discoverability
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            size="large"
            onClick={handleCreateCategory}
          >
            Create Category
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Category sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {totalCategories}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Categories
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <ColorLens sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {currentCategories.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Categories on Page
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <School sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {totalCourses}
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
              <Visibility sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {Math.round(totalCourses / Math.max(totalCategories, 1))}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Courses/Category
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Search & Filter
            </Typography>
          </Box>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search categories by name, description..."
                value={searchTerm}
                onChange={handleSearch}
                onKeyPress={handleSearchKeyPress}
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
              <Box sx={{ display: 'flex', gap: 1, height: 40 }}>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<FilterList />}
                  onClick={handleApplyFilters}
                  sx={{ flex: 1, minWidth: 0 }}
                >
                  Apply
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Close />}
                  onClick={handleClearFilters}
                  sx={{ flex: 1, minWidth: 0 }}
                >
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Results Count */}
          <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing {totalCategories} results
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <CategoryTable
        categories={currentCategories}
        totalCategories={totalCategories}
        currentPage={parseInt(searchParams.page || '1')}
        onPageChange={handlePageChange}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />

      {/* Dialogs */}
      <CategoryForm
        open={formDialogOpen}
        onClose={handleCloseForm}
        category={selectedCategory}
        mode={formMode}
      />
      
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={handleCloseDelete}
        category={selectedCategory}
      />
    </Box>
  );
}