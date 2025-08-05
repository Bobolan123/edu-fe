"use client";

import Image from "next/image";
import {
    Trash2,
    Star,
    Clock,
    Users,
    ShoppingCart,
    CreditCard,
} from "lucide-react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Chip,
    Button as MUIButton,
    Select,
    MenuItem,
    CircularProgress,
    Skeleton,
    alpha,
} from "@mui/material";
import { ICartItem } from "../../../types/entities";
import { deleteCartItem } from "@/actions/cartActions";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { slugify } from "../../../utils/utils";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { currencyService } from "@/service/currency";
import { useTranslations } from "next-intl";
import { LoadingButton, useLoadingState } from "@/components/common/Loading";
import { toastService } from "@/services/toast";

interface ICartProps {
    cartItems?: ICartItem[];
}

const Cart = ({ cartItems = [] }: ICartProps) => {
    const { data: session } = useSession();
    const { currency, setCurrency } = useCurrency();
    const t = useTranslations('Cart');
    const [convertedTotal, setConvertedTotal] = useState(0);
    const [convertedPrices, setConvertedPrices] = useState<
        Record<number, number>
    >({});
    
    // Loading states
    const [deletingItems, setDeletingItems] = useState<
        Record<number, boolean>
    >({});
    const [isConvertingPrices, setIsConvertingPrices] = useState(false);
    const [isConvertingTotal, setIsConvertingTotal] = useState(false);

    const rawTotal =
        cartItems?.reduce((sum, item) => sum + (item.price || 0), 0) || 0;

    useEffect(() => {
        async function convertTotal() {
            setIsConvertingTotal(true);
            try {
                const result = await currencyService.convertPrice(
                    rawTotal,
                    "VND",
                    currency
                );
                setConvertedTotal(result);
            } catch (error) {
                toastService.error('Failed to convert currency');
            } finally {
                setIsConvertingTotal(false);
            }
        }
        convertTotal();
    }, [rawTotal, currency]);
    useEffect(() => {
        async function convertAllPrices() {
            if (cartItems.length === 0) return;
            
            setIsConvertingPrices(true);
            try {
                const newPrices: Record<number, number> = {};
                for (const item of cartItems) {
                    const converted = await currencyService.convertPrice(
                        item.price || 0,
                        "VND",
                        currency
                    );
                    newPrices[item.course.id] = converted;
                }
                setConvertedPrices(newPrices);
            } catch (error) {
                toastService.error('Failed to convert prices');
            } finally {
                setIsConvertingPrices(false);
            }
        }
        convertAllPrices();
    }, [cartItems, currency]);

    const formatRating = (rating: number = 0) => rating.toFixed(1);

    const handleDeleteItem = async (courseId: number) => {
        setDeletingItems(prev => ({ ...prev, [courseId]: true }));
        
        try {
            const res = await deleteCartItem(courseId);
            
            if (res && res.data) {
                toastService.success(res.message);
                // Remove from local state to provide immediate feedback
                setConvertedPrices(prev => {
                    const newPrices = { ...prev };
                    delete newPrices[courseId];
                    return newPrices;
                });
            } else {
                toastService.error(res.message);
            }
        } catch (error) {
            toastService.error('Failed to remove item from cart');
        } finally {
            setDeletingItems(prev => ({ ...prev, [courseId]: false }));
        }
    };

    if (cartItems.length === 0) {
        return (
            <Box className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
                <Card sx={{ p: 5, textAlign: "center", maxWidth: 500 }}>
                    <ShoppingCart
                        className="mx-auto text-gray-400 mb-4"
                        size={64}
                    />
                    <Typography variant="h5" gutterBottom>
                        {t('empty_title')}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                    >
                        {t('empty_description')}
                    </Typography>
                    <MUIButton
                        variant="contained"
                        sx={{ mt: 3 }}
                        color="primary"
                    >
                        {t('browse_courses')}
                    </MUIButton>
                </Card>
            </Box>
        );
    }

    return (
        <Box className="min-h-screen bg-gray-50 py-8">
            <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Box className="mb-8">
                    <Typography variant="h4" gutterBottom>
                        {t('title')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {t('item_count', { count: cartItems.length })}
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} lg={8}>
                        {cartItems.map((cartItem) => (
                            <Link
                                key={cartItem.id}
                                href={`/courses/${slugify(
                                    cartItem?.course?.title
                                )}?id=${cartItem?.course?.id}`}
                            >
                                <Card
                                    elevation={2}
                                    sx={{
                                        mb: 2,
                                        overflow: "hidden",
                                        borderRadius: 3,
                                        ":hover": { boxShadow: 6 },
                                    }}
                                >
                                    <Grid container>
                                        <Grid item xs={12} md={4}>
                                            <Image
                                                src={
                                                    cartItem?.course
                                                        ?.thumbnail_url ||
                                                    "/placeholder.svg"
                                                }
                                                alt={
                                                    cartItem?.course?.title ||
                                                    t('course_image')
                                                }
                                                width={300}
                                                height={200}
                                                className="w-full h-full object-cover"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <Box
                                                p={2}
                                                display="flex"
                                                flexDirection="column"
                                                gap={1}
                                            >
                                                <Box
                                                    display="flex"
                                                    justifyContent="space-between"
                                                    alignItems="start"
                                                >
                                                    <Typography variant="h6">
                                                        {cartItem?.course
                                                            ?.title ||
                                                            t('untitled_course')}
                                                    </Typography>
                                                    <MUIButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() =>
                                                            handleDeleteItem(
                                                                +cartItem
                                                                    ?.course?.id
                                                            )
                                                        }
                                                        disabled={deletingItems[cartItem?.course?.id]}
                                                        sx={{
                                                            minWidth: 40,
                                                            minHeight: 40,
                                                            borderRadius: 2,
                                                            '&:hover': {
                                                                backgroundColor: alpha('#ef4444', 0.1),
                                                            },
                                                        }}
                                                    >
                                                        {deletingItems[cartItem?.course?.id] ? (
                                                            <CircularProgress 
                                                                size={18} 
                                                                color="error" 
                                                            />
                                                        ) : (
                                                            <Trash2 size={18} />
                                                        )}
                                                    </MUIButton>
                                                </Box>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {cartItem?.course
                                                        ?.description ||
                                                        t('no_description')}
                                                </Typography>

                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    gap={1}
                                                >
                                                    <Image
                                                        src={
                                                            cartItem?.course
                                                                ?.instructor
                                                                ?.avatar_url ||
                                                            "/placeholder.svg"
                                                        }
                                                        alt={
                                                            cartItem?.course
                                                                ?.instructor
                                                                ?.name ||
                                                            t('instructor')
                                                        }
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full"
                                                    />
                                                    <Typography variant="body2">
                                                        {cartItem?.course
                                                            ?.instructor
                                                            ?.name ||
                                                            t('unknown_instructor')}
                                                    </Typography>
                                                </Box>

                                                <Box
                                                    display="flex"
                                                    gap={1.5}
                                                    flexWrap="wrap"
                                                    mt={1}
                                                >
                                                    <Chip
                                                        icon={<Star />}
                                                        label={`${formatRating(
                                                            cartItem?.course
                                                                ?.average_rating
                                                        )} (${
                                                            cartItem?.course
                                                                ?.total_reviews ||
                                                            0
                                                        })`}
                                                        color="warning"
                                                    />
                                                    <Chip
                                                        icon={<Clock />}
                                                        label={`${
                                                            cartItem?.course
                                                                ?.language || 'English'
                                                        }`}
                                                        color="info"
                                                    />
                                                    <Chip
                                                        icon={<Users />}
                                                        label={
                                                            cartItem?.course?.total_students?.toLocaleString() ||
                                                            "0"
                                                        }
                                                        color="success"
                                                    />
                                                </Box>

                                                <Box
                                                    display="flex"
                                                    justifyContent="right"
                                                    mt={2}
                                                >
                                                    {isConvertingPrices && !convertedPrices[cartItem.course.id] ? (
                                                        <Skeleton 
                                                            variant="text" 
                                                            width={80} 
                                                            height={32}
                                                        />
                                                    ) : (
                                                        <Typography variant="h6">
                                                            {currencyService.formatPrice(
                                                                convertedPrices[
                                                                    cartItem.course
                                                                        .id
                                                                ] || 0,
                                                                currency
                                                            )}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Link>
                        ))}
                    </Grid>

                    {/* Summary Section */}
                    <Grid item xs={12} lg={4}>
                        <Card
                            elevation={3}
                            sx={{
                                borderRadius: 3,
                            }}
                        >
                            <CardHeader title={t('order_summary')} />

                            <CardContent>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    mb={2}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={600}
                                    >
                                        {t('total')}
                                    </Typography>
                                    {isConvertingTotal ? (
                                        <Skeleton 
                                            variant="text" 
                                            width={100} 
                                            height={32}
                                        />
                                    ) : (
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight={600}
                                        >
                                            {currencyService.formatPrice(
                                                convertedTotal,
                                                currency
                                            )}
                                        </Typography>
                                    )}
                                </Box>
                                <Link href={`/checkout`}>
                                    <MUIButton
                                        variant="contained"
                                        fullWidth
                                        sx={{ 
                                            mt: 1.5,
                                            height: 48,
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                                            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                                boxShadow: '0 6px 20px rgba(14, 165, 233, 0.4)',
                                                transform: 'translateY(-1px)',
                                            },
                                        }}
                                        startIcon={<CreditCard />}
                                        disabled={isConvertingTotal || isConvertingPrices}
                                    >
                                        {t('checkout')}
                                    </MUIButton>
                                </Link>
                                <Link href={`/courses`}>
                                    <MUIButton
                                        variant="outlined"
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    >
                                        {t('continue_shopping')}
                                    </MUIButton>
                                </Link>
                                <Box
                                    mt={4}
                                    bgcolor="green.50"
                                    p={2}
                                    borderRadius={2}
                                    textAlign="center"
                                >
                                    <Typography
                                        variant="body2"
                                        color="green.800"
                                    >
                                        {t('money_back_guarantee')}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="green.600"
                                    >
                                        {t('lifetime_access')}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Cart;
