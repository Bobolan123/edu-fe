'use server'
import { signIn } from "@/auth";


export const customSignin = async (email: string, password: string) => {
    try {
        const res = await signIn("credentials", {
            email,
            password,
        });
        return res;
    } catch (error) {
        if ((error as any).name === "InvalidCredentials") {
            return {
                message: (error as any).type,
                statusCode: 400
            };
        } else if ((error as any).name === "InvalidActive") {
            return {
                message: (error as any).type,
                statusCode: 403,
            };
        } else {
            return {
                message: "Internal server error",
                statusCode: 500,
            };
        }
    }
};
