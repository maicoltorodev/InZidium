import { NextResponse } from "next/server";
import { auth } from "./auth";
import { detectDeviceTier } from "@/lib/device-profile";

const TABLET_REQUIRED_PATH = "/tablet-required";
const MOBILE_REQUIRED_PATH = "/mobile-required";
const CLIENT_PROJECTS_PATH = "/clientes/proyectos";
const MOBILE_CLIENT_PROJECTS_PATH = "/mobile/clientes/proyectos";
const TABLET_CLIENT_PROJECTS_PATH = "/tablet/clientes/proyectos";
const ADMIN_LOGIN_PATH = "/admin/login";

export default auth((req) => {
    const requestHeaders = new Headers(req.headers);
    const deviceTier = detectDeviceTier(
        req.headers.get("user-agent"),
        req.headers.get("sec-ch-ua-mobile"),
        req.headers.get("sec-ch-ua-platform"),
    );

    requestHeaders.set("x-alk-device-tier", deviceTier);
    requestHeaders.set("x-invoke-path", req.nextUrl.pathname);

    const pathname = req.nextUrl.pathname;
    const isProtectedAdminRoute =
        pathname.startsWith("/admin") && pathname !== ADMIN_LOGIN_PATH;
    const isClientProjectsPath = pathname === CLIENT_PROJECTS_PATH;
    const isMobileClientProjectsPath = pathname === MOBILE_CLIENT_PROJECTS_PATH;
    const isTabletClientProjectsPath = pathname === TABLET_CLIENT_PROJECTS_PATH;
    const isServiceDetailPage =
        pathname.startsWith("/servicios/") && !/\.[a-zA-Z0-9]+$/.test(pathname);
    const isMobileServicePage = pathname.startsWith("/mobile/servicios/");
    const isTabletServicePage = pathname.startsWith("/tablet/servicios/");

    if (isProtectedAdminRoute && !req.auth) {
        const signInUrl = req.nextUrl.clone();
        signInUrl.pathname = ADMIN_LOGIN_PATH;
        signInUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signInUrl);
    }

    const requiredPath =
        deviceTier === "tablet"
            ? TABLET_REQUIRED_PATH
            : deviceTier === "mobile"
                ? MOBILE_REQUIRED_PATH
                : null;

    if (isClientProjectsPath && requiredPath) {
        const rewriteUrl = req.nextUrl.clone();
        rewriteUrl.pathname =
            deviceTier === "tablet"
                ? TABLET_CLIENT_PROJECTS_PATH
                : MOBILE_CLIENT_PROJECTS_PATH;
        rewriteUrl.searchParams.set("from", req.nextUrl.pathname);

        return NextResponse.rewrite(rewriteUrl, {
            request: {
                headers: requestHeaders,
            },
        });
    }

    if (isMobileClientProjectsPath || isTabletClientProjectsPath) {
        return NextResponse.next({
            request: { headers: requestHeaders },
        });
    }

    // Platform-specific service pages: pass through directly
    if (isMobileServicePage || isTabletServicePage) {
        return NextResponse.next({
            request: { headers: requestHeaders },
        });
    }

    if (requiredPath && isServiceDetailPage) {
        const rewriteUrl = req.nextUrl.clone();
        rewriteUrl.pathname = pathname.replace(
            "/servicios/",
            deviceTier === "tablet" ? "/tablet/servicios/" : "/mobile/servicios/",
        );
        return NextResponse.rewrite(rewriteUrl, {
            request: { headers: requestHeaders },
        });
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
});

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|offline.html|apple-icon.png|icon.png|icons|images).*)",
    ],
};
