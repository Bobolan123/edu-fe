"use client";

import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  InputAdornment,
  Tooltip,
  LinearProgress,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Visibility,
  Block,
  CheckCircle,
  School,
  Person,
  PlayCircle,
  Assignment,
  Close,
  Timeline,
  TrendingUp,
  AccessTime,
  BookmarkBorder,
} from '@mui/icons-material';

interface Enrollment {
  id: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  courseTitle: string;
  courseId: string;
  instructorName: string;
  enrolledAt: string;
  lastAccessed: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  status: 'active' | 'completed' | 'suspended' | 'expired';
  certificateIssued: boolean;
  timeSpent: number; // in hours
}

const mockEnrollments: Enrollment[] = [
  {
    id: '1',
    studentName: 'John Doe',
    studentEmail: 'john.doe@email.com',
    courseTitle: 'React Fundamentals',
    courseId: '1',
    instructorName: 'Sarah Johnson',
    enrolledAt: '2024-02-01T10:30:00Z',
    lastAccessed: '2024-02-20T15:45:00Z',
    progress: 85,
    completedLessons: 17,
    totalLessons: 20,
    status: 'active',
    certificateIssued: false,
    timeSpent: 24.5,
  },
  {
    id: '2',
    studentName: 'Sarah Wilson',
    studentEmail: 'sarah.wilson@email.com',
    courseTitle: 'Advanced JavaScript',
    courseId: '2',
    instructorName: 'Mike Chen',
    enrolledAt: '2024-01-15T09:20:00Z',
    lastAccessed: '2024-02-18T11:30:00Z',
    progress: 100,
    completedLessons: 25,
    totalLessons: 25,
    status: 'completed',
    certificateIssued: true,
    timeSpent: 42.3,
  },
  {
    id: '3',
    studentName: 'Mike Johnson',
    studentEmail: 'mike.johnson@email.com',
    courseTitle: 'Python for Data Science',
    courseId: '3',
    instructorName: 'Emily Davis',
    enrolledAt: '2024-02-10T14:15:00Z',
    lastAccessed: '2024-02-19T09:45:00Z',
    progress: 45,
    completedLessons: 9,
    totalLessons: 20,
    status: 'active',
    certificateIssued: false,
    timeSpent: 18.7,
  },
  {
    id: '4',
    studentName: 'Emma Brown',
    studentEmail: 'emma.brown@email.com',
    courseTitle: 'UI/UX Design Principles',
    courseId: '4',
    instructorName: 'Alex Rivera',
    enrolledAt: '2024-01-20T16:45:00Z',
    lastAccessed: '2024-01-25T10:20:00Z',
    progress: 15,
    completedLessons: 2,
    totalLessons: 15,
    status: 'suspended',
    certificateIssued: false,
    timeSpent: 3.2,
  },
  {
    id: '5',
    studentName: 'David Lee',
    studentEmail: 'david.lee@email.com',
    courseTitle: 'Machine Learning Basics',
    courseId: '5',
    instructorName: 'Dr. Lisa Wang',
    enrolledAt: '2024-01-05T11:30:00Z',
    lastAccessed: '2024-02-17T14:20:00Z',
    progress: 100,
    completedLessons: 30,
    totalLessons: 30,
    status: 'completed',
    certificateIssued: true,
    timeSpent: 67.5,
  },
  {
    id: '6',
    studentName: 'Lisa Martinez',
    studentEmail: 'lisa.martinez@email.com',
    courseTitle: 'Node.js Development',
    courseId: '6',
    instructorName: 'Tom Anderson',
    enrolledAt: '2023-12-15T08:45:00Z',
    lastAccessed: '2023-12-20T16:30:00Z',
    progress: 8,
    completedLessons: 1,
    totalLessons: 18,
    status: 'expired',
    certificateIssued: false,
    timeSpent: 1.5,
  },
];

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

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockEnrollments);
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>(mockEnrollments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedProgress, setSelectedProgress] = useState('All Progress');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterEnrollments(value, selectedStatus, selectedProgress);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    filterEnrollments(searchTerm, status, selectedProgress);
  };

  const handleProgressChange = (progress: string) => {
    setSelectedProgress(progress);
    filterEnrollments(searchTerm, selectedStatus, progress);
  };

  const filterEnrollments = (search: string, status: string, progress: string) => {
    let filtered = enrollments;

    if (search) {
      filtered = filtered.filter(enrollment =>
        enrollment.studentName.toLowerCase().includes(search.toLowerCase()) ||
        enrollment.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
        enrollment.instructorName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== 'All Status') {
      filtered = filtered.filter(enrollment => enrollment.status === status);
    }

    if (progress !== 'All Progress') {
      switch (progress) {
        case 'Not Started':
          filtered = filtered.filter(enrollment => enrollment.progress === 0);
          break;
        case 'In Progress':
          filtered = filtered.filter(enrollment => enrollment.progress > 0 && enrollment.progress < 100);
          break;
        case 'Completed':
          filtered = filtered.filter(enrollment => enrollment.progress === 100);
          break;
      }
    }

    setFilteredEnrollments(filtered);
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, enrollment: Enrollment) => {
    setMenuAnchor(event.currentTarget);
    setSelectedEnrollment(enrollment);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedEnrollment(null);
  };

  const handleViewDetails = () => {
    setDetailsDialogOpen(true);
    handleMenuClose();
  };

  const handleSuspend = () => {
    if (selectedEnrollment) {
      const updatedEnrollments = enrollments.map(e => 
        e.id === selectedEnrollment.id 
          ? { ...e, status: 'suspended' as const }
          : e
      );
      setEnrollments(updatedEnrollments);
      setFilteredEnrollments(updatedEnrollments);
    }
    handleMenuClose();
  };

  const handleReactivate = () => {
    if (selectedEnrollment) {
      const updatedEnrollments = enrollments.map(e => 
        e.id === selectedEnrollment.id 
          ? { ...e, status: 'active' as const }
          : e
      );
      setEnrollments(updatedEnrollments);
      setFilteredEnrollments(updatedEnrollments);
    }
    handleMenuClose();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'error';
    if (progress < 50) return 'warning';
    if (progress < 100) return 'info';
    return 'success';
  };

  const EnrollmentDetailsDialog = () => (
    <Dialog 
      open={detailsDialogOpen} 
      onClose={() => setDetailsDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            Enrollment Details
          </Typography>
          <IconButton onClick={() => setDetailsDialogOpen(false)}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      {selectedEnrollment && (
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            {/* Student & Course Info */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }} variant="outlined">
                <Typography variant="h6" gutterBottom>
                  Student Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ backgroundColor: 'primary.main', width: 48, height: 48 }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      {selectedEnrollment.studentName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedEnrollment.studentEmail}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ backgroundColor: 'secondary.main', width: 48, height: 48 }}>
                    <School />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      {selectedEnrollment.courseTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      by {selectedEnrollment.instructorName}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Progress & Stats */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }} variant="outlined">
                <Typography variant="h6" gutterBottom>
                  Progress Overview
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Overall Progress</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedEnrollment.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={selectedEnrollment.progress}
                      color={getProgressColor(selectedEnrollment.progress)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Lessons:</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedEnrollment.completedLessons}/{selectedEnrollment.totalLessons}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Time Spent:</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedEnrollment.timeSpent.toFixed(1)} hours
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Status:</Typography>
                    <Chip
                      label={selectedEnrollment.status}
                      size="small"
                      color={statusColors[selectedEnrollment.status]}
                      variant="filled"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Certificate:</Typography>
                    <Chip
                      label={selectedEnrollment.certificateIssued ? 'Issued' : 'Not Issued'}
                      size="small"
                      color={selectedEnrollment.certificateIssued ? 'success' : 'default'}
                      variant="filled"
                    />
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            {/* Activity Timeline */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }} variant="outlined">
                <Typography variant="h6" gutterBottom>
                  Enrollment Timeline
                </Typography>
                <List disablePadding>
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <BookmarkBorder color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Course Enrolled"
                      secondary={new Date(selectedEnrollment.enrolledAt).toLocaleString()}
                    />
                  </ListItem>
                  
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <Timeline color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Last Activity"
                      secondary={new Date(selectedEnrollment.lastAccessed).toLocaleString()}
                    />
                  </ListItem>
                  
                  {selectedEnrollment.status === 'completed' && selectedEnrollment.certificateIssued && (
                    <ListItem disablePadding>
                      <ListItemIcon>
                        <Assignment color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Certificate Issued"
                        secondary="Course completed successfully"
                      />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </Grid>

            {/* Learning Analytics */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }} variant="outlined">
                <Typography variant="h6" gutterBottom>
                  Learning Analytics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <TrendingUp sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h6" fontWeight={600}>
                        {Math.round(selectedEnrollment.progress / (selectedEnrollment.timeSpent || 1))}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Progress Rate
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <AccessTime sx={{ fontSize: 32, color: 'info.main', mb: 1 }} />
                      <Typography variant="h6" fontWeight={600}>
                        {(selectedEnrollment.timeSpent / selectedEnrollment.completedLessons || 0).toFixed(1)}h
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Avg Time/Lesson
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <PlayCircle sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                      <Typography variant="h6" fontWeight={600}>
                        {Math.round((Date.now() - new Date(selectedEnrollment.lastAccessed).getTime()) / (1000 * 60 * 60 * 24))}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Days Since Access
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <School sx={{ fontSize: 32, color: 'secondary.main', mb: 1 }} />
                      <Typography variant="h6" fontWeight={600}>
                        {selectedEnrollment.totalLessons - selectedEnrollment.completedLessons}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Lessons Remaining
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
      )}
      
      <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
        <Button onClick={() => setDetailsDialogOpen(false)}>
          Close
        </Button>
        {selectedEnrollment?.status === 'active' && (
          <Button variant="outlined" color="warning" onClick={handleSuspend}>
            Suspend Enrollment
          </Button>
        )}
        {selectedEnrollment?.status === 'suspended' && (
          <Button variant="contained" color="success" onClick={handleReactivate}>
            Reactivate
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  const totalEnrollments = enrollments.length;
  const activeEnrollments = enrollments.filter(e => e.status === 'active').length;
  const completedEnrollments = enrollments.filter(e => e.status === 'completed').length;
  const avgProgress = enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          Enrollments Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track student progress and manage course enrollments
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <School sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {totalEnrollments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Enrollments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <PlayCircle sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {activeEnrollments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Enrollments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {completedEnrollments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed Courses
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                {avgProgress.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search enrollments..."
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
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedStatus}
                  label="Status"
                  onChange={(e) => handleStatusChange(e.target.value as string)}
                >
                  <MenuItem value="All Status">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Progress</InputLabel>
                <Select
                  value={selectedProgress}
                  label="Progress"
                  onChange={(e) => handleProgressChange(e.target.value as string)}
                >
                  <MenuItem value="All Progress">All Progress</MenuItem>
                  <MenuItem value="Not Started">Not Started</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                fullWidth
                sx={{ height: 56 }}
              >
                Export
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Enrollments Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Course</TableCell>
                <TableCell align="center">Progress</TableCell>
                <TableCell align="center">Lessons</TableCell>
                <TableCell align="center">Time Spent</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Last Access</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEnrollments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((enrollment) => {
                  const StatusIcon = statusIcons[enrollment.status];
                  return (
                    <TableRow key={enrollment.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ width: 40, height: 40, backgroundColor: 'primary.main' }}>
                            <Person />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={500}>
                              {enrollment.studentName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {enrollment.studentEmail}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {enrollment.courseTitle}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            by {enrollment.instructorName}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Box sx={{ minWidth: 80 }}>
                          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                            {enrollment.progress}%
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={enrollment.progress}
                            color={getProgressColor(enrollment.progress)}
                            sx={{ height: 4, borderRadius: 2 }}
                          />
                        </Box>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Typography variant="body2">
                          {enrollment.completedLessons}/{enrollment.totalLessons}
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Typography variant="body2">
                          {enrollment.timeSpent.toFixed(1)}h
                        </Typography>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <StatusIcon sx={{ fontSize: 16, color: `${statusColors[enrollment.status]}.main` }} />
                          <Chip
                            label={enrollment.status}
                            size="small"
                            color={statusColors[enrollment.status]}
                            variant="filled"
                          />
                        </Box>
                      </TableCell>
                      
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {new Date(enrollment.lastAccessed).toLocaleDateString()}
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
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredEnrollments.length}
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
          sx: { borderRadius: '12px', minWidth: 160 },
        }}
      >
        <MenuItem onClick={handleViewDetails}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Visibility fontSize="small" />
            View Details
          </Box>
        </MenuItem>
        
        {selectedEnrollment?.status === 'active' && (
          <MenuItem onClick={handleSuspend} sx={{ color: 'warning.main' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Block fontSize="small" />
              Suspend
            </Box>
          </MenuItem>
        )}
        
        {selectedEnrollment?.status === 'suspended' && (
          <MenuItem onClick={handleReactivate} sx={{ color: 'success.main' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CheckCircle fontSize="small" />
              Reactivate
            </Box>
          </MenuItem>
        )}
      </Menu>

      {/* Dialogs */}
      <EnrollmentDetailsDialog />
    </Box>
  );
}