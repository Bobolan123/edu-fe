"use client";

import { useState } from "react";
import {
    Button,
    Box,
    Grid,
    Typography,
    Link as MuiLink,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { customSignin } from "../../../utils/auth/action";
import { loginSchema, LoginFormData } from "@/lib/validationSchemas";
import { FormTextField } from "@/components/common/FormComponents";
import { LoadingButton, useLoadingState } from "@/components/common/Loading";
import { toastService } from "@/services/toast";
import ResendOtpModel from "./ResendOtp.model";
import ForgotPasswordModel from "./forgotPassword.model";

const LoginForm = () => {
    const t = useTranslations("Login");
    const router = useRouter();
    const { loading, withLoading } = useLoadingState();

    const [isOpenModelResendOtp, setIsOpenModelResendOtp] = useState(false);
    const [isOpenModelForgotPassword, setIsOpenModelForgotPassword] = useState(false);
    const [emailModel, setEmailModel] = useState("");

    const handleCloseModelResendOtp = () => setIsOpenModelResendOtp(false);
    const handleCloseModelForgotPassword = () => setIsOpenModelForgotPassword(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        getValues,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await withLoading(async () => {
                const res = await customSignin(data.email, data.password);
                
                if (res?.message && res.statusCode === 400) {
                    toastService.error(res.message);
                } else if (res?.message && res.statusCode === 403) {
                    toastService.warning(res.message);
                    setEmailModel(data.email);
                    setIsOpenModelResendOtp(true);
                } else {
                    toastService.success("Login successful! Redirecting...");
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1000);
                }
            });
        } catch (error) {
            toastService.error("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <Box 
            sx={{ 
                display: "flex", 
                flexDirection: "column",
                maxWidth: "400px",
                margin: "0 auto",
                p: 4,
            }}
        >
            {/* Header Section */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        fontWeight: 700,
                        mb: 2,
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    {t("title")}
                </Typography>
                <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ mb: 4 }}
                >
                    Welcome back! Please sign in to continue your learning journey.
                </Typography>
            </Box>

            {/* Form Section */}
            <Box 
                component="form" 
                onSubmit={handleSubmit(onSubmit)} 
                noValidate 
                sx={{
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    borderRadius: '20px',
                    p: 4,
                    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ mb: 3 }}>
                    <FormTextField
                        name="email"
                        control={control}
                        label={t("email")}
                        type="email"
                        required
                        disabled={loading}
                        placeholder="your.email@example.com"
                        startAdornment={
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                                <Box
                                    sx={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        backgroundColor: 'primary.main',
                                    }}
                                />
                            </Box>
                        }
                    />
                </Box>
                
                <Box sx={{ mb: 4 }}>
                    <FormTextField
                        name="password"
                        control={control}
                        label={t("password")}
                        type="password"
                        required
                        disabled={loading}
                        showPasswordToggle
                        placeholder="Enter your password"
                        startAdornment={
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                                <Box
                                    sx={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        backgroundColor: 'secondary.main',
                                    }}
                                />
                            </Box>
                        }
                    />
                </Box>

                <LoadingButton
                    loading={loading}
                    loadingText="Signing in..."
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                        height: 56,
                        borderRadius: '16px',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                            boxShadow: '0 8px 25px rgba(14, 165, 233, 0.4)',
                            transform: 'translateY(-2px)',
                        },
                        '&:active': {
                            transform: 'translateY(0)',
                        },
                        mb: 3,
                    }}
                >
                    {t("login_button")}
                </LoadingButton>
                {/* Footer Links */}
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography
                        variant="body2"
                        color="primary"
                        sx={{ 
                            cursor: "pointer",
                            textDecoration: 'underline',
                            mb: 2,
                            '&:hover': {
                                color: 'primary.dark',
                            },
                        }}
                        onClick={() => setIsOpenModelForgotPassword(true)}
                    >
                        {t("forgot_password")}
                    </Typography>
                </Box>
            </Box>

            {/* Sign Up Link */}
            <Box 
                sx={{ 
                    textAlign: 'center', 
                    mt: 4,
                    p: 3,
                    borderRadius: '16px',
                    backgroundColor: 'rgba(14, 165, 233, 0.04)',
                    border: '1px solid',
                    borderColor: 'rgba(14, 165, 233, 0.1)',
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    {t("signup_prompt")}{" "}
                    <Link 
                        href="/signup"
                        style={{
                            color: '#0ea5e9',
                            textDecoration: 'none',
                            fontWeight: 600,
                        }}
                    >
                        {t("signup_button")}
                    </Link>
                </Typography>
            </Box>
            <ResendOtpModel
                isOpenModelResendOtp={isOpenModelResendOtp}
                handleCloseModelResendOtp={handleCloseModelResendOtp}
                email={emailModel}
            />
            <ForgotPasswordModel
                isOpenModelForgotPassword={isOpenModelForgotPassword}
                handleCloseModelForgotPassword={handleCloseModelForgotPassword}
            />
        </Box>
    );
};

export default LoginForm;
