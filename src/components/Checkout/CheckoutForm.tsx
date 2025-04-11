'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, RadioGroup, FormControlLabel, Radio, Button, Box, Typography, Alert } from '@mui/material';

enum PaymentMethod {
  VNPAY = 'VNPAY',
  PAYPAL = 'PAYPAL',
  CREDIT_CARD = 'CREDIT_CARD',
}

interface CheckoutFormProps {
  courseId: number;
  amount: number;
}

export default function CheckoutForm({ courseId, amount }: CheckoutFormProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.VNPAY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [billingInfo, setBillingInfo] = useState({
    country: 'Vietnam',
    name: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setBillingInfo({ ...billingInfo, [field]: event.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          amount,
          paymentMethod,
          billingInfo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment failed');
      }

      // Redirect to payment URL
      window.location.href = data.paymentUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
      <Typography variant="h6" gutterBottom>
        Billing address
      </Typography>

      <Box mb={3}>
        <TextField
          select
          fullWidth
          label="Country"
          value={billingInfo.country}
          onChange={handleInputChange('country')}
          SelectProps={{
            native: true,
          }}
        >
          <option value="Vietnam">Vietnam</option>
          <option value="Other">Other</option>
        </TextField>
      </Box>

      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>

      <RadioGroup
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
      >
        <FormControlLabel
          value={PaymentMethod.VNPAY}
          control={<Radio />}
          label={
            <Box display="flex" alignItems="center" gap={2}>
              <img src="/images/vnpay-logo.png" alt="VNPay" height={24} />
              <Typography>VNPay</Typography>
            </Box>
          }
        />
        <FormControlLabel
          value={PaymentMethod.PAYPAL}
          control={<Radio />}
          label={
            <Box display="flex" alignItems="center" gap={2}>
              <img src="/images/paypal-logo.png" alt="PayPal" height={24} />
              <Typography>PayPal</Typography>
            </Box>
          }
        />
        <FormControlLabel
          value={PaymentMethod.CREDIT_CARD}
          control={<Radio />}
          label={
            <Box display="flex" alignItems="center" gap={2}>
              <img src="/images/credit-card-logos.png" alt="Credit Cards" height={24} />
              <Typography>Credit or Debit Card</Typography>
            </Box>
          }
        />
      </RadioGroup>

      {paymentMethod === PaymentMethod.CREDIT_CARD && (
        <Box mt={3}>
          <TextField
            fullWidth
            label="Name on card"
            value={billingInfo.name}
            onChange={handleInputChange('name')}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Card number"
            value={billingInfo.cardNumber}
            onChange={handleInputChange('cardNumber')}
            margin="normal"
          />
          <Box display="flex" gap={2} mt={2}>
            <TextField
              label="Expiry date"
              value={billingInfo.expiryDate}
              onChange={handleInputChange('expiryDate')}
              placeholder="MM/YY"
            />
            <TextField
              label="CVC"
              value={billingInfo.cvc}
              onChange={handleInputChange('cvc')}
              placeholder="CVC"
            />
          </Box>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={loading}
        sx={{
          mt: 3,
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        {loading ? 'Processing...' : `Complete Payment - ₫${amount.toLocaleString()}`}
      </Button>

      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
        By completing your purchase you agree to these Terms of Use.
      </Typography>
    </form>
  );
} 