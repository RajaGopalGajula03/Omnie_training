
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_ROLES, getOptimisticSession, hasAnyRole } from "./lib/auth-edge";

export function middleware(req: NextRequest) {
    const session = getOptimisticSession(req);

    if (!session) {
        return NextResponse.redirect(new URL("/login",req.url))
    }

    const pathname = req.nextUrl.pathname;
    const adminOnlyPaths = [
        "/employees",
        "/employees/add",
        "/employees/edit",
        "/departments",
        // "/payroll",
        "/leave/approvals",
        // "/announcements",
    ];

    const requiresAdmin = adminOnlyPaths.some((path) =>
        pathname === path || pathname.startsWith(`${path}/`)
    );

    if (requiresAdmin && !hasAnyRole(session.user.role, ADMIN_ROLES)) {
        return NextResponse.redirect(new URL("/attendance", req.url));
    }

    return NextResponse.next();
}
export const config = {
    matcher: [
        "/employees",
        "/employees/:path*",
        "/dashboard",
        "/dashboard/:path*",
        "/departments",
        "/departments/:path*",
        "/payroll",
        "/payroll/:path*",
        "/attendance",
        "/attendance/:path*",
        "/leave",
        "/leave/:path*",
        "/leave/approvals",
        "/leave/approvals/:path*",
        "/announcements",
        "/announcements/:path*",
    ],
}
