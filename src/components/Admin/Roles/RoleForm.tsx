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
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Paper,
} from '@mui/material';
import { Close, ExpandMore, Security, AdminPanelSettings } from '@mui/icons-material';
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
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [permissionsFilter, setPermissionsFilter] = useState({
    search: '',
    module: '',
    method: ''
  });

  // Filter permissions based on search criteria
  const filteredPermissions = permissions.filter(permission => {
    const searchMatch = !permissionsFilter.search || 
      permission.api.toLowerCase().includes(permissionsFilter.search.toLowerCase()) ||
      permission.description?.toLowerCase().includes(permissionsFilter.search.toLowerCase()) ||
      permission.method.toLowerCase().includes(permissionsFilter.search.toLowerCase());
    
    const moduleMatch = !permissionsFilter.module || 
      (permission.module || 'Other') === permissionsFilter.module;
    
    const methodMatch = !permissionsFilter.method || 
      permission.method === permissionsFilter.method;
    
    return searchMatch && moduleMatch && methodMatch;
  });

  // Group filtered permissions by module
  const groupedPermissions = filteredPermissions.reduce((groups, permission) => {
    const module = permission.module || 'Other';
    if (!groups[module]) {
      groups[module] = [];
    }
    groups[module].push(permission);
    return groups;
  }, {} as Record<string, IPermission[]>);

  // Get unique modules and methods for filters
  const availableModules = [...new Set(permissions.map(p => p.module || 'Other'))].sort();
  const availableMethods = [...new Set(permissions.map(p => p.method))].sort();

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

  // Initialize all modules as expanded by default
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    Object.keys(groupedPermissions).forEach(module => {
      initialExpanded[module] = true;
    });
    setExpandedModules(initialExpanded);
  }, [permissions]);

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

  // HTTP method colors for visual distinction
  const getMethodColor = (method: string): { color: string; backgroundColor: string } => {
    switch (method.toUpperCase()) {
      case 'GET':
        return { color: '#2e7d32', backgroundColor: '#e8f5e9' };
      case 'POST':
        return { color: '#1976d2', backgroundColor: '#e3f2fd' };
      case 'PUT':
        return { color: '#f57c00', backgroundColor: '#fff3e0' };
      case 'PATCH':
        return { color: '#7b1fa2', backgroundColor: '#f3e5f5' };
      case 'DELETE':
        return { color: '#d32f2f', backgroundColor: '#ffebee' };
      default:
        return { color: '#616161', backgroundColor: '#f5f5f5' };
    }
  };

  // Generate human-readable title from API path and method
  const generateTitle = (permission: IPermission): string => {
    const { method, api } = permission;
    
    // Extract meaningful parts from API path
    const pathParts = api.split('/').filter(part => part && !part.startsWith(':'));
    const resource = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2] || 'resource';
    
    // Generate action based on method and path
    switch (method.toUpperCase()) {
      case 'GET':
        return api.includes('/') && !api.endsWith('/') ? `View ${resource}` : `List ${resource}`;
      case 'POST':
        return `Create ${resource}`;
      case 'PUT':
        return `Update ${resource}`;
      case 'PATCH':
        return `Modify ${resource}`;
      case 'DELETE':
        return `Delete ${resource}`;
      default:
        return `${method} ${resource}`;
    }
  };

  // Handle individual permission toggle
  const handlePermissionToggle = (permissionId: number) => {
    if (isReadOnly) return;
    
    const newSelection = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter(id => id !== permissionId)
      : [...selectedPermissions, permissionId];
    
    setSelectedPermissions(newSelection);
  };

  // Handle master toggle for a module
  const handleMasterToggle = (module: string) => {
    if (isReadOnly) return;
    
    const modulePermissionIds = groupedPermissions[module].map(p => p.id);
    const allSelected = modulePermissionIds.every(id => selectedPermissions.includes(id));
    
    let newSelection: number[];
    if (allSelected) {
      // Remove all permissions from this module
      newSelection = selectedPermissions.filter(id => !modulePermissionIds.includes(id));
    } else {
      // Add all permissions from this module
      const newIds = modulePermissionIds.filter(id => !selectedPermissions.includes(id));
      newSelection = [...selectedPermissions, ...newIds];
    }
    
    setSelectedPermissions(newSelection);
  };

  // Check if all permissions in a module are selected
  const isModuleFullySelected = (module: string): boolean => {
    const modulePermissionIds = groupedPermissions[module].map(p => p.id);
    return modulePermissionIds.length > 0 && modulePermissionIds.every(id => selectedPermissions.includes(id));
  };

  // Check if some (but not all) permissions in a module are selected
  const isModulePartiallySelected = (module: string): boolean => {
    const modulePermissionIds = groupedPermissions[module].map(p => p.id);
    const selectedCount = modulePermissionIds.filter(id => selectedPermissions.includes(id)).length;
    return selectedCount > 0 && selectedCount < modulePermissionIds.length;
  };

  // Handle module accordion expansion
  const handleModuleExpansion = (module: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [module]: !prev[module]
    }));
  };

  const isReadOnly = mode === 'view';
  const showPermissions = mode === 'create' || mode === 'editPermissions' || mode === 'view';
  const showNameField = mode === 'create' || mode === 'edit' || mode === 'view';

  return (
    <Dialog open={open} onClose={onClose} maxWidth={showPermissions ? "lg" : "sm"} fullWidth>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Security sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    Permission Settings
                  </Typography>
                  <Chip 
                    label={`${selectedPermissions.length} selected`} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                  />
                  <Chip 
                    label={`${filteredPermissions.length} of ${permissions.length} shown`} 
                    size="small" 
                    color="info" 
                    variant="outlined" 
                  />
                </Box>

                {!isReadOnly && (
                  <Box sx={{ mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                      Filter Permissions
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Search permissions..."
                          value={permissionsFilter.search}
                          onChange={(e) => setPermissionsFilter(prev => ({
                            ...prev,
                            search: e.target.value
                          }))}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Module</InputLabel>
                          <Select
                            value={permissionsFilter.module}
                            label="Module"
                            onChange={(e) => setPermissionsFilter(prev => ({
                              ...prev,
                              module: e.target.value
                            }))}
                          >
                            <MenuItem value="">All Modules</MenuItem>
                            {availableModules.map(module => (
                              <MenuItem key={module} value={module}>{module}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Method</InputLabel>
                          <Select
                            value={permissionsFilter.method}
                            label="Method"
                            onChange={(e) => setPermissionsFilter(prev => ({
                              ...prev,
                              method: e.target.value
                            }))}
                          >
                            <MenuItem value="">All Methods</MenuItem>
                            {availableMethods.map(method => (
                              <MenuItem key={method} value={method}>
                                <Chip 
                                  label={method} 
                                  size="small" 
                                  sx={{
                                    ...getMethodColor(method),
                                    fontFamily: 'monospace',
                                    fontWeight: 600
                                  }} 
                                />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    {(permissionsFilter.search || permissionsFilter.module || permissionsFilter.method) && (
                      <Box sx={{ mt: 2 }}>
                        <Button
                          size="small"
                          onClick={() => setPermissionsFilter({ search: '', module: '', method: '' })}
                          sx={{ color: 'text.secondary' }}
                        >
                          Clear Filters
                        </Button>
                      </Box>
                    )}
                  </Box>
                )}

                {mode === 'view' ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {role?.permissions?.map((permission) => {
                      const methodColors = getMethodColor(permission.method);
                      const title = generateTitle(permission);
                      
                      return (
                        <Card
                          key={permission.id}
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            minWidth: 200,
                            borderColor: 'primary.main',
                            backgroundColor: 'primary.50',
                          }}
                        >
                          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            {title}
                          </Typography>
                          <Chip
                            label={permission.method}
                            size="small"
                            sx={{
                              ...methodColors,
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              fontFamily: 'monospace',
                              mb: 1,
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontFamily: 'monospace',
                              backgroundColor: 'grey.50',
                              p: 0.5,
                              borderRadius: 1,
                              display: 'block',
                              wordBreak: 'break-all',
                            }}
                          >
                            {permission.api}
                          </Typography>
                        </Card>
                      );
                    }) || <Typography variant="body2" color="text.secondary">No permissions assigned</Typography>}
                  </Box>
                ) : (
                  <Box>
                    {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                      <Paper
                        key={module}
                        elevation={2}
                        sx={{
                          mb: 3,
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: '1px solid',
                          borderColor: 'divider',
                          '&:hover': {
                            borderColor: 'primary.light',
                            boxShadow: (theme) => theme.shadows[4],
                          }
                        }}
                      >
                        <Accordion
                          expanded={expandedModules[module] || false}
                          onChange={() => handleModuleExpansion(module)}
                          sx={{
                            '&:before': { display: 'none' },
                            boxShadow: 'none',
                            '& .MuiAccordionSummary-root': {
                              backgroundColor: 'primary.main',
                              color: 'white',
                              minHeight: 64,
                              '&:hover': {
                                backgroundColor: 'primary.dark',
                              },
                              '& .MuiAccordionSummary-content': {
                                alignItems: 'center',
                              },
                            },
                          }}
                        >
                          <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'white' }} />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mr: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <AdminPanelSettings />
                                <Typography variant="h6" fontWeight={600}>
                                  {module}
                                </Typography>
                                <Chip
                                  label={`${modulePermissions.length} permissions`}
                                  size="small"
                                  sx={{ 
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    color: 'white',
                                    fontWeight: 500
                                  }}
                                />
                              </Box>
                              
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={isModuleFullySelected(module) || isModulePartiallySelected(module)}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleMasterToggle(module);
                                    }}
                                    disabled={isReadOnly}
                                    sx={{
                                      '& .MuiSwitch-thumb': {
                                        backgroundColor: 'white',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                      },
                                      // Partial state styling
                                      ...(isModulePartiallySelected(module) && !isModuleFullySelected(module) && {
                                        '& .MuiSwitch-track': {
                                          backgroundColor: '#ff9800', // Orange for partial state
                                          opacity: 0.7,
                                        },
                                        '& .MuiSwitch-thumb': {
                                          backgroundColor: '#ff9800',
                                          boxShadow: '0 2px 4px rgba(255,152,0,0.3)',
                                        },
                                      }),
                                      '& .MuiSwitch-track': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.2) !important',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                      },
                                      '& .Mui-checked .MuiSwitch-track': {
                                        backgroundColor: 'rgba(76, 175, 80, 0.8) !important',
                                        border: '1px solid rgba(76, 175, 80, 1)',
                                      },
                                      '& .Mui-checked .MuiSwitch-thumb': {
                                        backgroundColor: 'white',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                                      },
                                    }}
                                  />
                                }
                                label={
                                  <Typography variant="body2" sx={{ color: 'inherit', fontWeight: 500 }}>
                                    {isModuleFullySelected(module) ? 'All enabled' : 
                                     isModulePartiallySelected(module) ? 'Partially enabled' : 'All disabled'}
                                  </Typography>
                                }
                                onClick={(e) => e.stopPropagation()}
                              />
                            </Box>
                          </AccordionSummary>
                          
                          <AccordionDetails sx={{ p: 3, backgroundColor: 'background.paper' }}>
                            <Grid container spacing={2}>
                              {modulePermissions.map((permission) => {
                                const isSelected = selectedPermissions.includes(permission.id);
                                const methodColors = getMethodColor(permission.method);
                                const title = generateTitle(permission);

                                return (
                                  <Grid item xs={12} sm={6} md={4} key={permission.id}>
                                    <Card
                                      variant="outlined"
                                      sx={{
                                        height: '100%',
                                        cursor: isReadOnly ? 'default' : 'pointer',
                                        borderColor: isSelected ? 'primary.main' : 'divider',
                                        backgroundColor: isSelected ? 'primary.50' : 'background.paper',
                                        transition: 'all 0.2s ease',
                                        '&:hover': isReadOnly ? {} : {
                                          borderColor: 'primary.main',
                                          boxShadow: 1,
                                          transform: 'translateY(-2px)',
                                        },
                                      }}
                                      onClick={() => handlePermissionToggle(permission.id)}
                                    >
                                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                          <Typography 
                                            variant="subtitle2" 
                                            fontWeight={600} 
                                            sx={{ 
                                              color: 'text.primary',
                                              lineHeight: 1.3,
                                              flex: 1,
                                              mr: 1
                                            }}
                                          >
                                            {title}
                                          </Typography>
                                          <Switch
                                            checked={isSelected}
                                            size="small"
                                            disabled={isReadOnly}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={() => handlePermissionToggle(permission.id)}
                                            sx={{
                                              '& .MuiSwitch-thumb': {
                                                boxShadow: 1,
                                              },
                                            }}
                                          />
                                        </Box>
                                        
                                        <Box sx={{ mb: 2 }}>
                                          <Chip
                                            label={permission.method}
                                            size="small"
                                            sx={{
                                              ...methodColors,
                                              fontWeight: 600,
                                              fontSize: '0.75rem',
                                              fontFamily: 'monospace',
                                              mr: 1,
                                            }}
                                          />
                                        </Box>
                                        
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            color: 'text.secondary',
                                            fontFamily: 'monospace',
                                            backgroundColor: 'grey.50',
                                            p: 0.5,
                                            borderRadius: 1,
                                            display: 'block',
                                            wordBreak: 'break-all',
                                          }}
                                        >
                                          {permission.api}
                                        </Typography>
                                        
                                        {permission.description && (
                                          <>
                                            <Divider sx={{ my: 1 }} />
                                            <Typography 
                                              variant="body2" 
                                              sx={{ 
                                                color: 'text.secondary',
                                                fontSize: '0.8rem',
                                                lineHeight: 1.3
                                              }}
                                            >
                                              {permission.description}
                                            </Typography>
                                          </>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                );
                              })}
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      </Paper>
                    ))}
                    
                    {Object.keys(groupedPermissions).length === 0 && (
                      <Box sx={{ textAlign: 'center', py: 6 }}>
                        <Security sx={{ fontSize: 64, color: 'action.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                          No permissions available
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Contact your administrator to configure permissions.
                        </Typography>
                      </Box>
                    )}
                  </Box>
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