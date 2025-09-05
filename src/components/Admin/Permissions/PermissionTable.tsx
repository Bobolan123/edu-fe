"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Card,
  IconButton,
  Chip,
  Box,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Security,
} from '@mui/icons-material';
import { useState } from 'react';
import { IPermission } from '../../../../types/entities';

interface PermissionTableProps {
  permissions: IPermission[];
  onEdit: (permission: IPermission) => void;
  onDelete: (permission: IPermission) => void;
  onView: (permission: IPermission) => void;
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const methodColors = {
  GET: 'success',
  POST: 'primary',
  PUT: 'warning',
  DELETE: 'error',
} as const;

export function PermissionTable({
  permissions,
  onEdit,
  onDelete,
  onView,
  totalCount,
  currentPage,
  onPageChange,
}: PermissionTableProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedPermission, setSelectedPermission] = useState<IPermission | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, permission: IPermission) => {
    setMenuAnchor(event.currentTarget);
    setSelectedPermission(permission);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedPermission(null);
  };

  const handleMenuAction = (action: () => void) => {
    action();
    handleMenuClose();
  };

  const rowsPerPage = 10;
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>API</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {permissions.map((permission) => (
              <TableRow key={permission.id} hover>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'monospace',
                      fontWeight: 500,
                      color: 'text.secondary'
                    }}
                  >
                    {permission.id}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Security color="primary" fontSize="small" />
                    <Typography
                      variant="body2"
                      sx={{ 
                        fontFamily: 'monospace',
                        fontWeight: 500,
                        maxWidth: 150,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      title={permission.api}
                    >
                      {permission.api}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    title={permission.description}
                  >
                    {permission.description}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Chip
                    label={permission.module}
                    color="info"
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                
                <TableCell>
                  <Chip
                    label={permission.method}
                    color={methodColors[permission.method as keyof typeof methodColors] || 'default'}
                    variant="filled"
                    size="small"
                    sx={{ 
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      minWidth: 60
                    }}
                  />
                </TableCell>
                
                <TableCell>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {new Date(permission.created).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {new Date(permission.updated).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
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
        rowsPerPageOptions={[10]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={currentPage - 1} // Convert 1-based to 0-based
        onPageChange={(_, newPage) => onPageChange(newPage + 1)} // Convert 0-based to 1-based
        onRowsPerPageChange={() => {}} // Fixed rows per page
      />

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
        <MenuItem onClick={() => handleMenuAction(() => selectedPermission && onView(selectedPermission))}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Visibility fontSize="small" />
            View Details
          </Box>
        </MenuItem>
        
        <MenuItem onClick={() => handleMenuAction(() => selectedPermission && onEdit(selectedPermission))}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Edit fontSize="small" />
            Edit Permission
          </Box>
        </MenuItem>
        
        <MenuItem 
          onClick={() => handleMenuAction(() => selectedPermission && onDelete(selectedPermission))} 
          sx={{ color: 'error.main' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Delete fontSize="small" />
            Delete Permission
          </Box>
        </MenuItem>
      </Menu>
    </Card>
  );
}