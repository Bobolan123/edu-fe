"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { customSignin } from "../../utils/auth/action";
import { loginSchema, LoginFormData } from "@/lib/validationSchemas";
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
        <div>
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">{t("welcome_back")}</h2>
                <p className="mt-2 text-sm text-gray-600">{t("subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            {t("email")}
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder={t("email_placeholder")}
                                {...control.register("email")}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            {t("password")}
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder={t("password_placeholder")}
                                {...control.register("password")}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end">
                    <div className="text-sm">
                        <button
                            type="button"
                            onClick={() => setIsOpenModelForgotPassword(true)}
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            {t("forgot_password")}
                        </button>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {loading ? t("signing_in") : t("login_button")}
                    </button>
                </div>

                <div>
                    <button
                        type="button"
                        onClick={() => signIn("google")}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
                        {t("google_signin")}
                    </button>
                </div>

                <div className="text-center text-sm">
                    <span className="text-gray-600">{t("signup_prompt")} </span>
                    <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                        {t("signup_button")}
                    </Link>
                </div>
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
