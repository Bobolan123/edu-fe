'use client';

import { Box, Typography, Button, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material";
import theme from "./[locale]/theme";
import { Roboto } from "next/font/google";
import { useEffect, useState } from 'react';
import "./globals.css";

const roboto = Roboto({
    weight: ["100", "300", "400", "500", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
    display: "swap",
});

const translations = {
    en: {
        title: 'Server Error',
        description: 'Something went wrong on our end. Please try refreshing the page or contact support if the problem persists.',
        tryAgain: 'Try Again',
        backHome: 'Back to Home'
    },
    vi: {
        title: 'Lỗi Máy Chủ',
        description: 'Đã có lỗi xảy ra từ phía chúng tôi. Vui lòng thử tải lại trang hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.',
        tryAgain: 'Thử Lại',
        backHome: 'Về Trang Chủ'
    }
};

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [locale, setLocale] = useState<'en' | 'vi'>('en');

    useEffect(() => {
        // Detect locale from URL or browser language
        const pathLocale = window.location.pathname?.startsWith('/vi') ? 'vi' : 
                          window.location.pathname?.startsWith('/en') ? 'en' : 
                          navigator.language?.startsWith('vi') ? 'vi' : 'en';
        setLocale(pathLocale as 'en' | 'vi');
    }, []);

    const t = translations[locale];
    return (
        <html className={roboto.className}>
            <body style={{ margin: 0 }}>
                <AppRouterCacheProvider>
                    <ThemeProvider theme={theme}>
                        <Container maxWidth="md">
                            <Box
                                sx={{
                                    marginTop: 10,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: '60vh',
                                    textAlign: 'center',
                                    gap: 3,
                                }}
                            >
                                <ErrorOutlineIcon 
                                    sx={{ 
                                        fontSize: 120, 
                                        color: '#d32f2f',
                                        opacity: 0.7
                                    }} 
                                />
                                
                                <Typography 
                                    variant="h1" 
                                    sx={{ 
                                        fontSize: { xs: '4rem', md: '6rem' },
                                        fontWeight: 'bold',
                                        color: '#d32f2f'
                                    }}
                                >
                                    500
                                </Typography>
                                
                                <Typography 
                                    variant="h4" 
                                    component="h2"
                                    sx={{ 
                                        fontSize: { xs: '1.5rem', md: '2rem' },
                                        fontWeight: 'medium',
                                        mb: 1
                                    }}
                                >
                                    {t.title}
                                </Typography>
                                
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        color: 'text.secondary',
                                        maxWidth: 400,
                                        mb: 2
                                    }}
                                >
                                    {t.description}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                                    <Button
                                        onClick={() => reset()}
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            borderRadius: 2,
                                            px: 4,
                                            py: 1.5,
                                            textTransform: 'none',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        {t.tryAgain}
                                    </Button>
                                    
                                    <Button
                                        onClick={() => window.location.href = '/'}
                                        variant="outlined"
                                        size="large"
                                        sx={{
                                            borderRadius: 2,
                                            px: 4,
                                            py: 1.5,
                                            textTransform: 'none',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        {t.backHome}
                                    </Button>
                                </Box>
                            </Box>
                        </Container>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}