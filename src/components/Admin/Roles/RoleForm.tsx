"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Chip,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { IRole, IPermission } from '../../../../types/entities';

interface RoleFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string; isActive?: boolean; permissions?: number[] }) => void;
  permissions: IPermission[];
  role?: IRole | null;
  mode: 'create' | 'edit' | 'editPermissions' | 'view';
  loading?: boolean;
}

export default function RoleForm({
  open,
  onClose,
  onSubmit,
  permissions,
  role,
  mode,
  loading = false,
}: RoleFormProps) {
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [roleIsActive, setRoleIsActive] = useState(true);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  useEffect(() => {
    if (role && (mode === 'edit' || mode === 'view')) {
      setRoleName(role.name);
      setRoleDescription(role.description || '');
      setRoleIsActive(role.isActive ?? true);
    }
    if (role && (mode === 'editPermissions' || mode === 'view')) {
      setSelectedPermissions(role.permissions?.map(p => p.id) || []);
    }
    if (mode === 'create') {
      setRoleName('');
      setRoleDescription('');
      setRoleIsActive(true);
      setSelectedPermissions([]);
    }
  }, [role, mode, open]);

  const handleSubmit = () => {
    if (mode === 'create') {
      onSubmit({ name: roleName, description: roleDescription, isActive: roleIsActive, permissions: selectedPermissions });
    } else if (mode === 'edit') {
      onSubmit({ name: roleName, description: roleDescription, isActive: roleIsActive });
    } else if (mode === 'editPermissions') {
      onSubmit({ name: roleName, permissions: selectedPermissions });
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Create New Role';
      case 'edit': return 'Edit Role';
      case 'editPermissions': return 'Edit Role Permissions';
      case 'view': return 'Role Details';
      default: return '';
    }
  };

  const isReadOnly = mode === 'view';
  const showPermissions = mode === 'create' || mode === 'editPermissions' || mode === 'view';
  const showNameField = mode === 'create' || mode === 'edit' || mode === 'view';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            {getTitle()}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3} pt={1}>
          {showNameField && (
            <TextField
              fullWidth
              label="Role Name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required={!isReadOnly}
              disabled={isReadOnly}
            />
          )}

          {(mode === 'create' || mode === 'edit' || mode === 'view') && (
            <TextField
              fullWidth
              label="Description"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              multiline
              rows={2}
              disabled={isReadOnly}
            />
          )}

          {(mode === 'create' || mode === 'edit' || mode === 'view') && (
            <FormControlLabel
              control={
                <Switch
                  checked={roleIsActive}
                  onChange={(e) => setRoleIsActive(e.target.checked)}
                  disabled={isReadOnly}
                />
              }
              label="Active Status"
            />
          )}

          {mode === 'editPermissions' && role && (
            <Typography variant="subtitle1" gutterBottom>
              Role: {role.name}
            </Typography>
          )}
          
          {showPermissions && (
            <>
              {mode === 'view' ? (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Users Count
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {role?.users?.length || 0} users
                  </Typography>
                </Box>
              ) : null}

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Permissions ({mode === 'view' ? role?.permissions?.length || 0 : selectedPermissions.length})
                </Typography>
                
                {mode === 'view' ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {role?.permissions?.map((permission) => (
                      <Chip
                        key={permission.id}
                        label={`${permission.method} ${permission.api}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontFamily: 'monospace' }}
                      />
                    )) || <Typography variant="body2" color="text.secondary">No permissions assigned</Typography>}
                  </Box>
                ) : (
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
                            const permission = permissions.find((p: IPermission) => p.id === value);
                            return (
                              <Chip 
                                key={value} 
                                label={permission ? `${permission.method} ${permission.api}` : 'Unknown'} 
                                size="small" 
                                sx={{ fontFamily: 'monospace' }}
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {permissions.map((permission: IPermission) => (
                        <MenuItem key={permission.id} value={permission.id}>
                          <Checkbox checked={selectedPermissions.indexOf(permission.id) > -1} />
                          <ListItemText 
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip label={permission.method} size="small" color="secondary" variant="outlined" sx={{ fontFamily: 'monospace' }} />
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{permission.api}</Typography>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 0.5 }}>
                                <Chip label={permission.module} size="small" color="info" variant="outlined" sx={{ mr: 1 }} />
                                <Typography variant="caption" color="text.secondary">{permission.description}</Typography>
                              </Box>
                            }
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
            </>
          )}
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={onClose}>
          {mode === 'view' ? 'Close' : 'Cancel'}
        </Button>
        
        {mode === 'view' ? (
          <Button variant="contained" onClick={() => onSubmit({ name: roleName, permissions: selectedPermissions })}>
            Edit Permissions
          </Button>
        ) : (
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={loading || (!roleName.trim() && (mode === 'create' || mode === 'edit'))}
          >
            {loading ? 'Saving...' : mode === 'create' ? 'Create Role' : mode === 'edit' ? 'Update Role' : 'Update Permissions'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}