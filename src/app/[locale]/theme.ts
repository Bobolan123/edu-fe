"use client";
import { createTheme } from "@mui/material/styles"; 
  
const theme = createTheme({
    typography: {
        fontFamily: "Basis, Verdana, sans-serif, var(--font-roboto)",
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
            lineHeight: 1.2,
        },
        h2: {
            fontWeight: 600,
            fontSize: '2rem',
            lineHeight: 1.3,
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
            lineHeight: 1.3,
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.4,
        },
        h5: {
            fontWeight: 500,
            fontSize: '1.25rem',
            lineHeight: 1.4,
        },
        h6: {
            fontWeight: 500,
            fontSize: '1.125rem',
            lineHeight: 1.5,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
        },
    },
    palette: {
        primary: {
            main: '#0ea5e9',
            dark: '#0284c7',
            light: '#38bdf8',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#8b5cf6',
            dark: '#7c3aed',
            light: '#a78bfa',
            contrastText: '#ffffff',
        },
        error: {
            main: '#ef4444',
            dark: '#dc2626',
            light: '#f87171',
        },
        warning: {
            main: '#f59e0b',
            dark: '#d97706',
            light: '#fbbf24',
        },
        info: {
            main: '#06b6d4',
            dark: '#0891b2',
            light: '#22d3ee',
        },
        success: {
            main: '#10b981',
            dark: '#059669',
            light: '#34d399',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        text: {
            primary: '#1e293b',
            secondary: '#64748b',
        },
        divider: '#e2e8f0',
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
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: '8px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                    border: '1px solid #e2e8f0',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                    },
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: '#f8fafc',
                    '& .MuiTableCell-head': {
                        fontWeight: 600,
                        color: '#334155',
                    },
                },
            },
        },
    },
});

export default theme;
