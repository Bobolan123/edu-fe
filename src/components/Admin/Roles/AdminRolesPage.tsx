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
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Alert,
} from '@mui/material';
import {
  Search,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Add,
  Security,
  People,
  AdminPanelSettings,
  Close,
} from '@mui/icons-material';
import { IRole, IPermission } from '../../../../types/entities';
import { 
  getRoles, 
  getRoleById, 
  createRole, 
  deleteRole, 
  updateRolePermissions,
  IRoleCreateRequest,
  IRoleUpdatePermissionsRequest
} from '../../../actions/rolesAction';
import { getPermissions } from '../../../actions/permissionsAction';
import { toastService } from '../../../services/toast';

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editPermissionsDialogOpen, setEditPermissionsDialogOpen] = useState(false);
  
  // Form states
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rolesRes, permissionsRes] = await Promise.all([
        getRoles(1, 100),
        getPermissions(1, 100)
      ]);
      setRoles(rolesRes.data || []);
      setPermissions(permissionsRes.data || []);
    } catch (error) {
      toastService.error('Failed to load data');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredRoles = roles.filter(role =>
    (role.name && role.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, role: IRole) => {
    setMenuAnchor(event.currentTarget);
    setSelectedRole(role);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRole(null);
  };

  const handleView = () => {
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handleEditPermissions = () => {
    if (selectedRole) {
      setSelectedPermissions(selectedRole.permissions?.map(p => p.id) || []);
      setEditPermissionsDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedRole) {
      try {
        await deleteRole(selectedRole.id);
        toastService.success('Role deleted successfully!');
        loadData();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete role';
        toastService.error(errorMessage);
      }
    }
    handleMenuClose();
  };

  const handleCreateRole = async () => {
    try {
      const roleData: IRoleCreateRequest = {
        name: newRoleName,
        description: newRoleDescription || undefined,
        permissions: selectedPermissions
      };
      await createRole(roleData);
      toastService.success('Role created successfully!');
      setCreateDialogOpen(false);
      setNewRoleName('');
      setNewRoleDescription('');
      setSelectedPermissions([]);
      loadData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create role';
      toastService.error(errorMessage);
    }
  };

  const handleUpdatePermissions = async () => {
    if (selectedRole) {
      try {
        const updateData: IRoleUpdatePermissionsRequest = {
          roleId: selectedRole.id,
          permissions: selectedPermissions
        };
        await updateRolePermissions(updateData);
        toastService.success('Role permissions updated successfully!');
        setEditPermissionsDialogOpen(false);
        loadData();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update role permissions';
        toastService.error(errorMessage);
      }
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const CreateRoleDialog = () => (
    <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            Create New Role
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
            label="Role Name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            required
          />
          
          <TextField
            fullWidth
            label="Description"
            value={newRoleDescription}
            onChange={(e) => setNewRoleDescription(e.target.value)}
            multiline
            rows={2}
          />
          
          <FormControl fullWidth>
            <InputLabel>Permissions</InputLabel>
            <Select
              multiple
              value={selectedPermissions}
              onChange={(e) => setSelectedPermissions(e.target.value as number[])}
              input={<OutlinedInput label="Permissions" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as number[]).map((value) => {
                    const permission = permissions.find(p => p.id === value);
                    return (
                      <Chip key={value} label={permission?.name} size="small" />
                    );
                  })}
                </Box>
              )}
            >
              {permissions.map((permission) => (
                <MenuItem key={permission.id} value={permission.id}>
                  <Checkbox checked={selectedPermissions.indexOf(permission.id) > -1} />
                  <ListItemText primary={permission.name} secondary={permission.description} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={() => setCreateDialogOpen(false)}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleCreateRole}
          disabled={!newRoleName.trim()}
        >
          Create Role
        </Button>
      </DialogActions>
    </Dialog>
  );

  const EditPermissionsDialog = () => (
    <Dialog 
      open={editPermissionsDialogOpen} 
      onClose={() => setEditPermissionsDialogOpen(false)} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            Edit Role Permissions
          </Typography>
          <IconButton onClick={() => setEditPermissionsDialogOpen(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Role: {selectedRole?.name}
        </Typography>
        
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Permissions</InputLabel>
          <Select
            multiple
            value={selectedPermissions}
            onChange={(e) => setSelectedPermissions(e.target.value as number[])}
            input={<OutlinedInput label="Permissions" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as number[]).map((value) => {
                  const permission = permissions.find(p => p.id === value);
                  return (
                    <Chip key={value} label={permission?.name} size="small" />
                  );
                })}
              </Box>
            )}
          >
            {permissions.map((permission) => (
              <MenuItem key={permission.id} value={permission.id}>
                <Checkbox checked={selectedPermissions.indexOf(permission.id) > -1} />
                <ListItemText primary={permission.name} secondary={permission.description} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={() => setEditPermissionsDialogOpen(false)}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleUpdatePermissions}>
          Update Permissions
        </Button>
      </DialogActions>
    </Dialog>
  );

  const ViewRoleDialog = () => (
    <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            Role Details
          </Typography>
          <IconButton onClick={() => setViewDialogOpen(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      {selectedRole && (
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Role Name
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {selectedRole.name}
              </Typography>
            </Box>
            
            {selectedRole.description && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1">
                  {selectedRole.description}
                </Typography>
              </Box>
            )}
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Users Count
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {selectedRole.users?.length || 0} users
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Permissions ({selectedRole.permissions?.length || 0})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {selectedRole.permissions?.map((permission) => (
                  <Chip
                    key={permission.id}
                    label={permission.name}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )) || <Typography variant="body2" color="text.secondary">No permissions assigned</Typography>}
              </Box>
            </Box>
          </Stack>
        </DialogContent>
      )}
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={() => setViewDialogOpen(false)}>
          Close
        </Button>
        <Button variant="contained" onClick={handleEditPermissions}>
          Edit Permissions
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography>Loading roles...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            Roles Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage user roles and their permissions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Role
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <Security sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {roles.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Roles
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <People sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {roles.reduce((sum, role) => sum + (role.users?.length || 0), 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Users with Roles
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <AdminPanelSettings sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {permissions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available Permissions
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
            placeholder="Search roles..."
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

      {/* Roles Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Users Count</TableCell>
                <TableCell align="center">Permissions</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRoles
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((role) => (
                <TableRow key={role.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {role.name}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {role.description || 'No description'}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Chip
                      label={role.users?.length || 0}
                      size="small"
                      color="primary"
                      variant="filled"
                    />
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography variant="body2">
                      {role.permissions?.length || 0} permissions
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Tooltip title="More actions">
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, role)}
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
          count={filteredRoles.length}
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
        
        <MenuItem onClick={handleEditPermissions}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Edit fontSize="small" />
            Edit Permissions
          </Box>
        </MenuItem>
        
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Delete fontSize="small" />
            Delete Role
          </Box>
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      <CreateRoleDialog />
      <EditPermissionsDialog />
      <ViewRoleDialog />

    </Box>
  );
}