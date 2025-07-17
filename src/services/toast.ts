import { toast, ToastOptions, ToastPosition } from 'react-toastify';

// Centralized toast configuration
const defaultToastOptions: ToastOptions = {
  position: "top-right" as ToastPosition,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
  style: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontSize: '14px',
  },
};

// Enhanced toast service with consistent options
export const toastService = {
  success: (message: string, options?: Partial<ToastOptions>) => {
    return toast.success(message, {
      ...defaultToastOptions,
      ...options,
    });
  },

  error: (message: string, options?: Partial<ToastOptions>) => {
    return toast.error(message, {
      ...defaultToastOptions,
      autoClose: 5000, // Errors show longer
      ...options,
    });
  },

  warning: (message: string, options?: Partial<ToastOptions>) => {
    return toast.warning(message, {
      ...defaultToastOptions,
      autoClose: 4000,
      ...options,
    });
  },

  info: (message: string, options?: Partial<ToastOptions>) => {
    return toast.info(message, {
      ...defaultToastOptions,
      ...options,
    });
  },

  loading: (message: string = "Loading...", options?: Partial<ToastOptions>) => {
    return toast.loading(message, {
      ...defaultToastOptions,
      autoClose: false,
      closeOnClick: false,
      ...options,
    });
  },

  update: (toastId: string | number, type: 'success' | 'error' | 'warning' | 'info', message: string, options?: Partial<ToastOptions>) => {
    const updateOptions = {
      ...defaultToastOptions,
      render: message,
      type,
      isLoading: false,
      autoClose: type === 'error' ? 5000 : 3000,
      ...options,
    };
    
    return toast.update(toastId, updateOptions);
  },

  dismiss: (toastId?: string | number) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },

  promise: <T>(
    promise: Promise<T>,
    messages: {
      pending: string;
      success: string;
      error: string;
    },
    options?: Partial<ToastOptions>
  ) => {
    return toast.promise(promise, messages, {
      ...defaultToastOptions,
      ...options,
    });
  },
};

// Utility functions for common scenarios
export const toastUtils = {
  // For API calls with loading state
  async handleAsyncOperation<T>(
    operation: () => Promise<T>,
    messages: {
      loading: string;
      success: string;
      error?: string;
    }
  ): Promise<T> {
    const toastId = toastService.loading(messages.loading);
    
    try {
      const result = await operation();
      toastService.update(toastId, 'success', messages.success);
      return result;
    } catch (error) {
      const errorMessage = messages.error || (error instanceof Error ? error.message : 'An error occurred');
      toastService.update(toastId, 'error', errorMessage);
      throw error;
    }
  },

  // For form validation errors
  showValidationErrors: (errors: Record<string, string>) => {
    Object.entries(errors).forEach(([field, message]) => {
      toastService.error(`${field}: ${message}`);
    });
  },

  // For network errors
  showNetworkError: () => {
    toastService.error('Network error. Please check your connection and try again.');
  },

  // For authentication errors
  showAuthError: () => {
    toastService.error('Session expired. Please log in again.');
  },
};

export default toastService;