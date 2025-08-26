"use client";

import {
  Card,
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
  Typography,
  Box,
  Tooltip,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Restore,
  DeleteForever,
} from '@mui/icons-material';
import { useState } from 'react';
import { IUser } from '../../../../types/entities';

interface UserTableProps {
  users: IUser[];
  onEdit: (user: IUser) => void;
  onDelete: (user: IUser, action?: 'delete' | 'restore' | 'force-delete') => void;
  onView: (user: IUser) => void;
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  includeDeleted?: boolean;
}

const roleColors = {
  student: 'primary' as const,
  instructor: 'secondary' as const,
  admin: 'error' as const,
};

export function UserTable({
  users,
  onEdit,
  onDelete,
  onView,
  totalCount,
  currentPage,
  onPageChange,
  includeDeleted = false,
}: UserTableProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const rowsPerPage = 10;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: IUser) => {
    setMenuAnchor(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedUser(null);
  };

  const handleView = () => {
    if (selectedUser) {
      onView(selectedUser);
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedUser) {
      onEdit(selectedUser);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedUser) {
      onDelete(selectedUser, 'delete');
    }
    handleMenuClose();
  };

  const handleRestore = () => {
    if (selectedUser) {
      onDelete(selectedUser, 'restore');
    }
    handleMenuClose();
  };

  const handleForceDelete = () => {
    if (selectedUser) {
      onDelete(selectedUser, 'force-delete');
    }
    handleMenuClose();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'student':
        return roleColors.student;
      case 'instructor':
        return roleColors.instructor;
      case 'admin':
        return roleColors.admin;
      default:
        return roleColors.student;
    }
  };

  return (
    <>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Bio</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Auth Type</TableCell>
                <TableCell align="center">Subscription</TableCell>
                <TableCell align="center">Courses</TableCell>
                <TableCell align="center">Join Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow 
                  key={user.id} 
                  hover
                  sx={{
                    ...(includeDeleted && {
                      backgroundColor: 'error.lighter',
                      opacity: 0.7,
                      '&:hover': {
                        backgroundColor: 'error.light',
                      }
                    })
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={user.avatar_url || undefined}
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: 'primary.main',
                          color: 'white',
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block',
                      }}
                      title={user.bio || 'No bio available'}
                    >
                      {user.bio || 'No bio available'}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={user.role?.name || 'No Role'}
                      size="small"
                      color={getRoleColor(user.role?.name || 'student')}
                      variant="filled"
                    />
                  </TableCell>
                  
                  <TableCell align="center">
                    <Chip
                      label={user.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={user.isActive ? 'success' : 'warning'}
                      variant="filled"
                    />
                  </TableCell>
                  
                  <TableCell align="center">
                    <Chip
                      label={user.googleId ? 'Google' : 'Email'}
                      size="small"
                      color={user.googleId ? 'info' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  
                  <TableCell align="center">
                    <Chip
                      label={user.has_active_subscription ? 'Active' : 'None'}
                      size="small"
                      color={user.has_active_subscription ? 'success' : 'default'}
                      variant="filled"
                    />
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography variant="body2">
                      {user.courses?.length || 0}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {new Date(user.date_joined).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Tooltip title="More actions">
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, user)}
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
          rowsPerPageOptions={[10]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={handleChangePage}
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
        
        {!includeDeleted ? [
          <MenuItem key="edit" onClick={handleEdit}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Edit fontSize="small" />
              Edit User
            </Box>
          </MenuItem>,
          
          <MenuItem key="delete" onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Delete fontSize="small" />
              Delete User
            </Box>
          </MenuItem>
        ] : [
          <MenuItem key="restore" onClick={handleRestore} sx={{ color: 'success.main' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Restore fontSize="small" />
              Restore User
            </Box>
          </MenuItem>,
          
          <MenuItem key="force-delete" onClick={handleForceDelete} sx={{ color: 'error.main' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <DeleteForever fontSize="small" />
              Permanently Delete
            </Box>
          </MenuItem>
        ]}
      </Menu>
    </>
  );
}