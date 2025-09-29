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
  Chip,
  Divider,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Close,
  School,
  Person,
  CalendarToday,
  Star,
  People,
  PlayArrow,
  Assignment,
  Category,
  MonetizationOn,
  Language,
} from '@mui/icons-material';
import { ICourse } from '../../../../types/entities';
import { format } from 'date-fns';
import { useCurrency } from '@/context/CurrencyContext';
import { currencyService } from '@/services/currency';

interface CourseViewModalProps {
  open: boolean;
  onClose: () => void;
  course: ICourse | null;
}

export default function CourseViewModal({ open, onClose, course }: CourseViewModalProps) {
  const { currency } = useCurrency();

  if (!course) return null;

  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'PPp');
  };

  const formatPrice = (price: number) => {
    return currencyService.formatPrice(price, currency);
  };

  const getTotalLectures = () => {
    return course.sections?.reduce((total, section) => total + (section.lectures?.length || 0), 0) || 0;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
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
          <School />
          <Typography variant="h6">Course Details</Typography>
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
          {/* Course Thumbnail and Basic Info */}
          <Grid item xs={12} md={5}>
            <Card elevation={2}>
              {course.thumbnail_url && (
                <CardMedia
                  component="img"
                  height="200"
                  image={course.thumbnail_url}
                  alt={course.title}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {course.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={course.isActive ? 'Active' : 'Inactive'}
                    color={course.isActive ? 'success' : 'error'}
                    size="small"
                  />
                  {course.deleted_at && (
                    <Chip
                      label="Deleted"
                      color="error"
                      size="small"
                    />
                  )}
                </Box>

                {/* Key Metrics */}
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                      <Star color="warning" />
                      <Typography variant="h6">{course.average_rating?.toFixed(1) || '0.0'}</Typography>
                      <Typography variant="caption">Rating</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                      <People color="primary" />
                      <Typography variant="h6">{course.total_students || 0}</Typography>
                      <Typography variant="caption">Students</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                      <Assignment color="secondary" />
                      <Typography variant="h6">{getTotalLectures()}</Typography>
                      <Typography variant="caption">Lectures</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card variant="outlined" sx={{ textAlign: 'center', p: 1 }}>
                      <Star color="info" />
                      <Typography variant="h6">{course.total_reviews || 0}</Typography>
                      <Typography variant="caption">Reviews</Typography>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Course Details */}
          <Grid item xs={12} md={7}>
            {/* Instructor Information */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person color="primary" />
                Instructor
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={course.instructor?.avatar_url || undefined}
                  sx={{ bgcolor: 'primary.main' }}
                >
                  {course.instructor?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">{course.instructor?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.instructor?.email}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Course Information */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MonetizationOn color="primary" />
                Course Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Price
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatPrice(course.price)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Language
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Language color="action" />
                    <Typography variant="body1">{course.language}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(course.date_created)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(course.last_updated)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Categories */}
            {course.categories && course.categories.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Category color="primary" />
                  Categories
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {course.categories.map((category) => (
                    <Chip
                      key={category.id}
                      label={category.name}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Description */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>f
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {course.description}
              </Typography>
            </Box>

            {/* Course Sections */}
            {course.sections && course.sections.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PlayArrow color="primary" />
                  Course Content ({course.sections.length} sections)
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List dense>
                  {course.sections.slice(0, 5).map((section, index) => (
                    <ListItem key={section.id}>
                      <ListItemIcon>
                        <Assignment color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary={section.title}
                        secondary={`${section.lectures?.length || 0} lectures`}
                      />
                    </ListItem>
                  ))}
                  {course.sections.length > 5 && (
                    <ListItem>
                      <ListItemText
                        primary={`... and ${course.sections.length - 5} more sections`}
                        sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                      />
                    </ListItem>
                  )}
                </List>
              </Box>
            )}
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