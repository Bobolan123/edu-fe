"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { TextField, CircularProgress, alpha } from "@mui/material";
import { fetchResendOtp, fetchVerifyOTP } from "@/auth.service";
import { toast } from "react-toastify";
import { useTranslations } from 'next-intl';
// Removed LoadingButton import
import { toastService } from "@/services/toast";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 440,
    bgcolor: "background.paper",
    border: "none",
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)',
    p: 4,
};

const steps = ["Verify", "Done"];

interface IResendOtpModelProps {
    handleCloseModelOpenVerify: () => void;
    isOpenVerify: boolean;
    email: string;
}
export default function VerifyOtpModel(props: IResendOtpModelProps) {
    const { isOpenVerify, handleCloseModelOpenVerify, email } = props;
    const [step, setStep] = React.useState<number>(0);
    const [userId, setUserId] = React.useState<number>(0);
    const [otp, setOtp] = React.useState<string>("");
    const t = useTranslations('VerifyOTP');
    
    // Loading states
    const [isVerifying, setIsVerifying] = React.useState(false);
    const [isResending, setIsResending] = React.useState(false);

    const handleVerify = async () => {
        if (!otp.trim()) {
            toastService.error('Please enter the OTP code');
            return;
        }
        
        setIsVerifying(true);
        try {
            const res = await fetchVerifyOTP(userId, +otp);

            if (res?.data) {
                toastService.success(res?.message);
                setStep(1);
            } else {
                toastService.error(res?.message);
            }
        } catch (error) {
            toastService.error('Verification failed. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendOtp = async (email: string) => {
        setIsResending(true);
        try {
            const res = await fetchResendOtp(email);
            if (res?.data) {
                setUserId(res?.data?.id);
                toastService.success(res.message);
            } else {
                toastService.error(res.message);
            }
        } catch (error) {
            toastService.error('Failed to resend OTP. Please try again.');
        } finally {
            setIsResending(false);
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
                    <Box sx={{ mb: 3 }}>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontWeight: 700,
                                mb: 2,
                                textAlign: 'center',
                                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Email Verification
                        </Typography>
                        <Stepper activeStep={step} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{t(`steps.${label.toLowerCase()}`)}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                    <Box
                        mt={3}
                        gap={3}
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                        {step === 0 && (
                            <>
                                <Typography 
                                    variant="body1" 
                                    color="text.secondary"
                                    sx={{ textAlign: 'center', mb: 2 }}
                                >
                                    {t('verify_account')}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{ textAlign: 'center', mb: 3 }}
                                >
                                    We've sent a verification code to <strong>{email}</strong>
                                </Typography>
                                <TextField
                                    name="otp"
                                    fullWidth
                                    id="otp"
                                    label="Enter OTP Code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    disabled={isVerifying || isResending}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            backgroundColor: alpha('#0ea5e9', 0.02),
                                            '&:hover': {
                                                backgroundColor: alpha('#0ea5e9', 0.04),
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: alpha('#0ea5e9', 0.06),
                                            },
                                        },
                                        mb: 2,
                                    }}
                                    inputProps={{
                                        style: { textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.1em' },
                                        maxLength: 6,
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleVerify}
                                    fullWidth
                                    size="large"
                                    disabled={isVerifying || !otp.trim()}
                                    startIcon={isVerifying && <CircularProgress size={20} color="inherit" />}
                                    sx={{
                                        height: 48,
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                                        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                            boxShadow: '0 6px 20px rgba(14, 165, 233, 0.4)',
                                        },
                                        mb: 2,
                                    }}
                                >
                                    {isVerifying ? 'Verifying...' : t('verify_button')}
                                </Button>
                                <Button
                                    variant="text"
                                    onClick={() => handleResendOtp(email)}
                                    disabled={isVerifying || isResending}
                                    startIcon={isResending && <CircularProgress size={16} color="inherit" />}
                                    sx={{
                                        fontWeight: 500,
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: alpha('#0ea5e9', 0.04),
                                        },
                                    }}
                                >
                                    {isResending ? 'Resending...' : t('resend_otp')}
                                </Button>
                            </>
                        )}
                        {step === 1 && (
                            <>
                                <Box sx={{ textAlign: 'center', mb: 3 }}>
                                    <Box
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 16px',
                                            fontSize: '24px',
                                        }}
                                    >
                                        ✓
                                    </Box>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            fontWeight: 600,
                                            color: 'success.main',
                                            mb: 1,
                                        }}
                                    >
                                        Email Verified!
                                    </Typography>
                                    <Typography 
                                        variant="body1" 
                                        color="text.secondary"
                                    >
                                        {t('success_message')}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    onClick={handleDone}
                                    fullWidth
                                    size="large"
                                    sx={{
                                        height: 48,
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                                        },
                                    }}
                                >
                                    {t('done_button')}
                                </Button>
                            </>
                        )}
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
