import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
    weight: ["100", "300", "400", "500", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
    display: "swap",
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html>
            <body
                style={{ margin: 0 }}
                className={`${roboto.className} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}