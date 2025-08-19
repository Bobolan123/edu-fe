import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function RootAdminLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const session = await auth();
 
    return <>{children}</>;
}