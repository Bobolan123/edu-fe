import { useTranslations } from "next-intl";
import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";

export default function Login() {
    const t = useTranslations("Login");

    return (
        <div className="min-h-screen flex items-center justify-center gap-10 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Image src="/logo.png" alt="logo" width={500} height={500} />
            <div className="max-w-md w-full space-y-8">
                <LoginForm />
            </div>
        </div>
    );
}
