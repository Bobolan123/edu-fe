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
  LinearProgress,
} from '@mui/material';
import {
  MoreVert,
  Visibility,
  Block,
  CheckCircle,
  Person,
  PlayCircle,
  AccessTime,
} from '@mui/icons-material';
import { useState } from 'react';
import { IEnrollment } from '../../../../types/entities';

interface EnrollmentTableProps {
  enrollments: IEnrollment[];
  onView: (enrollment: IEnrollment) => void;
  onSuspend?: (enrollment: IEnrollment) => void;
  onReactivate?: (enrollment: IEnrollment) => void;
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const statusColors = {
  active: 'primary',
  completed: 'success',
  suspended: 'warning',
  expired: 'error',
} as const;

const statusIcons = {
  active: PlayCircle,
  completed: CheckCircle,
  suspended: Block,
  expired: AccessTime,
};

export default function EnrollmentTable({ 
  enrollments, 
  onView, 
  onSuspend, 
  onReactivate, 
  totalCount, 
  currentPage, 
  onPageChange 
}: EnrollmentTableProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<IEnrollment | null>(null);
  const rowsPerPage = 10;


  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, enrollment: IEnrollment) => {
    setMenuAnchor(event.currentTarget);
    setSelectedEnrollment(enrollment);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedEnrollment(null);
  };

  const handleView = () => {
    if (selectedEnrollment) {
      onView(selectedEnrollment);
    }
    handleMenuClose();
  };

  const handleSuspend = () => {
    if (selectedEnrollment && onSuspend) {
      onSuspend(selectedEnrollment);
    }
    handleMenuClose();
  };

  const handleReactivate = () => {
    if (selectedEnrollment && onReactivate) {
      onReactivate(selectedEnrollment);
    }
    handleMenuClose();
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    onPageChange(newPage + 1);
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'error';
    if (progress < 50) return 'warning';
    if (progress < 100) return 'info';
    return 'success';
  };

  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Course</TableCell>
              <TableCell align="center">Progress</TableCell>
              <TableCell align="center">Lessons</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Last Activity</TableCell>
              <TableCell align="center">Enrolled</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrollments.map((enrollment: IEnrollment) => {
              // Use completion_status from API or infer from progress
              const progressPercentage = enrollment.progressData?.progressPercentage || 0;
              const statusKey = progressPercentage === 100 ? 'completed' : enrollment.completion_status || 'active';
              const StatusIcon = statusIcons[statusKey as keyof typeof statusIcons] || PlayCircle;
              
              return (
                <TableRow key={enrollment.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 40, height: 40, backgroundColor: 'primary.main' }}>
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={500}>
                          {enrollment.student?.name || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {enrollment.student?.email || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {enrollment.course?.title || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        by {enrollment.course?.instructor?.name || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box sx={{ minWidth: 80 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                        {progressPercentage}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={progressPercentage}
                        color={getProgressColor(progressPercentage)}
                        sx={{ height: 4, borderRadius: 2 }}
                      />
                    </Box>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography variant="body2">
                      {enrollment.progressData?.completedLecturesCount || 0}/
                      {enrollment.progressData?.totalLecturesCount || 0}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <StatusIcon sx={{ fontSize: 16, color: `${statusColors[statusKey as keyof typeof statusColors] || 'primary'}.main` }} />
                      <Chip
                        label={statusKey}
                        size="small"
                        color={statusColors[statusKey as keyof typeof statusColors] || 'primary'}
                        variant="filled"
                      />
                    </Box>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {enrollment.progressData?.lastActivity 
                        ? new Date(enrollment.progressData.lastActivity).toLocaleDateString()
                        : 'No activity'
                      }
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {enrollment.date_enrolled 
                        ? new Date(enrollment.date_enrolled).toLocaleDateString()
                        : 'N/A'
                      }
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Tooltip title="More actions">
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, enrollment)}
                        size="small"
                      >
                        <MoreVert />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={currentPage - 1}
        onPageChange={handlePageChange}
        onRowsPerPageChange={() => {}} // Fixed rows per page
      />

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { borderRadius: '12px', minWidth: 160 },
        }}
      >
        <MenuItem onClick={handleView}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Visibility fontSize="small" />
            View Details
          </Box>
        </MenuItem>
        
        {selectedEnrollment?.completion_status === 'active' && onSuspend && (
          <MenuItem onClick={handleSuspend} sx={{ color: 'warning.main' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Block fontSize="small" />
              Suspend
            </Box>
          </MenuItem>
        )}
        
        {selectedEnrollment?.completion_status === 'suspended' && onReactivate && (
          <MenuItem onClick={handleReactivate} sx={{ color: 'success.main' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CheckCircle fontSize="small" />
              Reactivate
            </Box>
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
}