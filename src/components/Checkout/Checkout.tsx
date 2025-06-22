"use client";

import { useState } from "react";
import {
    Typography,
    Paper,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Button,
    Select,
    MenuItem,
    Alert,
    Divider,
    Card,
    CardContent,
} from "@mui/material";
import { Lock, Shield } from "lucide-react";
import { ICartItem, PaymentMethod } from "../../../types/entities";
import { createOrder } from "@/actions";
import { useSession } from "next-auth/react";
import { formatCurrency } from "../../../utils/utils";

interface ICheckoutProps {
    cartItems?: ICartItem[];
    cartId: number;
}

const exchangeRate = 25000;

export default function Checkout({ cartItems, cartId }: ICheckoutProps) {
    const { data: session } = useSession();

    const [paymentMethod, setPaymentMethod] = useState("vnpay");
    const [currency, setCurrency] = useState("VND");

    const totalVND =
        cartItems?.reduce((sum, item) => sum + (item?.price || 0), 0) || 0;
    const totalUSD = totalVND / exchangeRate;

   

    const getCurrentTotal = () => (currency ==="VND" ? totalVND : totalUSD); 

    const handleCheckout = async () => {
        try {
            const result = await createOrder({
                cartId: cartId,
                totalPrice: totalVND,
                paymentMethod: paymentMethod.toUpperCase() as PaymentMethod,
                userId: session?.user.id || "",
                access_token: session?.user?.access_token || "",
            });

            if (result.paymentUrl) {
                window.location.href = result.paymentUrl;
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Something went wrong during checkout.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <Typography
                    variant="h4"
                    className="font-bold mb-8 text-gray-900"
                >
                    Checkout
                </Typography>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Currency Selection */}
                        <Paper className="p-6">
                            <Typography
                                variant="h6"
                                className="font-semibold mb-4"
                            >
                                Currency
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    value={currency}
                                    onChange={(e) =>
                                        setCurrency(e.target.value)
                                    }
                                    className="mb-2"
                                >
                                    <MenuItem value="VND">
                                        🇻🇳 Vietnamese Dong (VND)
                                    </MenuItem>
                                    <MenuItem value="USD">
                                        🇺🇸 US Dollar (USD)
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <Typography
                                variant="body2"
                                className="text-gray-600 mt-2"
                            >
                                Exchange rate: 1 USD = ₫
                                {exchangeRate.toLocaleString()}
                            </Typography>
                        </Paper>

                        {/* Payment Method */}
                        <Paper className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Typography
                                    variant="h6"
                                    className="font-semibold"
                                >
                                    Payment method
                                </Typography>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Lock className="w-4 h-4 mr-1" />
                                    Secure and encrypted
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
                                                        PayPal
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
                                                    {formatCurrency(
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
                                                    : (item?.price || 0) /
                                                          exchangeRate,
                                                currency
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
                                        variant="body2"
                                        className="text-gray-600"
                                    >
                                        Original Price:
                                    </Typography>
                                    <Typography variant="body2">
                                        {formatCurrency(
                                            getCurrentTotal(),
                                            currency
                                        )}
                                    </Typography>
                                </div>

                                <Divider />

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
                                        {formatCurrency(
                                            getCurrentTotal(),
                                            currency
                                        )}
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
