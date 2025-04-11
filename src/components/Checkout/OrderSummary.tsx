'use client';

import { Box, Typography, Paper } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

interface OrderSummaryProps {
  originalPrice: number;
  discountPercentage: number;
  discountedPrice: number;
}

export default function OrderSummary({
  originalPrice,
  discountPercentage,
  discountedPrice,
}: OrderSummaryProps) {
  const discountAmount = originalPrice - discountedPrice;

  return (
    <Paper className="p-6 sticky top-4">
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>

      <Box className="space-y-4">
        <Box className="flex justify-between">
          <Typography>Original Price:</Typography>
          <Typography>₫{originalPrice.toLocaleString()}</Typography>
        </Box>

        <Box className="flex justify-between text-green-600">
          <Typography>Discounts ({discountPercentage}% Off):</Typography>
          <Typography>-₫{discountAmount.toLocaleString()}</Typography>
        </Box>

        <Box className="flex justify-between font-bold border-t pt-4">
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6">₫{discountedPrice.toLocaleString()}</Typography>
        </Box>

        <Box className="mt-6">
          <Box className="flex items-center gap-2 text-gray-600 mb-4">
            <LockIcon fontSize="small" />
            <Typography variant="body2">Secure checkout</Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            30-Day Money-Back Guarantee
          </Typography>
        </Box>

        <Box className="mt-4 p-4 bg-gray-50 rounded-lg">
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            This course includes:
          </Typography>
          <ul className="list-disc pl-4 space-y-2">
            <li>Full lifetime access</li>
            <li>Access on mobile and desktop</li>
            <li>Certificate of completion</li>
            <li>Premium course materials</li>
          </ul>
        </Box>
      </Box>
    </Paper>
  );
} 