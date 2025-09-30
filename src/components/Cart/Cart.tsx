"use client";

import Image from "next/image";
import {
    Trash2,
    Star,
    Clock,
    Users,
    ShoppingCart,
    ArrowRight,
    BookOpen,
    Shield,
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
    Divider,
    Fade,
    Zoom,
} from "@mui/material";
import { ICartItem } from "../../../types/entities";
import { deleteCartItem } from "@/actions/cartActions";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { createSlugWithId } from "../../utils/utils";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { currencyService } from "@/services/currency";
import { useTranslations } from "next-intl";
// Removed LoadingButton import
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
                    if (!item.course?.id) continue;

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
            <Box className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
                <Zoom in timeout={500}>
                    <Card 
                        elevation={0}
                        sx={{ 
                            p: 6, 
                            textAlign: "center", 
                            maxWidth: 500,
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                            border: '1px solid',
                            borderColor: 'divider',
                            position: 'relative',
                            overflow: 'visible',
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
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                bgcolor: 'primary.50',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px',
                                position: 'relative',
                            }}
                        >
                            <ShoppingCart
                                size={40}
                                className="text-blue-500"
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    border: '2px dashed',
                                    borderColor: 'primary.200',
                                    animation: 'pulse 2s infinite',
                                    '@keyframes pulse': {
                                        '0%': { transform: 'scale(1)', opacity: 1 },
                                        '50%': { transform: 'scale(1.05)', opacity: 0.7 },
                                        '100%': { transform: 'scale(1)', opacity: 1 },
                                    }
                                }}
                            />
                        </Box>
                        
                        <Typography 
                            variant="h4" 
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                mb: 2
                            }}
                        >
                            {t('empty_title')}
                        </Typography>
                        
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 4, lineHeight: 1.6 }}
                        >
                            {t('empty_description')}
                        </Typography>
                        
                        <Link href="/courses">
                            <MUIButton
                                variant="contained"
                                size="large"
                                endIcon={<BookOpen size={20} />}
                                sx={{ 
                                    mt: 2,
                                    py: 1.5,
                                    px: 4,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.25)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                                        boxShadow: '0 12px 35px rgba(59, 130, 246, 0.35)',
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                            >
                                {t('browse_courses')}
                            </MUIButton>
                        </Link>
                        
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1,
                                mt: 4,
                                pt: 3,
                                borderTop: '1px solid',
                                borderColor: 'divider',
                                color: 'text.secondary'
                            }}
                        >
                            <Shield size={16} />
                            <Typography variant="caption">
                                Secure shopping experience
                            </Typography>
                        </Box>
                    </Card>
                </Zoom>
            </Box>
        );
    }

    return (
        <Box 
            sx={{ 
                minHeight: 'calc(100vh - 64px)',
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
                }}>
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
                            {t('title')}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                            <ShoppingCart size={20} className="text-blue-600" />
                            <Typography variant="h6" color="text.secondary" fontWeight={500}>
                                {t('item_count', { count: cartItems.length })}
                            </Typography>
                        </Box>
                    </Box>
                </Fade>

                <Grid container spacing={{ xs: 2, md: 4 }}>
                    <Grid item xs={12} lg={8}>
                        {cartItems.map((cartItem, index) => (
                            <Fade in timeout={800 + index * 100} key={cartItem.id}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        mb: 3,
                                        overflow: "hidden",
                                        borderRadius: 4,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        background: 'linear-gradient(135deg, #ffffff 0%, #fafbff 100%)',
                                        position: 'relative',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': { 
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                                            transform: 'translateY(-4px)',
                                            borderColor: 'primary.200',
                                            '& .course-image': {
                                                transform: 'scale(1.05)',
                                            },
                                            '& .delete-btn': {
                                                opacity: 1,
                                            }
                                        },
                                    }}
                                >
                                    <Link
                                        href={`/courses/${createSlugWithId(
                                            cartItem?.course?.title || "",
                                            cartItem?.course?.id || 0
                                        )}`}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        <Grid container spacing={0}>
                                             <Grid item xs={12} md={4}>
                                                 <Box 
                                                     sx={{ 
                                                         position: 'relative',
                                                                                                                  height: { xs: 80, md: '100%' },
                                                        minHeight: { md: 120 },
                                                         overflow: 'hidden',
                                                         borderRadius: { 
                                                             xs: '16px 16px 0 0',
                                                             md: '16px 0 0 16px' 
                                                         }
                                                     }}
                                                 >
                                                    <Image
                                                        src={
                                                            cartItem?.course
                                                                ?.thumbnail_url ||
                                                            "/img_not_found.png"
                                                        }
                                                        alt={
                                                            cartItem?.course?.title ||
                                                            t('course_image')
                                                        }
                                                        width={160}
                                                        height={80}
                                                        className="course-image w-full h-full object-cover transition-transform duration-300"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            if (target.src !== "/img_not_found.png") {
                                                                target.src = "/img_not_found.png";
                                                            }
                                                        }}
                                                    />
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            bottom: 0,
                                                            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)',
                                                        }}
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <Box
                                                    p={1}
                                                    display="flex"
                                                    flexDirection="column"
                                                    gap={0.5}
                                                    height="100%"
                                                >
                                                    <Box
                                                        display="flex"
                                                        justifyContent="space-between"
                                                        alignItems="start"
                                                        mb={0.5}
                                                    >
                                                        <Typography 
                                                            variant="subtitle1" 
                                                            sx={{
                                                                fontWeight: 700,
                                                                color: 'text.primary',
                                                                lineHeight: 1.3,
                                                                flex: 1,
                                                                mr: 2
                                                            }}
                                                        >
                                                            {cartItem?.course
                                                                ?.title ||
                                                                t('untitled_course')}
                                                        </Typography>
                                                        <MUIButton
                                                            className="delete-btn"
                                                            size="small"
                                                            color="error"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleDeleteItem(
                                                                    +cartItem?.course?.id
                                                                );
                                                            }}
                                                            disabled={deletingItems[cartItem?.course?.id]}
                                                            sx={{
                                                                minWidth: 44,
                                                                minHeight: 44,
                                                                borderRadius: '50%',
                                                                opacity: { xs: 1, md: 0.7 },
                                                                transition: 'all 0.2s ease-in-out',
                                                                bgcolor: 'background.paper',
                                                                border: '2px solid',
                                                                borderColor: 'error.200',
                                                                '&:hover': {
                                                                    backgroundColor: 'error.50',
                                                                    borderColor: 'error.400',
                                                                    transform: 'scale(1.05)',
                                                                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
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
                                                        variant="body1"
                                                        color="text.secondary"
                                                        sx={{
                                                            lineHeight: 1.4,
                                                            mb: 1,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        {cartItem?.course
                                                            ?.description ||
                                                            t('no_description')}
                                                    </Typography>

                                                    <Box
                                                        display="flex"
                                                        alignItems="center"
                                                        gap={0.75}
                                                        mb={0.5}
                                                    >
                                                                                                                 <Box
                                                             sx={{
                                                                 position: 'relative',
                                                                                                                                 width: 36,
                                                                height: 36,
                                                                 borderRadius: '50%',
                                                                 overflow: 'hidden',
                                                                 border: '2px solid',
                                                                 borderColor: 'primary.200',
                                                                 bgcolor: 'primary.50',
                                                                 boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.1)',
                                                                 transition: 'all 0.3s ease',
                                                                 '&:hover': {
                                                                     transform: 'scale(1.05)',
                                                                     boxShadow: '0 0 0 6px rgba(59, 130, 246, 0.15)',
                                                                 }
                                                             }}
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
                                                                                                                                 width={36}
                                                                height={36}
                                                                 className="w-full h-full object-cover"
                                                             />
                                                         </Box>
                                                         <Box>
                                                             <Typography 
                                                                 variant="caption" 
                                                                 sx={{
                                                                     color: 'primary.600',
                                                                     bgcolor: 'primary.50',
                                                                     px: 1,
                                                                     py: 0.5,
                                                                     borderRadius: 1,
                                                                     display: 'inline-block',
                                                                     mb: 0.5,
                                                                     fontWeight: 500
                                                                 }}
                                                             >
                                                                 Course Instructor
                                                             </Typography>
                                                             <Typography 
                                                                 variant="body1"
                                                                 fontWeight={700}
                                                                 sx={{
                                                                     color: 'text.primary',
                                                                     transition: 'color 0.2s ease',
                                                                     '&:hover': {
                                                                         color: 'primary.main'
                                                                     }
                                                                 }}
                                                             >
                                                                 {cartItem?.course
                                                                     ?.instructor
                                                                     ?.name ||
                                                                     t('unknown_instructor')}
                                                             </Typography>
                                                         </Box>
                                                    </Box>

                                                    <Box
                                                        display="flex"
                                                        gap={1}
                                                        flexWrap="wrap"
                                                        mb={0.5}
                                                    >
                                                        <Chip
                                                            icon={<Star size={14} />}
                                                            label={`${formatRating(
                                                                cartItem?.course
                                                                    ?.average_rating
                                                            )} (${cartItem?.course
                                                                ?.total_reviews || 0})`}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: '#fef3c7',
                                                                color: '#92400e',
                                                                fontWeight: 600,
                                                                '& .MuiChip-icon': {
                                                                    color: '#f59e0b'
                                                                }
                                                            }}
                                                        />
                                                        <Chip
                                                            icon={<Clock size={14} />}
                                                            label={cartItem?.course?.language || 'English'}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: '#dbeafe',
                                                                color: '#1e40af',
                                                                fontWeight: 600,
                                                                '& .MuiChip-icon': {
                                                                    color: '#3b82f6'
                                                                }
                                                            }}
                                                        />
                                                        <Chip
                                                            icon={<Users size={14} />}
                                                            label={cartItem?.course?.total_students?.toLocaleString() || "0"}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: '#dcfce7',
                                                                color: '#166534',
                                                                fontWeight: 600,
                                                                '& .MuiChip-icon': {
                                                                    color: '#22c55e'
                                                                }
                                                            }}
                                                        />
                                                    </Box>

                                                                                                         <Box
                                                         sx={{
                                                             mt: 'auto',
                                                             pt: 2,
                                                             borderTop: '1px dashed',
                                                             borderColor: 'divider'
                                                         }}
                                                     >
                                                         <Box 
                                                             display="flex" 
                                                             justifyContent="space-between"
                                                             alignItems="center"
                                                         >
                                                             <Box 
                                                                 sx={{
                                                                     display: 'flex',
                                                                     alignItems: 'center',
                                                                     gap: 1,
                                                                     px: 2,
                                                                     py: 1,
                                                                     borderRadius: 2,
                                                                     bgcolor: 'primary.50',
                                                                     transition: 'all 0.2s ease',
                                                                     '&:hover': {
                                                                         bgcolor: 'primary.100',
                                                                         transform: 'translateX(4px)'
                                                                     }
                                                                 }}
                                                             >
                                                                 <ArrowRight size={16} className="text-blue-600" />
                                                                 <Typography 
                                                                     variant="body2" 
                                                                     color="primary.700"
                                                                     fontWeight={600}
                                                                 >
                                                                     View Course Details
                                                                 </Typography>
                                                             </Box>
                                                             <Box>
                                                                 {isConvertingPrices && !convertedPrices[cartItem.course?.id] ? (
                                                                     <Skeleton 
                                                                         variant="text" 
                                                                         width={120} 
                                                                         height={40}
                                                                     />
                                                                 ) : (
                                                                     <Box textAlign="right">
                                                                         <Typography 
                                                                             variant="caption" 
                                                                             display="block" 
                                                                             color="text.secondary"
                                                                             mb={0.5}
                                                                         >
                                                                             Course Price
                                                                         </Typography>
                                                                         <Typography 
                                                                             variant="h4" 
                                                                             sx={{
                                                                                 fontWeight: 800,
                                                                                 background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                                                                                 backgroundClip: 'text',
                                                                                 WebkitBackgroundClip: 'text',
                                                                                 color: 'transparent',
                                                                                 letterSpacing: '-0.02em'
                                                                             }}
                                                                         >
                                                                             {currencyService.formatPrice(
                                                                                 convertedPrices[
                                                                                     cartItem.course
                                                                                         ?.id
                                                                                 ] || 0,
                                                                                 currency
                                                                             )}
                                                                         </Typography>
                                                                     </Box>
                                                                 )}
                                                             </Box>
                                                         </Box>
                                                     </Box>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Link>
                                </Card>
                            </Fade>
                        ))}
                    </Grid>

                    {/* Summary Section */}
                    <Grid item xs={12} lg={4}>
                        <Fade in timeout={1000}>
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
                                    <CardHeader 
                                        title={
                                            <Box display="flex" alignItems="center" gap={1.5}>
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
                                                    <ShoppingCart size={18} className="text-blue-600" />
                                                </Box>
                                                <Typography variant="h5" fontWeight={700}>
                                                    {t('order_summary')}
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{
                                            pb: 1,
                                            '& .MuiCardHeader-title': {
                                                fontSize: '1.25rem'
                                            }
                                        }}
                                    />

                                    <CardContent sx={{ pt: 0 }}>
                                        {/* Items Summary */}
                                        <Box mb={3}>
                                            <Typography variant="body2" color="text.secondary" mb={1}>
                                                Items in cart
                                            </Typography>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <BookOpen size={16} className="text-blue-600" />
                                                <Typography variant="body1" fontWeight={600}>
                                                    {cartItems.length} {cartItems.length === 1 ? 'course' : 'courses'}
                                                </Typography>
                                            </Box>
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
                                                {t('total')}
                                            </Typography>
                                            {isConvertingTotal ? (
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
                                                    {currencyService.formatPrice(
                                                        convertedTotal,
                                                        currency
                                                    )}
                                                </Typography>
                                            )}
                                        </Box>

                                        {/* Checkout Button */}
                                        <Link href={`/checkout`}>
                                            <MUIButton
                                                variant="contained"
                                                fullWidth
                                                size="large"
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
                                                startIcon={<ShoppingCart size={20} />}
                                                disabled={isConvertingTotal || isConvertingPrices}
                                            >
                                                {t('checkout')}
                                            </MUIButton>
                                        </Link>

                                        {/* Continue Shopping */}
                                        <Link href={`/courses`}>
                                            <MUIButton
                                                variant="outlined"
                                                fullWidth
                                                sx={{ 
                                                    mb: 3,
                                                    py: 1.2,
                                                    borderRadius: 3,
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    borderColor: 'primary.300',
                                                    color: 'primary.600',
                                                    '&:hover': {
                                                        borderColor: 'primary.500',
                                                        bgcolor: 'primary.50',
                                                        transform: 'translateY(-1px)',
                                                    },
                                                    transition: 'all 0.2s ease-in-out',
                                                }}
                                                startIcon={<ArrowRight size={18} />}
                                            >
                                                {t('continue_shopping')}
                                            </MUIButton>
                                        </Link>

                                        {/* Guarantee Badge */}
                                        <Box
                                            p={3}
                                            borderRadius={3}
                                            sx={{
                                                background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
                                                border: '1px solid #bbf7d0',
                                                position: 'relative',
                                                overflow: 'hidden',
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
                                            <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                                                <Shield size={20} className="text-green-600" />
                                                <Typography
                                                    variant="subtitle2"
                                                    fontWeight={700}
                                                    color="green.800"
                                                >
                                                    {t('money_back_guarantee')}
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                color="green.700"
                                                lineHeight={1.5}
                                            >
                                                {t('lifetime_access')}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Fade>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Cart;
