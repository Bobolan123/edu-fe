import { sendRequest } from "../ultils/api";

//Register
export const fetchRegister = async (email: string, password: string) => {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_SERVER}/auth/register`,
        method: "POST",
        body: {
            email: email.toString(),
            password: password.toString(),
        },
    });
    return res;
};

//Sign in
export const fetchSignIn = async (email: string, password: string) => {
    const res = await sendRequest<IBackendRes<ILogin>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/auth/login`,
        body: {
            username: email,
            password: password,
        },
    });
    return res;
};

//Verify OTP
export const fetchResendOtp = async (email: string) => {
    const res = await sendRequest<IBackendRes<any>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/auth/resendOtp`,
        body: {
            email,
        },
    });
    return res;
};

//Verify OTP
export const fetchVerifyOTP = async (id: number, otp: number) => {
    const res = await sendRequest<IBackendRes<any>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/auth/verifyOtp`,
        body: {
            id,
            otp,
        },
    });
    return res;
};

//Send email to get OTP to change password
export const fetchForgotPassword = async (email: string) => {
    const res = await sendRequest<IBackendRes<any>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/auth/forgotPassword`,
        body: {
            email,
        },
    });
    return res;
};

//Change Password
export const fetchChangePassword = async (
    email: string,
    password: string,
    confirmPassword: string
) => {
    const res = await sendRequest<IBackendRes<any>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/auth/changePassword`,
        body: {
            email,
            password,
            confirmPassword,
        },
    });
    return res;
};
