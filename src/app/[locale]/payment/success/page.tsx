import { Metadata } from "next";
import {
    Container,
    Typography,
    Box,
    Button,
    Paper,
    Grid,
    Stack,
    Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SchoolIcon from "@mui/icons-material/School";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import DownloadIcon from "@mui/icons-material/Download";
import GroupIcon from "@mui/icons-material/Group";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
    title: "Payment Successful - MindfulMaze",
    description: "Your payment has been processed successfully",
};

interface PaymentSuccessPageProps {
    searchParams: Promise<{
        orderId?: string;
        price?: string;
        status?: string;
        method?: string;
        date?: string;
        transactionId?: string;
    }>;
}

export default async function PaymentSuccessPage({
    searchParams,
}: PaymentSuccessPageProps) {
    const t = await getTranslations("Payment");
    const params = await searchParams;

    const orderInfo = {
        orderId: params.orderId,
        price: params.price ? parseFloat(params.price) : null,
        status: params.status,
        method: params.method,
        date: params.date ? new Date(params.date) : null,
        transactionId: params.transactionId,
    };

    const nextSteps = [
        {
            icon: SchoolIcon,
            title: t("whats_next_list.access_materials"),
            description: "Start learning immediately with full course access",
            color: "from-emerald-400 to-teal-400",
            bgColor: "from-emerald-100 via-emerald-50 to-teal-50",
        },
        {
            icon: VideoLibraryIcon,
            title: t("whats_next_list.start_watching"),
            description: "High-quality video content at your fingertips",
            color: "from-blue-400 to-indigo-400",
            bgColor: "from-blue-100 via-blue-50 to-indigo-50",
        },
        {
            icon: DownloadIcon,
            title: t("whats_next_list.download_resources"),
            description: "Get additional materials and worksheets",
            color: "from-purple-400 to-violet-400",
            bgColor: "from-purple-100 via-purple-50 to-violet-50",
        },
        {
            icon: GroupIcon,
            title: t("whats_next_list.join_community"),
            description: "Connect with fellow learners and instructors",
            color: "from-pink-400 to-rose-400",
            bgColor: "from-pink-100 via-pink-50 to-rose-50",
        },
    ];

    return (
        <Box className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
            <Container maxWidth="lg" className="py-4 flex flex-col items-center justify-center  ">
                {/* Success Message */}
                <Box className="text-center mb-6">
                    <Box className="inline-flex items-center justify-center gap-3 mb-3">
                        <Box className="p-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500">
                            <CheckCircleIcon className="h-6 w-6 text-white" />
                        </Box>
                        <Typography
                            variant="h1"
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-bold"
                            sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem" } }}
                        >
                            {t("success_title")}
                        </Typography>
                    </Box>
                    <Typography
                        variant="subtitle1"
                        className="text-gray-600 mb-6 font-medium mx-auto max-w-lg text-center"
                    >
                        {t("success_description")}
                    </Typography>
                </Box>

                {/* Order Information Section */}
                {orderInfo.orderId && (
                    <Box className="mb-6 w-full max-w-2xl">
                        <Paper
                            elevation={0}
                            className="p-6 bg-white rounded-xl border border-gray-100 shadow-md"
                        >
                            <Box className="flex items-center gap-2 mb-4">
                                <ReceiptIcon className="h-5 w-5 text-emerald-600" />
                                <Typography
                                    variant="h6"
                                    className="font-semibold text-gray-800"
                                >
                                    Order Summary
                                </Typography>
                            </Box>
                            
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
                                                Amount Paid
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" className="font-medium text-emerald-600">
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
                                                Transaction Date
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

                {/* What's Next Section */}
                <Box className="mb-6">
                    <Typography
                        variant="h2"
                        className="text-center mb-4 text-gray-800 font-bold"
                        sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem" } }}
                    >
                        What's Next?
                    </Typography>

                    <Grid container spacing={2}>
                        {nextSteps.map((step, index) => (
                            <Grid item xs={6} key={index}>
                                <Paper
                                    elevation={0}
                                    className={`p-3 bg-gradient-to-br ${step.bgColor} rounded-xl border border-white/60 hover:shadow-md transition-shadow`}
                                >
                                    <Box className="text-center">
                                        <Box
                                            className={`p-2 rounded-lg bg-gradient-to-r ${step.color} mx-auto mb-2 inline-flex`}
                                        >
                                            <step.icon className="h-5 w-5 text-white" />
                                        </Box>
                                        <Typography
                                            variant="subtitle1"
                                            className="font-semibold text-gray-800 mb-1"
                                        >
                                            {step.title}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            className="text-gray-600 block"
                                        >
                                            {step.description}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
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
                                href="/my-learning"
                                startIcon={<SchoolIcon />}
                                className="rounded-lg px-4 py-1.5 font-medium"
                                sx={{
                                    background:
                                        "linear-gradient(45deg, #10b981, #059669)",
                                    "&:hover": {
                                        background:
                                            "linear-gradient(45deg, #059669, #047857)",
                                    },
                                }}
                            >
                                {t("go_to_learning")}
                            </Button>

                            <Button
                                variant="outlined"
                                size="medium"
                                component={Link}
                                href="/"
                                className="rounded-lg px-4 py-1.5 font-medium"
                                sx={{
                                    borderColor: "#10b981",
                                    color: "#059669",
                                    "&:hover": {
                                        borderColor: "#059669",
                                        backgroundColor:
                                            "rgba(16, 185, 129, 0.1)",
                                    },
                                }}
                            >
                                {t("back_to_home")}
                            </Button>
                        </Stack>

                        <Typography variant="caption" className="text-gray-600 block">
                            {t("need_help", {
                                email: "support@mindfulmaze.com",
                            })}
                        </Typography>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
}
