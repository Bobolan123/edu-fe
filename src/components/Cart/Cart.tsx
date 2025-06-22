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
    Divider,
    Select,
    MenuItem,
} from "@mui/material";
import { ICartItem } from "../../../types/entities";
import { deleteCartItem } from "@/actions";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
    slugify,
    formatCurrency,
    exchangeCurrency,
} from "../../../utils/utils";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

interface ICartProps {
    cartItems?: ICartItem[];
}

const Cart = ({ cartItems = [] }: ICartProps) => {
    const { data: session } = useSession();
    const [currency, setCurrency] = useState<"USD" | "VND">("VND");
    const [convertedTotal, setConvertedTotal] = useState(0);

    const rawTotal =
        cartItems?.reduce((sum, item) => sum + (item.price || 0), 0) || 0;

    useEffect(() => {
        async function convertTotal() {
            const value = await exchangeCurrency(rawTotal, "VND", currency,0.0038);
            setConvertedTotal(value);
        }
        convertTotal();
    }, [rawTotal, currency]);

    const formatRating = (rating: number = 0) => rating.toFixed(1);

    const handleDeleteItem = async (courseId: number) => {
        const res = await deleteCartItem(
            courseId,
            session?.user?.access_token as string
        );
        res && res.data ? toast.success(res.message) : toast.error(res.message);
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
                        Your cart is empty
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                    >
                        Discover amazing courses and start learning today!
                    </Typography>
                    <MUIButton
                        variant="contained"
                        sx={{ mt: 3 }}
                        color="primary"
                    >
                        Browse Courses
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
                        Shopping Cart
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {cartItems.length} course
                        {cartItems.length !== 1 ? "s" : ""} in your cart
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
                                    key={cartItem?.course?.id}
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
                                                    "Course image"
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
                                                            "Untitled Course"}
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
                                                    >
                                                        <Trash2 size={18} />
                                                    </MUIButton>
                                                </Box>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {cartItem?.course
                                                        ?.description ||
                                                        "No description available."}
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
                                                            "Instructor"
                                                        }
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full"
                                                    />
                                                    <Typography variant="body2">
                                                        {cartItem?.course
                                                            ?.instructor
                                                            ?.name ||
                                                            "Unknown Instructor"}
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
                                                                ?.duration || 0
                                                        }h`}
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
                                                   
                                                    <Typography variant="h6">
                                                        {formatCurrency(
                                                            cartItem?.course
                                                                ?.price || 0,
                                                            currency
                                                        )}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Link>
                        ))}
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        <Card
                            elevation={3}
                            sx={{
                                position: "sticky",
                                top: 20,
                                borderRadius: 3,
                            }}
                        >
                            <CardHeader title="Order Summary" />
                            <Select
                                value={currency}
                                onChange={(e) =>
                                    setCurrency(e.target.value as "USD" | "VND")
                                }
                                className="mb-2 ml-4"
                            >
                                <MenuItem value="VND">
                                    🇻🇳 Vietnamese Dong (VND)
                                </MenuItem>
                                <MenuItem value="USD">
                                    🇺🇸 US Dollar (USD)
                                </MenuItem>
                            </Select>
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
                                        Total
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={600}
                                    >
                                        {formatCurrency(
                                            convertedTotal,
                                            currency
                                        )}
                                    </Typography>
                                </Box>
                                <Link href={`/checkout`}>
                                    <MUIButton
                                        variant="contained"
                                        fullWidth
                                        sx={{ mt: 1.5 }}
                                        startIcon={<CreditCard />}
                                    >
                                        Checkout
                                    </MUIButton>
                                </Link>
                                <Link href={`/courses`}>
                                    <MUIButton
                                        variant="outlined"
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    >
                                        Continue Shopping
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
                                        30-Day Money-Back Guarantee
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="green.600"
                                    >
                                        Full Lifetime Access
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
