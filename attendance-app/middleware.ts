
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

export function middleware(req: NextRequest) {

    const token = req.cookies.get("token")?.value;

    const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");

    console.log("token : ", token)

    if (isDashboard) {
        try {
            if (!token || !verifyToken(token)) {
                return NextResponse.redirect(new URL("/login", req.url))
            }
        }
        catch {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}
export const config = {
    matcher: ["/employees"],
}