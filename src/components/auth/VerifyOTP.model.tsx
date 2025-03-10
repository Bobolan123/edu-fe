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
import { fetchResendOtp, fetchVerifyOTP } from "@/auth.service";

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

const steps = ["Verify", "Done"];

interface IResendOtpModelProps {
    handleCloseModelOpenVerify: () =>void;
    isOpenVerify: boolean;
    email: string;
}
export default function VerifyOtpModel(props: IResendOtpModelProps) {
    const { isOpenVerify, handleCloseModelOpenVerify, email } = props;
    const [step, setStep] = React.useState<number>(0);
    const [userId, setUserId] = React.useState<number>(0);
    const [otp, setOtp] = React.useState<string>("");

    const handleVerify = async (id: number, otp: number) => {
        const res = await fetchVerifyOTP(id, otp);

        if (res?.data) {
            setStep(1);
        }
    };
    const handleDone = async () => {
        handleCloseModelOpenVerify();
    };
    return (
        <div>
            <Modal
                open={isOpenVerify}
                onClose={handleCloseModelOpenVerify}
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
                                <Typography>Verify your account!</Typography>
                                <TextField
                                    name="email"
                                    size="small"
                                    id="email"
                                    defaultValue={email}
                                    disabled
                                    onChange={(e) => setOtp(e.target.value)} 
                                />
                                <TextField
                                    name="otp"
                                    size="small"
                                    id="otp"
                                    label="OTP"
                                    onChange={(e) => setOtp(e.target.value)} 
                                />
                                <Button
                                    variant="contained"
                                    onClick={() => handleVerify(userId, +otp)}
                                >
                                    Verify
                                </Button>
                            </>
                        )}

                        {step === 1 && (
                            <>
                                <Typography>
                                    Succesfully. Please sign up
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => handleDone()}
                                >
                                    Done
                                </Button>
                            </>
                        )}
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
