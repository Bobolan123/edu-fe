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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Security,
  AdminPanelSettings,
  Clear,
  Api,
  Assignment,
  Close,
} from '@mui/icons-material';
import { PermissionTable } from './PermissionTable';
import { PermissionForm } from './PermissionForm';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { IPermission } from '../../../../types/entities';
import { toastService } from '../../../services/toast';

interface AdminPermissionsPageProps {
  permissions: IModelPaginate<IPermission>;
  searchParams: {
    page?: string;
    search?: string;
    api?: string;
    description?: string;
    method?: string;
    module?: string;
    order?: 'ASC' | 'DESC';
    orderBy?: 'id' | 'api' | 'description' | 'method' | 'module' | 'created' | 'updated';
    take?: string;
  };
}

export default function AdminPermissionsPage({ 
  permissions, 
  searchParams 
}: AdminPermissionsPageProps) {
  const router = useRouter();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.search || '');
  const [apiFilter, setApiFilter] = useState(searchParams.api || '');
  const [descriptionFilter, setDescriptionFilter] = useState(searchParams.description || '');
  const [methodFilter, setMethodFilter] = useState(searchParams.method || 'all');
  const [moduleFilter, setModuleFilter] = useState(searchParams.module || 'all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(
    !!(searchParams.api || searchParams.description || searchParams.method || searchParams.module)
  );
  
  // Dialog states
  const [selectedPermission, setSelectedPermission] = useState<IPermission | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get available modules and methods from current data
  const availableModules = [...new Set(permissions?.data?.result?.map(p => p.module) || [])];
  const httpMethods = ['GET', 'POST', 'PUT', 'DELETE'];

  // Update search URL with all filters
  const updateSearchParams = (filters: {
    search?: string;
    api?: string;
    description?: string;
    method?: string;
    module?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams();
    
    if (filters.search?.trim()) params.set('search', filters.search.trim());
    if (filters.api?.trim()) params.set('api', filters.api.trim());
    if (filters.description?.trim()) params.set('description', filters.description.trim());
    if (filters.method && filters.method !== 'all') params.set('method', filters.method);
    if (filters.module && filters.module !== 'all') params.set('module', filters.module);
    if (filters.page && filters.page > 1) params.set('page', filters.page.toString());
    
    const newUrl = `/admin/permissions${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl);
  };

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== (searchParams.search || '')) {
        updateSearchParams({
          search: searchTerm,
          api: apiFilter,
          description: descriptionFilter,
          method: methodFilter,
          module: moduleFilter,
          page: 1
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle filter changes
  const handleFilterChange = () => {
    updateSearchParams({
      search: searchTerm,
      api: apiFilter,
      description: descriptionFilter,
      method: methodFilter,
      module: moduleFilter,
      page: 1
    });
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({
      search: searchTerm,
      api: apiFilter,
      description: descriptionFilter,
      method: methodFilter,
      module: moduleFilter,
      page
    });
  };

  const handleClearAllFilters = () => {
    setSearchTerm('');
    setApiFilter('');
    setDescriptionFilter('');
    setMethodFilter('all');
    setModuleFilter('all');
    updateSearchParams({});
  };

  const refreshData = () => {
    router.refresh();
  };

  // Dialog handlers
  const handleCreate = () => {
    setSelectedPermission(null);
    setCreateDialogOpen(true);
  };

  const handleEdit = (permission: IPermission) => {
    setSelectedPermission(permission);
    setEditDialogOpen(true);
  };

  const handleView = (permission: IPermission) => {
    setSelectedPermission(permission);
    setViewDialogOpen(true);
  };

  const handleDelete = (permission: IPermission) => {
    setSelectedPermission(permission);
    setDeleteDialogOpen(true);
  };

  const handleSuccess = (message: string) => {
    toastService.success(message);
    refreshData();
  };

  const handleError = (error: string) => {
    toastService.error(error);
  };

  const currentPage = parseInt(searchParams.page || '1');
  const totalCount = permissions?.data?.meta?.itemCount || 0;
  const permissionList = permissions?.data?.result || [];

  // Calculate stats
  const totalAssignments = permissionList.reduce((sum, perm) => sum + (perm.roles?.length || 0), 0);
  const unassignedCount = permissionList.filter(p => !p.roles || p.roles.length === 0).length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            Permissions Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage system permissions and access controls
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
          sx={{ borderRadius: 2 }}
        >
          Create Permission
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Security sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {totalCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Permissions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <AdminPanelSettings sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {totalAssignments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Assignments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Assignment sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {unassignedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unassigned
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Api sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {[...new Set(permissionList.map(p => p.module))].length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Modules
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search permissions by endpoint, method, module, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        onClick={() => setSearchTerm('')}
                        sx={{ minWidth: 'auto', p: 0.5 }}
                      >
                        <Clear fontSize="small" />
                      </Button>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  size="small"
                >
                  {showAdvancedFilters ? 'Hide' : 'Show'} Filters
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={handleClearAllFilters}
                  size="small"
                  disabled={!searchTerm && !apiFilter && !descriptionFilter && methodFilter === 'all' && moduleFilter === 'all'}
                >
                  Clear All
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Advanced Filters
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="API Endpoint"
                    value={apiFilter}
                    onChange={(e) => setApiFilter(e.target.value)}
                    onBlur={handleFilterChange}
                    placeholder="/api/users"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={descriptionFilter}
                    onChange={(e) => setDescriptionFilter(e.target.value)}
                    onBlur={handleFilterChange}
                    placeholder="Filter by description"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>HTTP Method</InputLabel>
                    <Select
                      value={methodFilter}
                      label="HTTP Method"
                      onChange={(e) => {
                        setMethodFilter(e.target.value);
                        setTimeout(handleFilterChange, 100);
                      }}
                    >
                      <MenuItem value="all">All Methods</MenuItem>
                      {httpMethods.map((method) => (
                        <MenuItem key={method} value={method}>
                          {method}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Module</InputLabel>
                    <Select
                      value={moduleFilter}
                      label="Module"
                      onChange={(e) => {
                        setModuleFilter(e.target.value);
                        setTimeout(handleFilterChange, 100);
                      }}
                    >
                      <MenuItem value="all">All Modules</MenuItem>
                      {availableModules.map((module) => (
                        <MenuItem key={module} value={module}>
                          {module}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Active Filters Display */}
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip 
              icon={<Search />} 
              label={`${totalCount} results`} 
              color="primary" 
              variant="outlined" 
              size="small"
            />
            {searchTerm && (
              <Chip 
                label={`Search: "${searchTerm}"`} 
                onDelete={() => setSearchTerm('')}
                color="secondary" 
                variant="filled" 
                size="small"
              />
            )}
            {apiFilter && (
              <Chip 
                label={`API: "${apiFilter}"`} 
                onDelete={() => setApiFilter('')}
                color="info" 
                variant="filled" 
                size="small"
              />
            )}
            {descriptionFilter && (
              <Chip 
                label={`Description: "${descriptionFilter}"`} 
                onDelete={() => setDescriptionFilter('')}
                color="info" 
                variant="filled" 
                size="small"
              />
            )}
            {methodFilter !== 'all' && (
              <Chip 
                label={`Method: ${methodFilter}`} 
                onDelete={() => setMethodFilter('all')}
                color="warning" 
                variant="filled" 
                size="small"
              />
            )}
            {moduleFilter !== 'all' && (
              <Chip 
                label={`Module: ${moduleFilter}`} 
                onDelete={() => setModuleFilter('all')}
                color="success" 
                variant="filled" 
                size="small"
              />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Permissions Table */}
      <PermissionTable
        permissions={permissionList}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        totalCount={totalCount}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* Create Permission Dialog */}
      <PermissionForm
        open={createDialogOpen}
        mode="create"
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={() => {
          setCreateDialogOpen(false);
          handleSuccess('Permission created successfully');
        }}
        onError={handleError}
      />

      {/* Edit Permission Dialog */}
      <PermissionForm
        open={editDialogOpen}
        mode="edit"
        permission={selectedPermission}
        onClose={() => setEditDialogOpen(false)}
        onSuccess={() => {
          setEditDialogOpen(false);
          handleSuccess('Permission updated successfully');
        }}
        onError={handleError}
      />

      {/* View Permission Dialog */}
      {selectedPermission && (
        <ViewPermissionDialog
          open={viewDialogOpen}
          permission={selectedPermission}
          onClose={() => setViewDialogOpen(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        permission={selectedPermission}
        onClose={() => setDeleteDialogOpen(false)}
        onSuccess={() => {
          setDeleteDialogOpen(false);
          handleSuccess('Permission deleted successfully');
        }}
        onError={handleError}
      />
    </Box>
  );
}

// View Permission Dialog Component
function ViewPermissionDialog({ 
  open, 
  permission, 
  onClose 
}: { 
  open: boolean; 
  permission: IPermission; 
  onClose: () => void; 
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Permission Details
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              API Endpoint & Method
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={permission.method}
                color="primary"
                variant="filled"
                size="small"
                sx={{ fontFamily: 'monospace', fontWeight: 600 }}
              />
              <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                {permission.api}
              </Typography>
            </Box>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Module
            </Typography>
            <Chip
              label={permission.module}
              color="info"
              variant="outlined"
            />
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1">
              {permission.description}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Used in Roles ({permission.roles?.length || 0})
            </Typography>
            {permission.roles && permission.roles.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {permission.roles.map((role) => (
                  <Chip
                    key={role.id}
                    label={role.name}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Not assigned to any roles
              </Typography>
            )}
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Timestamps
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                Created: {new Date(permission.created).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                Updated: {new Date(permission.updated).toLocaleString()}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}