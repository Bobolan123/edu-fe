"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { TextField } from "@mui/material";
import { toast } from "react-toastify";
import { fetchChangePassword, fetchResendOtp } from "@/auth.service";
import { IsValidEmail } from "../../../utils/utils";
import { useTranslations } from "next-intl";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

interface IForgotPasswordModelProps {
    handleCloseModelForgotPassword: any;
    isOpenModelForgotPassword: boolean;
    email: string;
    id: number;
}
export default function ForgotPasswordModel(props: any) {
    const { isOpenModelForgotPassword, handleCloseModelForgotPassword } = props;
    const t = useTranslations("ForgotPassword");

    const [email, setEmail] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [confirmPassword, setConfirmPassword] = React.useState<string>("");
    const [step, setStep] = React.useState<number>(0);
    const [otp, setOtp] = React.useState<string>("");

    const steps = [t("steps.login"), t("steps.verify"), t("steps.done")];

    const handleResendOtp = async (email: string) => {
        if (!email || !IsValidEmail(email)) {
            toast.error("Email is invalid");
            return;
        }
        const res = await fetchResendOtp(email);
        if (res?.data) {
            setStep(1);
        } else {
            toast.error(res?.message);
        }
    };

    const handleChangePassword = async (
        email: string,
        password: string,
        confirmPassword: string
    ) => {
        const res = await fetchChangePassword(
            email,
            password,
            confirmPassword,
            otp || "0"
        );
        if (res?.data) {
            toast.success(res?.message);

            setStep(2);
        } else {
            toast.error(res?.message);
        }
    };

    const handleDone = async () => {
        handleCloseModelForgotPassword();
        setStep(0);
    };
    return (
        <div>
            <Modal
                open={isOpenModelForgotPassword}
                onClose={handleCloseModelForgotPassword}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Stepper activeStep={step} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <Box
                        mt={3}
                        gap={2}
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        {step === 0 && (
                            <>
                                <Typography variant="h5">
                                    Forgot password?
                                </Typography>
                                <TextField
                                    required
                                    fullWidth
                                    size="small"
                                    id="email"
                                    name="email"
                                    label={t("email")}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <Button
                                    variant="contained"
                                    onClick={() => handleResendOtp(email)}
                                >
                                    {t("send_otp")}
                                </Button>
                            </>
                        )}
                        {step === 1 && (
                            <>
                                <Typography>Change password!</Typography>
                                <TextField
                                    fullWidth
                                    name="otp"
                                    size="small"
                                    id="otp"
                                    label={t("verify_otp")}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    size="small"
                                    fullWidth
                                    name="password"
                                    label={t("new_password")}
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    type="password"
                                    size="small"
                                    name="confirmPassword"
                                    label={t("confirm_password")}
                                    id="confirmPassword"
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        handleChangePassword(
                                            email,
                                            password,
                                            confirmPassword
                                        )
                                    }
                                >
                                    {t("change_password")}
                                </Button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <Typography>
                                    {t("success_message")}
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => handleDone()}
                                >
                                    {t("done_button")}
                                </Button>
                            </>
                        )}
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
