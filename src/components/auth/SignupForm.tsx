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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { IsValidEmail } from "../../../ultils/ultils";
import { fetchRegister } from "@/auth.service";
import VerifyOtpModel from "./VerifyOTP.model";

const SignupForm = () => {
    const t = useTranslations("Signup");
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isOpenVerify, setIsOpenVerify] = useState(false);

    const handleCloseModelOpenVerify = () => setIsOpenVerify(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!fullName || !email || !password) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (!IsValidEmail(email)) {
            toast.error("Invalid email format.");
            return;
        }

        const res = await fetchRegister(
            email.toString(),
            password.toString(),
            fullName
        );
        if (res?.statusCode === 403) {
            toast.error(res.message);
            setIsOpenVerify(true);
        } else if (res?.statusCode === 400) {
            toast.error(res.message);
        } else {
            toast.success(res.message + " Please verify Email!");
            setIsOpenVerify(true);
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
                    name="fullName"
                    label={t("fullname")}
                    variant="outlined"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
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
                                    {showPassword ? (
                                        <VisibilityIcon />
                                    ) : (
                                        <VisibilityOffIcon />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    {t("signup_button")}
                </Button>
                <Typography variant="body2" align="center">
                    {t("terms")}
                </Typography>
                <Grid container justifyContent="center" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        <Link href="/login"> {t("login_prompt")}</Link>
                    </Typography>
                </Grid>
            </Box>
            <VerifyOtpModel
                email={email}
                handleCloseModelOpenVerify={handleCloseModelOpenVerify}
                isOpenVerify={isOpenVerify}
            />
        </Box>
    );
};

export default SignupForm;
