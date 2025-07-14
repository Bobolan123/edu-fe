import { Metadata } from 'next';
import { Container, Typography, Box, Button, Paper, Alert } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: 'Payment Failed - MindfulMaze',
  description: 'There was an issue processing your payment',
};

export default function PaymentFailedPage() {
  const t = useTranslations('Payment');
  
  return (
    <Container maxWidth="md" className="py-12">
      <Paper elevation={3} className="p-8 text-center">
        <Box className="flex flex-col items-center gap-6">
          <ErrorOutlineIcon 
            sx={{ 
              fontSize: 80, 
              color: '#f44336',
              animation: 'scaleIn 0.5s ease-out'
            }} 
          />
          
          <Typography variant="h4" component="h1" className="font-bold">
            {t('failed_title')}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" className="max-w-md">
            {t('failed_description')}
          </Typography>

          <Alert severity="error" className="w-full max-w-md">
            <Typography variant="body2">
              {t('common_reasons')}
            </Typography>
            <ul className="list-disc list-inside text-left mt-2">
              <li>{t('common_reasons_list.insufficient_funds')}</li>
              <li>{t('common_reasons_list.incorrect_details')}</li>
              <li>{t('common_reasons_list.bank_declined')}</li>
              <li>{t('common_reasons_list.network_issues')}</li>
            </ul>
          </Alert>

          <Box className="w-full max-w-md mt-8 p-6 bg-gray-50 rounded-lg">
            <Typography variant="h6" gutterBottom>
              {t('need_help_title')}
            </Typography>
            <Typography variant="body2" className="text-left">
              {t('need_help_description')}
            </Typography>
            <ul className="list-disc list-inside text-left space-y-2 mt-2">
              <li>{t('need_help_list.check_details')}</li>
              <li>{t('need_help_list.contact_bank')}</li>
              <li>{t('need_help_list.try_different')}</li>
              <li>{t('need_help_list.reach_support')}</li>
            </ul>
          </Box>

          <Box className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              href="/checkout"
              className="w-full sm:w-auto"
            >
              {t('try_again')}
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
              {t('support_contact', { 
                email: 'support@mindfulmaze.com', 
                phone: '+1 (234) 567-890' 
              })}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
} 