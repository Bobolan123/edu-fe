import React from 'react';
import {
  CircularProgress,
  Box,
  Typography,
  Skeleton,
  Card,
  CardContent,
  Button,
  Backdrop,
  Container,
  Paper,
  Fade,
  Zoom,
  alpha,
  useTheme,
  keyframes,
} from '@mui/material';
import {
  CloudOff as CloudOffIcon,
  Search as SearchIcon,
  School as SchoolIcon,
  MenuBook as BookOpenIcon,
  Coffee as CoffeeIcon,
} from '@mui/icons-material';

// Enhanced animations
const pulse = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
  40%, 43% { transform: translate3d(0, -8px, 0); }
  70% { transform: translate3d(0, -4px, 0); }
  90% { transform: translate3d(0, -1px, 0); }
`;

// Enhanced loading spinner
interface LoadingSpinnerProps {
  size?: number | string;
  color?: 'primary' | 'secondary' | 'inherit';
  thickness?: number;
  variant?: 'default' | 'gradient' | 'pulsing';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color = 'primary',
  thickness = 3.6,
  variant = 'default',
}) => {
  const theme = useTheme();

  if (variant === 'gradient') {
    return (
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
          width: size,
          height: size,
        }}
      >
        <CircularProgress
          size={size}
          thickness={thickness}
          sx={{
            position: 'absolute',
            color: alpha(theme.palette.primary.main, 0.2),
          }}
          variant="determinate"
          value={100}
        />
        <CircularProgress
          size={size}
          thickness={thickness}
          sx={{
            color: theme.palette.primary.main,
            animation: `${pulse} 1.5s ease-in-out infinite`,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
      </Box>
    );
  }

  if (variant === 'pulsing') {
    return (
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
          animation: `${pulse} 2s ease-in-out infinite`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '60%',
            height: '60%',
            borderRadius: '50%',
            backgroundColor: 'white',
          }}
        />
      </Box>
    );
  }

  return <CircularProgress size={size} color={color} thickness={thickness} />;
};

// Loading with text
interface LoadingWithTextProps {
  message?: string;
  size?: number | string;
  color?: 'primary' | 'secondary' | 'inherit';
}

export const LoadingWithText: React.FC<LoadingWithTextProps> = ({
  message = 'Loading...',
  size = 40,
  color = 'primary',
}) => (
  <Box 
    display="flex" 
    flexDirection="column" 
    alignItems="center" 
    gap={2}
    className="py-8"
  >
    <LoadingSpinner size={size} color={color} />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

// Full page loading overlay
interface LoadingOverlayProps {
  open: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  open,
  message = 'Loading...',
}) => (
  <Backdrop
    sx={{
      color: '#fff',
      zIndex: (theme) => theme.zIndex.drawer + 1,
      flexDirection: 'column',
      gap: 2,
    }}
    open={open}
  >
    <LoadingSpinner size={60} color="inherit" />
    <Typography variant="h6">{message}</Typography>
  </Backdrop>
);

// Loading button with integrated spinner
interface LoadingButtonProps {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
  sx?: any;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  children,
  loadingText,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  startIcon,
  endIcon,
  className,
  sx,
}) => (
  <Button
    variant={variant}
    color={color}
    size={size}
    fullWidth={fullWidth}
    disabled={disabled || loading}
    onClick={onClick}
    type={type}
    startIcon={loading ? <LoadingSpinner size={16} color="inherit" /> : startIcon}
    endIcon={!loading ? endIcon : undefined}
    className={className}
    sx={{
      minHeight: size === 'small' ? 32 : size === 'large' ? 48 : 40,
      ...sx,
    }}
  >
    {loading ? (loadingText || 'Loading...') : children}
  </Button>
);

// Enhanced skeleton loaders
export const CardSkeleton: React.FC<{ variant?: 'default' | 'course' | 'modern' }> = ({ 
  variant = 'default' 
}) => {
  const theme = useTheme();

  if (variant === 'course') {
    return (
      <Card
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Skeleton
          variant="rectangular"
          height={200}
          sx={{
            background: `linear-gradient(90deg, ${alpha(theme.palette.grey[300], 0.8)} 0%, ${alpha(theme.palette.grey[100], 0.8)} 50%, ${alpha(theme.palette.grey[300], 0.8)} 100%)`,
            '&::after': {
              animation: `${shimmer} 2s infinite`,
              background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.common.white, 0.4)}, transparent)`,
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            },
          }}
        />
        <CardContent sx={{ p: 3 }}>
          <Skeleton variant="text" height={28} sx={{ mb: 1.5, borderRadius: '8px' }} />
          <Skeleton variant="text" height={20} width="80%" sx={{ mb: 1, borderRadius: '4px' }} />
          <Skeleton variant="text" height={20} width="60%" sx={{ mb: 3, borderRadius: '4px' }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1.5 }} />
            <Skeleton variant="text" height={16} width="40%" sx={{ borderRadius: '4px' }} />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Skeleton variant="text" height={24} width="30%" sx={{ borderRadius: '6px' }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'modern') {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          background: 'background.paper',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Skeleton
            variant="rectangular"
            height={240}
            sx={{
              background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
            }}
          >
            <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: '12px' }} />
          </Box>
        </Box>
        <Box sx={{ p: 4 }}>
          <Skeleton variant="text" height={32} sx={{ mb: 2, borderRadius: '8px' }} />
          <Skeleton variant="text" height={20} width="90%" sx={{ mb: 1, borderRadius: '4px' }} />
          <Skeleton variant="text" height={20} width="70%" sx={{ mb: 4, borderRadius: '4px' }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Skeleton variant="text" height={40} width="30%" sx={{ borderRadius: '8px' }} />
            <Skeleton variant="rounded" width={120} height={48} sx={{ borderRadius: '12px' }} />
          </Box>
        </Box>
      </Paper>
    );
  }

  return (
    <Card sx={{ borderRadius: '16px' }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent>
        <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} width="60%" sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton variant="text" height={24} width="40%" />
          <Skeleton variant="text" height={20} width="30%" />
        </Box>
      </CardContent>
    </Card>
  );
};

