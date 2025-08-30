"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Alert,
  CircularProgress,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import {
  Search,
  School,
  PlayCircle,
  CheckCircle,
  TrendingUp,
  FilterList,
  Clear,
  ExpandMore,
} from '@mui/icons-material';
import { IEnrollment } from '../../../../types/entities';
import { toastService } from '../../../services/toast';
import EnrollmentTable from './EnrollmentTable';
import EnrollmentDetailsDialog from './EnrollmentDetailsDialog';

interface AdminEnrollmentsPageProps {
  enrollments: {
    result: IEnrollment[];
    meta: {
      page: number;
      take: number;
      itemCount: number;
      pageCount: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
  };
  searchParams: {
    page?: string;
    search?: string;
    orderBy?: string;
    order?: string;
    userId?: string;
    courseId?: string;
    instructorId?: string;
    courseName?: string;
    studentName?: string;
    studentEmail?: string;
    enrolledFromDate?: string;
    enrolledToDate?: string;
  };
}

export default function AdminEnrollmentsPage({ enrollments, searchParams }: AdminEnrollmentsPageProps) {
  const router = useRouter();
  
  // Form state
  const [searchTerm, setSearchTerm] = useState(searchParams.search || '');
  // Reconstruct sortBy from orderBy and order parameters
  const [sortBy, setSortBy] = useState(() => {
    const orderBy = searchParams.orderBy || 'date_enrolled';
    const order = searchParams.order || 'DESC';
    return `${orderBy}-${order}`;
  });
  
  // Filter states
  const [userId, setUserId] = useState(searchParams.userId || '');
  const [courseId, setCourseId] = useState(searchParams.courseId || '');
  const [instructorId, setInstructorId] = useState(searchParams.instructorId || '');
  const [courseName, setCourseName] = useState(searchParams.courseName || '');
  const [studentName, setStudentName] = useState(searchParams.studentName || '');
  const [studentEmail, setStudentEmail] = useState(searchParams.studentEmail || '');
  const [enrolledFromDate, setEnrolledFromDate] = useState(searchParams.enrolledFromDate || '');
  const [enrolledToDate, setEnrolledToDate] = useState(searchParams.enrolledToDate || '');
  
  // Track pending changes for apply/clear functionality
  const [pendingFilters, setPendingFilters] = useState({
    userId,
    courseId,
    instructorId,
    courseName,
    studentName,
    studentEmail,
    enrolledFromDate,
    enrolledToDate,
  });
  
  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<IEnrollment | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Accordion expansion state
  const [expandedFilters, setExpandedFilters] = useState(false);

  // Get data from props - API returns result array with meta
  const enrollmentsList = enrollments.result || [];
  const totalCount = enrollments.meta?.itemCount || 0;
  const currentPage = parseInt(searchParams.page || '1');


  // Update URL parameters
  const updateSearchParams = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    
    // Keep existing params and update with new ones
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && !newParams.hasOwnProperty(key)) {
        params.set(key, value.toString());
      }
    });
    
    // Add new params
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== 'All Status') {
        params.set(key, value);
      }
    });
    
    // Reset to page 1 when filtering
    if (Object.keys(newParams).some(key => key !== 'page')) {
      params.set('page', '1');
    }
    
    router.push(`/admin/enrollments?${params.toString()}`, { scroll: false });
  };

  // Event handlers
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    // Don't auto-apply search, wait for Apply button
  };

  const handleSortByChange = (sortBy: string) => {
    setSortBy(sortBy);
    // Don't auto-apply sort, wait for Apply button
  };

  // Filter handlers - update pending state only
  const handleUserIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUserId(value);
    setPendingFilters(prev => ({ ...prev, userId: value }));
  };

  const handleCourseIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCourseId(value);
    setPendingFilters(prev => ({ ...prev, courseId: value }));
  };

  const handleInstructorIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInstructorId(value);
    setPendingFilters(prev => ({ ...prev, instructorId: value }));
  };

  const handleCourseNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCourseName(value);
    setPendingFilters(prev => ({ ...prev, courseName: value }));
  };

  const handleStudentNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setStudentName(value);
    setPendingFilters(prev => ({ ...prev, studentName: value }));
  };

  const handleStudentEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setStudentEmail(value);
    setPendingFilters(prev => ({ ...prev, studentEmail: value }));
  };

  const handleEnrolledFromDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEnrolledFromDate(value);
    setPendingFilters(prev => ({ ...prev, enrolledFromDate: value }));
  };

  const handleEnrolledToDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEnrolledToDate(value);
    setPendingFilters(prev => ({ ...prev, enrolledToDate: value }));
  };

  // Apply and Clear handlers
  const handleApplyFilters = () => {
    // Parse sortBy into orderBy and order
    const [orderBy, order] = sortBy.split('-') as [string, 'ASC' | 'DESC'];
    
    const filtersToApply: Record<string, string | undefined> = {};
    
    // Add search if provided
    if (searchTerm) filtersToApply.search = searchTerm;
    
    // Add sorting parameters
    filtersToApply.orderBy = orderBy;
    filtersToApply.order = order;
    
    // Add all filter parameters
    Object.entries(pendingFilters).forEach(([key, value]) => {
      if (value) filtersToApply[key] = value;
    });
    
    updateSearchParams(filtersToApply);
  };

  const handleClearFilters = () => {
    // Reset all filter states
    setUserId('');
    setCourseId('');
    setInstructorId('');
    setCourseName('');
    setStudentName('');
    setStudentEmail('');
    setEnrolledFromDate('');
    setEnrolledToDate('');
    setSearchTerm('');
    setSortBy('date_enrolled-DESC');
    
    // Reset pending filters
    setPendingFilters({
      userId: '',
      courseId: '',
      instructorId: '',
      courseName: '',
      studentName: '',
      studentEmail: '',
      enrolledFromDate: '',
      enrolledToDate: '',
    });
    
    // Clear URL parameters
    router.push('/admin/enrollments', { scroll: false });
  };

  const handleView = (enrollment: IEnrollment) => {
    setSelectedEnrollment(enrollment);
    setDetailsDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: page.toString() });
  };

  const handleSuspend = async (enrollment: IEnrollment) => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement suspend enrollment API call
      toastService.success('Enrollment suspended successfully');
      router.refresh();
      setDetailsDialogOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to suspend enrollment';
      setError(errorMessage);
      toastService.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async (enrollment: IEnrollment) => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Implement reactivate enrollment API call
      toastService.success('Enrollment reactivated successfully');
      router.refresh();
      setDetailsDialogOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reactivate enrollment';
      setError(errorMessage);
      toastService.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from real data
  const totalEnrollments = totalCount;
  const activeEnrollments = enrollmentsList.filter((e: any) => 
    (e.progressData?.progressPercentage || 0) < 100 && (e.completion_status !== 'completed')
  ).length;
  const completedEnrollments = enrollmentsList.filter((e: any) => 
    (e.progressData?.progressPercentage || 0) === 100 || e.completion_status === 'completed'
  ).length;
  const avgProgress = enrollmentsList.length > 0 
    ? enrollmentsList.reduce((sum: number, e: any) => sum + (e.progressData?.progressPercentage || 0), 0) / enrollmentsList.length 
    : 0;

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

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

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
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterList />
            Filters & Search
          </Typography>
          
          {/* Always Visible: Search, Sort, and Date Filters */}
          <Grid container spacing={3}>
            {/* Search and Sort Row */}
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Search enrollments..."
                    value={searchTerm}
                    onChange={handleSearch}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      label="Sort By"
                      onChange={(e) => handleSortByChange(e.target.value as string)}
                    >
                      <MenuItem value="date_enrolled-DESC">Newest Enrollments</MenuItem>
                      <MenuItem value="date_enrolled-ASC">Oldest Enrollments</MenuItem>
                      <MenuItem value="course_title-ASC">Course Title (A-Z)</MenuItem>
                      <MenuItem value="course_title-DESC">Course Title (Z-A)</MenuItem>
                      <MenuItem value="student_name-ASC">Student Name (A-Z)</MenuItem>
                      <MenuItem value="student_name-DESC">Student Name (Z-A)</MenuItem>
                      <MenuItem value="instructor_name-ASC">Instructor Name (A-Z)</MenuItem>
                      <MenuItem value="instructor_name-DESC">Instructor Name (Z-A)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            {/* Date Filters Row - Always Visible */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom color="text.secondary">
                Filter by Enrollment Date
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    value={enrolledFromDate}
                    onChange={handleEnrolledFromDateChange}
                    label="Enrolled From Date"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    value={enrolledToDate}
                    onChange={handleEnrolledToDateChange}
                    label="Enrolled To Date"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Collapsible Advanced Filters */}
          <Accordion 
            expanded={expandedFilters} 
            onChange={(e, isExpanded) => setExpandedFilters(isExpanded)}
            elevation={0}
            sx={{ 
              '&:before': { display: 'none' },
              boxShadow: 'none',
              bgcolor: 'transparent'
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{ 
                px: 0,
                minHeight: 'auto',
                '& .MuiAccordionSummary-content': { 
                  margin: '8px 0' 
                }
              }}
            >
              <Typography variant="subtitle1" color="text.secondary">
                Advanced Filters
              </Typography>
            </AccordionSummary>
            
            <AccordionDetails sx={{ px: 0 }}>
              <Grid container spacing={3}>
                {/* ID Filters Row */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom color="text.secondary">
                    Filter by IDs
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        type="number"
                        placeholder="User ID"
                        value={userId}
                        onChange={handleUserIdChange}
                        label="User ID"
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        type="number"
                        placeholder="Course ID"
                        value={courseId}
                        onChange={handleCourseIdChange}
                        label="Course ID"
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        type="number"
                        placeholder="Instructor ID"
                        value={instructorId}
                        onChange={handleInstructorIdChange}
                        label="Instructor ID"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Name/Email Filters Row */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom color="text.secondary">
                    Filter by Names & Email
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        placeholder="Course Name"
                        value={courseName}
                        onChange={handleCourseNameChange}
                        label="Course Name"
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        placeholder="Student Name"
                        value={studentName}
                        onChange={handleStudentNameChange}
                        label="Student Name"
                        size="small"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        type="email"
                        placeholder="Student Email"
                        value={studentEmail}
                        onChange={handleStudentEmailChange}
                        label="Student Email"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Action Buttons Row - Always Visible */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={handleClearFilters}
              color="secondary"
            >
              Clear All
            </Button>
            <Button
              variant="contained"
              startIcon={<FilterList />}
              onClick={handleApplyFilters}
              color="primary"
            >
              Apply Filters
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Enrollments Table */}
      {!loading && (
        <EnrollmentTable
          enrollments={enrollmentsList}
          onView={handleView}
          onSuspend={handleSuspend}
          onReactivate={handleReactivate}
          totalCount={totalCount}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}

      {/* Details Dialog */}
      <EnrollmentDetailsDialog
        open={detailsDialogOpen}
        enrollment={selectedEnrollment}
        onClose={() => setDetailsDialogOpen(false)}
        onSuspend={handleSuspend}
        onReactivate={handleReactivate}
      />
    </Box>
  );
}