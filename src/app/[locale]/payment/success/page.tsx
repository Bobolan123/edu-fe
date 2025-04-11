import { Metadata } from 'next';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Payment Successful - MindfulMaze',
  description: 'Your payment has been processed successfully',
};

export default function PaymentSuccessPage() {
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
            Payment Successful!
          </Typography>
          
          <Typography variant="body1" color="text.secondary" className="max-w-md">
            Thank you for your purchase! Your payment has been processed successfully. 
            You can now access your course materials and start learning.
          </Typography>

          <Box className="w-full max-w-md mt-8 p-6 bg-green-50 rounded-lg">
            <Typography variant="h6" gutterBottom>
              What's Next?
            </Typography>
            <ul className="list-disc list-inside text-left space-y-2">
              <li>Access your course materials immediately</li>
              <li>Download any available resources</li>
              <li>Start watching video lessons</li>
              <li>Join the course community</li>
            </ul>
          </Box>

          <Box className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              href="/my-courses"
              className="w-full sm:w-auto"
            >
              Go to My Courses
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
              Need help? Contact our support team at{' '}
              <a href="mailto:support@mindfulmaze.com" className="text-primary hover:underline">
                support@mindfulmaze.com
              </a>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
} 