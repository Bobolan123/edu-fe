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
} from "@mui/material";
import { Lock, Shield } from "lucide-react";
import { ICartItem, PaymentMethod } from "../../../types/entities";
import { createOrder } from "@/actions";
import { useSession } from "next-auth/react";
import { useCurrency } from "@/context/CurrencyContext";
import { currencyService } from "@/service/currency";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

interface ICheckoutProps {
    cartItems?: ICartItem[];
    cartId: number;
}

export default function Checkout({ cartItems, cartId }: ICheckoutProps) {
    const t = useTranslations("Checkout");
    const { data: session } = useSession();
    const { currency } = useCurrency();
    const [paymentMethod, setPaymentMethod] = useState("vnpay");
    const [totalUSD, setTotalUSD] = useState(0);

    const totalVND =
        cartItems?.reduce((sum, item) => sum + (item?.price || 0), 0) || 0;

    useEffect(() => {
        if (currency === "USD") {
            currencyService
                .convertPrice(totalVND, "VND", "USD")
                .then(setTotalUSD)
                .catch(console.error);
        }
    }, [totalVND, currency]);

    const getCurrentTotal = () => (currency === "VND" ? totalVND : totalUSD);

    const formatCurrency = (amount: number) =>
        currencyService.formatPrice(amount, currency);

    const handleCheckout = async () => {
        try {
            // Get payment currency based on payment method
            const paymentCurrency = currencyService.getPaymentCurrency(paymentMethod as 'vnpay' | 'paypal');
            const paymentAmount = paymentCurrency === 'VND' ? totalVND : totalUSD;
            
            const res = await createOrder({
                cartId,
                totalPrice: paymentAmount, // Send currency based on payment method
                paymentMethod: paymentMethod.toUpperCase() as PaymentMethod,
                userId: session?.user.id || "",
                access_token: session?.user?.access_token || "",
            });
            if (res?.paymentUrl) {
                window.location.href = res.paymentUrl;
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error(t("checkout_error"));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <Typography
                    variant="h4"
                    className="font-bold mb-8 text-gray-900"
                >
                    {t("title")}
                </Typography>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Payment Method */}
                        <Paper className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Typography
                                    variant="h6"
                                    className="font-semibold"
                                >
                                    {t("payment_method")}
                                </Typography>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Lock className="w-4 h-4 mr-1" />
                                    {t("secure_encrypted")}
                                </div>
                            </div>

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
                                    {/* PayPal */}
                                    <Paper
                                        variant="outlined"
                                        className={`p-4 cursor-pointer transition-colors ${
                                            paymentMethod === "paypal"
                                                ? "border-blue-500 bg-blue-50"
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        <FormControlLabel
                                            value="paypal"
                                            control={<Radio />}
                                            label={
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center">
                                                        <span className="text-white font-bold text-xs">
                                                            PP
                                                        </span>
                                                    </div>
                                                    <span className="font-medium">
                                                        {t("paypal")}
                                                    </span>
                                                </div>
                                            }
                                            className="m-0 w-full"
                                        />
                                        {paymentMethod === "paypal" && (
                                            <div className="mt-3 pl-12">
                                                <Typography
                                                    variant="body2"
                                                    className="text-gray-700 mb-2"
                                                >
                                                    We will redirect you to
                                                    PayPal’s secure servers.
                                                </Typography>
                                                {currency === "VND" && (
                                                    <Alert
                                                        severity="warning"
                                                        className="mb-2"
                                                    >
                                                        PayPal does not support
                                                        VND. Payment will be
                                                        made in USD.
                                                    </Alert>
                                                )}
                                                <Typography
                                                    variant="body2"
                                                    className="font-medium"
                                                >
                                                    You will be charged{" "}
                                                    {currencyService.formatPrice(
                                                        totalUSD,
                                                        "USD"
                                                    )}
                                                    .
                                                </Typography>
                                            </div>
                                        )}
                                    </Paper>

                                    {/* VNPay */}
                                    <Paper
                                        variant="outlined"
                                        className={`p-4 cursor-pointer transition-colors ${
                                            paymentMethod === "vnpay"
                                                ? "border-blue-500 bg-blue-50"
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        <FormControlLabel
                                            value="vnpay"
                                            control={<Radio />}
                                            label={
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-red-600 rounded mr-3 flex items-center justify-center">
                                                        <span className="text-white font-bold text-xs">
                                                            VN
                                                        </span>
                                                    </div>
                                                    <span className="font-medium">
                                                        VNPay
                                                    </span>
                                                </div>
                                            }
                                            className="m-0 w-full"
                                        />
                                        {paymentMethod === "vnpay" && (
                                            <div className="mt-3 pl-12">
                                                <Typography
                                                    variant="body2"
                                                    className="text-gray-700"
                                                >
                                                    VNPay supports all major
                                                    Vietnamese banks and
                                                    e-wallets.
                                                </Typography>
                                            </div>
                                        )}
                                    </Paper>
                                </RadioGroup>
                            </FormControl>
                        </Paper>

                        {/* Order Details */}
                        <Paper className="p-6">
                            <Typography
                                variant="h6"
                                className="font-semibold mb-4"
                            >
                                Order details ({cartItems?.length || 0} courses)
                            </Typography>
                            <div className="space-y-4">
                                {cartItems?.map((item) => (
                                    <div
                                        key={item?.id}
                                        className="flex items-center space-x-4"
                                    >
                                        <img
                                            src={
                                                item?.course?.thumbnail_url ||
                                                "/placeholder.svg"
                                            }
                                            alt={
                                                item?.course?.title || "Course"
                                            }
                                            className="w-12 h-12 rounded object-cover"
                                        />
                                        <div className="flex-1">
                                            <Typography
                                                variant="body2"
                                                className="font-medium text-gray-900"
                                            >
                                                {item?.course?.title}
                                            </Typography>
                                        </div>
                                        <Typography
                                            variant="body2"
                                            className="font-semibold"
                                        >
                                            {formatCurrency(
                                                currency === "VND"
                                                    ? item?.price || 0
                                                    : totalUSD *
                                                          ((item?.price || 0) /
                                                              totalVND)
                                            )}
                                        </Typography>
                                    </div>
                                ))}
                            </div>
                        </Paper>
                    </div>

                    {/* Right Column - Summary */}
                    <div className="space-y-6">
                        <Paper className="p-6">
                            <Typography
                                variant="h6"
                                className="font-semibold mb-4"
                            >
                                Order summary
                            </Typography>

                            <div className="space-y-3 mb-4">    
                                <div className="flex justify-between">
                                    <Typography
                                        variant="body1"
                                        className="font-semibold"
                                    >
                                        Total ({cartItems?.length || 0}{" "}
                                        courses):
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        className="font-bold text-lg"
                                    >
                                        {formatCurrency(getCurrentTotal())}
                                    </Typography>
                                </div>
                            </div>

                            <Typography
                                variant="caption"
                                className="text-gray-600 block mb-4"
                            >
                                By completing your purchase, you agree to our
                                Terms of Use.
                            </Typography>

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                startIcon={<Lock className="w-4 h-4" />}
                                onClick={handleCheckout}
                            >
                                Proceed
                            </Button>
                        </Paper>

                        {/* Guarantee */}
                        <Card className="bg-gray-50">
                            <CardContent className="text-center p-6">
                                <Shield className="w-12 h-12 mx-auto mb-3 text-green-600" />
                                <Typography
                                    variant="h6"
                                    className="font-semibold mb-2"
                                >
                                    30-Day Money-Back Guarantee
                                </Typography>
                                <Typography
                                    variant="body2"
                                    className="text-gray-600"
                                >
                                    Not satisfied? Get a full refund within 30
                                    days.
                                </Typography>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
