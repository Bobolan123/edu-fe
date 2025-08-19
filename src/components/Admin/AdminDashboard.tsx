"use client";

import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  IconButton,
  Button,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  School,
  ShoppingCart,
  Star,
  MoreVert,
  Launch,
  PersonAdd,
  BookmarkAdd,
  Payment,
  RateReview,
} from '@mui/icons-material';

interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalUsers: number;
  usersChange: number;
  totalCourses: number;
  coursesChange: number;
  totalEnrollments: number;
  enrollmentsChange: number;
}

interface RecentActivity {
  id: string;
  type: 'enrollment' | 'course' | 'payment' | 'review';
  title: string;
  description: string;
  time: string;
  user: {
    name: string;
    avatar?: string;
  };
}

interface CoursePerformance {
  id: string;
  title: string;
  enrollments: number;
  rating: number;
  revenue: number;
  progress: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 124500,
    revenueChange: 12.5,
    totalUsers: 2847,
    usersChange: 8.2,
    totalCourses: 156,
    coursesChange: 3.1,
    totalEnrollments: 8924,
    enrollmentsChange: 15.4,
  });

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'enrollment',
      title: 'New Enrollment',
      description: 'React Fundamentals Course',
      time: '2 minutes ago',
      user: { name: 'John Doe' },
    },
    {
      id: '2',
      type: 'course',
      title: 'Course Published',
      description: 'Advanced JavaScript Patterns',
      time: '15 minutes ago',
      user: { name: 'Sarah Wilson' },
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Received',
      description: '$299.00 for Premium Package',
      time: '1 hour ago',
      user: { name: 'Mike Johnson' },
    },
    {
      id: '4',
      type: 'review',
      title: 'New Review',
      description: '5-star review on Node.js Course',
      time: '2 hours ago',
      user: { name: 'Emma Brown' },
    },
    {
      id: '5',
      type: 'enrollment',
      title: 'New Enrollment',
      description: 'Python for Beginners',
      time: '3 hours ago',
      user: { name: 'David Lee' },
    },
  ]);

  const [topCourses] = useState<CoursePerformance[]>([
    {
      id: '1',
      title: 'React Fundamentals',
      enrollments: 1240,
      rating: 4.8,
      revenue: 37200,
      progress: 85,
    },
    {
      id: '2',
      title: 'Node.js Masterclass',
      enrollments: 980,
      rating: 4.7,
      revenue: 29400,
      progress: 78,
    },
    {
      id: '3',
      title: 'Python for Data Science',
      enrollments: 856,
      rating: 4.9,
      revenue: 25680,
      progress: 92,
    },
    {
      id: '4',
      title: 'JavaScript Advanced',
      enrollments: 742,
      rating: 4.6,
      revenue: 22260,
      progress: 65,
    },
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment':
        return <PersonAdd sx={{ color: 'primary.main' }} />;
      case 'course':
        return <BookmarkAdd sx={{ color: 'secondary.main' }} />;
      case 'payment':
        return <Payment sx={{ color: 'success.main' }} />;
      case 'review':
        return <RateReview sx={{ color: 'warning.main' }} />;
      default:
        return <Launch />;
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color = 'primary' 
  }: { 
    title: string; 
    value: string | number; 
    change: number; 
    icon: any; 
    color?: string;
  }) => (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight={700} sx={{ mb: 1 }}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {change >= 0 ? (
                <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
              ) : (
                <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
              )}
              <Typography
                variant="body2"
                sx={{ 
                  color: change >= 0 ? 'success.main' : 'error.main',
                  fontWeight: 600,
                }}
              >
                {change >= 0 ? '+' : ''}{change}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                vs last month
              </Typography>
            </Box>
          </Box>
          
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${color}.main`,
              color: 'white',
            }}
          >
            <Icon sx={{ fontSize: 32 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            change={stats.revenueChange}
            icon={ShoppingCart}
            color="primary"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            change={stats.usersChange}
            icon={People}
            color="secondary"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Courses"
            value={stats.totalCourses}
            change={stats.coursesChange}
            icon={School}
            color="info"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Enrollments"
            value={stats.totalEnrollments}
            change={stats.enrollmentsChange}
            icon={Star}
            color="success"
          />
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  Recent Activity
                </Typography>
                <Button variant="outlined" size="small" endIcon={<Launch />}>
                  View All
                </Button>
              </Box>
              
              <List disablePadding>
                {recentActivities.map((activity, index) => (
                  <Box key={activity.id}>
                    <ListItem
                      disablePadding
                      sx={{
                        py: 1.5,
                        px: 0,
                        '&:hover': {
                          backgroundColor: 'grey.50',
                          borderRadius: '8px',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 56 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: 'grey.100',
                          }}
                        >
                          {getActivityIcon(activity.type)}
                        </Avatar>
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={`${activity.title} by ${activity.user.name}`}
                        secondary={`${activity.description} • ${activity.time}`}
                        primaryTypographyProps={{
                          variant: "body1",
                          fontWeight: 500,
                          sx: { mb: 0.5 }
                        }}
                        secondaryTypographyProps={{
                          variant: "body2",
                          color: "text.secondary"
                        }}
                      />
                    </ListItem>
                    
                    {index < recentActivities.length - 1 && (
                      <Divider sx={{ my: 0.5 }} />
                    )}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Performing Courses */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" component="h2" fontWeight={600}>
                  Top Courses
                </Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {topCourses.map((course) => (
                  <Paper
                    key={course.id}
                    sx={{
                      p: 2,
                      backgroundColor: 'grey.50',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: '12px',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600} noWrap sx={{ flex: 1, mr: 1 }}>
                        {course.title}
                      </Typography>
                      <Chip
                        icon={<Star sx={{ fontSize: 16 }} />}
                        label={course.rating}
                        size="small"
                        color="warning"
                        variant="filled"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {course.enrollments.toLocaleString()} students
                      </Typography>
                      <Typography variant="body2" fontWeight={500} color="success.main">
                        ${course.revenue.toLocaleString()}
                      </Typography>
                    </Box>
                    
                    <LinearProgress
                      variant="determinate"
                      value={course.progress}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: 'grey.300',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 2,
                          backgroundColor: 'primary.main',
                        },
                      }}
                    />
                    
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      {course.progress}% completion rate
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}