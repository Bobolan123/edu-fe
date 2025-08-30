"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  Avatar,
  Chip,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from '@mui/material';
import {
  Close,
  Person,
  School,
  BookmarkBorder,
  Timeline,
  Assignment,
  TrendingUp,
  AccessTime,
  PlayCircle,
  CheckCircle,
  Block,
} from '@mui/icons-material';
import { IEnrollment } from '../../../../types/entities';

interface EnrollmentDetailsDialogProps {
  open: boolean;
  enrollment: IEnrollment | null;
  onClose: () => void;
  onSuspend?: (enrollment: IEnrollment) => void;
  onReactivate?: (enrollment: IEnrollment) => void;
}

const statusColors = {
  active: 'primary',
  completed: 'success',
  suspended: 'warning',
  expired: 'error',
} as const;

export default function EnrollmentDetailsDialog({ 
  open, 
  enrollment, 
  onClose, 
  onSuspend, 
  onReactivate 
}: EnrollmentDetailsDialogProps) {
  if (!enrollment) return null;

  const progressPercentage = (enrollment as any).progressData?.progressPercentage || 0;
  const statusKey = progressPercentage === 100 ? 'completed' : (enrollment as any).completion_status || 'active';
  const timeSpent = ((enrollment as any).progressData?.totalWatchTime || 0) / 3600; // Convert seconds to hours
  const completedLessons = (enrollment as any).progressData?.completedLecturesCount || 0;
  const totalLessons = (enrollment as any).progressData?.totalLecturesCount || 0;
  const lastActivity = (enrollment as any).progressData?.lastActivity;

  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'error';
    if (progress < 50) return 'warning';
    if (progress < 100) return 'info';
    return 'success';
  };

  const handleSuspend = () => {
    if (onSuspend) onSuspend(enrollment);
  };

  const handleReactivate = () => {
    if (onReactivate) onReactivate(enrollment);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            Enrollment Details
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
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
                    {(enrollment as any).student?.name || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {(enrollment as any).student?.email || 'N/A'}
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
                    {(enrollment as any).course?.title || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {(enrollment as any).course?.instructor?.name || 'N/A'}
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
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Overall Progress</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {progressPercentage}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={progressPercentage}
                  color={getProgressColor(progressPercentage)}
                  sx={{ height: 8, borderRadius: 4, mb: 2 }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Lessons:</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {completedLessons}/{totalLessons}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Time Spent:</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {timeSpent.toFixed(1)} hours
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Status:</Typography>
                  <Chip
                    label={statusKey}
                    size="small"
                    color={statusColors[statusKey as keyof typeof statusColors]}
                    variant="filled"
                  />
                </Box>
              </Box>
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
                    secondary={(enrollment as any).date_enrolled ? new Date((enrollment as any).date_enrolled).toLocaleString() : 'N/A'}
                  />
                </ListItem>
                
                {lastActivity && (
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <Timeline color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Last Activity"
                      secondary={new Date(lastActivity).toLocaleString()}
                    />
                  </ListItem>
                )}
                
                {statusKey === 'completed' && (
                  <ListItem disablePadding>
                    <ListItemIcon>
                      <Assignment color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Course Completed"
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
                      {Math.round(progressPercentage / (timeSpent || 1))}%
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
                      {(timeSpent / (completedLessons || 1)).toFixed(1)}h
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
                      {(enrollment as any).date_enrolled ? Math.round((Date.now() - new Date((enrollment as any).date_enrolled).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Days Enrolled
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <School sx={{ fontSize: 32, color: 'secondary.main', mb: 1 }} />
                    <Typography variant="h6" fontWeight={600}>
                      {totalLessons - completedLessons}
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
      
      <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
        <Button onClick={onClose}>
          Close
        </Button>
        {statusKey === 'active' && onSuspend && (
          <Button variant="outlined" color="warning" onClick={handleSuspend}>
            Suspend Enrollment
          </Button>
        )}
        {statusKey === 'suspended' && onReactivate && (
          <Button variant="contained" color="success" onClick={handleReactivate}>
            Reactivate
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}