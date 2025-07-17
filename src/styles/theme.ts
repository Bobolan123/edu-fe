import { createTheme, ThemeOptions } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// Enhanced color palette for e-learning platform
const palette = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main primary
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    main: '#0ea5e9',
    light: '#38bdf8',
    dark: '#0369a1',
    contrastText: '#ffffff',
  },
  secondary: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef', // Main secondary
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
    main: '#d946ef',
    light: '#e879f9',
    dark: '#a21caf',
    contrastText: '#ffffff',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    main: '#22c55e',
    light: '#4ade80',
    dark: '#15803d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#b45309',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    main: '#ef4444',
    light: '#f87171',
    dark: '#b91c1c',
  },
  info: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    main: '#0ea5e9',
    light: '#38bdf8',
    dark: '#0369a1',
  },
  grey: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  background: {
    default: '#fafbfc',
    paper: '#ffffff',
    neutral: '#f8fafc',
    elevated: '#ffffff',
  },
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    disabled: '#94a3b8',
  },
  divider: '#e2e8f0',
};

// Enhanced typography system
const typography = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  h1: {
    fontSize: '3.5rem',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-0.025em',
  },
  h2: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.025em',
  },
  h3: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.025em',
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '-0.01em',
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '-0.01em',
  },
  h6: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '-0.01em',
  },
  subtitle1: {
    fontSize: '1.125rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  subtitle2: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.025em',
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0.025em',
    textTransform: 'none' as const,
  },
};

// Enhanced component overrides
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        textTransform: 'none' as const,
        fontWeight: 600,
        padding: '10px 24px',
        boxShadow: 'none',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      },
      contained: {
        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        '&:hover': {
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          boxShadow: '0 8px 25px rgba(14, 165, 233, 0.3)',
        },
      },
      outlined: {
        borderWidth: '2px',
        '&:hover': {
          borderWidth: '2px',
          backgroundColor: alpha('#0ea5e9', 0.04),
        },
      },
      text: {
        '&:hover': {
          backgroundColor: alpha('#0ea5e9', 0.04),
        },
      },
      sizeLarge: {
        padding: '12px 32px',
        fontSize: '1rem',
      },
      sizeSmall: {
        padding: '6px 16px',
        fontSize: '0.75rem',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
          transform: 'translateY(-2px)',
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          backgroundColor: '#fafbfc',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: '#f8fafc',
          },
          '&.Mui-focused': {
            backgroundColor: '#ffffff',
            boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.1)',
          },
          '& fieldset': {
            borderColor: '#e2e8f0',
            borderWidth: '2px',
          },
          '&:hover fieldset': {
            borderColor: '#cbd5e1',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#0ea5e9',
            borderWidth: '2px',
          },
        },
        '& .MuiInputLabel-root': {
          fontWeight: 500,
          color: '#64748b',
          '&.Mui-focused': {
            color: '#0ea5e9',
            fontWeight: 600,
          },
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        fontWeight: 500,
        fontSize: '0.75rem',
        height: '28px',
      },
      filled: {
        backgroundColor: alpha('#0ea5e9', 0.1),
        color: '#0369a1',
        '&:hover': {
          backgroundColor: alpha('#0ea5e9', 0.15),
        },
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        border: '1px solid',
        '&.MuiAlert-standardSuccess': {
          backgroundColor: alpha('#22c55e', 0.1),
          borderColor: alpha('#22c55e', 0.2),
          color: '#15803d',
        },
        '&.MuiAlert-standardError': {
          backgroundColor: alpha('#ef4444', 0.1),
          borderColor: alpha('#ef4444', 0.2),
          color: '#b91c1c',
        },
        '&.MuiAlert-standardWarning': {
          backgroundColor: alpha('#f59e0b', 0.1),
          borderColor: alpha('#f59e0b', 0.2),
          color: '#b45309',
        },
        '&.MuiAlert-standardInfo': {
          backgroundColor: alpha('#0ea5e9', 0.1),
          borderColor: alpha('#0ea5e9', 0.2),
          color: '#0369a1',
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      elevation1: {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      elevation2: {
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      elevation3: {
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: {
        '& .MuiTabs-indicator': {
          height: '3px',
          borderRadius: '3px',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        },
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none' as const,
        fontWeight: 600,
        fontSize: '0.875rem',
        minHeight: '48px',
        borderRadius: '8px 8px 0 0',
        '&.Mui-selected': {
          color: '#0ea5e9',
        },
      },
    },
  },
  MuiFormControlLabel: {
    styleOverrides: {
      root: {
        marginLeft: '0',
        marginRight: '16px',
        '& .MuiFormControlLabel-label': {
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#1e293b',
        },
      },
    },
  },
  MuiRadio: {
    styleOverrides: {
      root: {
        color: '#cbd5e1',
        '&.Mui-checked': {
          color: '#0ea5e9',
        },
      },
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      root: {
        color: '#cbd5e1',
        '&.Mui-checked': {
          color: '#0ea5e9',
        },
      },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      root: {
        '& .MuiSwitch-switchBase.Mui-checked': {
          color: '#0ea5e9',
          '& + .MuiSwitch-track': {
            backgroundColor: '#0ea5e9',
          },
        },
      },
    },
  },
};

// Enhanced shadows
const shadows = [
  'none',
  '0 1px 2px rgba(0, 0, 0, 0.05)',
  '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.06)',
  '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
  '0 25px 50px rgba(0, 0, 0, 0.15), 0 12px 18px rgba(0, 0, 0, 0.1)',
  '0 35px 60px rgba(0, 0, 0, 0.2), 0 15px 25px rgba(0, 0, 0, 0.15)',
  '0 45px 70px rgba(0, 0, 0, 0.25), 0 20px 30px rgba(0, 0, 0, 0.2)',
  '0 50px 80px rgba(0, 0, 0, 0.3), 0 25px 35px rgba(0, 0, 0, 0.25)',
  // Additional shadows for elevation levels 10-24
  ...Array(15).fill('0 50px 80px rgba(0, 0, 0, 0.3), 0 25px 35px rgba(0, 0, 0, 0.25)'),
] as const;

// Enhanced spacing
const spacing = (factor: number) => `${0.25 * factor}rem`;

// Enhanced shape
const shape = {
  borderRadius: 12,
};

// Create the enhanced theme
export const theme = createTheme({
  palette,
  typography,
  components,
  shadows,
  spacing,
  shape,
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
} as ThemeOptions);

// Export additional design tokens
export const designTokens = {
  // Animation
  animation: {
    easing: {
      easeOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    duration: {
      shortest: '150ms',
      shorter: '200ms',
      short: '250ms',
      standard: '300ms',
      complex: '375ms',
      enteringScreen: '225ms',
      leavingScreen: '195ms',
    },
  },
  // Layout
  layout: {
    maxWidth: '1280px',
    sidebarWidth: '280px',
    headerHeight: '72px',
    footerHeight: '320px',
  },
  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    secondary: 'linear-gradient(135deg, #d946ef 0%, #c026d3 100%)',
    success: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    card: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
  },
  // Blur effects
  blur: {
    sm: 'blur(4px)',
    md: 'blur(8px)',
    lg: 'blur(16px)',
    xl: 'blur(24px)',
  },
};

export default theme;