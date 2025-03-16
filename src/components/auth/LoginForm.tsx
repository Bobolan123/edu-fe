"use client";

import { useState } from "react";
import {
    TextField,
    Button,
    Box,
    Grid,
    Typography,
    IconButton,
    InputAdornment,
    Link as MuiLink,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { customSignin } from "../../../ultils/auth/action";
import { IsValidEmail } from "../../../ultils/ultils";
import ResendOtpModel from "./ResendOtp.model";
import ForgotPasswordModel from "./ForgotPassword.model";

const LoginForm = () => {
    const t = useTranslations("Login");
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isOpenModelResendOtp, setIsOpenModelResendOtp] = useState(false);
    const [isOpenModelForgotPassword, setIsOpenModelForgotPassword] = useState(false);
    const [emailModel, setEmailModel] = useState("");

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleCloseModelResendOtp = () => setIsOpenModelResendOtp(false);
    const handleCloseModelForgotPassword = () => setIsOpenModelForgotPassword(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!email || !password) {
            toast.error("Please enter both email and password.");
            return;
        }

        if (!IsValidEmail(email)) {
            toast.error("Invalid email format.");
            return;
        }
        const res = await customSignin(email, password);
        if (res?.message && res.statusCode === 400) {
            toast.error(res.message);
            
        } else if (res?.message && res.statusCode === 403) {
            toast.error(res.message);
            setEmailModel(email);
            setIsOpenModelResendOtp(true);
        } else {
            router.push("/");
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h5" align="center" gutterBottom>
                {t("title")}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                    fullWidth
                    required
                    margin="normal"
                    name="email"
                    label={t("email")}
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    fullWidth
                    required
                    margin="normal"
                    name="password"
                    label={t("password")}
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowPassword}>
                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button fullWidth type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                    {t("login_button")}
                </Button>
                <Grid container>
                    <Grid item xs>
                        <Typography
                            variant="subtitle2"
                            color="primary"
                            sx={{ cursor: "pointer" }}
                            onClick={() => setIsOpenModelForgotPassword(true)}
                        >
                            {t("forgot_password")}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2">
                            {t("signup_prompt")} <Link href="/signup">{t("signup_button")}</Link>
                        </Typography>
                    </Grid>
                </Grid>
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
