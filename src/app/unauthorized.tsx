'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack
} from '@mui/material';
import {
  Lock as LockIcon,
  Home as HomeIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoToLogin = () => {
    router.push('/login');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 2,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        <Box sx={{ mb: 4 }}>
          <LockIcon
            sx={{
              fontSize: 80,
              color: 'error.main',
              mb: 2,
              opacity: 0.8
            }}
          />
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'error.main',
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            401
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 2
            }}
          >
            Access Denied
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              lineHeight: 1.6,
              fontSize: '1.1rem'
            }}
          >
            You don't have permission to access this area. This section is restricted to administrators only.
          </Typography>
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            sx={{
              py: 1.5,
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1BA9D3 90%)',
              }
            }}
          >
            Go Home
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<LoginIcon />}
            onClick={handleGoToLogin}
            sx={{
              py: 1.5,
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'primary.main',
                color: 'white',
              }
            }}
          >
            Sign In
          </Button>
        </Stack>

        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '0.9rem' }}
          >
            Need access? Please contact an administrator for assistance.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}