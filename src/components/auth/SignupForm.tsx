"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { fetchRegister } from "@/auth.service";
import { signupSchema, SignupFormData } from "@/lib/validationSchemas";
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
        <div>
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">{t("welcome_title")}</h2>
                <p className="mt-2 text-sm text-gray-600">{t("subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                            {t("fullname")}
                        </label>
                        <div className="mt-1">
                            <input
                                id="fullname"
                                type="text"
                                autoComplete="name"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder={t("fullname_placeholder")}
                                {...control.register("fullname")}
                            />
                        </div>
                    </div>

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
                                autoComplete="new-password"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder={t("password_placeholder")}
                                {...control.register("password")}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            {t("confirm_password")}
                        </label>
                        <div className="mt-1">
                            <input
                                id="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder={t("confirm_password_placeholder")}
                                {...control.register("confirmPassword")}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {loading ? t("creating_account") : t("signup_button")}
                    </button>
                </div>

                <div className="text-center text-sm">
                    <span className="text-gray-600">{t("login_prompt")} </span>
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        {t("login_button")}
                    </Link>
                </div>
            </form>

            <VerifyOtpModel
                email={emailModel}
                handleCloseModelOpenVerify={handleCloseModelOpenVerify}
                isOpenVerify={isOpenVerify}
            />
        </div>
    );
};

export default SignupForm;
