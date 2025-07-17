import React, { useState } from 'react';
import {
  Alert,
  AlertTitle,
  Collapse,
  IconButton,
  Snackbar,
  Box,
  Typography,
  Button,
  Paper,
  Fade,
  Slide,
  AlertColor,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

// Enhanced Alert Component with more features
interface EnhancedAlertProps {
  severity: AlertColor;
  title?: string;
  message: string;
  details?: string;
  onClose?: () => void;
  actions?: React.ReactNode;
  collapsible?: boolean;
  persistent?: boolean;
  className?: string;
}

export const EnhancedAlert: React.FC<EnhancedAlertProps> = ({
  severity,
  title,
  message,
  details,
  onClose,
  actions,
  collapsible = false,
  persistent = false,
  className,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Alert
      severity={severity}
      onClose={!persistent ? onClose : undefined}
      className={className}
      action={
        <Box className="flex items-center gap-1">
          {collapsible && details && (
            <IconButton
              size="small"
              onClick={handleToggleExpanded}
              aria-label={expanded ? 'Collapse details' : 'Expand details'}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
          {actions}
          {persistent && onClose && (
            <IconButton size="small" onClick={onClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      }
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      <Typography variant="body2">{message}</Typography>
      
      {collapsible && details && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">
              {details}
            </Typography>
          </Box>
        </Collapse>
      )}
    </Alert>
  );
};

// Notification Banner Component
interface NotificationBannerProps {
  open: boolean;
  severity: AlertColor;
  title?: string;
  message: string;
  onClose?: () => void;
  autoHideDuration?: number;
  position?: 'top' | 'bottom';
  persistent?: boolean;
  action?: React.ReactNode;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  open,
  severity,
  title,
  message,
  onClose,
  autoHideDuration = 6000,
  position = 'top',
  persistent = false,
  action,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={!persistent ? autoHideDuration : null}
      onClose={onClose}
      anchorOrigin={{
        vertical: position,
        horizontal: 'center',
      }}
      TransitionComponent={Slide}
      TransitionProps={{
        direction: position === 'top' ? 'down' : 'up',
      } as any}
    >
      <Alert
        severity={severity}
        onClose={onClose}
        action={action}
        sx={{ minWidth: 300, maxWidth: 600 }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
};

// Inline Message Component
interface InlineMessageProps {
  severity: AlertColor;
  message: string;
  show: boolean;
  className?: string;
}

export const InlineMessage: React.FC<InlineMessageProps> = ({
  severity,
  message,
  show,
  className,
}) => {
  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <SuccessIcon fontSize="small" />;
      case 'error':
        return <ErrorIcon fontSize="small" />;
      case 'warning':
        return <WarningIcon fontSize="small" />;
      case 'info':
        return <InfoIcon fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  const getColor = () => {
    switch (severity) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-orange-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Fade in={show}>
      <Box className={`flex items-center gap-2 mt-2 ${className}`}>
        <span className={getColor()}>{getIcon()}</span>
        <Typography variant="body2" className={getColor()}>
          {message}
        </Typography>
      </Box>
    </Fade>
  );
};

// Status Card Component
interface StatusCardProps {
  status: 'loading' | 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  action?: React.ReactNode;
  onRetry?: () => void;
  className?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  status,
  title,
  message,
  action,
  onRetry,
  className,
}) => {
  const getSeverity = (): AlertColor => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'loading':
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  return (
    <Paper elevation={1} className={`p-4 ${className}`}>
      <Alert severity={getSeverity()} variant="outlined">
        <AlertTitle>{title}</AlertTitle>
        <Typography variant="body2" sx={{ mb: action || onRetry ? 2 : 0 }}>
          {message}
        </Typography>
        
        {(action || onRetry) && (
          <Box className="flex gap-2">
            {onRetry && (
              <Button
                size="small"
                variant="outlined"
                onClick={onRetry}
                color={status === 'error' ? 'error' : 'primary'}
              >
                Try Again
              </Button>
            )}
            {action}
          </Box>
        )}
      </Alert>
    </Paper>
  );
};

// Error State Component
interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  showImage?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  retryText = 'Try Again',
  showImage = true,
  className,
}) => {
  return (
    <Box className={`text-center py-8 ${className}`}>
      {showImage && (
        <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
      )}
      <Typography variant="h6" color="error" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {message}
      </Typography>
      {onRetry && (
        <Button
          variant="contained"
          color="error"
          onClick={onRetry}
          startIcon={<ErrorIcon />}
        >
          {retryText}
        </Button>
      )}
    </Box>
  );
};

// Empty State Component
interface EmptyStateProps {
  title: string;
  message: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  action,
  icon,
  className,
}) => {
  return (
    <Box className={`text-center py-12 ${className}`}>
      {icon && <Box className="mb-4">{icon}</Box>}
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {message}
      </Typography>
      {action && <Box className="mt-4">{action}</Box>}
    </Box>
  );
};

// Custom hooks for managing alert states
export const useAlert = () => {
  const [alert, setAlert] = useState<{
    open: boolean;
    severity: AlertColor;
    title?: string;
    message: string;
  }>({
    open: false,
    severity: 'info',
    message: '',
  });

  const showAlert = (
    severity: AlertColor,
    message: string,
    title?: string
  ) => {
    setAlert({
      open: true,
      severity,
      title,
      message,
    });
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  return {
    alert,
    showAlert,
    hideAlert,
    showSuccess: (message: string, title?: string) => showAlert('success', message, title),
    showError: (message: string, title?: string) => showAlert('error', message, title),
    showWarning: (message: string, title?: string) => showAlert('warning', message, title),
    showInfo: (message: string, title?: string) => showAlert('info', message, title),
  };
};

export const useNotification = () => {
  const [notification, setNotification] = useState<{
    open: boolean;
    severity: AlertColor;
    title?: string;
    message: string;
  }>({
    open: false,
    severity: 'info',
    message: '',
  });

  const showNotification = (
    severity: AlertColor,
    message: string,
    title?: string
  ) => {
    setNotification({
      open: true,
      severity,
      title,
      message,
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess: (message: string, title?: string) => showNotification('success', message, title),
    showError: (message: string, title?: string) => showNotification('error', message, title),
    showWarning: (message: string, title?: string) => showNotification('warning', message, title),
    showInfo: (message: string, title?: string) => showNotification('info', message, title),
  };
};