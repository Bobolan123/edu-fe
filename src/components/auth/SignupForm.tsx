"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { fetchRegister } from "@/auth.service";
import { signupSchema, SignupFormData } from "@/lib/validationSchemas";
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { toastService } from "@/services/toast";
import VerifyOtpModel from "./VerifyOTP.model";

const SignupForm = () => {
    const t = useTranslations("Signup");
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [isOpenVerify, setIsOpenVerify] = useState(false);
    const [emailModel, setEmailModel] = useState("");

    const handleCloseModelOpenVerify = () => setIsOpenVerify(false);

    const {
        register,
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
        setLoading(true);
        try {
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
        } catch (error) {
            toastService.error("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="max-w-md mx-auto">
            <Box className="text-center mb-8">
                <Typography variant="h4" component="h2" className="font-bold tracking-tight text-gray-900">
                    {t("welcome_title")}
                </Typography>
                <Typography variant="body2" className="mt-2 text-gray-600">
                    {t("subtitle")}
                </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <TextField
                    fullWidth
                    id="fullname"
                    label={t("fullname")}
                    type="text"
                    autoComplete="name"
                    placeholder={t("fullname_placeholder")}
                    error={!!errors.fullname}
                    helperText={errors.fullname?.message}
                    {...register("fullname")}
                    variant="outlined"
                />

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
                    autoComplete="new-password"
                    placeholder={t("password_placeholder")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    {...register("password")}
                    variant="outlined"
                />

                <TextField
                    fullWidth
                    id="confirmPassword"
                    label={t("confirm_password")}
                    type="password"
                    autoComplete="new-password"
                    placeholder={t("confirm_password_placeholder")}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                    variant="outlined"
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    className="py-3"
                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                    {loading ? t("creating_account") : t("signup_button")}
                </Button>

                <Typography variant="body2" className="text-center">
                    <span className="text-gray-600">{t("login_prompt")} </span>
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 no-underline">
                        {t("login_button")}
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