export const CourseCardSkeleton: React.FC = () => (
  <Card className="w-full">
    <Skeleton variant="rectangular" height={180} />
    <CardContent>
      <Skeleton variant="text" height={28} sx={{ mb: 1 }} />
      <Skeleton variant="text" height={16} width="70%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={16} width="50%" sx={{ mb: 2 }} />
      <Box className="flex justify-between items-center">
        <Skeleton variant="text" height={24} width="40%" />
        <Skeleton variant="rectangular" height={20} width={60} />
      </Box>
    </CardContent>
  </Card>
);

export const TableRowSkeleton: React.FC<{ columns: number }> = ({ columns }) => (
  <tr>
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="p-4">
        <Skeleton variant="text" height={20} />
      </td>
    ))}
  </tr>
);

export const ListItemSkeleton: React.FC = () => (
  <Box className="flex items-center gap-3 p-3">
    <Skeleton variant="circular" width={40} height={40} />
    <Box className="flex-1">
      <Skeleton variant="text" height={20} width="80%" />
      <Skeleton variant="text" height={16} width="60%" />
    </Box>
  </Box>
);

// Progress bar component
interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  size?: 'small' | 'medium' | 'large';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'primary',
  size = 'medium',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const height = size === 'small' ? 4 : size === 'large' ? 12 : 8;

  return (
    <Box className="w-full">
      {(label || showPercentage) && (
        <Box className="flex justify-between items-center mb-1">
          {label && (
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
          )}
          {showPercentage && (
            <Typography variant="body2" color="text.secondary">
              {Math.round(percentage)}%
            </Typography>
          )}
        </Box>
      )}
      <Box
        sx={{
          width: '100%',
          height,
          backgroundColor: 'grey.300',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: `${color}.main`,
            transition: 'width 0.3s ease-in-out',
          }}
        />
      </Box>
    </Box>
  );
};

