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
  Avatar,
  Chip,
  Divider,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import {
  Close,
  Person,
  Email,
  CalendarToday,
  Badge,
  School,
  Star,
  Assignment,
} from '@mui/icons-material';
import { IUser } from '../../../../types/entities';
import { format } from 'date-fns';

interface UserViewModalProps {
  open: boolean;
  onClose: () => void;
  user: IUser | null;
}

export default function UserViewModal({ open, onClose, user }: UserViewModalProps) {
  if (!user) return null;

  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'PPp');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'primary.main',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Person />
          <Typography variant="h6">User Details</Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ color: 'white' }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* User Avatar and Basic Info */}
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  src={user.avatar_url || undefined}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  {user.name}
                </Typography>
                <Chip
                  label={user.role?.name || 'No Role'}
                  color={user.role?.name === 'admin' ? 'error' : user.role?.name === 'instructor' ? 'secondary' : 'primary'}
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={user.isActive ? 'Active' : 'Inactive'}
                    color={user.isActive ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* User Details */}
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email color="primary" />
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email Address
                  </Typography>
                  <Typography variant="body1">{user.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Google ID
                  </Typography>
                  <Typography variant="body1">
                    {user.googleId || 'Not linked'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday color="primary" />
                Account Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date Joined
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(user.date_joined)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Account Status
                  </Typography>
                  <Chip
                    label={user.deleted_at ? 'Deleted' : 'Active'}
                    color={user.deleted_at ? 'error' : 'success'}
                    size="small"
                  />
                </Grid>
                {user.deleted_at && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Deleted At
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(user.deleted_at)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>

            {user.bio && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Badge color="primary" />
                  Bio
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {user.bio}
                </Typography>
              </Box>
            )}

            <Box>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assignment color="primary" />
                Activity Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center', py: 1 }}>
                      <School color="primary" sx={{ fontSize: 30, mb: 1 }} />
                      <Typography variant="h6">{user.courses?.length || 0}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Courses Created
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center', py: 1 }}>
                      <Badge color="primary" sx={{ fontSize: 30, mb: 1 }} />
                      <Typography variant="h6">{user.enrollments?.length || 0}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Enrollments
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center', py: 1 }}>
                      <Star color="primary" sx={{ fontSize: 30, mb: 1 }} />
                      <Typography variant="h6">{user.reviews?.length || 0}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Reviews
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}