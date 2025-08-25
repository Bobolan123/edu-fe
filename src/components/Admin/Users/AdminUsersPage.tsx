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
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  People,
  PersonAdd,
  School,
  AttachMoney,
  Clear,
} from '@mui/icons-material';
import { UserTable } from './UserTable';
import { UserForm } from './UserForm';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { IUser, IRole } from '../../../../types/entities';
import toastService from '../../../services/toast';
import { useCurrency } from '@/context/CurrencyContext';
import { currencyService } from '@/service/currency';

interface AdminUsersPageProps {
  users: IModelPaginate<IUser>;
  roles: IBackendRes<IRole>;
  searchParams: {
    page?: string;
    search?: string;
    role?: string;
    status?: string;
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

export default function AdminUsersPage({ 
  users, 
  roles,
  searchParams 
}: AdminUsersPageProps) {
  const router = useRouter();
  const { currency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState(searchParams.search || '');
  const [selectedRole, setSelectedRole] = useState(searchParams.role || 'all');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.status || 'all');
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateURL = (params: Record<string, string | undefined>) => {
    const searchParams = new URLSearchParams();
    
    if (params.search && params.search !== '') {
      searchParams.set('search', params.search);
    }
    
    if (params.role && params.role !== 'all') {
      searchParams.set('role', params.role);
    }
    
    if (params.status && params.status !== 'all') {
      searchParams.set('status', params.status);
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

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handlePageChange = (newPage: number) => {
    updateURL({ 
      search: searchTerm, 
      role: selectedRole, 
      status: selectedStatus,
      page: (newPage + 1).toString() 
    });
  };

  const handleApplyFilters = () => {
    updateURL({ 
      search: searchTerm, 
      role: selectedRole !== 'all' ? selectedRole : undefined,
      status: selectedStatus !== 'all' ? selectedStatus : undefined,
      page: '1'
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedRole('all');
    setSelectedStatus('all');
    updateURL({
      search: undefined,
      role: undefined,
      status: undefined,
      page: '1'
    });
  };

  const handleEdit = (user: IUser) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDelete = (user: IUser) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleView = (user: IUser) => {
    router.push(`/admin/users/${user.id}`);
  };

  const handleCreateSuccess = (response?: any) => {
    setCreateDialogOpen(false);
    setError(null);
    const message = response?.message || 'User created successfully!';
    toastService.success(message);
    router.refresh(); 
  };

  const handleEditSuccess = (response?: any) => {
    setEditDialogOpen(false);
    setSelectedUser(null);
    setError(null);
    const message = response?.message || 'User updated successfully!';
    toastService.success(message);
    router.refresh();
  };

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
    setError(null);
    toastService.success('User deleted successfully!');
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

  const activeUsers = users.data?.result?.filter(u => u.isActive).length || 0;
  const totalRevenue = users.data?.result?.reduce((sum, user) => {
    return sum + (user.courses?.reduce((courseSum, course) => courseSum + (course.price * course.total_students), 0) || 0);
  }, 0) || 0;
  const instructors = users.data?.result?.filter(u => u.role?.name === 'instructor').length || 0;

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
              User Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and monitor all users on the platform
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            size="large"
            onClick={() => setCreateDialogOpen(true)}
            sx={{ height: 48 }}
          >
            Create User
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <People sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {users.data?.meta?.itemCount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <PersonAdd sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {activeUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <School sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {instructors}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Instructors
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <AttachMoney sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                <RevenueDisplay revenue={totalRevenue} />
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
                placeholder="Search users..."
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
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedRole}
                  label="Role"
                  onChange={(e) => handleRoleChange(e.target.value as string)}
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="instructor">Instructor</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
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

      {/* Users Table */}
      <UserTable
        users={users.data?.result || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        totalCount={users.data?.meta?.itemCount || 0}
        currentPage={parseInt(searchParams.page || '1') - 1}
        onPageChange={handlePageChange}
      />

      {/* Dialogs */}
      <UserForm
        open={createDialogOpen}
        mode="create"
        roles={Array.isArray(roles.data) ? roles.data : roles.data ? [roles.data] : []}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
        onError={handleError}
      />
      
      <UserForm
        open={editDialogOpen}
        mode="edit"
        user={selectedUser}
        roles={Array.isArray(roles.data) ? roles.data : roles.data ? [roles.data] : []}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedUser(null);
        }}
        onSuccess={handleEditSuccess}
        onError={handleError}
      />
      
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        user={selectedUser}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedUser(null);
        }}
        onSuccess={handleDeleteSuccess}
        onError={handleError}
      />
    </Box>
  );
}