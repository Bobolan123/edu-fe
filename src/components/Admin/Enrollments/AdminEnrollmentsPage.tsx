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
} from '@mui/material';
import {
  Search,
  School,
  PlayCircle,
  CheckCircle,
  TrendingUp,
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
    status?: string;
    sortBy?: 'newest' | 'oldest' | 'progress_high' | 'progress_low';
  };
}

export default function AdminEnrollmentsPage({ enrollments, searchParams }: AdminEnrollmentsPageProps) {
  const router = useRouter();
  
  // Form state
  const [searchTerm, setSearchTerm] = useState(searchParams.search || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.status || 'All Status');
  const [sortBy, setSortBy] = useState(searchParams.sortBy || 'newest');
  
  // Dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<IEnrollment | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    
    router.push(`/admin/enrollments?${params.toString()}`);
  };

  // Event handlers
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      updateSearchParams({ search: value || undefined });
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    updateSearchParams({ status: status === 'All Status' ? undefined : status });
  };

  const handleSortByChange = (sortBy: string) => {
    setSortBy(sortBy as 'newest' | 'oldest' | 'progress_high' | 'progress_low');
    updateSearchParams({ sortBy });
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
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => handleSortByChange(e.target.value as string)}
                >
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="oldest">Oldest</MenuItem>
                  <MenuItem value="progress_high">Highest Progress</MenuItem>
                  <MenuItem value="progress_low">Lowest Progress</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
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