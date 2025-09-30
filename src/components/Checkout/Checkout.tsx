"use client";

import { useEffect, useState } from "react";
import {
    Typography,
    Paper,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Button,
    Alert,
    Divider,
    Card,
    CardContent,
    Box,
    Skeleton,
    Fade,
    Zoom,
    CircularProgress,
} from "@mui/material";
import { Lock, Shield } from "lucide-react";
import { ICartItem, PaymentMethod } from "../../../types/entities";
import { createOrder } from "@/actions/orderActions";
import { useSession } from "next-auth/react";
import { useCurrency } from "@/context/CurrencyContext";
import { currencyService } from "@/services/currency";
import { useTranslations } from "next-intl";
import { toastService } from "@/services/toast";
// Removed LoadingButton and ErrorBoundary imports

interface ICheckoutProps {
    cartItems?: ICartItem[];
    cartId: string;
}

function CheckoutComponent({ cartItems, cartId }: ICheckoutProps) {
    const t = useTranslations("Checkout");
    const { data: session } = useSession();
    const { currency } = useCurrency();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("vnpay");
    const totalVND =
        cartItems?.reduce((sum, item) => sum + (item?.price || 0), 0) || 0;

    const getCurrentTotal = () => totalVND;

    const formatCurrency = (amount: number) =>
        currencyService.formatPrice(amount, "VND");

    const handleCheckout = async () => {
        try {
            const res = await createOrder({
                cartId,
                totalPrice: totalVND,
                paymentMethod: paymentMethod.toUpperCase() as PaymentMethod,
            });
            if (res?.paymentUrl) {
                window.location.href = res.paymentUrl;
            }
        } catch (error: any) {
            console.error("Checkout error:", error);
            
            // Handle specific error messages
            const errorMessage = error?.message || error?.toString() || "";
            
            if (errorMessage.includes("Already enrolled in course")) {
                toastService.error("You are already enrolled in one or more courses");
            } else if (errorMessage.includes("Cart not found or is empty")) {
                toastService.error("Your cart is empty or has expired");
            } else if (errorMessage.includes("Price mismatch detected")) {
                toastService.error("Course prices have changed, please refresh your cart");
            } else if (errorMessage.includes("Invalid payment signature")) {
                toastService.error("Payment verification failed, please try again");
            } else if (errorMessage.includes("Order cannot be processed")) {
                toastService.error("Order is in invalid state for processing");
            } else {
                toastService.error(t("checkout_error"));
            }
        }
    };

    return (
        <Box 
            sx={{ 
                minHeight: '100vh',
                background: 'linear-gradient(145deg, #f8fafc 0%, #eff6ff 50%, #eef2ff 100%)',
                py: { xs: 4, sm: 6, md: 8 },
                px: { xs: 4, sm: 8, md: 12 }
            }}
        >
            <Box 
                sx={{ 
                    maxWidth: 'lg',
                    mx: 'auto',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -40,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '100%',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent)'
                    }
                }}
            >
                <Fade in timeout={600}>
                    <Box className="mb-10">
                        <Typography 
                            variant="h3" 
                            gutterBottom
                            sx={{
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                mb: 1
                            }}
                        >
                            {t("title")}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Lock size={20} className="text-blue-600" />
                            <Typography variant="h6" color="text.secondary" fontWeight={500}>
                                {t("secure_encrypted")}
                            </Typography>
                        </Box>
                    </Box>
                </Fade>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: { xs: 2, md: 4 } }}>
                    {/* Left Column */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Payment Method */}
                        <Fade in timeout={800}>
                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: 4,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    background: 'linear-gradient(135deg, #ffffff 0%, #fafbff 100%)',
                                    overflow: 'visible',
                                    position: 'relative',
                                    p: 3,
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: -2,
                                        left: -2,
                                        right: -2,
                                        bottom: -2,
                                        background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                                        borderRadius: 4,
                                        zIndex: -1,
                                        opacity: 0.1,
                                    }
                                }}
                            >
                            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    sx={{
                                        background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent',
                                    }}
                                >
                                    {t("payment_method")}
                                </Typography>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Lock size={16} className="text-green-600" />
                                    <Typography variant="caption" color="success.main" fontWeight={600}>
                                        {t("secure_encrypted")}
                                    </Typography>
                                </Box>
                            </Box>

                            <FormControl
                                component="fieldset"
                                className="w-full"
                            >
                                <RadioGroup
                                    value={paymentMethod}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                    className="space-y-3"
                                >
                                    {/* VNPay */}
                                    <Card
                                        elevation={0}
                                        sx={{
                                            p: 2.5,
                                            cursor: 'pointer',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            border: '2px solid',
                                            borderColor: paymentMethod === "vnpay" ? 'error.300' : 'divider',
                                            background: paymentMethod === "vnpay" 
                                                ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'
                                                : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                            borderRadius: 3,
                                            '&:hover': {
                                                borderColor: 'error.400',
                                                background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 8px 25px rgba(239, 68, 68, 0.15)',
                                            }
                                        }}
                                    >
                                        <FormControlLabel
                                            value="vnpay"
                                            control={<Radio />}
                                            label={
                                                <Box display="flex" alignItems="center">
                                                    <Box
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                                                            borderRadius: 2,
                                                            mr: 2,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                                                        }}
                                                    >
                                                        <Typography 
                                                            variant="caption" 
                                                            fontWeight={800}
                                                            color="white"
                                                        >
                                                            VN
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body1" fontWeight={700}>
                                                        VNPay
                                                    </Typography>
                                                </Box>
                                            }
                                            className="m-0 w-full"
                                        />
                                        {paymentMethod === "vnpay" && (
                                            <Fade in timeout={300}>
                                                <Box sx={{ mt: 2, pl: 6 }}>
                                                    <Box
                                                        sx={{
                                                            p: 2,
                                                            borderRadius: 2,
                                                            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                                                            border: '1px solid',
                                                            borderColor: 'error.200',
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={600}
                                                            color="error.800"
                                                        >
                                                            VNPay supports all major Vietnamese banks and e-wallets.
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Fade>
                                        )}
                                    </Card>
                                </RadioGroup>
                            </FormControl>
                        </Card>
                        </Fade>

                        {/* Order Details */}
                        <Fade in timeout={1000}>
                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: 4,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    background: 'linear-gradient(135deg, #ffffff 0%, #fafbff 100%)',
                                    overflow: 'visible',
                                    position: 'relative',
                                    p: 3,
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: -2,
                                        left: -2,
                                        right: -2,
                                        bottom: -2,
                                        background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                                        borderRadius: 4,
                                        zIndex: -1,
                                        opacity: 0.1,
                                    }
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    sx={{
                                        background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent',
                                        mb: 3
                                    }}
                                >
                                    Order details ({cartItems?.length || 0} courses)
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {cartItems?.map((item, index) => (
                                        <Fade key={item?.id} in timeout={1200 + index * 100}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    p: 2,
                                                    borderRadius: 3,
                                                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                                                        transform: 'translateX(4px)',
                                                    }
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 56,
                                                        height: 56,
                                                        borderRadius: 2,
                                                        overflow: 'hidden',
                                                        border: '2px solid',
                                                        borderColor: 'primary.200',
                                                        position: 'relative',
                                                    }}
                                                >
                                                    <img
                                                        src={
                                                            item?.course?.thumbnail_url ||
                                                            "/img_not_found.png"
                                                        }
                                                        alt={
                                                            item?.course?.title || "Course"
                                                        }
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                        }}
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            if (target.src !== "/img_not_found.png") {
                                                                target.src = "/img_not_found.png";
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography
                                                        variant="body1"
                                                        fontWeight={700}
                                                        color="text.primary"
                                                        sx={{ lineHeight: 1.4 }}
                                                    >
                                                        {item?.course?.title}
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    variant="h6"
                                                    fontWeight={800}
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                                                        backgroundClip: 'text',
                                                        WebkitBackgroundClip: 'text',
                                                        color: 'transparent',
                                                    }}
                                                >
                                                    {formatCurrency(item?.price || 0)}
                                                </Typography>
                                            </Box>
                                        </Fade>
                                    ))}
                                </Box>
                            </Card>
                        </Fade>
                    </Box>

                    {/* Right Column - Summary */}
                    <Box>
                        <Fade in timeout={1400}>
                            <Box sx={{ position: { lg: 'sticky' }, top: { lg: 24 } }}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        borderRadius: 4,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                        overflow: 'visible',
                                        position: 'relative',
                                        p: 3,
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: -2,
                                            left: -2,
                                            right: -2,
                                            bottom: -2,
                                            background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                                            borderRadius: 4,
                                            zIndex: -1,
                                            opacity: 0.1,
                                        }
                                    }}
                                >
                                    <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                                        <Box
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                bgcolor: 'primary.100',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Lock size={18} className="text-blue-600" />
                                        </Box>
                                        <Typography 
                                            variant="h5" 
                                            fontWeight={700}
                                            sx={{
                                                background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)',
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                color: 'transparent',
                                            }}
                                        >
                                            Order summary
                                        </Typography>
                                    </Box>

                                    {/* Items Summary */}
                                    <Box mb={2}>
                                        <Typography variant="body2" color="text.secondary" mb={1}>
                                            Items in cart
                                        </Typography>
                                        <Typography variant="body1" fontWeight={600}>
                                            {cartItems?.length || 0} {(cartItems?.length || 0) === 1 ? 'course' : 'courses'}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    {/* Total */}
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        mb={3}
                                        p={2}
                                        borderRadius={2}
                                        bgcolor="primary.50"
                                    >
                                        <Typography
                                            variant="h6"
                                            fontWeight={700}
                                            color="primary.dark"
                                        >
                                            Total
                                        </Typography>
                                        {loading ? (
                                            <Skeleton 
                                                variant="text" 
                                                width={120} 
                                                height={40}
                                            />
                                        ) : (
                                            <Typography
                                                variant="h4"
                                                fontWeight={800}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                                                    backgroundClip: 'text',
                                                    WebkitBackgroundClip: 'text',
                                                    color: 'transparent',
                                                }}
                                            >
                                                {formatCurrency(getCurrentTotal())}
                                            </Typography>
                                        )}
                                    </Box>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ 
                                            display: 'block', 
                                            mb: 3, 
                                            lineHeight: 1.4,
                                            textAlign: 'center'
                                        }}
                                    >
                                        By completing your purchase, you agree to our Terms of Use.
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={loading || !paymentMethod}
                                        startIcon={!loading ? <Lock size={20} /> : <CircularProgress size={20} color="inherit" />}
                                        onClick={async () => {
                                            setLoading(true);
                                            try {
                                                await handleCheckout();
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                        sx={{
                                            mb: 2,
                                            py: 1.8,
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            borderRadius: 3,
                                            textTransform: 'none',
                                            background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                                            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.25)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                                                boxShadow: '0 12px 35px rgba(59, 130, 246, 0.35)',
                                                transform: 'translateY(-2px)',
                                            },
                                            '&:active': {
                                                transform: 'translateY(0px)',
                                            },
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        }}
                                    >
                                        {loading ? 'Processing...' : 'Proceed to Payment'}
                                    </Button>
                                </Card>
                            </Box>
                        </Fade>

                        {/* Guarantee */}
                        <Fade in timeout={1600}>
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
                                    border: '1px solid #bbf7d0',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    textAlign: 'center',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: 3,
                                        background: 'linear-gradient(90deg, #10b981, #059669)',
                                    }
                                }}
                            >
                                <Shield size={48} className="text-green-600 mx-auto mb-3" />
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    color="green.800"
                                    sx={{ mb: 1 }}
                                >
                                    30-Day Money-Back Guarantee
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="green.700"
                                    sx={{ lineHeight: 1.5 }}
                                >
                                    Not satisfied? Get a full refund within 30 days.
                                </Typography>
                            </Box>
                        </Fade>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

// Export the component directly
export default CheckoutComponent;
