import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { cookies } from "next/headers";

const locales = ["en", "vi"];
const defaultLocale = "en";

const pages = {
  auth: {
    signin: () => "/login",
    signup: () => "/signup",
  },
  admin: {
    signin: () => "/admin/login",
  },
  home: {
    root: "/",
  },
};

const authPages = ["/login", "/signup", "/admin/login"];
const protectedPages: string[] = ["/my-learning", "/my-learning/*"];
const adminPages = ["/admin", "/admin/*"];
const adminAuthPages = ["/admin/login"];
const instructorPages = ["/my-courses", "/my-courses/*"];

const   intlMiddleware = createIntlMiddleware({
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

const handleLocaleRedirect = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname;
  const search = req.nextUrl.search; 

  if (locales.some((locale) => pathname.startsWith(`/${locale}`))) {
    return null;
  }

  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || defaultLocale;

  const newUrl = new URL(`/${locale}${pathname}${search}`, req.url);
  return NextResponse.redirect(newUrl);
};

const handleAuth = async (
  req: NextRequest,
  isAuthPage: boolean,
  isProtectedPage: boolean,
  isAdminPage: boolean,
  isInstructorPage: boolean
) => {
  const session = await auth();
  const isAuth = session?.user;

  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || defaultLocale;
  const search = req.nextUrl.search; 

  if (isInstructorPage) {
    if (!isAuth) {
      return NextResponse.redirect(
        new URL(`/${locale}${pages.auth.signin()}?error=auth_required`, req.url)
      );
    }

    const userRole = (session?.user as any)?.role;
    if (userRole !== "instructor" && userRole !== "admin") {
      return NextResponse.redirect(
        new URL(`/${locale}${pages.home.root}?error=instructor_required`, req.url)
      );
    }
  }

  if (isAdminPage) {
    if (!isAuth) {
      return NextResponse.redirect(
        new URL(`/${locale}${pages.admin.signin()}?error=admin_auth_required`, req.url)
      );
    }

    const userRole = (session?.user as any)?.role;
    if (userRole !== "admin") {
      return NextResponse.redirect(
        new URL(`/${locale}${pages.admin.signin()}?error=admin_required`, req.url)
      );
    }
  }

  if (!isAuth && isProtectedPage) {
    return NextResponse.redirect(
      new URL(`/${locale}${pages.auth.signin()}${search}`, req.url)
    );
  }

  if (isAuth && isAuthPage) {
    return NextResponse.redirect(
      new URL(`/${locale}${pages.home.root}${search}`, req.url)
    );
  }

  return intlMiddleware(req);
};

export default async function middleware(req: NextRequest) {
  const localeRedirect = await handleLocaleRedirect(req);
  if (localeRedirect) return localeRedirect;

  const isAuthPage = testPagesRegex(authPages, req.nextUrl.pathname);
  const isProtectedPage = testPagesRegex(protectedPages, req.nextUrl.pathname);
  const isAdminAuthPage = testPagesRegex(adminAuthPages, req.nextUrl.pathname);
  const isAdminPage = testPagesRegex(adminPages, req.nextUrl.pathname) && !isAdminAuthPage;
  const isInstructorPage = testPagesRegex(instructorPages, req.nextUrl.pathname);

  return await handleAuth(req, isAuthPage, isProtectedPage, isAdminPage, isInstructorPage);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api|.*\\..*).*)"],
};
