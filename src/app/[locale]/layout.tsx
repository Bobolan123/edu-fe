import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import { Roboto } from "next/font/google";
import "../globals.css"
const roboto = Roboto({
    weight: ["100", "300", "400", "500", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
    display: "swap",
});

export default async function LocaleLayout({
    children,
    params: { locale },
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body
                style={{ margin: 0 }}
                className={`${roboto.className} antialiased`}
            >
                <NextIntlClientProvider messages={messages}>
                    <AppRouterCacheProvider>
                        <ThemeProvider theme={theme}>
                            <Navbar />
                            {children}
                        </ThemeProvider>
                    </AppRouterCacheProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