// Loading states hook
export const useLoadingState = (initialState = false) => {
  const [loading, setLoading] = React.useState(initialState);

  const withLoading = React.useCallback(async <T,>(
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    setLoading(true);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    setLoading,
    withLoading,
  };
};

// Enhanced Empty State Component
interface EmptyStateProps {
  title: string;
  message: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'default' | 'search' | 'courses' | 'error' | 'offline';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  action,
  icon,
  variant = 'default',
  className,
}) => {
  const theme = useTheme();

  const getVariantIcon = () => {
    switch (variant) {
      case 'search':
        return <SearchIcon sx={{ fontSize: 80, color: 'text.disabled' }} />;
      case 'courses':
        return <SchoolIcon sx={{ fontSize: 80, color: 'text.disabled' }} />;
      case 'error':
        return <CloudOffIcon sx={{ fontSize: 80, color: 'error.light' }} />;
      case 'offline':
        return <CloudOffIcon sx={{ fontSize: 80, color: 'warning.light' }} />;
      default:
        return <BookOpenIcon sx={{ fontSize: 80, color: 'text.disabled' }} />;
    }
  };

  const getVariantColors = () => {
    switch (variant) {
      case 'error':
        return {
          background: alpha(theme.palette.error.main, 0.02),
          border: alpha(theme.palette.error.main, 0.1),
          iconBg: alpha(theme.palette.error.main, 0.1),
        };
      case 'search':
        return {
          background: alpha(theme.palette.info.main, 0.02),
          border: alpha(theme.palette.info.main, 0.1),
          iconBg: alpha(theme.palette.info.main, 0.1),
        };
      case 'courses':
        return {
          background: alpha(theme.palette.primary.main, 0.02),
          border: alpha(theme.palette.primary.main, 0.1),
          iconBg: alpha(theme.palette.primary.main, 0.1),
        };
      default:
        return {
          background: alpha(theme.palette.grey[500], 0.02),
          border: alpha(theme.palette.grey[500], 0.1),
          iconBg: alpha(theme.palette.grey[500], 0.1),
        };
    }
  };

  const colors = getVariantColors();

  return (
    <Container maxWidth="sm" className={className}>
      <Fade in timeout={600}>
        <Paper
          elevation={0}
          sx={{
            textAlign: 'center',
            py: 8,
            px: 4,
            borderRadius: '24px',
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Zoom in timeout={800} style={{ transitionDelay: '200ms' }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                backgroundColor: colors.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto',
                animation: `${pulse} 3s ease-in-out infinite`,
              }}
            >
              {icon || getVariantIcon()}
            </Box>
          </Zoom>

          <Fade in timeout={600} style={{ transitionDelay: '400ms' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: 'text.primary',
                background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.text.secondary} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {title}
            </Typography>
          </Fade>

          <Fade in timeout={600} style={{ transitionDelay: '600ms' }}>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 4,
                lineHeight: 1.6,
                maxWidth: '400px',
                margin: '0 auto 32px auto',
              }}
            >
              {message}
            </Typography>
          </Fade>

          {action && (
            <Zoom in timeout={600} style={{ transitionDelay: '800ms' }}>
              <Box>{action}</Box>
            </Zoom>
          )}
        </Paper>
      </Fade>
    </Container>
  );
};

// Specialized empty states for e-learning
export const NoCoursesFound: React.FC<{ onCreateCourse?: () => void }> = ({ onCreateCourse }) => (
  <EmptyState
    variant="courses"
    title="No Courses Found"
    message="Start your learning journey by exploring our course catalog or create your first course to share knowledge with others."
    action={
      onCreateCourse && (
        <Button
          variant="contained"
          size="large"
          startIcon={<SchoolIcon />}
          onClick={onCreateCourse}
          sx={{
            borderRadius: '12px',
            px: 4,
            py: 1.5,
          }}
        >
          Create Your First Course
        </Button>
      )
    }
  />
);

export const SearchNoResults: React.FC<{ searchTerm: string; onClearSearch?: () => void }> = ({ 
  searchTerm, 
  onClearSearch 
}) => (
  <EmptyState
    variant="search"
    title="No Results Found"
    message={`We couldn't find any courses matching "${searchTerm}". Try adjusting your search terms or browse our course categories.`}
    action={
      onClearSearch && (
        <Button
          variant="outlined"
          size="large"
          onClick={onClearSearch}
          sx={{
            borderRadius: '12px',
            px: 4,
            py: 1.5,
          }}
        >
          Clear Search
        </Button>
      )
    }
  />
);

export const OfflineState: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <EmptyState
    variant="offline"
    title="You're Offline"
    message="Check your internet connection and try again. Your learning progress is saved locally and will sync when you're back online."
    action={
      onRetry && (
        <Button
          variant="contained"
          size="large"
          onClick={onRetry}
          sx={{
            borderRadius: '12px',
            px: 4,
            py: 1.5,
          }}
        >
          Try Again
        </Button>
      )
    }
  />
);