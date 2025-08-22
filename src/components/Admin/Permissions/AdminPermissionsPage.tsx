"use client";

import { useState, useEffect } from 'react';
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
  Menu,
  MenuItem,
  InputAdornment,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Search,
  MoreVert,
  Delete,
  Visibility,
  Add,
  Security,
  AdminPanelSettings,
  Close,
} from '@mui/icons-material';
import { IPermission } from '../../../../types/entities';
import { 
  getPermissions, 
  getPermissionById, 
  createPermission, 
  deletePermission,
  IPermissionCreateRequest
} from '../../../actions/permissionsAction';

export default function AdminPermissionsPage() {
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedPermission, setSelectedPermission] = useState<IPermission | null>(null);
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Form states
  const [newPermissionName, setNewPermissionName] = useState('');
  const [newPermissionDescription, setNewPermissionDescription] = useState('');
  
  // Feedback states
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      const response = await getPermissions(1, 100);
      setPermissions(response.data || []);
    } catch (error) {
      showSnackbar('Failed to load permissions', 'error');
      console.error('Error loading permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredPermissions = permissions.filter(permission =>
    (permission.name && permission.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (permission.description && permission.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, permission: IPermission) => {
    setMenuAnchor(event.currentTarget);
    setSelectedPermission(permission);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedPermission(null);
  };

  const handleView = () => {
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedPermission) {
      try {
        await deletePermission(selectedPermission.id);
        showSnackbar('Permission deleted successfully', 'success');
        loadPermissions();
      } catch (error) {
        showSnackbar('Failed to delete permission', 'error');
      }
    }
    handleMenuClose();
  };

  const handleCreatePermission = async () => {
    try {
      const permissionData: IPermissionCreateRequest = {
        name: newPermissionName,
        description: newPermissionDescription || undefined
      };
      await createPermission(permissionData);
      showSnackbar('Permission created successfully', 'success');
      setCreateDialogOpen(false);
      setNewPermissionName('');
      setNewPermissionDescription('');
      loadPermissions();
    } catch (error) {
      showSnackbar('Failed to create permission', 'error');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const CreatePermissionDialog = () => (
    <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            Create New Permission
          </Typography>
          <IconButton onClick={() => setCreateDialogOpen(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Permission Name"
            value={newPermissionName}
            onChange={(e) => setNewPermissionName(e.target.value)}
            required
            placeholder="e.g., manage_users, create_courses"
          />
          
          <TextField
            fullWidth
            label="Description"
            value={newPermissionDescription}
            onChange={(e) => setNewPermissionDescription(e.target.value)}
            multiline
            rows={3}
            placeholder="Describe what this permission allows users to do"
          />
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={() => setCreateDialogOpen(false)}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleCreatePermission}
          disabled={!newPermissionName.trim()}
        >
          Create Permission
        </Button>
      </DialogActions>
    </Dialog>
  );

  const ViewPermissionDialog = () => (
    <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            Permission Details
          </Typography>
          <IconButton onClick={() => setViewDialogOpen(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      {selectedPermission && (
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Permission Name
              </Typography>
              <Chip
                label={selectedPermission.name}
                color="primary"
                variant="filled"
                sx={{ fontFamily: 'monospace' }}
              />
            </Box>
            
            {selectedPermission.description && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1">
                  {selectedPermission.description}
                </Typography>
              </Box>
            )}
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Used in Roles
              </Typography>
              {selectedPermission.roles && selectedPermission.roles.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {selectedPermission.roles.map((role) => (
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
                Permission ID
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                {selectedPermission.id}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
      )}
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={() => setViewDialogOpen(false)}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography>Loading permissions...</Typography>
      </Box>
    );
  }

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
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Permission
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Security sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {permissions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Permissions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <AdminPanelSettings sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {permissions.reduce((sum, perm) => sum + (perm.roles?.length || 0), 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Assignments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Security sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {permissions.filter(p => !p.roles || p.roles.length === 0).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unassigned
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search permissions..."
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
        </CardContent>
      </Card>

      {/* Permissions Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Permission Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Used in Roles</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPermissions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((permission) => (
                <TableRow key={permission.id} hover>
                  <TableCell>
                    <Chip
                      label={permission.name}
                      color="primary"
                      variant="filled"
                      sx={{ fontFamily: 'monospace' }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {permission.description || 'No description provided'}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                      {permission.roles && permission.roles.length > 0 ? (
                        permission.roles.slice(0, 3).map((role) => (
                          <Chip
                            key={role.id}
                            label={role.name}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        ))
                      ) : (
                        <Chip
                          label="Unassigned"
                          size="small"
                          color="default"
                          variant="outlined"
                        />
                      )}
                      {permission.roles && permission.roles.length > 3 && (
                        <Chip
                          label={`+${permission.roles.length - 3} more`}
                          size="small"
                          color="default"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Tooltip title="More actions">
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, permission)}
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
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredPermissions.length}
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
          sx: {
            borderRadius: '12px',
            minWidth: 160,
          },
        }}
      >
        <MenuItem onClick={handleView}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Visibility fontSize="small" />
            View Details
          </Box>
        </MenuItem>
        
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Delete fontSize="small" />
            Delete Permission
          </Box>
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      <CreatePermissionDialog />
      <ViewPermissionDialog />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}