"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { TextField, CircularProgress, alpha, Alert } from "@mui/material";
import { fetchResendOtp, fetchVerifyOTP } from "@/auth.service";
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

const steps = ["Login", "Verify", "Done"];

interface IResendOtpModelProps {
    handleCloseModelResendOtp: any;
    isOpenModelResendOtp: boolean;
    email: string;
}
export default function ResendOtpModel(props: IResendOtpModelProps) {
    const { isOpenModelResendOtp, handleCloseModelResendOtp, email } = props;
    const [step, setStep] = React.useState<number>(0);
    const [userId, setUserId] = React.useState<number>(0);
    const [otp, setOtp] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");
    const t = useTranslations('ResendOTP');
    
    // Loading states
    const [isResending, setIsResending] = React.useState(false);
    const [isVerifying, setIsVerifying] = React.useState(false);

    const handleResendOtp = async (email: string) => {
        setError("");
        
        setIsResending(true);
        try {
            const res = await fetchResendOtp(email);
            if (res?.data) {
                setStep(1);
                setUserId(res?.data?.id);
                toastService.success(res?.message || 'OTP sent successfully!');
            } else {
                setError(res?.message || 'Failed to send OTP');
                toastService.error(res?.message || 'Failed to send OTP');
            }
        } catch (error) {
            const errorMsg = 'Failed to resend OTP. Please try again.';
            setError(errorMsg);
            toastService.error(errorMsg);
        } finally {
            setIsResending(false);
        }
    };
    const handleVerify = async (id: number, otp: number) => {
        if (!otp) {
            setError('Please enter the OTP code');
            toastService.error('Please enter the OTP code');
            return;
        }
        
        setError("");
        
        setIsVerifying(true);
        try {
            const res = await fetchVerifyOTP(id, otp);
            if (res?.data) {
                setStep(2);
                toastService.success(res?.message || 'Account verified successfully!');
            } else {
                setError(res?.message || 'Invalid OTP code');
                toastService.error(res?.message || 'Invalid OTP code');
            }
        } catch (error) {
            const errorMsg = 'Verification failed. Please try again.';
            setError(errorMsg);
            toastService.error(errorMsg);
        } finally {
            setIsVerifying(false);
        }
    };
    const handleDone = async () => {
        handleCloseModelResendOtp();
    };
    return (
        <div>
            <Modal
                open={isOpenModelResendOtp}
                onClose={handleCloseModelResendOtp}
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
                            Account Verification
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
                        gap={2}
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
                                    {t('not_verified')}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{ textAlign: 'center', mb: 3 }}
                                >
                                    We need to verify your email address: <strong>{email}</strong>
                                </Typography>
                                {error && (
                                    <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                                        {error}
                                    </Alert>
                                )}
                                <TextField
                                    fullWidth
                                    disabled
                                    id="email"
                                    name="email"
                                    label="Email Address"
                                    value={email}
                                    sx={{
                                        mb: 3,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            backgroundColor: alpha('#f3f4f6', 0.5),
                                        },
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={() => handleResendOtp(email)}
                                    fullWidth
                                    size="large"
                                    disabled={isResending}
                                    startIcon={isResending && <CircularProgress size={20} color="inherit" />}
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
                                    }}
                                >
                                    {isResending ? 'Sending OTP...' : t('resend_button')}
                                </Button>
                            </>
                        )}
                        {step === 1 && (
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
                                {error && (
                                    <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                                        {error}
                                    </Alert>
                                )}
                                <TextField
                                    name="otp"
                                    fullWidth
                                    id="otp"
                                    label="Enter OTP Code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    disabled={isVerifying}
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
                                        mb: 3,
                                    }}
                                    inputProps={{
                                        style: { textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.1em' },
                                        maxLength: 6,
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={() => handleVerify(userId, +otp)}
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
                                    }}
                                >
                                    {isVerifying ? 'Verifying...' : t('verify_button')}
                                </Button>
                            </>
                        )}
                        {step === 2 && (
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
                                            color: 'white',
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
                                    onClick={() => handleDone()}
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
