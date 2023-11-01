import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { i18n } from "./i18n-config";

function getLocale(request: NextRequest): string {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const localeCookie = request.cookies.get("NEXT_LOCALE");

  // // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
  if (
    [
      "/favicon.ico",
      "/favicon-16x16.png",
      "/favicon-32x32.png",
      "/nextrmm.svg",
    ].includes(pathname)
  )
    return;

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = localeCookie ? localeCookie.value : getLocale(request);
    console.log(locale);

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url,
      ),
    );
  }

  console.log("pathname>>>", pathname);
  console.log("locale in cookies>>>", localeCookie?.value);

  // Redirect if the locale does not match the one specified in cookies
  if (localeCookie) {
    const localeInPath = pathname.split("/")[1];
    console.log("locale in path>>>>", localeInPath);
    const isLocaleMatching = localeInPath === localeCookie.value;

    if (!isLocaleMatching) {
      return NextResponse.redirect(
        new URL(
          `${pathname.replace(localeInPath!, localeCookie.value)}`,
          request.url,
        ),
      );
    }
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
