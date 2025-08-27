"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Avatar,
  Box,
  Typography,
  Menu,
  MenuItem,
  Tooltip,
  Card,
} from '@mui/material';
import {
  Category,
  MoreVert,
  Edit,
  Delete,
} from '@mui/icons-material';
import { useState } from 'react';
import { IResFindAllCategories } from '../../../../types/resData';

interface CategoryTableProps {
  categories: IResFindAllCategories[];
  totalCategories: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
  onEdit: (category: IResFindAllCategories) => void;
  onDelete: (category: IResFindAllCategories) => void;
}

export const CategoryTable = ({
  categories,
  totalCategories,
  currentPage,
  onPageChange,
  onEdit,
  onDelete,
}: CategoryTableProps) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<IResFindAllCategories | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, category: IResFindAllCategories) => {
    setMenuAnchor(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedCategory(null);
  };

  const handleEdit = () => {
    if (selectedCategory) {
      onEdit(selectedCategory);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedCategory) {
      onDelete(selectedCategory);
    }
    handleMenuClose();
  };

  return (
    <>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Courses</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: 'primary.main',
                          color: 'white',
                        }}
                      >
                        <Category />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {category.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {category.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {category.description || 'No description'}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={600}>
                      {category.courseCount || 0}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Tooltip title="More actions">
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, category)}
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
          count={totalCategories}
          rowsPerPage={10}
          page={currentPage - 1}
          onPageChange={(_, newPage) => onPageChange(newPage + 1)}
          onRowsPerPageChange={() => {}}
        />
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: '12px', minWidth: 160 },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Edit fontSize="small" />
            Edit Category
          </Box>
        </MenuItem>
        
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Delete fontSize="small" />
            Delete Category
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
};