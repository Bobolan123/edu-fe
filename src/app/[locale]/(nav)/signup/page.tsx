import Image from "next/image";
import { TextField, Button } from "@mui/material";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { FormEvent } from "react";

export default function Signup() {
    const t = useTranslations("Signup");

    async function onSignup(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
    
        const formData = new FormData(event.currentTarget);
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: formData
        });
    
        const data = await response.json();
    
        if (response.ok) {
            console.log("Signup successful:", data);
            // Redirect user to login or dashboard
        } else {
            console.error("Signup failed:", data);
            // Show error message to user
        }
    }
    
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex w-full max-w-6xl bg-white gap-28 overflow-hidden">
                {/* Left Image Section */}
                <div className="hidden md:flex w-1/2 items-center justify-center p-8">
                    <Image
                        src="/logo.png"
                        alt={t("title")}
                        width={400}
                        height={400}
                    />
                </div>

                {/* Right Signup Form Section */}
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-2xl font-semibold text-gray-700 text-center">
                        {t("title")}
                    </h2>
                    <form className="mt-6 space-y-4">
                        <TextField
                            fullWidth
                            label={t("fullname")}
                            variant="outlined"
                            className="mt-2"
                        />
                        <TextField
                            fullWidth
                            label={t("email")}
                            variant="outlined"
                            className="mt-2"
                        />
                        <TextField
                            fullWidth
                            label={t("password")}
                            type="password"
                            variant="outlined"
                            className="mt-2"
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className="mt-4"
                            size="large"
                        >
                            {t("signup_button")}
                        </Button>
                    </form>

                    <p className="mt-4 text-center text-gray-600">
                        {t("terms")}{" "}

                        .
                    </p>
                    <p className="mt-2 text-center">
                        {" "}
                        <Link
                            href="/login"
                            className="text-blue-500 font-semibold"
                        >
                            {t("login_prompt")}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
