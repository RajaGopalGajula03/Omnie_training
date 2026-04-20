
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

export function middleware(req: NextRequest) {

    const token = req.cookies.get("token")?.value;

    console.log("token : ", token)

    if(!token)
    {
        return NextResponse.redirect(new URL("/login",req.url))
    }

    try{
        verifyToken(token);
    }
    catch(err)
    {
        console.log("Invalid Token :",err);
        return NextResponse.redirect(new URL("/login",req.url))
    }

    return NextResponse.next();
}
export const config = {
    matcher: ["/employees", "/employees/:path*"],
}