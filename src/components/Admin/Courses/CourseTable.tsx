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
  Avatar,
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
  School,
  Star,
} from '@mui/icons-material';
import { useState } from 'react';
import { ICourse } from '../../../../types/entities';

interface CourseTableProps {
  courses: ICourse[];
  onEdit: (course: ICourse) => void;
  onDelete: (course: ICourse) => void;
  onView: (course: ICourse) => void;
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const statusColors = {
  true: 'success',
  false: 'error',
} as const;

export function CourseTable({
  courses,
  onEdit,
  onDelete,
  onView,
  totalCount,
  currentPage,
  onPageChange,
}: CourseTableProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const rowsPerPage = 10;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, course: ICourse) => {
    setMenuAnchor(event.currentTarget);
    setSelectedCourse(course);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedCourse(null);
  };

  const handleEdit = () => {
    if (selectedCourse) {
      onEdit(selectedCourse);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedCourse) {
      onDelete(selectedCourse);
    }
    handleMenuClose();
  };

  const handleView = () => {
    if (selectedCourse) {
      onView(selectedCourse);
    }
    handleMenuClose();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  return (
    <>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="center">Enrollments</TableCell>
                <TableCell align="center">Rating</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={course.thumbnail_url || undefined}
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: 'primary.main',
                          color: 'white',
                        }}
                      >
                        {!course.thumbnail_url && <School />}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600} noWrap>
                          {course.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          by {course.instructor?.name || 'Unknown'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {course.categories && course.categories.length > 0 ? (
                        <>
                          {course.categories.slice(0, 2).map((category) => (
                            <Chip
                              key={category.id}
                              label={category.name}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          ))}
                          {course.categories.length > 2 && (
                            <Chip
                              label={`+${course.categories.length - 2}`}
                              size="small"
                              variant="outlined"
                              color="default"
                            />
                          )}
                        </>
                      ) : (
                        <Chip
                          label="Uncategorized"
                          size="small"
                          variant="outlined"
                          color="default"
                        />
                      )}
                    </Box>
                  </TableCell>
                  
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600}>
                      ${course.price || 0}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography variant="body2">
                      {(course.total_students || 0).toLocaleString()}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                      <Typography variant="body2" fontWeight={500}>
                        {(course.average_rating || 0).toFixed(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({course.total_reviews || 0})
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Chip
                      label={course.active ? 'Active' : 'Inactive'}
                      size="small"
                      color={statusColors[course.active ? 'true' : 'false']}
                      variant="filled"
                    />
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {course.date_created ? new Date(course.date_created).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Tooltip title="More actions">
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, course)}
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
        
        <MenuItem onClick={handleEdit}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Edit fontSize="small" />
            Edit Course
          </Box>
        </MenuItem>
        
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Delete fontSize="small" />
            Delete Course
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
}