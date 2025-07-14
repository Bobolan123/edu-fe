import { Metadata } from 'next';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: 'Payment Successful - MindfulMaze',
  description: 'Your payment has been processed successfully',
};

export default function PaymentSuccessPage() {
  const t = useTranslations('Payment');
  
  return (
    <Container maxWidth="md" className="py-12">
      <Paper elevation={3} className="p-8 text-center">
        <Box className="flex flex-col items-center gap-6">
          <CheckCircleIcon 
            sx={{ 
              fontSize: 80, 
              color: '#4CAF50',
              animation: 'scaleIn 0.5s ease-out'
            }} 
          />
          
          <Typography variant="h4" component="h1" className="font-bold">
            {t('success_title')}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" className="max-w-md">
            {t('success_description')}
          </Typography>

          <Box className="w-full max-w-md mt-8 p-6 bg-green-50 rounded-lg">
            <Typography variant="h6" gutterBottom>
              {t('whats_next')}
            </Typography>
            <ul className="list-disc list-inside text-left space-y-2">
              <li>{t('whats_next_list.access_materials')}</li>
              <li>{t('whats_next_list.download_resources')}</li>
              <li>{t('whats_next_list.start_watching')}</li>
              <li>{t('whats_next_list.join_community')}</li>
            </ul>
          </Box>

          <Box className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              href="/my-learning"
              className="w-full sm:w-auto"
            >
              {t('go_to_learning')}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              component={Link}
              href="/"
              className="w-full sm:w-auto"
            >
              {t('back_to_home')}
            </Button>
          </Box>

          <Box className="mt-8 text-sm text-gray-500">
            <Typography variant="body2">
              {t('need_help', { email: 'support@mindfulmaze.com' })}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
} 