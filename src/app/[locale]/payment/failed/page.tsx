import { Metadata } from 'next';
import { Container, Typography, Box, Button, Paper, Alert, Grid, Stack, Divider } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CancelIcon from '@mui/icons-material/Cancel';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Payment Failed - MindfulMaze',
  description: 'There was an issue processing your payment',
};

interface PaymentFailedPageProps {
  searchParams: {
    orderId?: string;
    price?: string;
    status?: string;
    method?: string;
    date?: string;
    transactionId?: string;
    reason?: string;
  };
}

export default async function PaymentFailedPage({
  searchParams,
}: PaymentFailedPageProps) {
  const t = await getTranslations('Payment');

  const orderInfo = {
    orderId: searchParams.orderId,
    price: searchParams.price ? parseFloat(searchParams.price) : null,
    status: searchParams.status,
    method: searchParams.method,
    date: searchParams.date ? new Date(searchParams.date) : null,
    transactionId: searchParams.transactionId,
    reason: searchParams.reason,
  };
  
  return (
    <Box className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
      <Container maxWidth="lg" className="py-4 flex flex-col items-center justify-center">
        {/* Error Message */}
        <Box className="text-center mb-6">
          <Box className="inline-flex items-center justify-center gap-3 mb-3">
            <Box className="p-2 rounded-full bg-gradient-to-r from-red-500 to-rose-500">
              <ErrorOutlineIcon className="h-6 w-6 text-white" />
            </Box>
            <Typography
              variant="h1"
              className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent font-bold"
              sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem" } }}
            >
              {t('failed_title')}
            </Typography>
          </Box>
        </Box>

        {/* Order Information Section */}
        {orderInfo.orderId && (
          <Box className="mb-6 w-full max-w-2xl">
            <Paper
              elevation={0}
              className="p-6 bg-white rounded-xl border border-gray-100 shadow-md"
            >
              <Box className="flex items-center gap-2 mb-4">
                <ReceiptIcon className="h-5 w-5 text-red-600" />
                <Typography
                  variant="h6"
                  className="font-semibold text-gray-800"
                >
                  Order Information
                </Typography>
              </Box>

              {orderInfo.reason === 'cancelled' && (
                <Box className="mb-4">
                  <Alert severity="warning" icon={<CancelIcon />}>
                    Payment was cancelled by user
                  </Alert>
                </Box>
              )}
              
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box className="flex items-center gap-2 mb-2">
                    <ConfirmationNumberIcon className="h-4 w-4 text-gray-500" />
                    <Typography variant="body2" className="text-gray-600">
                      Order ID
                    </Typography>
                  </Box>
                  <Typography variant="body1" className="font-medium">
                    #{orderInfo.orderId}
                  </Typography>
                </Grid>
                
                {orderInfo.price && (
                  <Grid item xs={6}>
                    <Box className="flex items-center gap-2 mb-2">
                      <PaymentIcon className="h-4 w-4 text-gray-500" />
                      <Typography variant="body2" className="text-gray-600">
                        Amount
                      </Typography>
                    </Box>
                    <Typography variant="body1" className="font-medium">
                      {orderInfo.price.toLocaleString()} VND
                    </Typography>
                  </Grid>
                )}
                
                {orderInfo.method && (
                  <Grid item xs={6}>
                    <Box className="flex items-center gap-2 mb-2">
                      <PaymentIcon className="h-4 w-4 text-gray-500" />
                      <Typography variant="body2" className="text-gray-600">
                        Payment Method
                      </Typography>
                    </Box>
                    <Typography variant="body1" className="font-medium">
                      {orderInfo.method}
                    </Typography>
                  </Grid>
                )}
                
                {orderInfo.date && (
                  <Grid item xs={6}>
                    <Box className="flex items-center gap-2 mb-2">
                      <CalendarTodayIcon className="h-4 w-4 text-gray-500" />
                      <Typography variant="body2" className="text-gray-600">
                        Attempted Date
                      </Typography>
                    </Box>
                    <Typography variant="body1" className="font-medium">
                      {orderInfo.date.toLocaleDateString()} {orderInfo.date.toLocaleTimeString()}
                    </Typography>
                  </Grid>
                )}
                
                {orderInfo.transactionId && (
                  <Grid item xs={12}>
                    <Divider className="my-2" />
                    <Box className="flex items-center gap-2 mb-2">
                      <ConfirmationNumberIcon className="h-4 w-4 text-gray-500" />
                      <Typography variant="body2" className="text-gray-600">
                        Transaction ID
                      </Typography>
                    </Box>
                    <Typography variant="body2" className="font-mono text-gray-700 bg-gray-50 p-2 rounded">
                      {orderInfo.transactionId}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Box>
        )}

        {/* Common Reasons Section */}
        <Box className="mb-6">
          <Typography
            variant="h2"
            className="text-center mb-4 text-gray-800 font-bold"
            sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem" } }}
          >
            {t('common_reasons')}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Paper elevation={0} className="p-3 bg-gradient-to-br from-red-100 via-red-50 to-rose-50 rounded-xl border border-white/60 hover:shadow-md transition-shadow">
                <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-1">
                  {t('common_reasons_list.insufficient_funds')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={0} className="p-3 bg-gradient-to-br from-orange-100 via-orange-50 to-red-50 rounded-xl border border-white/60 hover:shadow-md transition-shadow">
                <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-1">
                  {t('common_reasons_list.incorrect_details')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={0} className="p-3 bg-gradient-to-br from-rose-100 via-rose-50 to-pink-50 rounded-xl border border-white/60 hover:shadow-md transition-shadow">
                <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-1">
                  {t('common_reasons_list.bank_declined')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={0} className="p-3 bg-gradient-to-br from-pink-100 via-pink-50 to-rose-50 rounded-xl border border-white/60 hover:shadow-md transition-shadow">
                <Typography variant="subtitle1" className="font-semibold text-gray-800 mb-1">
                  {t('common_reasons_list.network_issues')}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Action Buttons & Support */}
        <Box className="text-center">
          <Paper
            elevation={0}
            className="p-4 bg-white rounded-xl border border-gray-100 shadow-md max-w-lg mx-auto"
          >
            <Stack
              direction="row"
              spacing={2}
              className="justify-center mb-3"
            >
              <Button
                variant="contained"
                size="medium"
                component={Link}
                href="/checkout"
                className="rounded-lg px-4 py-1.5 font-medium"
                sx={{
                  background: "linear-gradient(45deg, #ef4444, #dc2626)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #dc2626, #b91c1c)",
                  },
                }}
              >
                {t('try_again')}
              </Button>

              <Button
                variant="outlined"
                size="medium"
                component={Link}
                href="/"
                className="rounded-lg px-4 py-1.5 font-medium"
                sx={{
                  borderColor: "#ef4444",
                  color: "#dc2626",
                  "&:hover": {
                    borderColor: "#dc2626",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                  },
                }}
              >
                {t('back_to_home')}
              </Button>
            </Stack>

            <Typography variant="caption" className="text-gray-600 block">
              {t('support_contact', { 
                email: 'support@mindfulmaze.com', 
                phone: '+1 (234) 567-890' 
              })}
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
} 