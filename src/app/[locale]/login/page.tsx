import Image from "next/image";
import { TextField, Button } from "@mui/material";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Google } from "@mui/icons-material";
import ThirdPartyOAuth from "@/components/auth/ThirdPartyOAuth";
import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
    const t = useTranslations("Login");

    return (
        <>
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex w-full max-w-6xl bg-white gap-28 overflow-hidden">
                    <div className="hidden md:flex w-1/2 items-center justify-center p-8">
                        <Image
                            src="/logo.png"
                            alt={t("title")}
                            width={400}
                            height={400}
                        />
                    </div>

                    {/* Right Login Form Section */}
                    <div className="w-full md:w-1/2 p-8">
                        <LoginForm/>    
                        <hr className="my-5" />
                        <ThirdPartyOAuth />
                    </div>
                </div>
            </div>
        </>
    );
}
