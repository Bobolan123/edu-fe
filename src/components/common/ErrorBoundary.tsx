'use client';

import React, { Component, ReactNode } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Alert,
  AlertTitle,
  Collapse,
} from '@mui/material';
import {
  ErrorOutline as ErrorIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  BugReport as BugReportIcon,
} from '@mui/icons-material';

interface ErrorInfo {
  componentStack: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
  showReportButton?: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Here you could also send error to logging service
    // Example: logErrorToService(error, errorInfo);
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        showDetails: false,
        retryCount: prevState.retryCount + 1,
      }));
    } else {
      // Max retries reached, reload the page
      window.location.reload();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails,
    }));
  };

  handleReportError = () => {
    const { error, errorInfo } = this.state;
    
    // Create error report
    const errorReport = {
      message: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace',
      componentStack: errorInfo?.componentStack || 'No component stack',
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };

    // Copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
      .then(() => {
        alert('Error report copied to clipboard. Please send this to support.');
      })
      .catch(() => {
        console.error('Failed to copy error report');
      });
  };

  render() {
    const { hasError, error, errorInfo, showDetails, retryCount } = this.state;
    const { children, fallback, maxRetries = 3 } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <Container maxWidth="md" className="min-h-screen flex items-center justify-center">
          <Paper elevation={3} className="p-8 max-w-2xl w-full">
            <Box className="text-center mb-6">
              <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Typography variant="h4" color="error" gutterBottom>
                Oops! Something went wrong
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                We're sorry, but something unexpected happened. This error has been logged 
                and we're working to fix it.
              </Typography>
            </Box>

            <Alert severity="error" className="mb-4">
              <AlertTitle>Error Details</AlertTitle>
              <Typography variant="body2" className="font-mono">
                {error?.message || 'An unknown error occurred'}
              </Typography>
            </Alert>

            <Box className="flex flex-col gap-3 mb-4">
              <Box className="flex gap-2 justify-center flex-wrap">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleRetry}
                  startIcon={<RefreshIcon />}
                  disabled={retryCount >= maxRetries}
                >
                  {retryCount >= maxRetries ? 'Max Retries Reached' : `Try Again (${retryCount}/${maxRetries})`}
                </Button>

                <Button
                  variant="outlined"
                  onClick={this.handleReload}
                  startIcon={<RefreshIcon />}
                >
                  Reload Page
                </Button>

                {this.props.showReportButton !== false && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={this.handleReportError}
                    startIcon={<BugReportIcon />}
                  >
                    Report Error
                  </Button>
                )}
              </Box>

              <Button
                variant="text"
                size="small"
                onClick={this.toggleDetails}
                startIcon={showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                className="self-center"
              >
                {showDetails ? 'Hide' : 'Show'} Technical Details
              </Button>
            </Box>

            <Collapse in={showDetails}>
              <Alert severity="info" className="text-left">
                <AlertTitle>Technical Information</AlertTitle>
                <Box className="mt-2">
                  <Typography variant="subtitle2" gutterBottom>
                    Error Stack:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    component="pre" 
                    className="text-xs font-mono bg-gray-100 p-2 rounded max-h-32 overflow-auto whitespace-pre-wrap"
                  >
                    {error?.stack || 'No stack trace available'}
                  </Typography>
                  
                  {errorInfo?.componentStack && (
                    <>
                      <Typography variant="subtitle2" gutterBottom className="mt-3">
                        Component Stack:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        component="pre" 
                        className="text-xs font-mono bg-gray-100 p-2 rounded max-h-32 overflow-auto whitespace-pre-wrap"
                      >
                        {errorInfo.componentStack}
                      </Typography>
                    </>
                  )}
                </Box>
              </Alert>
            </Collapse>

            <Box className="text-center mt-6">
              <Typography variant="body2" color="text.secondary">
                If this problem persists, please contact our support team.
              </Typography>
            </Box>
          </Paper>
        </Container>
      );
    }

    return children;
  }
}

// HOC for easy wrapping of components
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Simple error boundary for smaller components
export const SimpleErrorBoundary: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({
  children,
  fallback,
}) => (
  <ErrorBoundary
    fallback={
      fallback || (
        <Alert severity="error" className="m-4">
          <AlertTitle>Something went wrong</AlertTitle>
          This component failed to load. Please try refreshing the page.
        </Alert>
      )
    }
  >
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary;