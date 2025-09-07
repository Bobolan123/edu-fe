import { sendRequest } from "./utils/api";

//Register
export const fetchRegister = async (email: string, password: string,name:string) => {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_SERVER}/auth/register`,
        method: "POST",
        body: {
            name:name.toString(),
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
            email,
            password,
        },
    });
    return res;
};
//Sign in
export const fetchSignInGoogle = async (email: string, name: string, googleId: string) => {
    const res = await sendRequest<IBackendRes<ILogin>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/auth/google-login`,
        body: {
            email,
            name,
            googleId,
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
    confirmPassword: string,
    otp?:string
) => {
    const res = await sendRequest<IBackendRes<any>>({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_SERVER}/auth/forgetPassword`,
        body: {
            email,
            password,
            confirmPassword,
            otp
        },
    });
    return res;
};
