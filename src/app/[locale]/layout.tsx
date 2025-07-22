import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import { Roboto } from "next/font/google";
import "../globals.css";
import ToastProvider from "@/components/Toastify/ToastContainer";
import ClientSideToastContainer from "@/components/Toastify/ToastContainer";
import { SessionProvider } from "next-auth/react";
import NavbarClient from "@/components/Navbar/NavbarClient";
import Navbar from "@/components/Navbar/Navbar";
import { getExchangeRateVND } from "../../../utils/utils";
import { cookies } from "next/headers";
import { setExchangeRateCookie } from "@/actions";
import { CurrencyProvider } from "@/context/CurrencyContext";

const roboto = Roboto({
    weight: ["100", "300", "400", "500", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
    display: "swap",
});

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const messages = await getMessages();
    const parameters = await params;
    const locale = parameters.locale;
    let exchangeRate: number | string = 1;
    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    exchangeRate = await getExchangeRateVND("USD");

    return (
        <html lang={locale}>
            <body
                style={{ margin: 0 }}
                className={`${roboto.className} antialiased`}
            >
                <NextIntlClientProvider messages={messages}>
                    <AppRouterCacheProvider>
                        <ThemeProvider theme={theme}>
                            <SessionProvider>
                                <CurrencyProvider>
                                    <div className="mb-28">
                                        <Navbar />
                                    </div>
                                    {children}
                                    <ClientSideToastContainer />
                                </CurrencyProvider>
                            </SessionProvider>
                        </ThemeProvider>
                    </AppRouterCacheProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
