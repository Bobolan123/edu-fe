"use client";

import { useState } from "react";
import {
    Button,
    Box,
    Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { fetchRegister } from "@/auth.service";
import { signupSchema, SignupFormData } from "@/lib/validationSchemas";
import { FormTextField } from "@/components/common/FormComponents";
import { LoadingButton, useLoadingState } from "@/components/common/Loading";
import { toastService } from "@/services/toast";
import VerifyOtpModel from "./VerifyOTP.model";

const SignupForm = () => {
    const t = useTranslations("Signup");
    const router = useRouter();
    const { loading, withLoading } = useLoadingState();

    const [isOpenVerify, setIsOpenVerify] = useState(false);
    const [emailModel, setEmailModel] = useState("");

    const handleCloseModelOpenVerify = () => setIsOpenVerify(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        getValues,
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            fullname: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: SignupFormData) => {
        try {
            await withLoading(async () => {
                const res = await fetchRegister(
                    data.email,
                    data.password,
                    data.fullname
                );
                
                if (res?.statusCode === 403) {
                    toastService.error(res.message);
                    setEmailModel(data.email);
                    setIsOpenVerify(true);
                } else if (res?.statusCode === 400) {
                    toastService.error(res.message);
                } else {
                    toastService.success(res.message + " Please verify Email!");
                    setEmailModel(data.email);
                    setIsOpenVerify(true);
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
                    Create your account to start your learning journey with us!
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
                        name="fullname"
                        control={control}
                        label={t("fullname")}
                        type="text"
                        required
                        disabled={loading}
                        placeholder="Enter your full name"
                        startAdornment={
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                                <Box
                                    sx={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        backgroundColor: 'success.main',
                                    }}
                                />
                            </Box>
                        }
                    />
                </Box>

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
                
                <Box sx={{ mb: 3 }}>
                    <FormTextField
                        name="password"
                        control={control}
                        label={t("password")}
                        type="password"
                        required
                        disabled={loading}
                        showPasswordToggle
                        placeholder="Password"
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

                <Box sx={{ mb: 4 }}>
                    <FormTextField
                        name="confirmPassword"
                        control={control}
                        label="Confirm Password"
                        type="password"
                        required
                        disabled={loading}
                        showPasswordToggle
                        placeholder="Confirm your password"
                        startAdornment={
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                                <Box
                                    sx={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        backgroundColor: 'warning.main',
                                    }}
                                />
                            </Box>
                        }
                    />
                </Box>

                <LoadingButton
                    loading={loading}
                    loadingText="Creating account..."
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
                    {t("signup_button")}
                </LoadingButton>

                {/* Terms */}
                <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ textAlign: 'center', mb: 2 }}
                >
                    {t("terms")}
                </Typography>
            </Box>

            {/* Login Link */}
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
                    Already have an account?{" "}
                    <Link 
                        href="/login"
                        style={{
                            color: '#0ea5e9',
                            textDecoration: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Sign in
                    </Link>
                </Typography>
            </Box>

            <VerifyOtpModel
                email={emailModel}
                handleCloseModelOpenVerify={handleCloseModelOpenVerify}
                isOpenVerify={isOpenVerify}
            />
        </Box>
    );
};

export default SignupForm;
