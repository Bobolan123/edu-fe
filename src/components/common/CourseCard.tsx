import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  Rating,
  Button,
  Fade,
  Zoom,
  alpha,
  useTheme,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  ShoppingCart as CartIcon,
  Visibility as ViewIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { ICourse } from '../../../types/entities';
import { currencyService } from '@/service/currency';
import { useCurrency } from '@/context/CurrencyContext';

interface CourseCardProps {
  course: ICourse;
  onAddToCart?: (courseId: number) => void;
  onViewDetails?: (courseId: number) => void;
  onToggleBookmark?: (courseId: number) => void;
  isBookmarked?: boolean;
  showProgress?: boolean;
  progress?: number;
  variant?: 'default' | 'featured' | 'compact' | 'horizontal';
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onAddToCart,
  onViewDetails,
  onToggleBookmark,
  isBookmarked = false,
  showProgress = false,
  progress = 0,
  variant = 'default',
  className,
}) => {
  const [hovered, setHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const theme = useTheme();
  const { currency } = useCurrency();

  const getFormattedPrice = () => {
    if (!course.price) return 'Free';
    return currencyService.formatPrice(course.price, currency);
  };

  const getDifficultyColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return theme.palette.success.main;
      case 'intermediate':
        return theme.palette.warning.main;
      case 'advanced':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  const renderCompactCard = () => (
    <Card
      className={`group cursor-pointer transition-all duration-300 ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onViewDetails?.(course.id)}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        background: 'background.paper',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 20px 25px ${alpha(theme.palette.primary.main, 0.1)}, 0 10px 10px ${alpha(theme.palette.common.black, 0.04)}`,
          borderColor: 'primary.light',
        },
      }}
    >
      {/* Image Section */}
      <Box sx={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          // FIX: Changed thumbnailUrl to thumbnail_url
          image={course.thumbnail_url || '/api/placeholder/400/225'}
          alt={course.title}
          onLoad={() => setImageLoaded(true)}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            opacity: imageLoaded ? 1 : 0,
          }}
        />
        
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <Zoom in={hovered}>
            <IconButton
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'white',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <PlayIcon />
            </IconButton>
          </Zoom>
        </Box>

        {/* Bookmark Button */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark?.(course.id);
          }}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            color: isBookmarked ? 'primary.main' : 'text.secondary',
            '&:hover': {
              backgroundColor: 'white',
              color: 'primary.main',
            },
          }}
        >
          {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </IconButton>

        {/* Categories */}
        {course.categories && course.categories.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
            }}
          >
            <Chip
              label={course.categories[0].name}
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                color: 'text.primary',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          </Box>
        )}

        {/* Progress Bar */}
        {showProgress && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'rgba(255, 255, 255, 0.3)',
            }}
          >
            <Box
              sx={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
                transition: 'width 0.3s ease',
              }}
            />
          </Box>
        )}
      </Box>

      {/* Content Section */}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              lineHeight: 1.3,
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.6em',
            }}
          >
            {course.title}
          </Typography>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.4em',
              lineHeight: 1.4,
            }}
          >
            {course.description}
          </Typography>
        </Box>

        {/* Instructor */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            // FIX: Changed avatar to avatar_url (based on convention from other errors)
            src={course.instructor?.avatar_url || "img_not_found.png"}
            sx={{ width: 32, height: 32, mr: 1.5 }}
          >
            <PersonIcon />
          </Avatar>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {course.instructor?.name || 'Unknown Instructor'}
          </Typography>
        </Box>

        {/* Metrics */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Rating
              // FIX: Changed averageRating to average_rating
              value={course.average_rating || 0}
              precision={0.1}
              size="small"
              readOnly
              icon={<StarIcon fontSize="inherit" />}
              emptyIcon={<StarBorderIcon fontSize="inherit" />}
            />
            <Typography variant="caption" color="text.secondary">
              {/* FIX: Changed totalReviews to total_reviews */}
              ({course.total_reviews || 0})
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TimeIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {course.language || 'English'}
            </Typography>
          </Box>
        </Box>

        {/* Price and Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
          <Typography
            variant="h6"
            color="primary"
            sx={{ fontWeight: 700 }}
          >
            {getFormattedPrice()}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.(course.id);
              }}
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              <CartIcon fontSize="small" />
            </IconButton>
            
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails?.(course.id);
              }}
              sx={{
                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                color: 'secondary.main',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                },
              }}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderFeaturedCard = () => (
    <Card
      className={`group cursor-pointer ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onViewDetails?.(course.id)}
      sx={{
        height: '100%',
        borderRadius: '20px',
        overflow: 'hidden',
        background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: `0 25px 50px ${alpha(theme.palette.primary.main, 0.15)}, 0 15px 25px ${alpha(theme.palette.common.black, 0.1)}`,
          borderColor: 'primary.main',
        },
      }}
    >
      {/* Featured Badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 2,
        }}
      >
        <Chip
          label="Featured"
          size="small"
          sx={{
            background: 'linear-gradient(135deg, #d946ef 0%, #c026d3 100%)',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />
      </Box>

      {/* Rest of the featured card content similar to compact but with enhanced styling */}
      <Box sx={{ position: 'relative', paddingTop: '60%', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          // FIX: Changed thumbnailUrl to thumbnail_url
          image={course.thumbnail_url || '/api/placeholder/400/240'}
          alt={course.title}
          onLoad={() => setImageLoaded(true)}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
            opacity: imageLoaded ? 1 : 0,
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          <Zoom in={hovered}>
            <IconButton
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                width: 56,
                height: 56,
                '&:hover': {
                  transform: 'scale(1.2)',
                  backgroundColor: 'white',
                },
              }}
            >
              <PlayIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Zoom>
        </Box>
      </Box>

      <CardContent sx={{ p: 4 }}>
        <Typography
          variant="h5"
          component="h3"
          sx={{
            fontWeight: 700,
            lineHeight: 1.2,
            mb: 2,
            background: 'linear-gradient(135deg, #1e293b 0%, #0ea5e9 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {course.title}
        </Typography>
        
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3, lineHeight: 1.6 }}
        >
          {course.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {getFormattedPrice()}
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            startIcon={<CartIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(course.id);
            }}
            sx={{
              borderRadius: '12px',
              px: 3,
              py: 1.5,
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Enroll Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  // Return appropriate variant
  switch (variant) {
    case 'featured':
      return renderFeaturedCard();
    case 'compact':
    default:
      return renderCompactCard();
  }
};

export default CourseCard;