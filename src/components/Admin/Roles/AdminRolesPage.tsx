"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  Add,
  Security,
  People,
  AdminPanelSettings,
} from '@mui/icons-material';
import { IRole, IPermission } from '../../../../types/entities';
import { 
  createRole, 
  deleteRole, 
  updateRole,
  updateRolePermissions,
  IRoleCreateRequest,
  IRoleUpdateRequest,
  IRoleUpdatePermissionsRequest
} from '../../../actions/rolesAction';
import { toastService } from '../../../services/toast';
import RoleTable from './RoleTable';
import RoleForm from './RoleForm';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface AdminRolesPageProps {
  roles: IBackendRes<IRole[]>;
  permissions: IModelPaginate<IPermission>;
  searchParams: {
    search?: string;
  };
}

type DialogMode = 'create' | 'edit' | 'editPermissions' | 'view' | 'delete' | null;

export default function AdminRolesPage({ roles, permissions, searchParams }: AdminRolesPageProps) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  
  const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [loading, setLoading] = useState(false);

  const searchTerm = searchParams.search || '';
  const rolesData = roles.data || [];
  const permissionsData = permissions.data?.result || [];

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(currentSearchParams.toString());
    if (event.target.value) {
      params.set('search', event.target.value);
    } else {
      params.delete('search');
    }
    router.replace(`?${params.toString()}`);
  };

  const handleCloseDialog = () => {
    setDialogMode(null);
    setSelectedRole(null);
    setLoading(false);
  };

  const handleView = (role: IRole) => {
    setSelectedRole(role);
    setDialogMode('view');
  };

  const handleEdit = (role: IRole) => {
    setSelectedRole(role);
    setDialogMode('edit');
  };

  const handleEditPermissions = (role: IRole) => {
    setSelectedRole(role);
    setDialogMode('editPermissions');
  };

  const handleDelete = (role: IRole) => {
    setSelectedRole(role);
    setDialogMode('delete');
  };

  const handleToggleStatus = async (role: IRole) => {
    setLoading(true);
    try {
      await updateRole(role.id, { isActive: !role.isActive });
      toastService.success(`Role ${!role.isActive ? 'activated' : 'deactivated'} successfully!`);
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update role status';
      toastService.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (data: { name: string; description?: string; isActive?: boolean; permissions?: number[] }) => {
    setLoading(true);
    try {
      const roleData: IRoleCreateRequest = {
        name: data.name,
        description: data.description,
        isActive: data.isActive ?? true
      };
      const newRole = await createRole(roleData);
      
      // If permissions are selected, update role permissions after creation
      if (data.permissions && data.permissions.length > 0) {
        await updateRolePermissions({
          roleId: newRole.id,
          permissionIds: data.permissions
        });
      }
      
      toastService.success('Role created successfully!');
      handleCloseDialog();
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create role';
      toastService.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (data: { name: string; description?: string; isActive?: boolean }) => {
    if (!selectedRole) return;
    
    setLoading(true);
    try {
      const roleData: IRoleUpdateRequest = {
        name: data.name,
        description: data.description,
        isActive: data.isActive
      };
      await updateRole(selectedRole.id, roleData);
      toastService.success('Role updated successfully!');
      handleCloseDialog();
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update role';
      toastService.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePermissions = async (data: { permissions?: number[] }) => {
    if (!selectedRole || !data.permissions) return;
    
    setLoading(true);
    try {
      const updateData: IRoleUpdatePermissionsRequest = {
        roleId: selectedRole.id,
        permissionIds: data.permissions
      };
      await updateRolePermissions(updateData);
      toastService.success('Role permissions updated successfully!');
      handleCloseDialog();
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update role permissions';
      toastService.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    
    setLoading(true);
    try {
      await deleteRole(selectedRole.id);
      toastService.success('Role deleted successfully!');
      handleCloseDialog();
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete role';
      toastService.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (data: { name: string; description?: string; isActive?: boolean; permissions?: number[] }) => {
    switch (dialogMode) {
      case 'create':
        return handleCreateRole(data);
      case 'edit':
        return handleUpdateRole(data);
      case 'editPermissions':
        return handleUpdatePermissions(data);
      case 'view':
        // Switch to edit permissions mode
        setDialogMode('editPermissions');
        break;
      default:
        break;
    }
  };

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
          onClick={() => setDialogMode('create')}
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
                {rolesData.length}
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
                {rolesData.reduce((sum: number, role: IRole) => sum + (role.users?.length || 0), 0)}
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
                {permissionsData.length}
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
        <RoleTable
          roles={rolesData}
          onView={handleView}
          onEdit={handleEdit}
          onEditPermissions={handleEditPermissions}
          onDelete={handleDelete}
        />
      </Card>

      {/* Role Form Dialog */}
      {dialogMode && dialogMode !== 'delete' && (
        <RoleForm
          open={true}
          onClose={handleCloseDialog}
          onSubmit={handleFormSubmit}
          permissions={permissionsData}
          role={selectedRole}
          mode={dialogMode}
          loading={loading}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={dialogMode === 'delete'}
        onClose={handleCloseDialog}
        onConfirm={handleDeleteRole}
        role={selectedRole}
        loading={loading}
      />
    </Box>
  );
}