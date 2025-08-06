'use client';

import { Box, Typography, Button, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const translations = {
    en: {
        title: 'Page Not Found',
        description: "Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.",
        backHome: 'Back to Home'
    },
    vi: {
        title: 'Không Tìm Thấy Trang',
        description: 'Xin lỗi, trang bạn đang tìm kiếm không tồn tại. Có thể nó đã được di chuyển, xóa hoặc bạn đã nhập sai URL.',
        backHome: 'Về Trang Chủ'
    }
};

export default function NotFound() {
    const router = useRouter();
    const pathname = usePathname();
    const [locale, setLocale] = useState<'en' | 'vi'>('en');

    useEffect(() => {
        // Detect locale from pathname or browser language
        const pathLocale = pathname?.startsWith('/vi') ? 'vi' : 
                          pathname?.startsWith('/en') ? 'en' : 
                          navigator.language?.startsWith('vi') ? 'vi' : 'en';
        setLocale(pathLocale as 'en' | 'vi');
    }, [pathname]);

    const t = translations[locale];

    return (
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
                        color: '#1976d2',
                        opacity: 0.7
                    }} 
                />
                
                <Typography 
                    variant="h1" 
                    sx={{ 
                        fontSize: { xs: '4rem', md: '6rem' },
                        fontWeight: 'bold',
                        color: '#1976d2'
                    }}
                >
                    404
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
                
                <Button
                    onClick={() => router.push('/')}
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
                    {t.backHome}
                </Button>
            </Box>
        </Container>
    );
}