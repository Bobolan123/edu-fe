"use client";

import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  InputAdornment,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add,
  Search,
  Category,
  School,
  Visibility,
  MoreVert,
  Edit,
  Delete,
  Close,
  ColorLens,
} from '@mui/icons-material';

interface CategoryType {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  coursesCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const mockCategories: CategoryType[] = [
  {
    id: '1',
    name: 'Programming',
    description: 'Learn programming languages and software development',
    color: '#0ea5e9',
    icon: 'Code',
    coursesCount: 45,
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-02-20',
  },
  {
    id: '2',
    name: 'Data Science',
    description: 'Master data analysis, machine learning, and statistics',
    color: '#8b5cf6',
    icon: 'Analytics',
    coursesCount: 28,
    isActive: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-02-18',
  },
  {
    id: '3',
    name: 'Design',
    description: 'UI/UX design, graphic design, and creative skills',
    color: '#f59e0b',
    icon: 'Palette',
    coursesCount: 22,
    isActive: true,
    createdAt: '2024-01-20',
    updatedAt: '2024-02-15',
  },
  {
    id: '4',
    name: 'Business',
    description: 'Business strategy, management, and entrepreneurship',
    color: '#10b981',
    icon: 'Business',
    coursesCount: 31,
    isActive: true,
    createdAt: '2024-01-25',
    updatedAt: '2024-02-10',
  },
  {
    id: '5',
    name: 'Marketing',
    description: 'Digital marketing, social media, and advertising',
    color: '#ef4444',
    icon: 'Campaign',
    coursesCount: 18,
    isActive: false,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-05',
  },
  {
    id: '6',
    name: 'Photography',
    description: 'Professional photography and photo editing',
    color: '#06b6d4',
    icon: 'CameraAlt',
    coursesCount: 12,
    isActive: true,
    createdAt: '2024-02-05',
    updatedAt: '2024-02-08',
  },
];

const categoryColors = [
  '#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#84cc16', '#f97316'
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryType[]>(mockCategories);
  const [filteredCategories, setFilteredCategories] = useState<CategoryType[]>(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: categoryColors[0],
    isActive: true,
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(value.toLowerCase()) ||
      category.description.toLowerCase().includes(value.toLowerCase())
    );
    
    setFilteredCategories(filtered);
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, category: CategoryType) => {
    setMenuAnchor(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedCategory(null);
  };

  const handleEdit = () => {
    if (selectedCategory) {
      setFormData({
        name: selectedCategory.name,
        description: selectedCategory.description,
        color: selectedCategory.color,
        isActive: selectedCategory.isActive,
      });
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      const updatedCategories = categories.filter(c => c.id !== selectedCategory.id);
      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);
    }
    setDeleteDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleFormSubmit = () => {
    const newCategory: CategoryType = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      color: formData.color,
      icon: 'Category',
      coursesCount: 0,
      isActive: formData.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    setFilteredCategories(updatedCategories);
    setCreateDialogOpen(false);
    setFormData({ name: '', description: '', color: categoryColors[0], isActive: true });
  };

  const handleFormUpdate = () => {
    if (selectedCategory) {
      const updatedCategories = categories.map(c => 
        c.id === selectedCategory.id 
          ? { ...c, ...formData, updatedAt: new Date().toISOString() }
          : c
      );
      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);
    }
    setEditDialogOpen(false);
    setFormData({ name: '', description: '', color: categoryColors[0], isActive: true });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const CategoryFormDialog = ({ 
    open, 
    onClose, 
    title, 
    onSubmit 
  }: { 
    open: boolean; 
    onClose: () => void; 
    title: string; 
    onSubmit: () => void; 
  }) => (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          <TextField
            label="Category Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter category name"
          />
          
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe this category"
          />
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Category Color
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {categoryColors.map((color) => (
                <Box
                  key={color}
                  onClick={() => setFormData({ ...formData, color })}
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: color,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: formData.color === color ? '3px solid #334155' : '2px solid transparent',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
          
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
            }
            label="Active Category"
          />
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={onSubmit}
          disabled={!formData.name.trim()}
        >
          {title.includes('Create') ? 'Create Category' : 'Update Category'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const DeleteConfirmDialog = () => (
    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
      <DialogContent sx={{ p: 3, textAlign: 'center' }}>
        <Box sx={{ mb: 2 }}>
          <Delete sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Delete Category
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{selectedCategory?.name}"? This will affect {selectedCategory?.coursesCount} courses.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'center', gap: 1 }}>
        <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
          Cancel
        </Button>
        <Button onClick={confirmDelete} variant="contained" color="error">
          Delete Category
        </Button>
      </DialogActions>
    </Dialog>
  );

  const activeCategories = categories.filter(c => c.isActive).length;
  const totalCourses = categories.reduce((sum, cat) => sum + cat.coursesCount, 0);

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
            onClick={() => setCreateDialogOpen(true)}
            sx={{ height: 48 }}
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
                {categories.length}
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
                {activeCategories}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Categories
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
                {Math.round(totalCourses / Math.max(categories.length, 1))}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Courses/Category
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search categories..."
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
          </Grid>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Courses</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Created</TableCell>
                <TableCell align="center">Updated</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((category) => (
                <TableRow key={category.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: category.color,
                          color: 'white',
                        }}
                      >
                        <Category />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {category.name}
                        </Typography>
                        <Chip
                          size="small"
                          sx={{
                            backgroundColor: category.color,
                            color: 'white',
                            fontSize: '0.75rem',
                          }}
                          label={category.color}
                        />
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={600}>
                      {category.coursesCount}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Chip
                      label={category.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={category.isActive ? 'success' : 'default'}
                      variant="filled"
                    />
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {new Date(category.updatedAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Tooltip title="More actions">
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, category)}
                        size="small"
                      >
                        <MoreVert />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCategories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: '12px', minWidth: 160 },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Edit fontSize="small" />
            Edit Category
          </Box>
        </MenuItem>
        
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Delete fontSize="small" />
            Delete Category
          </Box>
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      <CategoryFormDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        title="Create New Category"
        onSubmit={handleFormSubmit}
      />
      
      <CategoryFormDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        title="Edit Category"
        onSubmit={handleFormUpdate}
      />
      
      <DeleteConfirmDialog />
    </Box>
  );
}