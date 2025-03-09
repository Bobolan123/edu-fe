import Image from "next/image";
import { TextField, Button } from "@mui/material";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { FormEvent } from "react";
import SignupForm from "@/components/auth/SignupForm";

export default function Signup() {
    const t = useTranslations("Signup");

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
                    <SignupForm />
                </div>
            </div>
        </div>
    );
}
