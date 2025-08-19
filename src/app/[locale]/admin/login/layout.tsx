import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLoginLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const session = await auth();
    
  

    // Render login page without sidebar
    return <>{children}</>;
}