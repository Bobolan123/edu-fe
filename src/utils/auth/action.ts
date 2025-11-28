'use server'
import { signIn } from "@/auth";


export const customSignin = async (email: string, password: string) => {
    try {
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        // Check if signin was successful
        if (res?.error) {
            return {
                message: "Invalid credentials",
                statusCode: 400
            };
        }

        return {
            statusCode: 201,
            data: res
        };
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
            // Re-throw redirect errors - they're not actual errors
            if ((error as any).digest?.startsWith('NEXT_REDIRECT')) {
                throw error;
            }

            console.error('Unexpected signin error:', error);
            return {
                message: "Internal server error",
                statusCode: 500,
            };
        }
    }
};
