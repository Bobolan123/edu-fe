import { Metadata } from 'next';
import { Container, Typography, Box, Button, Paper, Alert } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Payment Failed - MindfulMaze',
  description: 'There was an issue processing your payment',
};

export default function PaymentFailedPage() {
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
            Payment Failed
          </Typography>
          
          <Typography variant="body1" color="text.secondary" className="max-w-md">
            We're sorry, but there was an issue processing your payment. 
            Please try again or contact our support team for assistance.
          </Typography>

          <Alert severity="error" className="w-full max-w-md">
            <Typography variant="body2">
              Common reasons for payment failure:
            </Typography>
            <ul className="list-disc list-inside text-left mt-2">
              <li>Insufficient funds</li>
              <li>Incorrect card details</li>
              <li>Bank declined the transaction</li>
              <li>Network connectivity issues</li>
            </ul>
          </Alert>

          <Box className="w-full max-w-md mt-8 p-6 bg-gray-50 rounded-lg">
            <Typography variant="h6" gutterBottom>
              Need Help?
            </Typography>
            <Typography variant="body2" className="text-left">
              If you continue to experience issues, please:
            </Typography>
            <ul className="list-disc list-inside text-left space-y-2 mt-2">
              <li>Check your payment details</li>
              <li>Contact your bank</li>
              <li>Try a different payment method</li>
              <li>Reach out to our support team</li>
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
              Try Again
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              component={Link}
              href="/"
              className="w-full sm:w-auto"
            >
              Back to Home
            </Button>
          </Box>

          <Box className="mt-8 text-sm text-gray-500">
            <Typography variant="body2">
              Contact our support team at{' '}
              <a href="mailto:support@mindfulmaze.com" className="text-primary hover:underline">
                support@mindfulmaze.com
              </a>
              {' '}or call us at{' '}
              <a href="tel:+1234567890" className="text-primary hover:underline">
                +1 (234) 567-890
              </a>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
} 