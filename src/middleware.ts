import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { getLocale } from "next-intl/server";

const pages = {
    auth: {
        signin: () => "/login",
        signup: () => "/signup",
    },
    home: {
        root: "/",
    },
};
const locales = ["en", "vi"];
const protectedPages: string[] = [];
const authPages = ["/login", "/signup"];
const defaultLocale = "en";
const intlMiddleware = createIntlMiddleware({
    locales,
    defaultLocale,
});

const testPagesRegex = (pages: string[], pathname: string) => {
    if (pages.length === 0) return false; 

    const regex = `^(/(${locales.join("|")}))?(${pages
        .map((p) => p.replace("/*", ".*"))
        .join("|")})/?$`;
    return new RegExp(regex, "i").test(pathname);
};


const handleAuth = async (
    req: NextRequest,
    isAuthPage: boolean,
    isProtectedPage: boolean
) => {
    const session = await auth();
    const isAuth = !!session?.user;

    if (!isAuth && isProtectedPage) {

        return NextResponse.redirect(
            new URL(
                `${
                    req.cookies.get("NEXT_LOCALE")?.value || defaultLocale
                }/${pages.auth.signin()}`,
                req.url
            )
        );
    }

    if (isAuth && isAuthPage) {
        return NextResponse.redirect(new URL(pages.home.root, req.nextUrl));
    }

    return intlMiddleware(req);
};

export default async function middleware(req: NextRequest) {
    const isAuthPage = testPagesRegex(authPages, req.nextUrl.pathname);
    const isProtectedPage = testPagesRegex(
        protectedPages,
        req.nextUrl.pathname
    );

    return await handleAuth(req, isAuthPage, isProtectedPage);
}

export const config = {
    matcher: ["/", "/(vi|en)/:path*"],
};
