"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { customSignin } from "../../utils/auth/action";
import { loginSchema, LoginFormData } from "@/lib/validationSchemas";
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
  Divider
} from "@mui/material";
import { toastService } from "@/services/toast";
import ForgotPasswordModel from "./forgotPassword.model";
import ResendOtpModel from "./resendOtp.model";

const LoginForm = () => {
    const t = useTranslations("Login");
    const router = useRouter();
    const locale = useLocale();
    const [loading, setLoading] = useState(false);

    const [isOpenModelResendOtp, setIsOpenModelResendOtp] = useState(false);
    const [isOpenModelForgotPassword, setIsOpenModelForgotPassword] = useState(false);
    const [emailModel, setEmailModel] = useState("");

    const handleCloseModelResendOtp = () => setIsOpenModelResendOtp(false);
    const handleCloseModelForgotPassword = () => setIsOpenModelForgotPassword(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        try {
            const res = await customSignin(data.email, data.password);

            if (res?.message && res.statusCode === 400) {
                toastService.error(res.message);
            } else if (res?.message && res.statusCode === 403) {
                toastService.warning(res.message);
                setEmailModel(data.email);
                setIsOpenModelResendOtp(true);
            } else {
                toastService.success("Login successful! Redirecting...");

                // Get session to check user role
                const session = await getSession();
                const userRole = (session?.user as any)?.role;

                // Redirect based on role
                let redirectUrl = `/${locale}/`; // default to home
                if (userRole === 'instructor') {
                    redirectUrl = `/${locale}/my-courses`;
                } else if (userRole === 'admin') {
                    redirectUrl = `/${locale}/admin`;
                }

                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 1000);
            }
        } catch (error) {
            toastService.error("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
                <Typography variant="h4" component="h2" className="font-bold tracking-tight text-gray-900">
                    {t("welcome_back")}
                </Typography>
                <Typography variant="body2" className="mt-2 text-gray-600">
                    {t("subtitle")}
                </Typography>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <TextField
                    fullWidth
                    id="email"
                    label={t("email")}
                    type="email"
                    autoComplete="email"
                    placeholder={t("email_placeholder")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    {...register("email")}
                    variant="outlined"
                />

                <TextField
                    fullWidth
                    id="password"
                    label={t("password")}
                    type="password"
                    autoComplete="current-password"
                    placeholder={t("password_placeholder")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    {...register("password")}
                    variant="outlined"
                />

                <Box className="flex items-center justify-end">
                    <Button
                        variant="text"
                        onClick={() => setIsOpenModelForgotPassword(true)}
                        className="text-blue-600 hover:text-blue-500"
                    >
                        {t("forgot_password")}
                    </Button>
                </Box>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    className="py-3"
                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                    {loading ? t("signing_in") : t("login_button")}
                </Button>

                <Divider className="my-6">
                    <Typography variant="body2" color="text.secondary">
                        or
                    </Typography>
                </Divider>

                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => signIn("google")}
                    className="py-3"
                    startIcon={
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                    }
                >
                    {t("google_signin")}
                </Button>

                <Typography variant="body2" className="text-center">
                    <span className="text-gray-600">{t("signup_prompt")} </span>
                    <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500 no-underline">
                        {t("signup_button")}
                    </Link>
                </Typography>
            </form>

            <ResendOtpModel
                isOpenModelResendOtp={isOpenModelResendOtp}
                handleCloseModelResendOtp={handleCloseModelResendOtp}
                email={emailModel}
            />
            <ForgotPasswordModel
                isOpenModelForgotPassword={isOpenModelForgotPassword}
                handleCloseModelForgotPassword={handleCloseModelForgotPassword}
            />
        </div>
    );
};

export default LoginForm;
