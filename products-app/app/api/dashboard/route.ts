import { NextRequest,NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";


export async function GET(req:NextRequest){
    const authHeader = req.headers.get("authorization");

    if(!authHeader)
    {
        return NextResponse.json({message:"No token"},{status:401})
    }

    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);

    if(!user)
    {
        return NextResponse.json({message:'Invalid token'},{status:403});
    }
    return NextResponse.json({
        message:'Protected Data',
        user,
    })
}