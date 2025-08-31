"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Visibility,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useState } from 'react';
import { IRole } from '../../../../types/entities';

interface RoleTableProps {
  roles: IRole[];
  onView: (role: IRole) => void;
  onEdit: (role: IRole) => void;
  onEditPermissions: (role: IRole) => void;
  onDelete: (role: IRole) => void;
}

export default function RoleTable({
  roles,
  onView,
  onEdit,
  onEditPermissions,
  onDelete,
}: RoleTableProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedRole, setSelectedRole] = useState<IRole | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, role: IRole) => {
    setMenuAnchor(event.currentTarget);
    setSelectedRole(role);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRole(null);
  };

  const handleView = () => {
    if (selectedRole) onView(selectedRole);
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedRole) onEdit(selectedRole);
    handleMenuClose();
  };

  const handleEditPermissions = () => {
    if (selectedRole) onEditPermissions(selectedRole);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedRole) onDelete(selectedRole);
    handleMenuClose();
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Role Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Permissions</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role: IRole) => (
              <TableRow key={role.id} hover>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {role.id}
                  </Typography>
                </TableCell>
                
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
                    label={role.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    color={role.isActive ? 'success' : 'default'}
                    variant={role.isActive ? 'filled' : 'outlined'}
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
        
        <MenuItem onClick={handleEdit}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Edit fontSize="small" />
            Edit Role
          </Box>
        </MenuItem>
        
        <MenuItem onClick={handleEditPermissions}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AdminPanelSettings fontSize="small" />
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
    </>
  );
}